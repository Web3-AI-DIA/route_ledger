# Sentinel Journal 🛡️

## 2025-05-14 - [PII Leakage in Firestore Error Handler]
**Vulnerability:** The `handleFirestoreError` function was capturing and logging raw `auth.currentUser` data, including PII like `email` and `displayName`. Furthermore, it was throwing a `JSON.stringify` of this data, which could be exposed to the client-side UI if not caught and sanitized elsewhere.
**Learning:** Directly serializing internal state or auth metadata into error objects can inadvertently leak PII into logs and client responses.
**Prevention:** Always explicitly redact sensitive fields before logging error metadata. Throw standardized, generic error messages to the client to ensure internal details and PII remain protected.
