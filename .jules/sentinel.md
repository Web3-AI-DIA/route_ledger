## 2026-07-02 - PII Leakage Remediation in Firestore Error Handler
**Vulnerability:** Personal Identifiable Information (PII) leakage including user emails, display names, and photo URLs, as well as database schema metadata and specific stack traces, were logged insecurely to `console.error` and thrown back directly to the client as JSON strings.
**Learning:** Raw application errors and complex auth metadata from Firebase Authentication contain client PII and internal structure, which should never be exposed to frontend consumers or un-sanitized server log dumps.
**Prevention:** Always use a centralized logger for structured and secure backend logging, strip PII (email, displayName, photoUrl) from internal structures, and return simplified, generic error messages to the client-side.
