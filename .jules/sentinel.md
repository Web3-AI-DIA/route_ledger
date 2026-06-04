# Sentinel Security Journal

## 2025-06-04 - [PII Leakage in Firestore Error Handler]
**Vulnerability:** The `handleFirestoreError` function in `lib/error-handler.ts` was serializing and exposing sensitive user PII (email, display name, photo URL) in both application logs and client-side error messages.
**Learning:** Over-reliance on automated serialization of user objects can lead to accidental data exposure. The `authInfo` object was constructed using raw data from `auth.currentUser` without explicit redaction.
**Prevention:** Always implement explicit redaction for sensitive fields when logging or returning error objects. Use a generic error message for client-side responses and keep detailed, sanitized metadata in server-side logs only.
