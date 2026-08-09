# Sentinel Journal

## 2026-07-02 - PII Leakage in Error Handlers
**Vulnerability:** Personal Identifiable Information (PII) including user email address, displayName, and photoUrl was being leaked in Firestore error handlers and thrown to the client side.
**Learning:** Automatically serializing auth.currentUser data on Firebase client SDK errors logs this information in the console and throws detailed internal metadata back to the client/UI, exposing it to potential interception or leakage.
**Prevention:** Always redact sensitive fields (email, displayName, photoUrl) with '[REDACTED]' before logging or processing error info, migrate from `console.error` to structured Pino logging, and throw a generic error message ('An internal database error occurred') to prevent client-side exposure of internal database metadata.
