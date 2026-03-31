'use client';

import { useState } from 'react';
import { Wallet, Link, Unlink } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function WalletConnect() {
  const { xrplAddress, evmAddress, solanaAddress, connectXrpl, connectEvm, connectSolana, disconnectAll } = useAppStore();
  const [isConnecting, setIsConnecting] = useState(false);

  // Simulated connection logic for MVP. 
  // In production, this uses Xaman SDK for XRPL and Reown AppKit for EVM/Solana.
  const handleConnectXrpl = async () => {
    setIsConnecting(true);
    // Simulate Xaman connection delay
    setTimeout(() => {
      connectXrpl('rPVMhWBsfF9iMXYj3aAzJVkPDTFNSyWdKy');
      setIsConnecting(false);
    }, 1000);
  };

  const handleConnectEvm = async () => {
    setIsConnecting(true);
    // Simulate Reown AppKit connection delay
    setTimeout(() => {
      connectEvm('0x71C...976F');
      setIsConnecting(false);
    }, 1000);
  };

  const handleConnectSolana = async () => {
    setIsConnecting(true);
    // Simulate Reown AppKit connection delay
    setTimeout(() => {
      connectSolana('HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH');
      setIsConnecting(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-blue-600" />
          Connected Wallets
        </h2>
        {(xrplAddress || evmAddress || solanaAddress) && (
          <button
            onClick={disconnectAll}
            className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
          >
            <Unlink className="w-4 h-4" />
            Disconnect All
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* XRPL Wallet */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">X</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">XRPL Wallet</p>
              <p className="text-sm text-gray-500">
                {xrplAddress ? `${xrplAddress.slice(0, 8)}...${xrplAddress.slice(-4)}` : 'Not connected'}
              </p>
            </div>
          </div>
          {!xrplAddress ? (
            <button
              onClick={handleConnectXrpl}
              disabled={isConnecting}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Connect Xaman
            </button>
          ) : (
            <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Connected
            </div>
          )}
        </div>

        {/* EVM Wallet */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-purple-600 font-bold text-sm">E</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">EVM Wallet</p>
              <p className="text-sm text-gray-500">
                {evmAddress ? `${evmAddress.slice(0, 6)}...${evmAddress.slice(-4)}` : 'Not connected'}
              </p>
            </div>
          </div>
          {!evmAddress ? (
            <button
              onClick={handleConnectEvm}
              disabled={isConnecting}
              className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              Connect AppKit
            </button>
          ) : (
            <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Connected
            </div>
          )}
        </div>

        {/* Solana Wallet */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 font-bold text-sm">S</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Solana Wallet</p>
              <p className="text-sm text-gray-500">
                {solanaAddress ? `${solanaAddress.slice(0, 6)}...${solanaAddress.slice(-4)}` : 'Not connected'}
              </p>
            </div>
          </div>
          {!solanaAddress ? (
            <button
              onClick={handleConnectSolana}
              disabled={isConnecting}
              className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              Connect AppKit
            </button>
          ) : (
            <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Connected
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
