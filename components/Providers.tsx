'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { mainnet, polygon, arbitrum, optimism, base, bsc, avalanche } from '@reown/appkit/networks';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { SolanaAdapter } from '@reown/appkit-adapter-solana';
import { TronAdapter } from '@reown/appkit-adapter-tron';
import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin';
import { TonAdapter } from '@reown/appkit-adapter-ton';
import { solana, solanaTestnet, solanaDevnet, bitcoin, ton } from '@reown/appkit/networks';
import { WagmiProvider } from 'wagmi';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';

const queryClient = new QueryClient();

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || 'YOUR_REOWN_PROJECT_ID';

const metadata = {
  name: 'RouteLedger',
  description: 'Non-custodial cross-chain payment router',
  url: 'https://routeledger.app',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
};

const midnight = {
  id: 400,
  name: 'Midnight Testnet',
  network: 'midnight-testnet',
  nativeCurrency: {
    decimals: 6,
    name: 'Dust',
    symbol: 'DUST',
  },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.midnight.network'] },
    public: { http: ['https://rpc.testnet.midnight.network'] },
  },
  blockExplorers: {
    default: { name: 'MidnightScan', url: 'https://explorer.testnet.midnight.network' },
  },
  testnet: true,
  chainNamespace: 'eip155',
  caipNetworkId: 'eip155:400',
} as any;

const evmNetworks = [mainnet, polygon, arbitrum, optimism, base, bsc, avalanche, midnight];
const solanaNetworks = [solana, solanaTestnet, solanaDevnet];

const wagmiAdapter = new WagmiAdapter({
  networks: evmNetworks,
  projectId,
  ssr: true
});

const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()]
});

const tronAdapter = new TronAdapter();
const bitcoinAdapter = new BitcoinAdapter();
const tonAdapter = new TonAdapter();

if (typeof window !== 'undefined') {
  try {
    createAppKit({
      adapters: [wagmiAdapter, solanaWeb3JsAdapter, tronAdapter, bitcoinAdapter, tonAdapter],
      networks: [...evmNetworks, ...solanaNetworks, bitcoin, ton] as any,
      projectId,
      metadata,
      features: {
        analytics: true,
      },
    });
  } catch (err) {
    console.error('Failed to initialize AppKit:', err);
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AptosWalletAdapterProvider autoConnect={true}>
          {children}
        </AptosWalletAdapterProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
