export type Chain = 'XRPL' | 'EVM' | 'SOLANA';
export type Asset = 'XRP' | 'USDC' | 'SOL' | 'ETH' | 'MATIC' | 'APT' | 'TRX' | 'XLM';

export interface RouteQuote {
  id: string;
  sourceChain: Chain;
  sourceAsset: Asset;
  destChain: Chain;
  destAsset: Asset;
  amountIn: string;
  estimatedAmountOut: string;
  routingFee: string; // 0.1% - 0.3%
  networkFee: string;
  totalFee: string;
  estimatedTimeMinutes: number;
  steps: ExecutionStep[];
  expiresAt: number;
}

export interface ExecutionStep {
  id: string;
  type: 'SWAP' | 'BRIDGE' | 'SETTLE';
  description: string;
  provider: string; // e.g., 'ChangeNOW', 'Jupiter', 'Uniswap'
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  txHash?: string;
}

export type TransferState =
  | 'PENDING_XRPL_PAYMENT'
  | 'XRPL_CONFIRMED'
  | 'BRIDGE_IN_FLIGHT'
  | 'DESTINATION_SETTLING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REFUNDED';

export interface TransferRequest {
  id: string;
  quoteId: string;
  userId: string;
  sourceAddress: string;
  destAddress: string;
  amountIn: string;
  expectedAmountOut: string;
  status: TransferState;
  createdAt: number;
  updatedAt: number;
  payinAddress?: string; // Address to send funds to (ChangeNOW)
  payoutAddress?: string; // Final destination
  txHashes: {
    source?: string;
    bridge?: string;
    dest?: string;
  };
  error?: string;
}

export interface BridgeQuote {
  fromCurrency: string;
  fromNetwork: string;
  toCurrency: string;
  toNetwork: string;
  expectedAmount: number;
  validUntil: string;
}

export interface SwapQuote {
  provider: string;
  amountIn: string;
  amountOut: string;
  priceImpact: number;
  fee: string;
}
