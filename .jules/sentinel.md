# Sentinel Security Journal

## 2026-07-02 - Remediation of PII Leakage in Firestore Error Handler

**Vulnerability:**
The centralized Firestore error handler (`lib/error-handler.ts`) captured full Firebase user authentication data (including `email`, `displayName`, and `photoUrl`) and printed it to stdout/stderr via `console.error(JSON.stringify(errInfo))`. Additionally, it threw an `Error` wrapping the raw stringified detailed error metadata JSON, propagating this sensitive user metadata and internal schema info directly to the client UI.

**Learning:**
Logging objects that combine application errors with active authentication context/user profile data without explicit sanitization inevitably results in PII leakage into application logs. Furthermore, serializing and throwing raw metadata objects instead of sanitized user-facing messages allows internal system structures and user details to leak straight to frontend components.

**Prevention:**
1. Explicitly redact sensitive authentication fields (`email`, `displayName`, `photoUrl`) using `'[REDACTED]'` placeholders before logs are constructed or stored.
2. Direct all security and exception logging through a centralized Pino logger under a standard `err` key instead of using standard `console` streams.
3. Decouple internal debug metadata from the exception messages propagated to callers: log the rich, redacted metadata object internally, but throw only a generic, sanitized error string to prevent exposure of system context.
