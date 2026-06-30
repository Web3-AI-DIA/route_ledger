# Sentinel Journal 🛡️

## 2026-06-12 - PII Leakage in Global Error Handler
**Vulnerability:** The `handleFirestoreError` function in `lib/error-handler.ts` included sensitive user PII (email, displayName, photoUrl) in both logs and thrown error messages, which were then exposed to the client-side UI.
**Learning:** Circular dependencies between Firebase initialization and error handling can lead to lazy remediation. Error objects thrown in the backend/lib should always be sanitized before reaching the UI or persistent logs.
**Prevention:** Use a centralized logger that supports redaction or manually redact sensitive fields in a structured error handler. Always return generic error messages to the client.
