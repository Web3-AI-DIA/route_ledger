# 🛡️ Sentinel Journal

## 2026-06-12 - Redacting PII from Firestore Error Logs
**Vulnerability:** Internal error objects from Firebase Auth/Firestore were being stringified and thrown directly to the client, leaking PII like `email`, `displayName`, and `photoURL` in both client-side errors and server logs.

**Learning:** Using `JSON.stringify(error)` on complex objects like user sessions or database errors is dangerous as it can capture sensitive metadata that isn't immediately obvious in the stack trace.

**Prevention:** Always implement a redaction layer in centralized error handlers. Use a generic, user-safe message for thrown errors while keeping the detailed (but sanitized) logs on the server using a structured logger.
