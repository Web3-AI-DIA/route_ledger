## 2025-05-26 - [Remediation] PII Leakage in Firestore Error Handler
**Vulnerability:** The `handleFirestoreError` function was logging and throwing raw user data, including `email`, `displayName`, and `photoUrl` from the Firebase auth context. This data was then potentially exposed in client-side error messages and server logs.
**Learning:** Centralized error handlers that aggregate context (like auth state) are high-risk areas for PII leakage. Merely stringifying an object for logging can inadvertently expose sensitive fields.
**Prevention:** Explicitly redact sensitive fields when constructing error metadata. Use generic error messages for errors thrown to the caller, while keeping detailed, sanitized logs for internal debugging.
