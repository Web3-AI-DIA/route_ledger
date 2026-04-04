import { NextResponse } from 'next/server';
import { XummSdk } from 'xumm-sdk';
import { XummPayloadSchema } from '@/lib/validations';
import { checkRateLimit } from '@/lib/ratelimit';
import logger from '@/lib/logger';

const XUMM_API_KEY = process.env.XUMM_API_KEY;
const XUMM_API_SECRET = process.env.XUMM_API_SECRET;

export async function POST(request: Request) {
  const identifier = request.headers.get('x-forwarded-for') || 'anonymous';

  try {
    // 1. Rate Limiting
    const { success, remaining, reset } = await checkRateLimit(identifier);
    if (!success) {
      logger.warn({ identifier }, 'Rate limit exceeded for XUMM payload');
      return NextResponse.json({ error: 'Too many requests' }, {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        }
      });
    }

    // 2. Validation
    const body = await request.json();
    const validation = XummPayloadSchema.safeParse(body);

    if (!validation.success) {
      logger.warn({ errors: validation.error.format() }, 'Invalid XUMM payload request');
      return NextResponse.json({ error: 'Invalid parameters', details: validation.error.format() }, { status: 400 });
    }

    const { amount, destination, memo } = validation.data;

    if (!XUMM_API_KEY || !XUMM_API_SECRET) {
      logger.error('XUMM API keys are not set');

      // Only allow mock response in non-production environments
      if (process.env.NODE_ENV !== 'production') {
        return NextResponse.json({
          qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=mock-xumm-payload',
          nextUrl: 'https://xumm.app',
          uuid: 'mock-uuid'
        });
      }

      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const Sdk = new XummSdk(XUMM_API_KEY, XUMM_API_SECRET);

    // Use string-based arithmetic for XRP to drops conversion to avoid floating point precision loss
    const [whole, fraction = ''] = amount.split('.');
    const amountInDrops = (BigInt(whole) * 1000000n + BigInt(fraction.padEnd(6, '0').slice(0, 6))).toString();

    const payload = await Sdk.payload.create({
      txjson: {
        TransactionType: 'Payment',
        Destination: destination,
        Amount: amountInDrops,
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

    logger.info({ uuid: payload.uuid }, 'XUMM payload created successfully');
    return NextResponse.json({
      qrUrl: payload.refs.qr_png,
      nextUrl: payload.next.always,
      uuid: payload.uuid
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Error creating XUMM payload');
    return NextResponse.json({ error: 'Failed to create Xumm payload' }, { status: 500 });
  }
}
