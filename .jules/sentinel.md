## 2026-06-12 - PII Leakage in Error Handler
**Vulnerability:** User PII (email, displayName, photoUrl) was being logged and thrown as part of an error message in `lib/error-handler.ts`, potentially exposing sensitive data to client-side UI and external logging systems.
**Learning:** Detailed error objects intended for debugging can inadvertently include sensitive user context from authentication providers if not carefully sanitized.
**Prevention:** Always redact sensitive fields from error metadata before logging or returning to the client. Use a centralized logger and throw generic error messages to the frontend.
