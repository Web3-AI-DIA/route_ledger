# Sentinel Journal

## 2026-07-02 - Rate Limit Bypass via IP Spoofing (Next.js 15)
**Vulnerability:** Rate limiting was implemented using Upstash Redis, but the client identifier was extracted directly from the user-controlled `x-forwarded-for` header without fallback or proxy-filtering validation. This allowed users to bypass rate limiting completely by spoofing `X-Forwarded-For` with arbitrary IP addresses.
**Learning:** In Next.js 15.0.0, `.ip` and `.geo` were removed from `NextRequest`, forcing developers to extract IP addresses manually. Direct extraction from `x-forwarded-for` without prioritizing upstream proxy headers (like `x-real-ip` or extracting only the first segment from a proxy chain) introduces a severe rate limit bypass risk.
**Prevention:** Always use a central secure IP extraction utility `getClientIp` that prioritizes `x-real-ip` (when deployed behind a secure edge proxy that strips user-supplied `x-real-ip`) or safely extracts only the first segment of `x-forwarded-for` instead of trusting the raw header value.
