'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Circle, Loader2, ArrowRight, ExternalLink, Copy, Check } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { subscribeToTransfer } from '@/lib/firebase';
import { TransferState } from '@/lib/types';

const STEPS: { id: TransferState; label: string; description: string }[] = [
  { id: 'PENDING_XRPL_PAYMENT', label: 'Awaiting Payment', description: 'Sign the transaction in your XRPL wallet.' },
  { id: 'XRPL_CONFIRMED', label: 'Payment Confirmed', description: 'Funds received on XRPL.' },
  { id: 'BRIDGE_IN_FLIGHT', label: 'Bridging', description: 'Assets are moving across chains.' },
  { id: 'DESTINATION_SETTLING', label: 'Settling', description: 'Delivering assets to destination.' },
  { id: 'COMPLETED', label: 'Completed', description: 'Transfer successful!' },
];

export default function TransferStatus() {
  const { activeTransfer, updateTransferStatus, setActiveTransfer } = useAppStore();
  const [copied, setCopied] = useState(false);

  // Simulate the state machine progression for the MVP
  useEffect(() => {
    if (!activeTransfer) return;

    // In a real app, this would be driven by Firestore updates from a backend worker.
    // Here we simulate the progression if it's not completed or failed.
    let timeout: NodeJS.Timeout;

    const simulateProgress = () => {
      switch (activeTransfer.status) {
        case 'PENDING_XRPL_PAYMENT':
          timeout = setTimeout(() => {
            updateTransferStatus('XRPL_CONFIRMED', { source: '1234567890ABCDEF1234567890ABCDEF' });
          }, 5000); // Wait 5s for user to "sign"
          break;
        case 'XRPL_CONFIRMED':
          timeout = setTimeout(() => {
            updateTransferStatus('BRIDGE_IN_FLIGHT', { bridge: 'bridge_tx_hash_abc123' });
          }, 3000);
          break;
        case 'BRIDGE_IN_FLIGHT':
          timeout = setTimeout(() => {
            updateTransferStatus('DESTINATION_SETTLING');
          }, 8000); // Simulate bridge delay
          break;
        case 'DESTINATION_SETTLING':
          timeout = setTimeout(() => {
            updateTransferStatus('COMPLETED', { dest: '0xabcdef1234567890abcdef1234567890' });
          }, 4000);
          break;
        default:
          break;
      }
    };

    simulateProgress();

    // Cleanup
    return () => clearTimeout(timeout);
  }, [activeTransfer, updateTransferStatus]);

  // Listen to Firestore updates (if configured)
  useEffect(() => {
    if (!activeTransfer?.id) return;
    const unsubscribe = subscribeToTransfer(activeTransfer.id, (updatedTransfer) => {
      // If the backend updated it, sync local state
      if (updatedTransfer.status !== activeTransfer?.status) {
        updateTransferStatus(updatedTransfer.status, updatedTransfer.txHashes);
      }
    });
    return () => unsubscribe();
  }, [activeTransfer?.id, activeTransfer?.status, updateTransferStatus]);

  if (!activeTransfer) return null;

  const currentStepIndex = STEPS.findIndex(s => s.id === activeTransfer.status);
  const isFailed = activeTransfer.status === 'FAILED';

  const handleCopy = () => {
    if (activeTransfer.payinAddress) {
      navigator.clipboard.writeText(activeTransfer.payinAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Transfer Status</h2>
        <div className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
          {activeTransfer.status.replace(/_/g, ' ')}
        </div>
      </div>

      {/* Payment Instructions (Only show when pending) */}
      {activeTransfer.status === 'PENDING_XRPL_PAYMENT' && activeTransfer.payinAddress && (
        <div className="mb-8 p-5 bg-gray-50 border border-gray-200 rounded-xl">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Send exactly {activeTransfer.amountIn} XRP to:</h3>
          <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-300">
            <code className="text-sm text-gray-800 break-all">{activeTransfer.payinAddress}</code>
            <button onClick={handleCopy} className="ml-3 p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" /> Waiting for deposit...
          </p>
        </div>
      )}

      {/* Progress Timeline */}
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
        {STEPS.map((step, index) => {
          const isCompleted = currentStepIndex > index || activeTransfer.status === 'COMPLETED';
          const isCurrent = currentStepIndex === index && !isFailed;

          return (
            <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${
                isCompleted ? 'bg-green-500 text-white' : isCurrent ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : isCurrent ? <Loader2 className="w-5 h-5 animate-spin" /> : <Circle className="w-3 h-3" />}
              </div>
              
              <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border shadow-sm transition-all ${
                isCurrent ? 'bg-blue-50 border-blue-200' : isCompleted ? 'bg-white border-gray-100' : 'bg-gray-50 border-gray-100 opacity-60'
              }`}>
                <h4 className={`font-bold text-sm mb-1 ${isCurrent ? 'text-blue-900' : 'text-gray-900'}`}>{step.label}</h4>
                <p className={`text-xs ${isCurrent ? 'text-blue-700' : 'text-gray-500'}`}>{step.description}</p>
                
                {/* Transaction Hashes */}
                {step.id === 'XRPL_CONFIRMED' && activeTransfer.txHashes.source && (
                  <a href={`https://livenet.xrpl.org/transactions/${activeTransfer.txHashes.source}`} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                    View XRPL Tx <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {step.id === 'COMPLETED' && activeTransfer.txHashes.dest && (
                  <a href="#" className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                    View Dest Tx <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {activeTransfer.status === 'COMPLETED' && (
        <div className="mt-8">
          <button
            onClick={() => setActiveTransfer(null)}
            className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            Start New Transfer
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
