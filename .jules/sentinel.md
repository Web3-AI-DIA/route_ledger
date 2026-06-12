# Sentinel Journal 🛡️

This journal tracks critical security learnings from the RouteLedger codebase.

## 2026-06-12 - PII Leakage in Firestore Error Handler
**Vulnerability:** Personally Identifiable Information (PII) including user emails and display names was being stringified into Error objects and console logs when Firestore operations failed. This could expose sensitive user data in server logs or directly to the client-side UI if these errors were not caught and sanitized at the API layer.

**Learning:** The `handleFirestoreError` utility was designed for debugging but violated the "Fail Securely" principle by including the full `auth.currentUser` object (including provider data) in the thrown error message.

**Prevention:** Always redact sensitive fields before logging or throwing errors. Use a centralized logger that supports structured metadata and can be configured to redact certain keys globally if needed. Throw generic error messages to the client and keep detailed, sanitized logs for server-side debugging.
