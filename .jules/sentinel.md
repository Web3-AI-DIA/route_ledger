## 2026-06-12 - PII Leakage in Global Error Handler
**Vulnerability:** The centralized Firestore error handler was stringifying and throwing internal error objects that included unredacted user PII (email, displayName, photoURL) and detailed stack traces/metadata.
**Learning:** Attaching `auth.currentUser` to error objects for "better debugging" creates a significant risk of leaking PII to the client-side UI if the error isn't explicitly caught and sanitized before being thrown or logged.
**Prevention:** Always redact sensitive fields (emails, names, tokens) in error metadata and ensure that errors thrown from utility functions use generic messages for client consumption, while logging the detailed (but sanitized) info server-side.
