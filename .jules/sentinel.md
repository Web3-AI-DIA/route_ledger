## 2026-07-02 - PII Leakage in Firestore Error Handler
**Vulnerability:** Personal Identifiable Information (PII) of logged-in users was being leaked in Firestore error handlers. Error objects stored and thrown detailed authInfo (such as email, displayName, photoUrl) which could be exposed to the client or written to persistent error logs.
**Learning:** Automatically serializing the entire current user's Auth state or provider data without sanitization is an easy way to inadvertently leak sensitive PII. Centralized error-handling functions must proactively filter and redact sensitive fields.
**Prevention:** Always redact sensitive fields (email, displayName, photoUrl) with '[REDACTED]' before serializing user metadata. Migrate from console.error to centralized structured logging via a custom logger and throw generic error messages to avoid exposing internals.

## 2026-07-02 - IP Spoofing Prevention in Rate Limiter
**Vulnerability:** The rate limiting system trusted user-supplied client IP addresses by extracting them directly from `x-forwarded-for` header, which could be easily spoofed by malicious clients. Next.js 15.0.0 also deprecated Request.ip and Request.geo properties.
**Learning:** Extracting client IPs manually from incoming request headers must be done carefully. Relying solely on `x-forwarded-for` without checking edge-proxy set headers like `x-real-ip` makes the system susceptible to IP spoofing.
**Prevention:** Implement a unified `getClientIp` utility that prioritizes `x-real-ip` or properly parses and picks the first trusted client IP address from `x-forwarded-for`.

## 2026-07-02 - Internal Schema Leakage via Zod Validation Responses
**Vulnerability:** Public API routes returned detailed schema formatting validation errors directly to public HTTP clients, exposing the internal data format and validation schemas (e.g. details from validation.error.format()).
**Learning:** Direct output of parser formatting errors can leak application architecture, schema constraints, and metadata to prospective attackers.
**Prevention:** Log detailed formatting errors inside server logs while returning generic error descriptions (e.g., 'Invalid parameters') to clients.
