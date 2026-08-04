# Sentinel Journal

## 2026-07-02 - PII Leakage Remediation
**Vulnerability:** Personal Identifying Information (PII) of authenticated users (such as email, displayName, and photoUrl) was logged directly to console output when handling database errors. Furthermore, the entire stringified error metadata was thrown back to the client, exposing sensitive system paths and structure.
**Learning:** Standard Firebase error handling was too verbose, and directly serialization of Firebase Auth's `currentUser` object leaked sensitive properties to server stdout and client responses.
**Prevention:** Always redact sensitive properties using `'[REDACTED]'`, migrate from standard console logging to centralized, structured logger (such as Pino), and throw generic error messages on the backend rather than throwing internal error details to the frontend.
