## 2025-05-14 - [Sanitizing Firestore Errors]
**Vulnerability:** PII leakage in Firestore error logs and client-side error messages.
**Learning:** The previous implementation was logging the entire `auth.currentUser` object, including `email` and `displayName`, and throwing it as a JSON string to the UI.
**Prevention:** Always strip PII before logging or returning errors. Use a generic error message for the UI while keeping detailed, sanitized logs for developers.
