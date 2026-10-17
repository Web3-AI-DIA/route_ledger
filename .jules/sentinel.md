# Sentinel Journal

## 2026-07-02 - Secure IP Extraction for Rate Limiting
**Vulnerability:** IP spoofing via unverified `X-Forwarded-For` headers allowed attackers to bypass rate limits.
**Learning:** Blindly trusting `X-Forwarded-For` is dangerous because it's user-controllable. Different hosting providers (Vercel, Cloudflare, etc.) provide more secure headers that should be prioritized.
**Prevention:** Use a centralized utility like `getClientIp` that checks for platform-specific secure headers (`cf-connecting-ip`, `x-vercel-forwarded-for`) before falling back to generic headers.

## 2026-07-02 - Schema Leakage in API Responses
**Vulnerability:** Returning Zod's `validation.error.format()` directly to the client exposed internal data structures and validation logic.
**Learning:** Error messages should be generic for clients while remaining detailed in server-side logs.
**Prevention:** Remove detailed validation error objects from production API responses and ensure they are only sent to the logger.
