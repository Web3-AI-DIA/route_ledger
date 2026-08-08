# Sentinel Security Journal

## 2026-07-02 - PII Leakage Remediation in Firestore Error Handler
**Vulnerability:** Personal Identifiable Information (PII) such as email, displayName, and photoUrl was being logged and thrown in raw Firestore error responses.
**Learning:** Raw Firestore error details and current user auth info were being stringified and thrown, leaking sensitive client-side metadata to front-end error handlers.
**Prevention:** Always sanitize/redact sensitive fields (email, displayName, photoUrl) with '[REDACTED]' in the central error handling logic before logging or propagating errors.

## 2026-07-02 - IP Spoofing & Rate Limiting Bypass
**Vulnerability:** Relying solely on `x-forwarded-for` header for client identification allows malicious actors to spoof their IP address and bypass Upstash rate limits.
**Learning:** In Next.js 15, the `.ip` property is deprecated. Clients can inject custom headers to trick the backend.
**Prevention:** Implement a central `getClientIp` utility prioritizing `x-real-ip` from trustable edge proxies and safely parsing the first element of `x-forwarded-for`.
