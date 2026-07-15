## 2026-07-02 - PII Leakage in Firestore Error Handler

**Vulnerability:** The `handleFirestoreError` utility was logging and throwing stringified JSON objects containing sensitive PII (email, displayName, photoUrl) and internal database metadata (Firestore paths).

**Learning:** Internal error handlers that automatically aggregate authentication state and database metadata for debugging can inadvertently leak that data to the client-side if the resulting error object is thrown directly.

**Prevention:** Always redact sensitive fields (PII) before logging or throwing errors. Implement a strict separation between internal structured logs (using a centralized logger like Pino) and client-facing error messages, which should remain generic to prevent metadata leakage.
