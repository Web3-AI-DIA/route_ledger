# Sentinel 🛡️ - Security Journal

## 2025-05-26 - [CRITICAL] PII Leakage in Firestore Error Handler
**Vulnerability:** The `handleFirestoreError` function in `lib/error-handler.ts` was capturing and stringifying the entire `auth.currentUser` object, including sensitive PII like `email`, `displayName`, and `photoURL`. This stringified object was then thrown as an error, potentially leaking PII to the client-side UI and external logging services.
**Learning:** Automatically capturing auth context for debugging is useful, but without strict filtering, it inevitably leads to PII leakage in error logs and potentially the frontend.
**Prevention:** Always explicitly define which fields from the auth context are safe to log (e.g., `uid`, `emailVerified`, `isAnonymous`). Use a generic, safe error message when throwing errors that might reach the client.
