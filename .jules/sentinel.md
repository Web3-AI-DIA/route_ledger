# Sentinel Journal - RouteLedger

## 2026-07-02 - PII Leakage in Firestore Error Handler
**Vulnerability:** The global Firestore error handler was logging and throwing raw user PII (email, displayName, photoUrl) in a JSON-stringified error object.
**Learning:** Even when trying to be helpful with debugging metadata, it's easy to accidentally include sensitive fields from user objects (like Firebase Auth's `currentUser`).
**Prevention:** Always use a redaction layer or explicitly pick only non-sensitive fields (like `uid`) when logging or passing error context to the client.

## 2026-07-02 - IP Spoofing in Rate Limiting
**Vulnerability:** API routes were relying solely on the `x-forwarded-for` header for rate limiting, which can be spoofed by clients.
**Learning:** Defaulting to `x-forwarded-for` without validating it or using platform-provided secure IP headers leads to bypassable rate limiting.
**Prevention:** Use a centralized utility to extract the client IP that prioritizes secure headers (e.g., `cf-connecting-ip`, `x-real-ip`) and handles `x-forwarded-for` carefully by taking the first entry.

## 2026-07-02 - Internal Schema Leakage in API Responses
**Vulnerability:** API routes were returning `validation.error.format()` directly to the client in 400 Bad Request responses.
**Learning:** Detailed validation error formats can reveal internal data structures and Zod schema expectations to potential attackers.
**Prevention:** Return generic error messages to the client and log the detailed validation errors internally for debugging.
