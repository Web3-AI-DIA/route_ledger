# Sentinel Journal

## 2026-07-02 - PII Leakage in Firestore Error Handler
**Vulnerability:** The `handleFirestoreError` function in `lib/error-handler.ts` was capturing and stringifying the full Firebase user object, including sensitive PII like email and display name. It then threw this stringified JSON as an error message, which could be displayed directly to users in the UI or leaked in client-side logs.
**Learning:** Error handlers often aggregate context for debugging, but if they are used on the client-side or their output is sent to the client, they must be strictly sanitized. Throwing stringified internal state is a high-risk pattern.
**Prevention:** Always redact PII before logging or throwing errors. Use a generic user-facing message for thrown errors and log the detailed (but still sanitized) information to a secure server-side logger.
