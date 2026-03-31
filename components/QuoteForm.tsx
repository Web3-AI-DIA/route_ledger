'use client';

import { useState } from 'react';
import { ArrowRight, ArrowDownUp, Info, Loader2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Chain, Asset } from '@/lib/types';
import { getChangeNowQuote } from '@/lib/changenow';

const SUPPORTED_CHAINS: { id: Chain; name: string; assets: Asset[] }[] = [
  { id: 'XRPL', name: 'XRP Ledger', assets: ['XRP', 'USDC'] },
  { id: 'EVM', name: 'EVM (Ethereum/Base)', assets: ['USDC', 'ETH', 'MATIC'] },
  { id: 'SOLANA', name: 'Solana', assets: ['SOL', 'USDC'] },
];

export default function QuoteForm() {
  const { xrplAddress, evmAddress, solanaAddress, setActiveQuote } = useAppStore();
  
  const [sourceChain, setSourceChain] = useState<Chain>('XRPL');
  const [sourceAsset, setSourceAsset] = useState<Asset>('XRP');
  const [destChain, setDestChain] = useState<Chain>('EVM');
  const [destAsset, setDestAsset] = useState<Asset>('USDC');
  const [amount, setAmount] = useState<string>('');
  const [destAddress, setDestAddress] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!destAddress) {
      setError('Please enter a destination address');
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, this calls our backend which calls ChangeNOW.
      // For MVP, we simulate the ChangeNOW API response since we don't have a real API key.
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // MOCK RESPONSE (Replace with actual getChangeNowQuote call when API key is available)
      const mockQuote = {
        id: crypto.randomUUID(),
        sourceChain,
        sourceAsset,
        destChain,
        destAsset,
        amountIn: amount,
        estimatedAmountOut: (parseFloat(amount) * 0.98).toFixed(6), // Mock 2% total cost
        routingFee: (parseFloat(amount) * 0.002).toFixed(6),
        networkFee: 'Included',
        totalFee: (parseFloat(amount) * 0.002).toFixed(6),
        estimatedTimeMinutes: 5,
        steps: [
          {
            id: crypto.randomUUID(),
            type: 'BRIDGE' as const,
            description: `Bridge ${sourceAsset} from ${sourceChain} to ${destChain}`,
            provider: 'ChangeNOW',
            status: 'PENDING' as const
          }
        ],
        expiresAt: Date.now() + 5 * 60 * 1000,
        destAddress, // Store it in the quote for the next step
      };

      setActiveQuote(mockQuote as any);
    } catch (err: any) {
      setError(err.message || 'Failed to get quote');
    } finally {
      setIsLoading(false);
    }
  };

  const sourceChainObj = SUPPORTED_CHAINS.find(c => c.id === sourceChain);
  const destChainObj = SUPPORTED_CHAINS.find(c => c.id === destChain);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Route Assets</h2>
      
      <form onSubmit={handleGetQuote} className="space-y-6">
        {/* Source */}
        <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <select
                value={sourceChain}
                onChange={(e) => {
                  const newChain = e.target.value as Chain;
                  setSourceChain(newChain);
                  setSourceAsset(SUPPORTED_CHAINS.find(c => c.id === newChain)!.assets[0]);
                }}
                className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {SUPPORTED_CHAINS.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={sourceAsset}
                onChange={(e) => setSourceAsset(e.target.value as Asset)}
                className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {sourceChainObj?.assets.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-4 text-2xl font-semibold rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="flex justify-center -my-3 relative z-10">
          <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm">
            <ArrowDownUp className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Destination */}
        <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <select
                value={destChain}
                onChange={(e) => {
                  const newChain = e.target.value as Chain;
                  setDestChain(newChain);
                  setDestAsset(SUPPORTED_CHAINS.find(c => c.id === newChain)!.assets[0]);
                }}
                className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {SUPPORTED_CHAINS.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={destAsset}
                onChange={(e) => setDestAsset(e.target.value as Asset)}
                className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {destChainObj?.assets.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <input
              type="text"
              placeholder="Destination Address"
              value={destAddress}
              onChange={(e) => setDestAddress(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-sm"
            />
            {/* Auto-fill helper */}
            <div className="mt-2 flex gap-2">
              {destChain === 'EVM' && evmAddress && (
                <button type="button" onClick={() => setDestAddress(evmAddress)} className="text-xs text-blue-600 hover:underline">Use Connected EVM Wallet</button>
              )}
              {destChain === 'SOLANA' && solanaAddress && (
                <button type="button" onClick={() => setDestAddress(solanaAddress)} className="text-xs text-blue-600 hover:underline">Use Connected Solana Wallet</button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !xrplAddress}
          className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Finding Best Route...
            </>
          ) : !xrplAddress ? (
            'Connect XRPL Wallet to Continue'
          ) : (
            <>
              Review Route
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
