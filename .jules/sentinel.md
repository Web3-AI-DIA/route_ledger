## 2026-06-12 - Remediation of PII Leakage, IP Spoofing, and Schema Exposure

**Vulnerability:**
1. PII Leakage: The Firestore error handler was capturing and serializing sensitive user data (email, displayName, photoUrl) into logs and throwing them as JSON-stringified error messages to the client.
2. IP Spoofing: API routes were using the raw `x-forwarded-for` header for rate limiting, allowing attackers to bypass limits by providing a spoofed IP at the end of the chain.
3. Schema Exposure: Zod validation errors were being returned directly to the client in 400 responses via `validation.error.format()`, exposing the internal data structures and validation rules.

**Learning:**
- Centralized error handlers are high-risk areas for data leakage if they blindly serialize objects that might contain PII (like user objects from Auth providers).
- In Next.js App Router, `request.headers.get('x-forwarded-for')` can return multiple IPs; only the first one should be trusted when behind a trusted proxy.
- Detailed validation errors are useful for development but should be logged server-side in production to prevent schema leakage.

**Prevention:**
- Always use a redaction layer or explicit picking for logging metadata.
- Sanitize headers used for security or rate-limiting decisions.
- Return generic error messages to the client while keeping detailed context in structured server-side logs.
