## 2025-06-04 - PII Leakage in Firestore Error Handler
**Vulnerability:** The `handleFirestoreError` function was capturing and logging raw Firebase `currentUser` data, including `email`, `displayName`, and `photoURL`, which were then stringified and thrown as part of the error message, potentially leaking PII to both logs and client-side UI.
**Learning:** Automatically serializing user objects into error metadata can inadvertently include sensitive PII. Centralized error handlers are high-risk areas for this pattern.
**Prevention:** Explicitly redact sensitive fields before logging or throwing error metadata. Always use a generic error message for client-facing exceptions and rely on secure, server-side logging for debugging details.
