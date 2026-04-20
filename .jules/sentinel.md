## 2025-05-19 - [Sanitized Firestore Error Handling]
**Vulnerability:** Personal Identifiable Information (PII) leakage through error handling.
**Learning:** Common error-handling wrappers often capture the full authentication context for debugging, but stringifying and throwing these objects can inadvertently expose sensitive data (email, displayName) to the client-side UI and insecure log streams.
**Prevention:** Always sanitize error objects by explicitly picking non-sensitive fields before logging. Use a structured logger for backend visibility and return generic, non-descriptive error messages to the client.
