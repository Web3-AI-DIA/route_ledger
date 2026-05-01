## 2025-05-14 - [PII Leakage in Error Handlers]
**Vulnerability:** The `handleFirestoreError` function was logging and throwing full user objects from Firebase Auth, including PII like `email`, `displayName`, and `photoUrl`.
**Learning:** Generic error handlers that wrap third-party SDK errors or auth states can easily leak sensitive data if not explicitly sanitized. In this case, `auth.currentUser` data was being serialized and exposed.
**Prevention:** Always implement an explicit sanitization layer for objects containing user data before logging or throwing them. Use generic error messages for client-side consumption while logging detailed (but sanitized) information server-side.
