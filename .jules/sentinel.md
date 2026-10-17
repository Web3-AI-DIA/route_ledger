# Sentinel Security Journal

This journal tracks critical security learnings, vulnerability patterns, and prevention strategies identified in RouteLedger.

## 2026-07-02 - PII Leakage in Error Handlers
**Vulnerability:** Personally Identifiable Information (PII) including user email addresses, display names, and internal database paths were leaked in browser console logs and stringified Firestore errors returned to the client-side UI.
**Learning:** The `handleFirestoreError` utility was stringifying the raw Firebase authentication context and Firestore document paths directly, and then throwing this details-heavy object to the UI, exposing internal systems.
**Prevention:** Sanitize and redact sensitive fields (e.g. email, displayName, photoUrl) before logging or throwing errors. Always use a centralized server-only structured logger (Pino) for details and throw generic error messages (e.g., 'An internal database error occurred') to prevent client-side exposure.

## 2026-07-02 - Rate Limit Bypass via IP Spoofing
**Vulnerability:** API routes were relying directly on raw HTTP headers (like `x-forwarded-for`) to identify clients for rate limiting, which could easily be spoofed by clients sending custom headers to bypass rate limits.
**Learning:** Next.js removed `.ip` and `.geo` properties, requiring manual client IP extraction. Extracting the raw header without validation or splitting allowed attackers to spoof their IP address.
**Prevention:** Implement a secure IP extraction utility `getClientIp` that prefers proxy-set headers like `x-real-ip` and sanitizes the first element of `x-forwarded-for` to robustly determine the client's true IP.

## 2026-07-02 - Internal Schema Leakage via Zod in API Responses
**Vulnerability:** Public API routes were returning the detailed `validation.error.format()` directly to the client inside a `details` field in the 400 Bad Request responses.
**Learning:** Returning raw parser errors leaks detailed validation schemas and internal data structures, giving potential attackers valuable insights into the internal validation requirements.
**Prevention:** Remove the `details` field from public 400 JSON responses. Ensure schema validation failures are logged internally via `logger.warn` while returning a generic invalid parameters error to the client.
