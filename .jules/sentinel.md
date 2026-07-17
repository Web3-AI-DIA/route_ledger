## 2026-07-02 - Remediation of PII Leakage in Firestore Error Handler
**Vulnerability:** The Firestore error handler was logging and throwing detailed user auth info containing sensitive PII (emails, names, photo URLs) and internal database metadata, exposing it to both logs and frontend clients.
**Learning:** Implicitly dumping raw authentication objects like `currentUser` leads to severe PII leakage. These error logs can be intercepted or exposed on the client side.
**Prevention:** Explicitly redact sensitive fields (`email`, `displayName`, `photoUrl`) with `'[REDACTED]'` before logging, use a centralized structured logger (Pino), and throw a generic user-facing message instead of leaking internals.
