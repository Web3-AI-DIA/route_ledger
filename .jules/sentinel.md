## 2025-05-15 - PII Leakage in Error Handlers
**Vulnerability:** The `handleFirestoreError` function in `lib/error-handler.ts` was capturing and logging sensitive user information (email, displayName, photoUrl) from the Firebase Auth state. This data was also being leaked to the client-side as it was included in the thrown error message.
**Learning:** Over-collecting "context" for debugging can lead to accidental PII exposure in logs and error responses if not explicitly sanitized.
**Prevention:** Implement a strict sanitization step for all error metadata. Use a centralized logger that can be configured to mask sensitive fields, and ensure client-facing error messages are generic and do not contain internal state or user data.
