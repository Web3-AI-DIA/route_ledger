'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { mainnet, polygon, arbitrum, optimism, base, bsc, avalanche } from '@reown/appkit/networks';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { SolanaAdapter } from '@reown/appkit-adapter-solana';
import { solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks';
import { WagmiProvider } from 'wagmi';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { WalletProvider as TronWalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';

const queryClient = new QueryClient();

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || 'YOUR_REOWN_PROJECT_ID';

const metadata = {
  name: 'RouteLedger',
  description: 'Non-custodial cross-chain payment router',
  url: 'https://routeledger.app', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
};

const evmNetworks = [mainnet, polygon, arbitrum, optimism, base, bsc, avalanche];
const solanaNetworks = [solana, solanaTestnet, solanaDevnet];

const wagmiAdapter = new WagmiAdapter({
  networks: evmNetworks,
  projectId,
  ssr: true
});

const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()]
});

createAppKit({
  adapters: [wagmiAdapter, solanaWeb3JsAdapter],
  networks: [...evmNetworks, ...solanaNetworks],
  projectId,
  metadata,
  features: {
    analytics: true
  }
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AptosWalletAdapterProvider autoConnect={true}>
          <TronWalletProvider>
            {children}
          </TronWalletProvider>
        </AptosWalletAdapterProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
