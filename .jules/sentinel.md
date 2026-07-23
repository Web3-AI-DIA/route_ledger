# Sentinel Journal: Critical Security Learnings

## 2026-07-02 - Rate-Limiter Bypass via IP Spoofing
**Vulnerability:** Rate limiting relied on direct extraction of the `x-forwarded-for` header without validation or proxy ordering awareness, allowing clients to spoof their IP address by injecting arbitrary `X-Forwarded-For` values and bypassing rate limits.
**Learning:** Next.js applications run behind reverse proxies or CDNs, which append or set headers differently. Prioritizing `x-real-ip` (when set reliably by edge infrastructure) or parsing only the client-facing elements from `x-forwarded-for` is crucial for reliable client identification.
**Prevention:** Implement a centralized `getClientIp` utility that sanitizes headers, prioritizes trustworthy headers (like `x-real-ip`), and takes only the first client IP from `x-forwarded-for`. Use this utility consistently across all rate-limited endpoints.
