# Sentinel Journal: Critical Security Learnings

## 2026-07-02 - PII Leakage Remediation in Error Handlers
**Vulnerability:** PII leakage in Firestore error handler, exposing sensitive auth details (email, displayName, photo URL) to the logs and throwing verbose error objects to client-side handlers.
**Learning:** Raw Firestore error details in `lib/error-handler.ts` logged via `console.error` and rethrown as stringified JSON directly exposed internal user metadata and database structures.
**Prevention:** Migrate logging to the centralized Pino logger, redact sensitive user attributes (`email`, `displayName`, `photoUrl`) with '[REDACTED]' placeholders, and throw a generic error message ('An internal database error occurred') to shield internal schemas and metadata from the client.

## 2026-07-02 - IP Spoofing Prevention
**Vulnerability:** Rate limiting bypass and IP spoofing by relying on client-supplied headers like `x-forwarded-for`.
**Learning:** Prioritizing `x-forwarded-for` directly without validating proxy configurations can allow malicious clients to spoof their source IP and bypass Upstash rate limits.
**Prevention:** Implement a secure `getClientIp` utility in `lib/utils.ts` that prioritizes the `x-real-ip` header (typically controlled by the edge proxy) and falls back safely to the first element of the `x-forwarded-for` list.

## 2026-07-02 - Internal Schema Leakage via Verbose Validation Responses
**Vulnerability:** Internal validation schemas, parameter structures, and validation rules leaked to client-facing HTTP 400 responses via direct return of Zod's `validation.error.format()`.
**Learning:** Returning deep structural metadata from Zod validation libraries reveals API parameter definitions, dependencies, and internal schema shapes to any network client, facilitating vulnerability mapping.
**Prevention:** Log detailed validation structural failures internally with structured `logger.warn` or `logger.error` calls, and return clean, generic responses (such as `{ error: 'Invalid parameters' }`) without verbose format objects.
