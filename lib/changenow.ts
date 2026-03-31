import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { RouteQuote, ExecutionStep, Chain, Asset } from './types';

// ChangeNOW API Base URL (v2)
const CHANGENOW_API_URL = 'https://api.changenow.io/v2';
// In production, this should be stored securely and called via a backend proxy
const CHANGENOW_API_KEY = process.env.NEXT_PUBLIC_CHANGENOW_API_KEY || 'YOUR_CHANGENOW_API_KEY';

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
    const fromCurrency = assetMap[sourceAsset];
    const fromNetwork = networkMap[sourceChain];
    const toCurrency = assetMap[destAsset];
    const toNetwork = networkMap[destChain];

    // 1. Get Estimated Amount from ChangeNOW
    const response = await axios.get(`${CHANGENOW_API_URL}/exchange/estimated-amount`, {
      params: {
        fromCurrency,
        fromNetwork,
        toCurrency,
        toNetwork,
        fromAmount: amount,
        type: 'direct',
      },
      headers: {
        'x-changenow-api-key': CHANGENOW_API_KEY,
      },
    });

    const { estimatedAmount, transactionSpeedForecast } = response.data;

    // 2. Calculate Routing Fee (e.g., 0.2% built into the app)
    const amountNum = parseFloat(amount);
    const routingFeeNum = amountNum * 0.002;
    const estimatedAmountOutNum = parseFloat(estimatedAmount);
    
    // Adjust output amount to account for our routing fee (in a real app, we'd take this fee before sending to ChangeNOW or via an affiliate link)
    const finalEstimatedAmountOut = estimatedAmountOutNum * 0.998;

    // 3. Build Execution Steps
    const steps: ExecutionStep[] = [];
    
    if (sourceAsset !== destAsset && sourceChain === 'XRPL') {
       steps.push({
         id: uuidv4(),
         type: 'SWAP',
         description: `Swap ${sourceAsset} to bridge asset on XRPL`,
         provider: 'XRPL DEX',
         status: 'PENDING'
       });
    }

    steps.push({
      id: uuidv4(),
      type: 'BRIDGE',
      description: `Bridge ${sourceAsset} from ${sourceChain} to ${destChain}`,
      provider: 'ChangeNOW',
      status: 'PENDING'
    });

    if (destChain === 'SOLANA' && destAsset !== 'SOL') {
      steps.push({
        id: uuidv4(),
        type: 'SETTLE',
        description: `Settle ${destAsset} on Solana via Jupiter`,
        provider: 'Jupiter',
        status: 'PENDING'
      });
    } else {
      steps.push({
        id: uuidv4(),
        type: 'SETTLE',
        description: `Deliver ${destAsset} to destination address`,
        provider: 'ChangeNOW',
        status: 'PENDING'
      });
    }

    return {
      id: uuidv4(),
      sourceChain,
      sourceAsset,
      destChain,
      destAsset,
      amountIn: amount,
      estimatedAmountOut: finalEstimatedAmountOut.toFixed(6),
      routingFee: routingFeeNum.toFixed(6),
      networkFee: 'Included', // ChangeNOW includes network fees in their estimate
      totalFee: routingFeeNum.toFixed(6),
      estimatedTimeMinutes: transactionSpeedForecast ? Math.ceil(transactionSpeedForecast / 60) : 10,
      steps,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes validity
    };
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
    const fromCurrency = assetMap[sourceAsset];
    const fromNetwork = networkMap[sourceChain];
    const toCurrency = assetMap[destAsset];
    const toNetwork = networkMap[destChain];

    const response = await axios.post(
      `${CHANGENOW_API_URL}/exchange`,
      {
        fromCurrency,
        fromNetwork,
        toCurrency,
        toNetwork,
        fromAmount: amount,
        address: destAddress,
        flow: 'standard',
        type: 'direct',
      },
      {
        headers: {
          'x-changenow-api-key': CHANGENOW_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data; // Returns { id, payinAddress, payoutAddress, ... }
  } catch (error) {
    console.error('Error creating ChangeNOW transaction:', error);
    throw new Error('Failed to create cross-chain transaction.');
  }
};

export const getChangeNowTransactionStatus = async (txId: string) => {
  try {
    const response = await axios.get(`${CHANGENOW_API_URL}/exchange/by-id`, {
      params: { id: txId },
      headers: {
        'x-changenow-api-key': CHANGENOW_API_KEY,
      },
    });
    return response.data; // Returns { status, payinHash, payoutHash, ... }
  } catch (error) {
    console.error('Error fetching transaction status:', error);
    throw new Error('Failed to fetch transaction status.');
  }
};
