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

export function getClientIp(request: Request): string {
  // SECURITY: Extract IP safely to prevent spoofing.
  // We prioritize platform-specific headers that are typically more secure.
  const headers = request.headers;

  // Cloudflare
  const cfIp = headers.get('cf-connecting-ip');
  if (cfIp) return cfIp;

  // Vercel
  const vercelIp = headers.get('x-vercel-forwarded-for');
  if (vercelIp) return vercelIp.split(',')[0].trim();

  // Akamai / Fastly / Generic Proxies
  const xRealIp = headers.get('x-real-ip');
  if (xRealIp) return xRealIp;

  // Standard X-Forwarded-For (Least secure, but necessary as fallback)
  const xForwardedFor = headers.get('x-forwarded-for');
  if (xForwardedFor) {
    // Use the rightmost IP if we can't trust the leftmost one?
    // Actually, without knowing the proxy count, we take the first one
    // but prioritize the more specific headers above.
    return xForwardedFor.split(',')[0].trim();
  }

  return 'anonymous';
}
