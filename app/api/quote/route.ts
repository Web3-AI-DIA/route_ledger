import { NextResponse } from 'next/server';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { QuoteRequestSchema } from '@/lib/validations';
import { getClientIp } from '@/lib/utils';
import { checkRateLimit } from '@/lib/ratelimit';
import { Redis } from '@upstash/redis';
import logger from '@/lib/logger';

const CHANGENOW_API_URL = 'https://api.changenow.io/v2';
const CHANGENOW_API_KEY = process.env.CHANGENOW_API_KEY;

const assetMap: Record<string, string> = {
  XRP: 'xrp',
  USDC: 'usdc',
  USDT: 'usdt',
  SOL: 'sol',
  ETH: 'eth',
  MATIC: 'matic',
  APT: 'apt',
  TRX: 'trx',
  XLM: 'xlm',
};

const networkMap: Record<string, string> = {
  XRPL: 'xrp',
  ETHEREUM: 'eth',
  POLYGON: 'matic',
  SOLANA: 'sol',
  APTOS: 'apt',
  ARBITRUM: 'arbitrum',
  AVALANCHE: 'avax',
  BSC: 'bsc',
  BASE: 'base',
  TRON: 'trx',
  OPTIMISM: 'optimism',
  STELLAR: 'xlm',
};

// Simple in-memory cache for fallback
const localCache = new Map<string, { data: any; expiresAt: number }>();
const CACHE_TTL = 10; // 10 seconds

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const identifier = getClientIp(request);
  
  // 1. Rate Limiting
  const { success, remaining, reset } = await checkRateLimit(identifier);
  if (!success) {
    logger.warn({ identifier }, 'Rate limit exceeded');
    return NextResponse.json({ error: 'Too many requests' }, { 
      status: 429,
      headers: {
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
      }
    });
  }

  // 2. Zod Validation
  const validation = QuoteRequestSchema.safeParse({
    sourceAsset: searchParams.get('sourceAsset'),
    sourceChain: searchParams.get('sourceChain'),
    destAsset: searchParams.get('destAsset'),
    destChain: searchParams.get('destChain'),
    amount: searchParams.get('amount'),
  });

  if (!validation.success) {
    logger.warn({ errors: validation.error.format() }, 'Invalid quote request');
    return NextResponse.json({ error: 'Invalid parameters', details: validation.error.format() }, { status: 400 });
  }

  const { sourceAsset, sourceChain, destAsset, destChain, amount } = validation.data;

  if (!CHANGENOW_API_KEY) {
    logger.error('CHANGENOW_API_KEY is not set');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  // 3. Cache Check
  const cacheKey = `quote:${sourceAsset}:${sourceChain}:${destAsset}:${destChain}:${amount}`;
  let cachedData: any = null;

  try {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      const redis = Redis.fromEnv();
      cachedData = await redis.get(cacheKey);
    } else {
      const localEntry = localCache.get(cacheKey);
      if (localEntry && localEntry.expiresAt > Date.now()) {
        cachedData = localEntry.data;
      }
    }
  } catch (err) {
    logger.warn({ err }, 'Cache read error, proceeding without cache');
  }

  if (cachedData) {
    logger.info({ cacheKey }, 'Serving quote from cache');
    return NextResponse.json({ ...cachedData, fromCache: true });
  }

  try {
    logger.info({ sourceAsset, sourceChain, destAsset, destChain, amount }, 'Fetching quote from ChangeNOW');
    const fromCurrency = assetMap[sourceAsset];
    const fromNetwork = networkMap[sourceChain];
    const toCurrency = assetMap[destAsset];
    const toNetwork = networkMap[destChain];

    const response = await axios.get(`${CHANGENOW_API_URL}/exchange/estimated-amount`, {
      params: {
        fromCurrency,
        fromNetwork,
        toCurrency,
        toNetwork,
        fromAmount: amount,
        type: 'direct',
      },
      headers: {
        'x-changenow-api-key': CHANGENOW_API_KEY,
      },
    });

    const { estimatedAmount, transactionSpeedForecast } = response.data;

    const amountNum = parseFloat(amount);
    const routingFeeNum = amountNum * 0.002;
    const estimatedAmountOutNum = parseFloat(estimatedAmount);
    const finalEstimatedAmountOut = estimatedAmountOutNum * 0.998;

    const steps = [];
    
    if (sourceAsset !== destAsset && sourceChain === 'XRPL') {
       steps.push({
         id: uuidv4(),
         type: 'SWAP',
         description: `Swap ${sourceAsset} to bridge asset on XRPL`,
         provider: 'XRPL DEX',
         status: 'PENDING'
       });
    }

    steps.push({
      id: uuidv4(),
      type: 'BRIDGE',
      description: `Bridge ${sourceAsset} from ${sourceChain} to ${destChain}`,
      provider: 'ChangeNOW',
      status: 'PENDING'
    });

    if (destChain === 'SOLANA' && destAsset !== 'SOL') {
      steps.push({
        id: uuidv4(),
        type: 'SETTLE',
        description: `Settle ${destAsset} on Solana via Jupiter`,
        provider: 'Jupiter',
        status: 'PENDING'
      });
    } else {
      steps.push({
        id: uuidv4(),
        type: 'SETTLE',
        description: `Deliver ${destAsset} to destination address`,
        provider: 'ChangeNOW',
        status: 'PENDING'
      });
    }

    const quoteResponse = {
      id: uuidv4(),
      sourceChain,
      sourceAsset,
      destChain,
      destAsset,
      amountIn: amount,
      estimatedAmountOut: finalEstimatedAmountOut.toFixed(6),
      routingFee: routingFeeNum.toFixed(6),
      networkFee: 'Included',
      totalFee: routingFeeNum.toFixed(6),
      estimatedTimeMinutes: transactionSpeedForecast ? Math.ceil(transactionSpeedForecast / 60) : 10,
      steps,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };

    // 4. Cache Store
    try {
      if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        const redis = Redis.fromEnv();
        await redis.set(cacheKey, quoteResponse, { ex: CACHE_TTL });
      } else {
        localCache.set(cacheKey, {
          data: quoteResponse,
          expiresAt: Date.now() + CACHE_TTL * 1000,
        });
      }
    } catch (err) {
      logger.warn({ err }, 'Cache write error');
    }

    logger.info({ quoteId: quoteResponse.id }, 'Quote generated and cached successfully');
    return NextResponse.json(quoteResponse);
  } catch (error: any) {
    logger.error({ error: error?.response?.data || error.message }, 'Error fetching ChangeNOW quote');
    return NextResponse.json({ error: 'Failed to fetch route quote' }, { status: 500 });
  }
}
