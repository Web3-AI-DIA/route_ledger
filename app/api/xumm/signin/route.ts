import { NextResponse } from 'next/server';
import { XummSdk } from 'xumm-sdk';
import logger from '@/lib/logger';
import { checkRateLimit } from '@/lib/ratelimit';

const XUMM_API_KEY = process.env.XUMM_API_KEY;
const XUMM_API_SECRET = process.env.XUMM_API_SECRET;

export async function POST(request: Request) {
  const identifier = request.headers.get('x-forwarded-for') || 'anonymous';

  try {
    const { success, limit, remaining, reset } = await checkRateLimit(identifier);
    if (!success) {
      logger.warn({ identifier }, 'Rate limit exceeded for Xumm sign-in');
      return NextResponse.json(
        { error: 'Too many requests' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': (limit ?? 0).toString(),
            'X-RateLimit-Remaining': (remaining ?? 0).toString(),
            'X-RateLimit-Reset': (reset ?? 0).toString(),
          },
        }
      );
    }

    if (!XUMM_API_KEY || !XUMM_API_SECRET) {
      logger.error('XUMM API keys are not set');
      return NextResponse.json({
        qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=mock-xumm-signin',
        nextUrl: 'https://xumm.app',
        uuid: 'mock-uuid'
      });
    }

    const Sdk = new XummSdk(XUMM_API_KEY, XUMM_API_SECRET);

    const payload = await Sdk.payload.create({
      txjson: {
        TransactionType: 'SignIn'
      }
    });

    if (!payload) {
      throw new Error('Failed to create Xumm sign-in payload');
    }

    logger.info({ uuid: payload.uuid }, 'Xumm sign-in payload created');

    return NextResponse.json({
      qrUrl: payload.refs.qr_png,
      nextUrl: payload.next.always,
      uuid: payload.uuid
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Error creating Xumm signin payload');
    return NextResponse.json({ error: 'Failed to create Xumm signin payload' }, { status: 500 });
  }
}
