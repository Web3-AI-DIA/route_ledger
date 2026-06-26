# Sentinel Journal

## 2026-06-12 - PII Leakage in Error Handling
**Vulnerability:** The `handleFirestoreError` function in `lib/error-handler.ts` was serializing sensitive user data (email, display name, photo URL) from the Firebase `auth` object and throwing it as part of a JSON-stringified error message.
**Learning:** Automatically serializing internal state objects into error messages can inadvertently leak PII to the client-side UI and logs.
**Prevention:** Always redact sensitive fields before logging or throwing errors. Use generic error messages for the client while keeping detailed, sanitized logs on the server.

## 2026-06-12 - IP Spoofing via X-Forwarded-For
**Vulnerability:** API routes were using the raw `x-forwarded-for` header value as an identifier for rate limiting.
**Learning:** The `x-forwarded-for` header can be easily spoofed by clients if not properly sanitized (e.g., taking only the first IP in the list). Attackers can bypass rate limits by providing random IP addresses in this header.
**Prevention:** Always sanitize the `x-forwarded-for` header by extracting the first comma-separated value, or use a trusted proxy configuration.
