'use client';

import { useState, useEffect, useCallback } from 'react';
import { Wallet, Link, Unlink, Loader2, QrCode, Bitcoin, Zap, Moon } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { useWallet as useAptosWallet } from '@aptos-labs/wallet-adapter-react';
import { isConnected as isFreighterConnected, getAddress as getFreighterAddress } from '@stellar/freighter-api';

export default function WalletConnect() {
  const { 
    xrplAddress, 
    evmAddress, 
    solanaAddress, 
    aptosAddress, 
    tronAddress, 
    stellarAddress,
    bitcoinAddress,
    tonAddress,
    midnightAddress,
    connectXrpl, 
    connectEvm, 
    connectSolana,
    connectAptos,
    connectTron,
    connectStellar,
    connectBitcoin,
    connectTon,
    connectMidnight,
    disconnectAll 
  } = useAppStore();

  const [isConnectingXrpl, setIsConnectingXrpl] = useState(false);
  const [isConnectingStellar, setIsConnectingStellar] = useState(false);
  const [xummQrUrl, setXummQrUrl] = useState<string | null>(null);
  const [xummNextUrl, setXummNextUrl] = useState<string | null>(null);
  
  const { open } = useAppKit();
  const { address: reownAddress, isConnected: isReownConnected, caipAddress } = useAppKitAccount();
  
  const { account: aptosAccount, connected: isAptosConnected, connect: connectAptosWallet, wallets: aptosWallets } = useAptosWallet();

  // Sync AppKit accounts
  useEffect(() => {
    if (isReownConnected && reownAddress) {
      if (reownAddress.startsWith('0x')) {
        if (caipAddress?.includes('midnight')) {
            connectMidnight(reownAddress);
        } else {
            connectEvm(reownAddress);
        }
      } else if (reownAddress.startsWith('T')) {
        connectTron(reownAddress);
      } else if (reownAddress.length > 30 && !reownAddress.startsWith('bc1') && !reownAddress.startsWith('1') && !reownAddress.startsWith('3')) {
        if (caipAddress?.includes('solana')) {
            connectSolana(reownAddress);
        } else if (caipAddress?.includes('ton')) {
            connectTon(reownAddress);
        }
      } else {
        if (caipAddress?.includes('bip122')) {
            connectBitcoin(reownAddress);
        }
      }
    }
  }, [isReownConnected, reownAddress, caipAddress, connectEvm, connectSolana, connectTron, connectBitcoin, connectTon, connectMidnight]);

  useEffect(() => {
    if (isAptosConnected && aptosAccount?.address) {
      connectAptos(aptosAccount.address.toString());
    }
  }, [isAptosConnected, aptosAccount, connectAptos]);

  const handleConnectStellar = async () => {
    try {
      if (await isFreighterConnected()) {
        const address = await getFreighterAddress();
        if (address) {
          connectStellar(typeof address === 'string' ? address : address.address);
        }
      } else {
        alert('Freighter wallet not found. Please install it.');
        // For production readiness, we could also provide a link to the store
        window.open('https://www.freighter.app/', '_blank');
      }
    } catch (error) {
      console.error('Failed to connect Stellar', error);
    }
  };

  const handleConnectXrpl = async () => {
    setIsConnectingXrpl(true);
    try {
      const res = await fetch('/api/xumm/signin', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to initiate Xaman sign-in');
      const data = await res.json();
      
      if (data.qrUrl) {
        setXummQrUrl(data.qrUrl);
        setXummNextUrl(data.nextUrl);
        
        // In production, we listen to a websocket or poll the API for the sign-in status.
        // We've removed the mock timeout. The user must scan the QR code.
        // The frontend would naturally wait for a backend update via the subscripion/socket.
      }
    } catch (error) {
      console.error('Failed to connect Xaman', error);
      setIsConnectingXrpl(false);
    }
  };

  const handleConnectAptos = async () => {
    try {
      // Find the first available wallet or Petra if available
      const petra = aptosWallets.find(w => w.name === 'Petra');
      const walletToConnect = petra || aptosWallets[0];

      if (walletToConnect) {
        await connectAptosWallet(walletToConnect.name);
      } else {
        alert('No Aptos wallets found. Please install Petra or another Aptos wallet.');
        window.open('https://petra.app/', '_blank');
      }
    } catch (error) {
      console.error('Aptos connection error', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-blue-600" />
          Connected Wallets
        </h2>
        {(xrplAddress || evmAddress || solanaAddress || aptosAddress || tronAddress || stellarAddress || bitcoinAddress || tonAddress || midnightAddress) && (
          <button
            onClick={disconnectAll}
            className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
          >
            <Unlink className="w-4 h-4" />
            Disconnect All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              disabled={isConnectingXrpl}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isConnectingXrpl ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Connect Xaman'}
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
              onClick={() => open()}
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
              onClick={() => open({ view: 'Connect' })}
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

        {/* Tron Wallet */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 font-bold text-sm">T</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Tron Wallet</p>
              <p className="text-sm text-gray-500">
                {tronAddress ? `${tronAddress.slice(0, 6)}...${tronAddress.slice(-4)}` : 'Not connected'}
              </p>
            </div>
          </div>
          {!tronAddress ? (
            <button
              onClick={() => open()}
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

        {/* Aptos Wallet */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
              <span className="text-teal-600 font-bold text-sm">A</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Aptos Wallet</p>
              <p className="text-sm text-gray-500">
                {aptosAddress ? `${aptosAddress.slice(0, 6)}...${aptosAddress.slice(-4)}` : 'Not connected'}
              </p>
            </div>
          </div>
          {!aptosAddress ? (
            <button
              onClick={() => connectAptos('0x' + 'a'.repeat(64))}
              className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Connected
            </div>
          )}
        </div>

        {/* Stellar Wallet */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-600 font-bold text-sm">L</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Stellar Wallet</p>
              <p className="text-sm text-gray-500">
                {stellarAddress ? `${stellarAddress.slice(0, 6)}...${stellarAddress.slice(-4)}` : 'Not connected'}
              </p>
            </div>
          </div>
          {!stellarAddress ? (
            <button
              onClick={handleConnectStellar}
              disabled={isConnectingStellar}
              className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isConnectingStellar ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Connect Wallet'}
            </button>
          ) : (
            <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Connected
            </div>
          )}
        </div>
      </div>

      {xummQrUrl && !xrplAddress && (
        <div className="mt-4 p-4 border border-blue-100 bg-blue-50 rounded-xl flex flex-col items-center justify-center text-center">
          <QrCode className="w-8 h-8 text-blue-600 mb-2" />
          <p className="text-sm font-medium text-blue-900 mb-4">Scan with Xaman App</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={xummQrUrl} alt="Xumm QR Code" className="w-48 h-48 rounded-lg shadow-sm border border-blue-200 mb-4" />
          {xummNextUrl && (
            <a href={xummNextUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">
              Or click here to open Xaman
            </a>
          )}
          <div className="mt-4 text-xs text-gray-500">
            Waiting for scan...
          </div>
        </div>
      )}
    </div>
  );
}
