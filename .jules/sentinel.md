## 2025-05-14 - [PII Leakage in Firestore Error Handling]
**Vulnerability:** The `handleFirestoreError` function was logging and throwing a `JSON.stringify(errInfo)` object that contained sensitive PII (Personally Identifiable Information) such as `email`, `displayName`, and `photoUrl` from the Firebase Auth `currentUser` object.
**Learning:** Error objects often capture more context than intended. When wrapping auth data in error logs, it's easy to accidentally include fields that should never be logged or exposed to the client.
**Prevention:** Explicitly define the interface for error metadata and only include necessary, non-sensitive identifiers (like `userId`). Use a structured logger that can handle redaction, and always throw generic error messages to the frontend.
