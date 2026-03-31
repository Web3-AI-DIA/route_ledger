'use client';

import { useAppStore } from '@/lib/store';
import WalletConnect from '@/components/WalletConnect';
import QuoteForm from '@/components/QuoteForm';
import QuoteReview from '@/components/QuoteReview';
import TransferStatus from '@/components/TransferStatus';
import { Layers } from 'lucide-react';

export default function Home() {
  const { activeQuote, activeTransfer } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-inner">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">RouteLedger</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Documentation</a>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Explorer</a>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Support</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Info & Wallets */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
              <h1 className="text-3xl font-bold mb-4 leading-tight">Cross-Chain Routing Made Simple.</h1>
              <p className="text-blue-100 mb-6 text-sm leading-relaxed">
                Send assets from XRPL to EVM or Solana in one step. We abstract away bridges, swaps, and routing complexity.
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-blue-200 uppercase tracking-wider">
                <span>XRPL</span>
                <span className="w-1 h-1 bg-blue-300 rounded-full" />
                <span>EVM</span>
                <span className="w-1 h-1 bg-blue-300 rounded-full" />
                <span>Solana</span>
              </div>
            </div>

            <WalletConnect />
          </div>

          {/* Right Column: App Flow */}
          <div className="lg:col-span-8">
            <div className="max-w-2xl mx-auto lg:mx-0">
              {activeTransfer ? (
                <TransferStatus />
              ) : activeQuote ? (
                <QuoteReview />
              ) : (
                <QuoteForm />
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
