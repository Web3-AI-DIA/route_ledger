## 2026-06-12 - PII Leakage via Centralized Error Handler
**Vulnerability:** The centralized `handleFirestoreError` function was capturing sensitive user PII (email, displayName, photoURL) from `auth.currentUser` and throwing it as a stringified JSON object. This metadata was then leaked to the client-side UI when the error was caught and displayed.
**Learning:** Even well-intentioned centralized error handlers can become a source of data leakage if they are too aggressive in gathering context without a strict redaction policy.
**Prevention:** Always implement an explicit redaction step for known sensitive fields before serializing or logging error objects that might reach the client or external log aggregators.

## 2026-06-12 - IP Spoofing in Rate Limiting
**Vulnerability:** API routes were using the raw `x-forwarded-for` header as a rate-limiting identifier. Because this header can contain a comma-separated list of IPs, using the raw string allows users to bypass limits by appending dummy addresses or allows proxy IPs to be incorrectly grouped.
**Learning:** Trusting the raw `X-Forwarded-For` header for identity (rate limiting) is insecure.
**Prevention:** Always extract and trim the first IP address from the `X-Forwarded-For` header for consistent and more secure rate limiting.
