## 2026-07-02 - IP Spoofing rate limit bypass
**Vulnerability:** Rate limiting bypass via HTTP header spoofing.
**Learning:** Next.js 15.0.0 removed the `.ip` and `.geo` properties from `NextRequest`. Manually falling back to `x-forwarded-for` directly without splitting and selecting the first IP or prioritizing `x-real-ip` allowed clients to spoof headers and completely bypass rate limits.
**Prevention:** Implement a central `getClientIp` utility prioritizing `x-real-ip` (which is typically set securely by edge proxies) and correctly extracting the first element of `x-forwarded-for` as the client IP, and apply it uniformly across all rate-limited endpoints.
