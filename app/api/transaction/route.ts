import { NextResponse } from 'next/server';
import axios from 'axios';
import { TransactionRequestSchema } from '@/lib/validations';
import { checkRateLimit } from '@/lib/ratelimit';
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

export async function POST(request: Request) {
  const identifier = request.headers.get('x-forwarded-for') || 'anonymous';

  try {
    // 1. Rate Limiting
    const { success, remaining, reset } = await checkRateLimit(identifier);
    if (!success) {
      logger.warn({ identifier }, 'Rate limit exceeded for transaction');
      return NextResponse.json({ error: 'Too many requests' }, { 
        status: 429,
        headers: {
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        }
      });
    }

    // 2. Zod Validation
    const body = await request.json();
    const validation = TransactionRequestSchema.safeParse(body);

    if (!validation.success) {
      // SECURITY: Prevent internal schema leakage by logging detailed errors internally and returning a generic response
      logger.warn({ errors: validation.error.format() }, 'Invalid transaction request');
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const { sourceAsset, sourceChain, destAsset, destChain, amount, destAddress } = validation.data;

    if (!CHANGENOW_API_KEY) {
      logger.error('CHANGENOW_API_KEY is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    logger.info({ sourceAsset, sourceChain, destAsset, destChain, amount, destAddress }, 'Creating ChangeNOW transaction');

    const fromCurrency = assetMap[sourceAsset];
    const fromNetwork = networkMap[sourceChain];
    const toCurrency = assetMap[destAsset];
    const toNetwork = networkMap[destChain];

    const response = await axios.post(
      `${CHANGENOW_API_URL}/exchange`,
      {
        fromCurrency,
        fromNetwork,
        toCurrency,
        toNetwork,
        fromAmount: amount,
        address: destAddress,
        flow: 'standard',
        type: 'direct',
      },
      {
        headers: {
          'x-changenow-api-key': CHANGENOW_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    logger.info({ transactionId: response.data.id }, 'ChangeNOW transaction created successfully');
    return NextResponse.json(response.data);
  } catch (error: any) {
    logger.error({ error: error?.response?.data || error.message }, 'Error creating ChangeNOW transaction');
    return NextResponse.json({ error: 'Failed to create cross-chain transaction' }, { status: 500 });
  }
}
