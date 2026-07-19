## 2026-07-02 - Remediation of PII Leakage in Firestore Error Handler
**Vulnerability:** Personal Identifiable Information (PII) including email, displayName, and photoUrl was logged via console.error and leaked to the client within Firestore error payloads in `lib/error-handler.ts`.
**Learning:** Standard Firebase error handling had verbose outputs that included full Firebase Auth currentUser attributes, exposing confidential credentials and profile information when operation failures occurred.
**Prevention:** Use a centralized logger (Pino) to safely log operations, redact PII fields with '[REDACTED]', and throw generic error messages on the backend to avoid leaking internal metadata to the frontend.
