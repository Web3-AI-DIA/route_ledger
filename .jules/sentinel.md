## 2026-06-12 - PII Leakage in Error Handler
**Vulnerability:** The centralized Firestore error handler was capturing and serializing sensitive user data (email, display name, photo URL) from the global Firebase Auth state into logs and thrown error messages. This could lead to PII exposure in server logs, browser consoles, and potentially end-user UI.

**Learning:** Automatic context capture in error handling, while helpful for debugging, can inadvertently lead to data leakage if internal objects like `User` or `Auth` state are serialized without sanitization. Throwing serialized error objects to the client is a major security risk.

**Prevention:** Implement explicit redaction for PII fields in error metadata. Use a centralized structured logger for internal reporting and always return generic, sanitized error messages to the client-side UI.
