# Sentinel Journal

## 2025-06-04 - PII Leakage in Firestore Error Handler
**Vulnerability:** The `handleFirestoreError` function was serializing the entire `auth.currentUser` object, including sensitive PII like `email`, `displayName`, and `photoURL`, into error messages that were logged to the console and thrown as part of an error object. This could expose user data in logs or to the client-side UI if not properly caught and sanitized.
**Learning:** Even internal error handlers can become sources of PII leakage if they blindly serialize objects that contain user data. Developers often include user context for debugging without considering the security implications of where that data ends up.
**Prevention:** Always explicitly redact sensitive fields before logging or throwing objects. Use a centralized logger that can be configured to handle sensitive data appropriately, and return generic, non-descriptive error messages to the client while keeping the detailed (but sanitized) logs on the server.
