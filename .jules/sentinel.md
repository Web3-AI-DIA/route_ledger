## 2026-05-08 - [PII Leakage in Firestore Error Handling]
**Vulnerability:** Personal Identifiable Information (PII) including user email, display name, and photo URL were being logged and returned to the client in Firestore error responses.
**Learning:** Directly serializing internal error objects or user metadata from authentication providers can unintentionally expose sensitive information to logs and client-side UIs.
**Prevention:** Always apply explicit redaction of sensitive fields (like email, PII) before logging objects, and use generic error messages for client-facing responses to prevent leaking internal state.
