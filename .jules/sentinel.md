## 2025-05-15 - [Secure Error Handling]
**Vulnerability:** Information leakage and PII exposure in Firestore error handler.
**Learning:** Directly logging internal error objects and Firebase Auth metadata (like emails) to the console/logs can leak sensitive data to external observers or the client UI.
**Prevention:** Sanitize error metadata by stripping PII (email, displayName, photoUrl) and throw generic error messages to the client while keeping detailed, sanitized logs for internal debugging.
