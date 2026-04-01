import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { RouteQuote, ExecutionStep, Chain, Asset } from './types';

// Map our internal assets to ChangeNOW tickers
const assetMap: Record<Asset, string> = {
  XRP: 'xrp',
  USDC: 'usdc',
  SOL: 'sol',
  ETH: 'eth',
  MATIC: 'matic',
  APT: 'apt',
  TRX: 'trx',
  XLM: 'xlm',
};

// Map our internal chains to ChangeNOW networks
const networkMap: Record<Chain, string> = {
  XRPL: 'xrp',
  EVM: 'eth', // Defaulting to Ethereum for EVM, can be dynamic (e.g., 'bsc', 'matic', 'base')
  SOLANA: 'sol',
};

export const getChangeNowQuote = async (
  sourceAsset: Asset,
  sourceChain: Chain,
  destAsset: Asset,
  destChain: Chain,
  amount: string
): Promise<RouteQuote> => {
  try {
    // Call our internal Next.js API route instead of ChangeNOW directly
    const response = await axios.get('/api/quote', {
      params: {
        sourceAsset,
        sourceChain,
        destAsset,
        destChain,
        amount,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching ChangeNOW quote:', error);
    throw new Error('Failed to fetch route quote. Please try again.');
  }
};

export const createChangeNowTransaction = async (
  sourceAsset: Asset,
  sourceChain: Chain,
  destAsset: Asset,
  destChain: Chain,
  amount: string,
  destAddress: string
) => {
  try {
    // Call our internal Next.js API route
    const response = await axios.post('/api/transaction', {
      sourceAsset,
      sourceChain,
      destAsset,
      destChain,
      amount,
      destAddress,
    });

    return response.data; // Returns { id, payinAddress, payoutAddress, ... }
  } catch (error) {
    console.error('Error creating ChangeNOW transaction:', error);
    throw new Error('Failed to create cross-chain transaction.');
  }
};

export const getChangeNowTransactionStatus = async (txId: string) => {
  try {
    // We could proxy this too, but for now we rely on webhooks for status updates.
    // If we need to poll, we should create an /api/status route.
    const response = await axios.get(`/api/status?id=${txId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction status:', error);
    throw new Error('Failed to fetch transaction status.');
  }
};
