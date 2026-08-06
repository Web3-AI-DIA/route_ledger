# Sentinel Journal: Critical Security Learnings

## 2026-07-02 - PII Leakage and Metadata Exposure in Firestore Error Handler
**Vulnerability:** Personally Identifiable Information (PII) such as user emails, display names, and profile photo URLs, along with internal database pathways and metadata, were being logged via `console.error` and thrown directly as stringified JSON errors. This exposed sensitive details to the client-side UI and untrusted execution environments.
**Learning:** Automatic error-serialization strategies that query current authentication state and operation metadata must proactively redact sensitive customer identifiers. Directly throwing complete system error information leaks internal schema details and breaches user privacy standards.
**Prevention:** Implement strict data redaction for any fields containing PII (`email`, `displayName`, `photoURL`) before logging or error throwing. Use a standardized, server-side-only structured logger (Pino) to capture internal operational logs securely, and return a generic user-friendly error string to the client.
