## 2025-05-14 - [PII Leakage in Firestore Error Handler]
**Vulnerability:** The `handleFirestoreError` function in `lib/error-handler.ts` was serializing and logging the entire `FirestoreErrorInfo` object, which included sensitive user PII such as email addresses, display names, and photo URLs. Furthermore, this detailed object was being thrown as an error, potentially exposing it to the client-side UI.

**Learning:** Error handlers often aggregate context to aid debugging, but without strict sanitization, they become a primary source of PII leakage into logs and client responses.

**Prevention:** Implement a strict redaction policy for all error metadata. Use a centralized logger that supports sanitization and always return generic, non-descriptive error messages to the client.
