import axios from 'axios';
import axiosRetry from 'axios-retry';
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

const validateInputs = (
  sourceAsset: Asset,
  sourceChain: Chain,
  destAsset: Asset,
  destChain: Chain,
  amount: string,
  destAddress?: string
) => {
  if (!assetMap[sourceAsset]) {
    throw new Error(`Invalid source asset: ${sourceAsset}`);
  }
  if (!assetMap[destAsset]) {
    throw new Error(`Invalid destination asset: ${destAsset}`);
  }
  if (!networkMap[sourceChain]) {
    throw new Error(`Invalid source chain: ${sourceChain}`);
  }
  if (!networkMap[destChain]) {
    throw new Error(`Invalid destination chain: ${destChain}`);
  }
  if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
    throw new Error('Invalid amount specified.');
  }
  if (destAddress && !validateAddress(destAddress, destChain)) {
    throw new Error('Invalid destination address.');
  }
};

const validateAddress = (address: string, chain: Chain): boolean => {
  // Add basic validation for each chain type here
  // This is an example for XRP. Extend as needed for other chains.
  if (chain === 'XRPL' && !/^r[1-9A-HJ-NP-Za-km-z]{25,34}$/.test(address)) {
    return false;
  }
  return true;
};

axiosRetry(axios, { retries: 3 });

export const getChangeNowQuote = async (
  sourceAsset: Asset,
  sourceChain: Chain,
  destAsset: Asset,
  destChain: Chain,
  amount: string
): Promise<RouteQuote> => {
  validateInputs(sourceAsset, sourceChain, destAsset, destChain, amount);

  try {
    const response = await axios.get(process.env.NEXT_PUBLIC_CHANGE_NOW_QUOTE_API || '/api/quote', {
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
  validateInputs(sourceAsset, sourceChain, destAsset, destChain, amount, destAddress);

  try {
    const response = await axios.post(process.env.NEXT_PUBLIC_CHANGE_NOW_TRANSACTION_API || '/api/transaction', {
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
    const response = await axios.get(`${process.env.NEXT_PUBLIC_CHANGE_NOW_STATUS_API || '/api/status'}?id=${txId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction status:', error);
    throw new Error('Failed to fetch transaction status.');
  }
};