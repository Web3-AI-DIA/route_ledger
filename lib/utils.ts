import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Chain } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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

/**
 * Extracts the client IP address from request headers in a secure way.
 * Prioritizes trusted headers and handles X-Forwarded-For safely.
 */
export function getClientIp(request: Request): string {
  // SECURITY: Prioritize secure headers from trusted proxies/CDNs
  const xRealIp = request.headers.get('x-real-ip');
  if (xRealIp) return xRealIp;

  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp;

  const xVercelForwardedFor = request.headers.get('x-vercel-forwarded-for');
  if (xVercelForwardedFor) return xVercelForwardedFor;

  // SECURITY: X-Forwarded-For can be spoofed. Only take the first element (client IP).
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }

  return 'anonymous';
}
