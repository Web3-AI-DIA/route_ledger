/**
 * Securely extracts the client's IP address from a Next.js Request object.
 * Prioritizes the platform-provided request.ip, then checks common headers.
 */
export function getClientIp(request: Request): string {
  // 1. Next.js/Vercel platform-provided IP
  const nextRequest = request as any;
  if (nextRequest.ip) {
    return nextRequest.ip;
  }

  // 2. Custom headers
  const xRealIp = request.headers.get('x-real-ip');
  if (xRealIp) {
    return xRealIp;
  }

  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // 3. X-Forwarded-For (take the first entry to prevent spoofing)
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }

  return 'anonymous';
}
