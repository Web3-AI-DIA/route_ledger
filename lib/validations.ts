import { z } from 'zod';

export const ChainSchema = z.enum([
  'XRPL', 
  'ETHEREUM', 
  'POLYGON', 
  'SOLANA', 
  'APTOS', 
  'ARBITRUM', 
  'AVALANCHE', 
  'BSC', 
  'BASE', 
  'TRON', 
  'OPTIMISM', 
  'STELLAR'
]);

export const AssetSchema = z.enum([
  'XRP', 
  'USDC', 
  'USDT', 
  'SOL', 
  'ETH', 
  'MATIC', 
  'APT', 
  'TRX', 
  'XLM'
]);

export const QuoteRequestSchema = z.object({
  sourceAsset: AssetSchema,
  sourceChain: ChainSchema,
  destAsset: AssetSchema,
  destChain: ChainSchema,
  amount: z.string().regex(/^\d+(\.\d+)?$/, 'Invalid amount format'),
});

export const ExecutionStepSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['SWAP', 'BRIDGE', 'SETTLE']),
  description: z.string(),
  provider: z.string(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED']),
  txHash: z.string().optional(),
});

export const TransferRequestSchema = z.object({
  id: z.string().uuid(),
  quoteId: z.string().uuid(),
  userId: z.string(),
  sourceAddress: z.string(),
  destAddress: z.string(),
  amountIn: z.string().regex(/^\d+(\.\d+)?$/),
  expectedAmountOut: z.string().regex(/^\d+(\.\d+)?$/),
  status: z.enum([
    'PENDING_XRPL_PAYMENT',
    'XRPL_CONFIRMED',
    'BRIDGE_IN_FLIGHT',
    'DESTINATION_SETTLING',
    'COMPLETED',
    'FAILED',
    'REFUNDED',
  ]),
  createdAt: z.number(),
  updatedAt: z.number(),
  payinAddress: z.string().optional(),
  payoutAddress: z.string().optional(),
  txHashes: z.object({
    source: z.string().optional(),
    bridge: z.string().optional(),
    dest: z.string().optional(),
  }),
  error: z.string().optional(),
});

export const TransactionRequestSchema = z.object({
  sourceAsset: AssetSchema,
  sourceChain: ChainSchema,
  destAsset: AssetSchema,
  destChain: ChainSchema,
  amount: z.string().regex(/^\d+(\.\d+)?$/, 'Invalid amount format'),
  destAddress: z.string().min(1, 'Destination address is required'),
});

export const XummPayloadSchema = z.object({
  amount: z.string().regex(/^\d+(\.\d{1,6})?$/, 'Invalid XRP amount format (max 6 decimal places)'),
  destination: z.string().min(1, 'Destination address is required'),
  memo: z.string().optional(),
});
