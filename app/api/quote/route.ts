import { NextResponse } from 'next/server';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const CHANGENOW_API_URL = 'https://api.changenow.io/v2';
const CHANGENOW_API_KEY = process.env.CHANGENOW_API_KEY;

const assetMap: Record<string, string> = {
  XRP: 'xrp',
  USDC: 'usdc',
  SOL: 'sol',
  ETH: 'eth',
  MATIC: 'matic',
  APT: 'apt',
  TRX: 'trx',
  XLM: 'xlm',
};

const networkMap: Record<string, string> = {
  XRPL: 'xrp',
  EVM: 'eth',
  SOLANA: 'sol',
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sourceAsset = searchParams.get('sourceAsset');
  const sourceChain = searchParams.get('sourceChain');
  const destAsset = searchParams.get('destAsset');
  const destChain = searchParams.get('destChain');
  const amount = searchParams.get('amount');

  if (!sourceAsset || !sourceChain || !destAsset || !destChain || !amount) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  if (!CHANGENOW_API_KEY) {
    console.error('CHANGENOW_API_KEY is not set');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
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

    return NextResponse.json({
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
    });
  } catch (error: any) {
    console.error('Error fetching ChangeNOW quote:', error?.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to fetch route quote' }, { status: 500 });
  }
}
