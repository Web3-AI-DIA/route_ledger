# Sentinel Security Journal

## 2026-07-02 - PII Leakage in Firestore Error Handler
**Vulnerability:** The centralized error handler `lib/error-handler.ts` log and throw outputs exposed raw authInfo, leaking PII like user email, displayName, and photoUrl to server-side logs and potentially client-side responses.
**Learning:** Detailed database metadata and authInfo are helpful for debugging but should never be printed in raw format or exposed to the frontend, as it violates compliance and privacy standards.
**Prevention:** Always redact sensitive auth attributes (email, displayName, photoUrl) with '[REDACTED]' before logging, use a centralized structured logger (Pino) instead of `console.error`, and throw generic error messages on the client-facing side.
