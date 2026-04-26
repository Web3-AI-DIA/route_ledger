/**
 * Securely extracts the client IP address from a request.
 * Prioritizes trusted headers and handles X-Forwarded-For carefully to prevent spoofing.
 */
export function getClientIp(request: Request): string {
  // 1. Next.js/Vercel specific property
  const nextIp = (request as any).ip;
  if (nextIp) return nextIp;

  const headers = request.headers;

  // 2. X-Real-IP is often set by trusted reverse proxies
  const xRealIp = headers.get('x-real-ip');
  if (xRealIp) return xRealIp;

  // 3. Cloudflare specific header
  const cfIp = headers.get('cf-connecting-ip');
  if (cfIp) return cfIp;

  // 4. X-Forwarded-For: client, proxy1, proxy2...
  // The rightmost IP is the most recently added one by a trusted proxy.
  const xForwardedFor = headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const ips = xForwardedFor.split(',').map((ip) => ip.trim());
    const rightmostIp = ips[ips.length - 1];
    if (rightmostIp) return rightmostIp;
  }

  return 'anonymous';
}
