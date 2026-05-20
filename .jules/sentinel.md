## 2025-05-14 - PII Leakage in Firestore Error Handler
**Vulnerability:** The `handleFirestoreError` function was capturing and stringifying sensitive user information (email, displayName, photoUrl) from the Firebase Auth object and including it in both logs (via `console.error`) and thrown Error messages.
**Learning:** Directly serializing internal state or user objects like `auth.currentUser` into error messages or logs can inadvertently expose Personally Identifiable Information (PII) to client-side UI and unencrypted log storage.
**Prevention:** Explicitly redact sensitive fields when constructing log metadata. Always return sanitized, generic error messages to the client while keeping detailed, non-PII-containing technical logs for internal observability.
