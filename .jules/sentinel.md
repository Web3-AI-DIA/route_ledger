## 2026-07-02 - PII Leakage and IP Spoofing Mitigation

**Vulnerability:**
1. Potential PII leakage in Firestore error handling: `lib/error-handler.ts` was logging and throwing full user objects (email, displayName, photoUrl).
2. IP spoofing risk for rate limiting: API routes were relying on the unverified `x-forwarded-for` header to identify clients for rate limiting.

**Learning:**
1. Centralized error handlers must proactively redact sensitive fields from the `auth.currentUser` object before logging or returning to the client.
2. In Next.js (App Router), relying solely on `x-forwarded-for` allows attackers to bypass rate limits by spoofing the header. Using secure platform headers like `cf-connecting-ip` or `x-vercel-forwarded-for` (if applicable) or splitting the `x-forwarded-for` list and taking the first element is safer.

**Prevention:**
1. Implement a `getClientIp` utility that prioritizes secure headers and use it across all rate-limited endpoints.
2. Use a structured logger (like Pino) for backend errors and always return generic, non-descriptive error messages to the client.
