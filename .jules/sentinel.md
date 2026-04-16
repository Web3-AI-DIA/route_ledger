# Sentinel's Journal - Security Learnings

## 2025-05-15 - PII Leakage in Firestore Error Handling
**Vulnerability:** The `handleFirestoreError` utility was stringifying and throwing the entire `FirestoreErrorInfo` object, which included sensitive user data like `email`, `displayName`, and `photoUrl`.
**Learning:** Error objects used for logging were also being thrown to the client-side UI, leading to potential PII exposure in browser consoles and user interfaces.
**Prevention:** Always differentiate between server-side logging (where PII might be acceptable for debugging) and client-side error propagation. Use a generic error message for exceptions thrown to the UI and sanitize any data logged in the browser context.

## 2025-05-15 - Insecure Mock Fallbacks in Production API Routes
**Vulnerability:** Xumm API routes were returning mock successful responses when API keys were missing, regardless of the environment.
**Learning:** Mock fallbacks intended for development/MVP were not gated by environment checks, potentially allowing broken payment flows to appear "successful" in production.
**Prevention:** Guard all mock data and test-only branches with `process.env.NODE_ENV !== 'production'` to ensure production environments fail securely when configuration is missing.
