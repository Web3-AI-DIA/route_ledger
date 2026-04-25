import { NextRequest } from 'next/server';

/**
 * Securely extracts the client's IP address from the request.
 * Prioritizes:
 * 1. request.ip (Next.js provided)
 * 2. x-real-ip header
 * 3. cf-connecting-ip header
 * 4. x-forwarded-for (rightmost entry)
 */
export function getClientIp(request: NextRequest): string {
  // 1. Next.js provided IP
  if (request.ip) {
    return request.ip;
  }

  // 2. X-Real-IP
  const xRealIp = request.headers.get('x-real-ip');
  if (xRealIp) {
    return xRealIp;
  }

  // 3. Cloudflare connecting IP
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) {
    return cfIp;
  }

  // 4. X-Forwarded-For (Rightmost entry is usually the most trusted from the proxy)
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const ips = xForwardedFor.split(',').map((ip) => ip.trim());
    return ips[ips.length - 1];
  }

  return 'anonymous';
}
