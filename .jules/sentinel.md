# Sentinel Journal - Critical Learnings Only

## 2026-04-30 - [PII Leakage in Firestore Error Handler]
**Vulnerability:** The `handleFirestoreError` function was logging and throwing error objects that included full user PII (emails, display names) from `auth.currentUser`.
**Learning:** Even well-intentioned error handlers can become sources of PII leakage if they blindly capture the entire auth state or detailed error objects.
**Prevention:** Explicitly sanitize all objects before logging or throwing. Use generic error messages for client-side consumption while logging sanitized metadata for server-side debugging.
