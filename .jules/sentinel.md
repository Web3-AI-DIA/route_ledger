## 2026-04-07 - PII Leakage in Firestore Error Handler
**Vulnerability:** User PII (UID, Email) and internal database paths were leaked to the client/UI via stringified Error objects thrown from `handleFirestoreError`.
**Learning:** In standard development, `JSON.stringify(error)` is often used for debugging, but in a full-stack Next.js environment, errors thrown from shared utility functions can bubble up to the client-side UI, exposing sensitive backend state and user data.
**Prevention:** Always sanitize errors before throwing them to a caller that might reach the UI. Use a centralized server-side logger for detailed error information and provide a generic, safe message to the user.
