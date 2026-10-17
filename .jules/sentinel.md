# Sentinel Journal - Security Learnings

## 2026-07-02 - IP Spoofing Prevention in Rate Limiting
**Vulnerability:** API routes used raw `request.headers.get('x-forwarded-for')` directly as client identifiers in rate limiting. Clients could spoof `x-forwarded-for` or send multiple comma-separated IP addresses to bypass rate limit checks.
**Learning:** Next.js 15 removed `.ip` from `NextRequest`. Extracting client IP requires prioritizing `x-real-ip` or extracting the first hop from `x-forwarded-for`.
**Prevention:** Always use a central `getClientIp` helper function that inspects headers safely and sanitizes IP extraction.
