## 2025-05-11 - [HIGH] PII Leakage in Firestore Error Handler
**Vulnerability:** The `handleFirestoreError` function was explicitly collecting and logging sensitive user information (PII) including `email`, `displayName`, and `photoUrl` from `auth.currentUser`. These details were also included in the error object thrown to the client.
**Learning:** Error handlers that attempt to be "helpful" by including full context can inadvertently become a source of PII leakage if they don't explicitly redact sensitive fields.
**Prevention:** Always implement explicit redaction of PII in centralized error handlers and ensure that only generic, non-sensitive error messages are returned to the client-side UI.
