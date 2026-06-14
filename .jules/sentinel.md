# Sentinel's Journal - Critical Security Learnings

## 2026-06-12 - PII Leakage in Error Handlers
**Vulnerability:** Internal error objects containing sensitive user data (email, displayName, photoUrl) were being stringified and thrown as errors, which could be exposed to the client-side UI.
**Learning:** Even well-intentioned error handlers can become a source of data leakage if they collect too much context without sanitization. Logging and throwing raw objects in a frontend-integrated handler is dangerous.
**Prevention:** Always redact sensitive fields (PII) before logging or throwing errors. Return generic, safe error messages to the client and use structured logging for internal debugging.
