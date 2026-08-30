import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Chain } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// SECURITY: Extract client IP securely to prevent rate limit bypass via spoofed x-forwarded-for headers.
export function getClientIp(request: Request): string {
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const ips = forwardedFor.split(',');
    if (ips[0]) {
      return ips[0].trim();
    }
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
