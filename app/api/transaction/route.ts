import { NextResponse } from 'next/server';
import axios from 'axios';

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sourceAsset, sourceChain, destAsset, destChain, amount, destAddress } = body;

    if (!sourceAsset || !sourceChain || !destAsset || !destChain || !amount || !destAddress) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    if (!CHANGENOW_API_KEY) {
      console.error('CHANGENOW_API_KEY is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

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

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error creating ChangeNOW transaction:', error?.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to create cross-chain transaction' }, { status: 500 });
  }
}
