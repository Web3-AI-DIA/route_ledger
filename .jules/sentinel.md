## 2026-07-02 - Remediation of PII Leakage and Secure IP Identification

**Vulnerability:**
The application was leaking sensitive Firestore error metadata (including JSON-stringified internal objects) directly to the client. Additionally, internal logs contained raw PII such as user emails and display names. Rate limiting relied on a naive extraction of the `x-forwarded-for` header, which was susceptible to IP spoofing.

**Learning:**
Using `JSON.stringify(error)` in an error handler and throwing it to the client is a significant information disclosure risk. In Next.js/Vercel environments, `x-forwarded-for` can be spoofed by clients if not handled carefully; preferring `x-real-ip` (set by the edge proxy) or understanding the proxy's header appending behavior is critical for reliable rate limiting.

**Prevention:**
Always redact sensitive fields (email, displayName, photoUrl) before logging user-related errors. Throw generic error messages to the client while logging detailed (but redacted) information internally using a structured logger like Pino. Use a centralized utility for client IP extraction that prioritizes trusted headers like `x-real-ip`.
