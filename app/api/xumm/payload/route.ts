import { NextResponse } from 'next/server';
import { XummSdk } from 'xumm-sdk';

const XUMM_API_KEY = process.env.XUMM_API_KEY;
const XUMM_API_SECRET = process.env.XUMM_API_SECRET;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, destination, memo } = body;

    if (!amount || !destination) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    if (!XUMM_API_KEY || !XUMM_API_SECRET) {
      console.error('XUMM API keys are not set');
      // For MVP, if keys are missing, return a mock response so the UI doesn't break
      return NextResponse.json({
        qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=mock-xumm-payload',
        nextUrl: 'https://xumm.app',
        uuid: 'mock-uuid'
      });
    }

    const Sdk = new XummSdk(XUMM_API_KEY, XUMM_API_SECRET);

    const payload = await Sdk.payload.create({
      txjson: {
        TransactionType: 'Payment',
        Destination: destination,
        Amount: (parseFloat(amount) * 1000000).toString(), // Convert XRP to drops
        Memos: memo ? [
          {
            Memo: {
              MemoData: Buffer.from(memo, 'utf8').toString('hex')
            }
          }
        ] : undefined
      }
    });

    if (!payload) {
      throw new Error('Failed to create Xumm payload');
    }

    return NextResponse.json({
      qrUrl: payload.refs.qr_png,
      nextUrl: payload.next.always,
      uuid: payload.uuid
    });
  } catch (error: any) {
    console.error('Error creating Xumm payload:', error.message);
    return NextResponse.json({ error: 'Failed to create Xumm payload' }, { status: 500 });
  }
}
