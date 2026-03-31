import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RouteQuote, TransferRequest, Chain, Asset } from './types';

interface AppState {
  // Wallet State
  xrplAddress: string | null;
  evmAddress: string | null;
  solanaAddress: string | null;
  connectXrpl: (address: string) => void;
  connectEvm: (address: string) => void;
  connectSolana: (address: string) => void;
  disconnectAll: () => void;

  // Routing State
  activeQuote: RouteQuote | null;
  setActiveQuote: (quote: RouteQuote | null) => void;

  // Transfer State
  activeTransfer: TransferRequest | null;
  setActiveTransfer: (transfer: TransferRequest | null) => void;
  updateTransferStatus: (status: TransferRequest['status'], txHashes?: Partial<TransferRequest['txHashes']>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      xrplAddress: null,
      evmAddress: null,
      solanaAddress: null,
      connectXrpl: (address) => set({ xrplAddress: address }),
      connectEvm: (address) => set({ evmAddress: address }),
      connectSolana: (address) => set({ solanaAddress: address }),
      disconnectAll: () => set({ xrplAddress: null, evmAddress: null, solanaAddress: null }),

      activeQuote: null,
      setActiveQuote: (quote) => set({ activeQuote: quote }),

      activeTransfer: null,
      setActiveTransfer: (transfer) => set({ activeTransfer: transfer }),
      updateTransferStatus: (status, txHashes) =>
        set((state) => ({
          activeTransfer: state.activeTransfer
            ? {
                ...state.activeTransfer,
                status,
                txHashes: { ...state.activeTransfer.txHashes, ...txHashes },
                updatedAt: Date.now(),
              }
            : null,
        })),
    }),
    {
      name: 'routeledger-storage',
    }
  )
);
