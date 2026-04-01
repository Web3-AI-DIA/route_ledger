'use client';

import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, ShieldCheck, Loader2, QrCode } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { TransferRequest } from '@/lib/types';
import { saveTransferRequest } from '@/lib/firebase';
import { createChangeNowTransaction } from '@/lib/changenow';

export default function QuoteReview() {
  const { activeQuote, setActiveQuote, setActiveTransfer, xrplAddress } = useAppStore();
  const [isExecuting, setIsExecuting] = useState(false);
  const [xummQrUrl, setXummQrUrl] = useState<string | null>(null);
  const [xummNextUrl, setXummNextUrl] = useState<string | null>(null);

  if (!activeQuote) return null;

  const handleConfirm = async () => {
    setIsExecuting(true);
    try {
      // 1. Call the backend to create the ChangeNOW transaction
      const tx = await createChangeNowTransaction(
        activeQuote.sourceAsset,
        activeQuote.sourceChain,
        activeQuote.destAsset,
        activeQuote.destChain,
        activeQuote.amountIn,
        (activeQuote as any).destAddress
      );
      
      const payinAddress = tx.payinAddress;
      
      // 2. Create the TransferRequest record
      const transfer: TransferRequest = {
        id: crypto.randomUUID(),
        quoteId: activeQuote.id,
        userId: xrplAddress || 'anonymous',
        sourceAddress: xrplAddress || '',
        destAddress: (activeQuote as any).destAddress,
        amountIn: activeQuote.amountIn,
        expectedAmountOut: activeQuote.estimatedAmountOut,
        status: 'PENDING_XRPL_PAYMENT',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        payinAddress: payinAddress,
        txHashes: {},
      };

      // 3. Save to Firestore (or local storage fallback)
      await saveTransferRequest(transfer);
      
      // 4. Generate Xumm Payment Payload
      const res = await fetch('/api/xumm/payload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: activeQuote.amountIn,
          destination: payinAddress,
          memo: `RouteLedger: ${activeQuote.sourceAsset} to ${activeQuote.destAsset}`
        })
      });
      
      const data = await res.json();
      
      if (data.qrUrl) {
        setXummQrUrl(data.qrUrl);
        setXummNextUrl(data.nextUrl);
        
        // In a real app, listen to the websocket for completion.
        // For MVP, we'll transition to the tracking view after a delay
        // to simulate the user scanning the QR code and signing.
        setTimeout(() => {
          setActiveTransfer(transfer);
          setActiveQuote(null);
        }, 8000);
      } else {
        // Fallback if Xumm fails
        setActiveTransfer(transfer);
        setActiveQuote(null);
      }
      
    } catch (error) {
      console.error('Failed to execute transfer:', error);
      alert('Failed to initiate transfer. Please try again.');
      setIsExecuting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {!xummQrUrl && (
        <button 
          onClick={() => setActiveQuote(null)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Edit
        </button>
      )}

      <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Route</h2>

      {xummQrUrl ? (
        <div className="p-8 border border-blue-100 bg-blue-50 rounded-xl flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
          <QrCode className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-bold text-blue-900 mb-2">Sign Transaction</h3>
          <p className="text-sm font-medium text-blue-800 mb-6">Scan with Xaman App to send {activeQuote.amountIn} {activeQuote.sourceAsset}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={xummQrUrl} alt="Xumm QR Code" className="w-64 h-64 rounded-xl shadow-md border border-blue-200 mb-6 bg-white p-2" />
          {xummNextUrl && (
            <a href={xummNextUrl} target="_blank" rel="noreferrer" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
              Open Xaman App
            </a>
          )}
          <p className="text-xs text-blue-600 mt-6 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Waiting for signature...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 font-medium">You Send</span>
              <span className="text-xl font-bold text-gray-900">{activeQuote.amountIn} {activeQuote.sourceAsset}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">You Receive (Est.)</span>
              <span className="text-2xl font-bold text-green-600">~{activeQuote.estimatedAmountOut} {activeQuote.destAsset}</span>
            </div>
          </div>

          {/* Route Steps */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Execution Path</h3>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              {activeQuote.steps.map((step, index) => (
                <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-100 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <span className="text-sm font-bold">{index + 1}</span>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-gray-900 text-sm">{step.provider}</span>
                      <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{step.type}</span>
                    </div>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 flex items-center gap-1"><Clock className="w-4 h-4" /> Est. Time</span>
              <span className="font-medium text-gray-900">~{activeQuote.estimatedTimeMinutes} mins</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Routing Fee</span>
              <span className="font-medium text-gray-900">{activeQuote.routingFee} {activeQuote.sourceAsset}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Network Fees</span>
              <span className="font-medium text-gray-900">{activeQuote.networkFee}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-100">
              <span className="text-gray-900 font-medium">Destination Address</span>
              <span className="font-mono text-gray-600 truncate max-w-[200px]" title={(activeQuote as any).destAddress}>
                {(activeQuote as any).destAddress}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50 text-blue-800 rounded-xl text-sm">
            <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-blue-600" />
            <p>
              RouteLedger is non-custodial. You will be prompted to sign a transaction from your XRPL wallet to initiate the transfer.
            </p>
          </div>

          <button
            onClick={handleConfirm}
            disabled={isExecuting}
            className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
          >
            {isExecuting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Preparing Transaction...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Confirm & Sign Transaction
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
