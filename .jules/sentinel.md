## 2026-07-02 - PII leakage in Firestore error handler
**Vulnerability:** The `handleFirestoreError` function was logging and throwing raw `authInfo` containing sensitive PII (email, displayName, photoUrl) from the Firebase currentUser object.
**Learning:** Even internal error handlers can become conduits for PII leakage if they blindly serialize the current user state. Throwing this data to the client also exposes internal metadata and PII to the browser.
**Prevention:** Always redact PII fields explicitly when capturing context for logs. Use generic error messages for client-side exceptions while keeping detailed (redacted) context in server-side logs.

## 2026-07-02 - IP Spoofing in Rate Limiting
**Vulnerability:** API routes were using the raw `x-forwarded-for` header for rate limiting, which can be easily spoofed by clients to bypass limits.
**Learning:** Next.js `x-forwarded-for` is not automatically trusted or sanitized. Secure platform-specific headers like `cf-connecting-ip` or `x-vercel-forwarded-for` should be prioritized.
**Prevention:** Implement a centralized `getClientIp` utility that understands the deployment environment's header priority and sanitizes the output (e.g., taking only the first IP in a list).
