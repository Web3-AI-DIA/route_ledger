## 2026-04-19 - [PII Leakage in Firestore Error Handler]
**Vulnerability:** The `handleFirestoreError` function was logging and throwing raw authentication objects containing PII (email, displayName, photoUrl). This could leak sensitive user data to logs and the client-side UI.
**Learning:** The error handler was designed for debugging convenience by capturing the full user state, but it failed to sanitize this state before exposing it.
**Prevention:** Always sanitize authentication and user objects before logging or throwing. Enforce generic error messages for the client-side to prevent internal details from leaking. Use structured logging to separate error metadata from user-facing messages.
