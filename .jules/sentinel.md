# Sentinel Security Journal

## 2026-07-02 - Remediation of PII Leakage in Error Handlers
**Vulnerability:** PII leakage in the centralized Firestore error handler (`lib/error-handler.ts`).
**Learning:** Raw Firestore error details and current user auth info (such as `email`, `displayName`, `photoUrl`) were logged using `console.error` and thrown directly as serialized JSON, leading to PII disclosure in client-facing stack traces and logs.
**Prevention:** Redact sensitive authentication fields to `'[REDACTED]'` before logging, use centralized Pino structured logging, and throw generic error messages (`'An internal database error occurred'`) to the client.

## 2026-07-02 - IP Spoofing Prevention in Rate Limiting
**Vulnerability:** Rate limiter bypass via spoofed IP addresses in headers.
**Learning:** Client IP address was extracted directly via the generic headers which could be spoofed by clients when behind certain proxy configurations.
**Prevention:** Implement a robust `getClientIp` utility prioritizing trustworthy edge-proxy headers like `x-real-ip` or carefully parsing the first element of `x-forwarded-for`.

## 2026-07-02 - Internal Schema Leakage via API Responses
**Vulnerability:** Disclosure of database schema and validation internals via Zod errors.
**Learning:** API validation errors from Zod were fully returned in the public HTTP 400 responses, exposing internal field mappings and constraints to the client.
**Prevention:** Sanitize HTTP 400 responses by removing the detailed validation error format, keeping validation details logged safely on the server side.
