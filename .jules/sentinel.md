# Sentinel Security Journal 🛡️

## 2025-05-25 - [PII Leakage in Firestore Error Handling]
**Vulnerability:** The `handleFirestoreError` function was capturing and stringifying raw user objects (including email, displayName, and photoUrl) from Firebase Auth. This sensitive data was being written to logs and thrown as an error message, potentially exposing PII to client-side UIs and log aggregators.
**Learning:** Centralized error handlers are high-value targets for accidental data leakage. Automated collection of "context" often over-collects sensitive information if not strictly filtered.
**Prevention:** Always implement an explicit redaction step for known PII fields in error handling utilities. Ensure that error messages thrown to the client are generic and sanitized, while detailed (but redacted) info is kept for internal structured logging only.
