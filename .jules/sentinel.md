# Sentinel Journal

## 2026-07-02 - PII Leakage in Global Error Handler
**Vulnerability:** The `handleFirestoreError` function in `lib/error-handler.ts` was capturing and throwing full user objects including `email`, `displayName`, and `photoURL`. These were being stringified and potentially sent to the client or logged in plain text.
**Learning:** captured `auth.currentUser` data often contains more PII than expected. Centralized error handlers must explicitly redact sensitive fields before logging or propagating errors.
**Prevention:** Use a redaction utility or a strict allowlist for error metadata. Always return generic error messages to the client.

## 2026-07-02 - IP Spoofing via X-Forwarded-For
**Vulnerability:** Rate limiting was relying on the `x-forwarded-for` header without validation. An attacker could spoof this header to bypass rate limits.
**Learning:** `x-forwarded-for` can be easily manipulated by the client unless the application is behind a trusted proxy that overwrites it.
**Prevention:** Use secure platform-specific headers (like `cf-connecting-ip` for Cloudflare or `x-vercel-forwarded-for` for Vercel) and prioritize them over `x-forwarded-for`.

## 2026-07-02 - Internal Schema Leakage in API Responses
**Vulnerability:** API routes were returning `validation.error.format()` from Zod directly to the client in 400 responses.
**Learning:** Providing detailed validation errors can leak the internal structure and requirements of the API schemas, aiding attackers in probing for vulnerabilities.
**Prevention:** Return generic "Invalid parameters" messages to the client while logging the detailed errors internally for debugging.
