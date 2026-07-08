# Sentinel Journal 🛡️

## 2026-07-02 - PII leakage in Firestore error handler
**Vulnerability:** Internal Firestore error metadata, including sensitive user data like `email`, `displayName`, and `photoURL`, was being stringified and thrown as an error, which could be exposed to the client-side UI.
**Learning:** Generic error handlers that wrap authentication state or database objects can inadvertently leak PII if they serialize the entire object.
**Prevention:** Explicitly redact sensitive fields in error handlers and only throw generic, non-informative messages to the client.

## 2026-07-02 - IP spoofing via x-forwarded-for for rate limiting
**Vulnerability:** The application relied on the `x-forwarded-for` header for rate limiting, which is easily spoofed by clients to bypass limits.
**Learning:** Standard headers like `x-forwarded-for` should not be trusted for security-critical identifiers like IP addresses unless the platform guarantees their integrity.
**Prevention:** Use a robust utility to extract the client IP, prioritizing secure headers from trusted proxies (e.g., `cf-connecting-ip`, `x-vercel-forwarded-for`).
