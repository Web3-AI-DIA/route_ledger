import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Chain } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely extracts the client IP address from various headers.
 * Prioritizes secure platform-specific headers over x-forwarded-for.
 */
export function getClientIp(headers: Headers): string {
  // SECURITY: Prioritize secure platform headers that are set by the provider and cannot be spoofed easily
  const cfConnectingIp = headers.get('cf-connecting-ip'); // Cloudflare
  if (cfConnectingIp) return cfConnectingIp;

  const vercelForwardedFor = headers.get('x-vercel-forwarded-for'); // Vercel
  if (vercelForwardedFor) return vercelForwardedFor;

  const realIp = headers.get('x-real-ip'); // Nginx/proxies
  if (realIp) return realIp;

  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    // SECURITY: Use the first element in the list, but be aware it could be spoofed
    // if we are not behind a trusted proxy that overwrites it.
    return forwardedFor.split(',')[0].trim();
  }

  return 'anonymous';
}

export function isValidAddress(address: string, chain: Chain): boolean {
  if (!address) return false;

  switch (chain) {
    case 'XRPL':
      // XRPL addresses start with 'r' and are 25-35 characters long
      return /^r[1-9A-HJ-NP-Za-km-z]{24,34}$/.test(address);
    
    case 'ETHEREUM':
    case 'POLYGON':
    case 'ARBITRUM':
    case 'AVALANCHE':
    case 'BSC':
    case 'BASE':
    case 'OPTIMISM':
      // EVM addresses start with '0x' and are 42 characters long
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    
    case 'SOLANA':
      // Solana addresses are base58 and 32-44 characters long
      return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
    
    case 'APTOS':
      // Aptos addresses start with '0x' and are 66 characters long
      return /^0x[a-fA-F0-9]{64}$/.test(address);
    
    case 'TRON':
      // Tron addresses start with 'T' and are 34 characters long
      return /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address);
    
    case 'STELLAR':
      // Stellar addresses start with 'G' and are 56 characters long
      return /^G[A-Z2-7]{55}$/.test(address);
    
    default:
      return false;
  }
}
