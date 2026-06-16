# Sentinel Journal 🛡️

## 2026-06-12 - PII Leakage in Firestore Error Handling
**Vulnerability:** User PII (email, displayName, photoUrl) was being captured from the Firebase Auth context and included in error objects that were both logged to the console and thrown to the client UI.
**Learning:** Detailed error objects intended for debugging can inadvertently serialize sensitive user state if not explicitly sanitized. The `handleFirestoreError` function was designed to provide context but failed to redact PII.
**Prevention:** Always use a centralized logger with PII redaction rules and never throw raw internal error objects or metadata to the client. Return generic error messages to the frontend while logging sanitized details internally.
