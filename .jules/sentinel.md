# Sentinel Journal

## 2026-07-02 - PII Leakage Remediation in Error Handlers
**Vulnerability:** PII leakage in the centralized error handler (`lib/error-handler.ts`). Sensitive user details (such as email, displayName, and photoUrl) were being serialized and logged to console or thrown directly back to the client.
**Learning:** The error handler was capturing raw user objects from Firebase Auth and serialization included sensitive properties. Returning the serialized payload directly exposed internal metadata and PII to the client-side UI.
**Prevention:** Migrate from `console.error` to a centralized Pino logger with specific redactions. Explicitly redact sensitive auth fields with '[REDACTED]' and throw a generic error message ('An internal database error occurred') to the client to hide internal details.

## 2026-07-02 - Rate-Limit Bypass via IP Spoofing
**Vulnerability:** The application was using the unvalidated `x-forwarded-for` header to identify clients for rate limiting in key API routes (`quote`, `transaction`, `xumm/payload`, and `xumm/signin`). A malicious user could easily bypass rate limits by supplying arbitrary IP addresses in the `x-forwarded-for` header.
**Learning:** Next.js 15.0.0 removed the `.ip` and `.geo` properties on `NextRequest`. Relying on headers without verifying their authenticity or order allows clients to spoof their source IP. In typical server environments, the edge proxy sets the `x-real-ip` header reliably, while `x-forwarded-for` can be appended with client-supplied values.
**Prevention:** Centralize client IP resolution into a utility function `getClientIp(request)`. Prioritize the `x-real-ip` header from the edge proxy as the trusted source of the client IP, falling back to splitting `x-forwarded-for` and taking the first element, or 'anonymous' if headers are not present.
