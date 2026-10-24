# Sentinel Security Journal

## 2026-07-02 - PII Redaction in Error Handlers
**Vulnerability:** Raw Firestore error details exposed client PII (email, displayName, photoUrl) in error logs and exceptions.
**Learning:** Returning unredacted error objects in error-handler can leak sensitive user information into application logging pipelines or client exceptions.
**Prevention:** Redact sensitive fields (email, displayName, photoUrl) with '[REDACTED]', migrate to centralized logging, and throw sanitized error strings.

## 2026-07-02 - IP Spoofing Prevention in Rate Limiter
**Vulnerability:** Client IP spoofing permitted rate limit bypass by manipulating `x-forwarded-for` headers.
**Learning:** `NextRequest.ip` is removed in Next.js 15; using raw unvalidated request headers allows arbitrary IP spoofing.
**Prevention:** Prioritize `x-real-ip` set by trusted edge proxy, or sanitize and take the first element from `x-forwarded-for`.

## 2026-07-02 - Internal Schema Leakage via Zod Validation Errors
**Vulnerability:** API endpoints returned `validation.error.format()` details in 400 responses, exposing internal schema definitions.
**Learning:** Publicly exposing full Zod validation formatting leaks data structure and schema constraints to potential attackers.
**Prevention:** Omit detailed format objects from public error responses while preserving internal structured warning logs.
