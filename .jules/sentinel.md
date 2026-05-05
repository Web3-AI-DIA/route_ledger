## 2025-05-05 - [PII leakage in Firestore error handler]
**Vulnerability:** The `handleFirestoreError` utility was logging the entire Firebase `auth.currentUser` object, including sensitive PII such as `email`, `displayName`, and `photoUrl`. Furthermore, it was throwing these details back to the client-side UI via `JSON.stringify(errInfo)`.
**Learning:** Centralized error handlers, while useful for debugging, can easily become vectors for accidental data exposure if they capture and re-emit entire state objects.
**Prevention:** Always explicitly select only the non-sensitive fields needed for debugging (e.g., `uid`) and ensure that errors thrown to the UI use generic messages while the detailed metadata is restricted to secure server-side logs.
