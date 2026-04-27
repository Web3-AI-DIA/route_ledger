import { NextRequest } from 'next/server';

/**
 * Securely extracts the client's IP address from a request.
 * This helper prioritizes trusted headers provided by common deployment platforms.
 */
export function getClientIp(request: Request | NextRequest): string {
  // 1. Vercel's preferred way
  if ('ip' in request && request.ip) {
    return request.ip as string;
  }

  const headers = request.headers;

  // 2. Standard and platform-specific headers
  // We prioritize these over X-Forwarded-For because they are typically
  // harder to spoof if the platform (e.g., Cloudflare, Nginx) is configured correctly.
  const xRealIp = headers.get('x-real-ip');
  if (xRealIp) return xRealIp;

  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp;

  // 3. X-Forwarded-For header
  // This header can be a comma-separated list of IPs.
  // The leftmost is the original client, but can be easily spoofed.
  // In most secure configurations, we take the rightmost IP that we trust.
  const xForwardedFor = headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const ips = xForwardedFor.split(',').map((ip) => ip.trim());
    return ips[ips.length - 1];
  }

  return 'anonymous';
}
