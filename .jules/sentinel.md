# Sentinel Journal 🛡️

## 2026-07-02 - PII Leakage in Global Error Handler
**Vulnerability:** The `handleFirestoreError` function in `lib/error-handler.ts` was capturing and stringifying full `auth.currentUser` objects, including `email`, `displayName`, and `photoURL`, then throwing this as a generic Error. This could leak PII to the client-side UI and external logging services.
**Learning:** Automatically capturing auth context for debugging can inadvertently include sensitive PII if not carefully filtered.
**Prevention:** Explicitly redact sensitive fields from metadata before logging or throwing errors. Use a centralized logger that can handle sanitization.
