## 2025-05-26 - [PII Leakage in Firestore Error Handler]
**Vulnerability:** The `handleFirestoreError` function was capturing and stringifying the entire `auth.currentUser` object (including `email`, `displayName`, and `photoURL`) and throwing it as part of an error message.
**Learning:** Even well-intentioned error handlers can become sources of PII leakage if they blindly serialize context objects that contain sensitive user data. Throwing detailed internal error objects to the client-side is a high-risk pattern.
**Prevention:** Always explicitly redact sensitive fields before logging or serializing objects. Use a standardized, generic error message for all exceptions thrown to the client-side UI to minimize information disclosure.
