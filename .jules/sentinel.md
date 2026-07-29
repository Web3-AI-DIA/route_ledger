# Sentinel Journal

## 2026-07-02 - PII Leakage Remediation in Firestore Error Handler
**Vulnerability:** The error handler in `lib/error-handler.ts` exposed sensitive user metadata (e.g. `email`, `displayName`, and `photoUrl`) when logging and throwing Firestore errors. Detailed error strings were thrown directly, raising the risk of client-side leakage of internal architecture details, session contexts, and user PII.
**Learning:** Overly permissive or detailed error handling mechanisms that capture the entire session/auth state often inadvertently bundle personally identifiable information (PII) and internal metadata. This sensitive data is subsequently outputted to standard logs or thrown back to the client application unchecked.
**Prevention:** Always redact sensitive fields (like email, displayName, and photo URLs) at the source of the error handler with generic placeholders. Log details to a structured, centralized internal logger, and expose only clean, generic error messages to the client.
