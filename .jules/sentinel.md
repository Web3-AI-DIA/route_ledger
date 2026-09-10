# Sentinel Security Journal

## 2026-07-02 - PII Leakage Remediation in Error Handlers
**Vulnerability:** User PII (email, displayName, photoUrl) was logged in plaintext during Firestore error handling.
**Learning:** Firestore error handling logic in `lib/error-handler.ts` was passing raw user objects to logger.
**Prevention:** Redact sensitive fields before logging and sanitize error messages before returning/throwing.

## 2026-07-02 - IP Spoofing Prevention via Centralized Client IP Extraction
**Vulnerability:** Direct use of unvalidated `x-forwarded-for` headers for rate limiting in API routes allowed IP spoofing and rate limit bypass.
**Learning:** Naive reliance on `x-forwarded-for` without checking proxy-set headers like `x-real-ip` or parsing the client IP correctly.
**Prevention:** Implement `getClientIp` utility in `lib/utils.ts` and use across all API endpoints.

## 2026-07-02 - Internal Schema Leakage via Zod Validation Errors
**Vulnerability:** Public API routes returned `validation.error.format()` in 400 responses, exposing internal schema details and field structures.
**Learning:** Returning full Zod error formatting directly to clients leaks implementation details.
**Prevention:** Omit `details` from API JSON responses and log validation failures internally via `logger.warn`.
