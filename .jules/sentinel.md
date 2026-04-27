## 2025-05-22 - IP Spoofing for Rate Limit Bypass
**Vulnerability:** API routes were directly reading the `x-forwarded-for` header to identify clients for rate limiting.
**Learning:** Using the raw `x-forwarded-for` header is insecure because the leftmost IP (the original client) can be easily spoofed by attackers. In proxied environments like Vercel or Cloudflare, the rightmost IP is typically the one appended by the trusted proxy.
**Prevention:** Use a centralized `getClientIp` utility that prioritizes platform-specific trusted headers (like `request.ip` on Vercel) and handles `x-forwarded-for` by taking the last entry.
