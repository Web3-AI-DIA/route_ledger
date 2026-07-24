## 2026-07-02 - Remediation of PII Leakage in Firestore Error Handler

**Vulnerability:** The centralized Firestore error handler was logging detailed user object data (including emails, display names, and profile photos) via console.error, and then throwing the entire JSON-serialized structure back to the caller. This allowed internal operational details and sensitive Personally Identifiable Information (PII) to be leaked on the client-side.

**Learning:** When debugging database operations, there is a temptation to capture full user session details in logs. However, failing to redact sensitive properties like emails and photos, or passing raw database errors directly to client-facing components, violates secure error-handling and data privacy principles.

**Prevention:** Always filter out or redact sensitive properties prior to logging, use a secure structured logger, and throw standardized, generic error messages to the client. Keep a strict boundary between internal diagnostic logs and public API responses.
