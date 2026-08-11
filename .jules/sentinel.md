## 2025-05-15 - [Information Leakage in Firestore Error Handler]
**Vulnerability:** The `handleFirestoreError` function was throwing stringified JSON containing sensitive information, including PII (userId, email) and internal Firestore document paths, which could be exposed to the client-side UI.
**Learning:** Centralized error handlers that aggregate all context for debugging can inadvertently leak that same context to the client if the error object is thrown directly without sanitization.
**Prevention:** Always separate internal logging (which can contain full context) from client-facing error messages (which should be generic and sanitized). Log the details on the server and throw a static, safe message to the caller.
