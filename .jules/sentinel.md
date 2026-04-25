# Sentinel Journal 🛡️

## 2025-05-14 - IP Spoofing in Rate Limiting
**Vulnerability:** API routes used the `x-forwarded-for` header directly for rate limiting identification, which is easily spoofed by clients.
**Learning:** Next.js applications behind proxies need a robust way to extract the true client IP, prioritizing trusted information like `request.ip` or the rightmost entry in `x-forwarded-for` when behind multiple proxies.
**Prevention:** Always use a dedicated utility like `getClientIp` that follows a secure prioritization logic and handles proxy headers safely across all API endpoints requiring rate limiting.
