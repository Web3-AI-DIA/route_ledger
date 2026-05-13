2026-05-13
## 2026-05-13 - [PII Leakage in Error Handler]
**Vulnerability:** The `handleFirestoreError` function was logging and throwing raw Firebase Auth metadata, including sensitive PII like `email`, `displayName`, and `photoUrl`.
**Learning:** Directly serializing internal error objects that capture user context can unintentionally expose sensitive data to logs and the client-side UI.
**Prevention:** Always apply explicit redaction to error objects and throw generic messages to the client, while keeping detailed logs server-side (with PII stripped).
