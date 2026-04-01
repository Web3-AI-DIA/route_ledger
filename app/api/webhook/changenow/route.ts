import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminDb } from '@/lib/firebase-admin';

const CHANGENOW_WEBHOOK_SECRET = process.env.CHANGENOW_WEBHOOK_SECRET;

export async function POST(request: Request) {
  try {
    const signature = request.headers.get('x-changenow-signature');
    const bodyText = await request.text();

    if (!CHANGENOW_WEBHOOK_SECRET) {
      console.error('CHANGENOW_WEBHOOK_SECRET is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    // Verify signature
    const hmac = crypto.createHmac('sha512', CHANGENOW_WEBHOOK_SECRET);
    const expectedSignature = hmac.update(bodyText).digest('hex');

    if (signature !== expectedSignature) {
      console.error('Invalid ChangeNOW webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(bodyText);
    const { id, status, payinHash, payoutHash } = payload;

    if (!id || !status) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

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
    // Note: We need to store the ChangeNOW ID in the TransferRequest when we create it
    const transfersRef = adminDb.collection('transfers');
    const snapshot = await transfersRef.where('changeNowTxId', '==', id).get();

    if (snapshot.empty) {
      console.warn(`Webhook received for unknown ChangeNOW ID: ${id}`);
      return NextResponse.json({ message: 'Transfer not found' }, { status: 200 }); // Return 200 so ChangeNOW doesn't retry
    }

    const doc = snapshot.docs[0];
    const transfer = doc.data();

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

    return NextResponse.json({ message: 'Webhook processed successfully' });
  } catch (error: any) {
    console.error('Error processing ChangeNOW webhook:', error.message);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}
