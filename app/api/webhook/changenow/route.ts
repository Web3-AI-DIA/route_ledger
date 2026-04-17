import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminDb } from '@/lib/firebase-admin';
import logger from '@/lib/logger';

const CHANGENOW_WEBHOOK_SECRET = process.env.CHANGENOW_WEBHOOK_SECRET;

export async function POST(request: Request) {
  try {
    const signature = request.headers.get('x-changenow-signature');
    const bodyText = await request.text();

    if (!CHANGENOW_WEBHOOK_SECRET) {
      logger.error('CHANGENOW_WEBHOOK_SECRET is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (!signature) {
      logger.warn('Webhook received without signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    // Verify signature using timing-safe comparison
    const hmac = crypto.createHmac('sha512', CHANGENOW_WEBHOOK_SECRET);
    const expectedSignature = hmac.update(bodyText).digest('hex');

    const signatureBuffer = Buffer.from(signature, 'hex');
    const expectedSignatureBuffer = Buffer.from(expectedSignature, 'hex');

    if (
      signatureBuffer.length !== expectedSignatureBuffer.length ||
      !crypto.timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
    ) {
      logger.warn({ signature }, 'Invalid ChangeNOW webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(bodyText);
    const { id, status, payinHash, payoutHash } = payload;

    if (!id || !status) {
      logger.warn({ payload }, 'Invalid payload received in webhook');
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    logger.info({ id, status }, 'Processing ChangeNOW webhook');

    // Map ChangeNOW status to our internal status
    let internalStatus = 'BRIDGE_IN_FLIGHT';
    if (status === 'finished') {
      internalStatus = 'COMPLETED';
    } else if (status === 'failed' || status === 'refunded') {
      internalStatus = status.toUpperCase();
    } else if (status === 'waiting' || status === 'confirming' || status === 'exchanging' || status === 'sending') {
      internalStatus = 'BRIDGE_IN_FLIGHT';
    }

    // Find the transfer request by ChangeNOW ID
    const transfersRef = adminDb.collection('transfers');
    const snapshot = await transfersRef.where('changeNowTxId', '==', id).get();

    if (snapshot.empty) {
      logger.warn({ id }, 'Webhook received for unknown ChangeNOW ID');
      return NextResponse.json({ message: 'Transfer not found' }, { status: 200 });
    }

    const doc = snapshot.docs[0];
    const updateData: any = {
      status: internalStatus,
      updatedAt: Date.now(),
    };

    if (payinHash) {
      updateData['txHashes.source'] = payinHash;
    }
    if (payoutHash) {
      updateData['txHashes.dest'] = payoutHash;
    }

    await doc.ref.update(updateData);
    logger.info({ transferId: doc.id, internalStatus }, 'Transfer updated via webhook');

    return NextResponse.json({ message: 'Webhook processed successfully' });
  } catch (error: any) {
    logger.error({ err: error }, 'Error processing ChangeNOW webhook');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
