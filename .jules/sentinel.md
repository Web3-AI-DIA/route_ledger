## 2026-07-02 - PII Leakage and IP Spoofing Remediation

**Vulnerability:**
1. `lib/error-handler.ts` was logging and throwing sensitive user data (email, display name, photo URL) in its error objects, which could be exposed in server logs or client-side responses.
2. API routes were using the raw `x-forwarded-for` header for rate limiting identifiers, which is trivial to spoof, allowing malicious actors to bypass rate limits.

**Learning:**
Centralized error handlers, while useful for debugging, must be strictly audited for PII redaction. Similarly, client IP extraction in Next.js requires prioritizing secure platform headers (like `x-real-ip` or `cf-connecting-ip`) over user-controllable headers like `x-forwarded-for`.

**Prevention:**
- Always redact known PII fields in logging utilities.
- Use a generic error message for client-facing errors while logging detailed (but redacted) info on the server.
- Centralize IP extraction logic in a utility that follows security best practices for header prioritization and parsing.
