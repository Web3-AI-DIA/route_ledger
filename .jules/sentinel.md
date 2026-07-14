# Sentinel's Journal - Critical Security Learnings

## 2026-07-14 - PII Leakage in Firestore Error Handler
**Vulnerability:** The `handleFirestoreError` function in `lib/error-handler.ts` was capturing and logging sensitive user PII (email, displayName, photoUrl) from `auth.currentUser` and throwing it as part of the error message.
**Learning:** Blindly capturing the entire user object or authentication state for "debugging" purposes frequently leads to PII leakage in logs and client-side consoles.
**Prevention:** Implement strict redaction in error handlers. Only log non-sensitive identifiers (like UID) and throw generic error messages to the client.
