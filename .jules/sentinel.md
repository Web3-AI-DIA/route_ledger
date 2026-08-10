# Sentinel Security Journal

## 2026-07-02 - IP Spoofing Rate Limit Bypass
**Vulnerability:** API endpoints relying on Upstash rate limiting extracted raw `x-forwarded-for` request headers directly to identify clients. This allowed attackers to bypass rate limits by supplying arbitrary, spoofed IP addresses in custom headers.
**Learning:** Next.js 15.0.0 removed the built-in `.ip` property from `NextRequest`, leaving developers to parse headers manually. Relying on raw `x-forwarded-for` headers without prioritizing proxy-controlled headers like `x-real-ip` or extracting only the first entry of `x-forwarded-for` opens up rate-limiting bypasses.
**Prevention:** Always use a secure `getClientIp` utility that prioritizes proxy-verified headers (e.g., `x-real-ip`) or strictly sanitizes/splits `x-forwarded-for` to take only the first element.

## 2026-07-02 - Firestore PII Exposure in Errors
**Vulnerability:** Sensitive user information (such as Auth email, display name, and photo URLs) was logged in plaintext and leaked to clients inside thrown errors.
**Learning:** Catching and re-throwing raw Firestore error details directly exposes private user metadata. Centralized error handling needs to sanitise internal schemas and redact private fields.
**Prevention:** Redact sensitive fields (email, displayName, photoUrl) with `[REDACTED]` in centralized error helpers and log errors internally via Pino while throwing generic messages to the client.
