# Sentinel Journal

## 2026-07-02 - Remediation of PII Leakage in Firestore Error Handler
**Vulnerability:** Centralized Firestore error handler `handleFirestoreError` in `lib/error-handler.ts` logged raw sensitive user information (such as email, displayName, and photoUrl) directly via `console.error`. Furthermore, it threw the raw error details (including full database paths and stringified PII) as a stringified JSON error object, exposing internal database schemas, metadata, and sensitive PII to the client interface and frontend error logging integrations.
**Learning:** Utilizing generic error structures without explicit redaction steps in library-level helper functions leads to accidental leakage of Personally Identifiable Information (PII) in logs. Centralized logging must enforce strict data minimization policies and only expose generic, safe error messages to clients.
**Prevention:** Implement explicit redaction fields (replacing fields like email, displayName, photoUrl with '[REDACTED]') prior to generating logs, migrate logging from `console.error` to structured Pino logging, and ensure that only clean, user-safe generic error strings are thrown to the client environment.
