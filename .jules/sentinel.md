# Sentinel Journal 🛡️

## 2026-06-12 - IP Spoofing and Schema Leakage
**Vulnerability:** API routes were using the raw `x-forwarded-for` header for rate limiting and leaking internal Zod validation errors to the client.
**Learning:** Defaulting to the entire `x-forwarded-for` header allows attackers to spoof their IP by providing their own header. Also, `validation.error.format()` exposes internal schema details.
**Prevention:** Always parse `x-forwarded-for` to get the first IP and return generic error messages for validation failures in production.
