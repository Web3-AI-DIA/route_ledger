# Sentinel Journal 🛡️

## 2025-05-26 - PII Leakage in Firestore Error Handler
**Vulnerability:** The `handleFirestoreError` function was logging and throwing raw `auth.currentUser` objects, which contained sensitive PII such as `email`, `displayName`, and `photoURL`.
**Learning:** Even internal error handling logic can inadvertently expose PII if entire objects are serialized into logs or passed to the client-side UI.
**Prevention:** Explicitly redact sensitive fields before logging or throwing errors. Always use a centralized logger that can be configured for secure output and throw generic error messages to the client.
