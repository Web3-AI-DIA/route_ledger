# Sentinel Journal - Critical Learnings

## 2026-06-12 - PII Leakage in Error Handlers
**Vulnerability:** Error handlers (specifically for Firestore) were capturing and serializing full user auth objects, including `email`, `displayName`, and `photoURL`, into error messages that were logged to the console and thrown to the client.
**Learning:** Automatically capturing `auth.currentUser` properties without explicit filtering leads to unintentional PII exposure in logs and client-side error responses. Even "internal" error objects can end up in user-facing UI or browser consoles.
**Prevention:** Explicitly redact sensitive fields before logging or throwing errors. Always throw generic error messages to the client and use a centralized, secure logging system for detailed debugging information.
