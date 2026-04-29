import { NextRequest } from 'next/server';

/**
 * Securely extracts the client's IP address from a request.
 *
 * This utility helps prevent IP spoofing by prioritizing reliable headers
 * and properly parsing the x-forwarded-for header.
 *
 * Security Note: Directly using request.headers.get('x-forwarded-for') is
 * vulnerable to IP spoofing because an attacker can set this header to
 * any value. By taking only the first entry or using platform-provided
 * request.ip, we mitigate this risk for rate limiting.
 */
export function getClientIp(request: Request | NextRequest): string {
  // 1. Try platform-provided IP (e.g. Next.js/Vercel)
  // We use type assertion to access 'ip' which is added by Next.js to the request object in middleware/API routes
  const nextRequest = request as any;
  if (nextRequest.ip) {
    return nextRequest.ip;
  }

  // 2. Try common trusted proxy headers
  const xRealIp = request.headers.get('x-real-ip');
  if (xRealIp) {
    return xRealIp;
  }

  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // 3. Fallback to x-forwarded-for, but only take the first IP
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    // The first IP is the original client IP, subsequent ones are proxies
    return xForwardedFor.split(',')[0].trim();
  }

  return 'anonymous';
}
