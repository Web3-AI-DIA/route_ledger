# Sentinel Journal 🛡️

## 2026-06-12 - PII Leakage in Global Error Handler
**Vulnerability:** Internal error objects containing sensitive PII (email, displayName, photoUrl) were being stringified and thrown as errors, potentially leaking to client-side UI and server-side logs.
**Learning:** The `handleFirestoreError` utility in `lib/error-handler.ts` captured the full Firebase `currentUser` object without redaction.
**Prevention:** Always explicitly redact sensitive fields (email, names, tokens) from error metadata before logging or throwing. Use generic error messages for client-side responses.
