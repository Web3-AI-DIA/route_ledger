# Sentinel Journal

## 2025-05-14 - [PII Leakage in Firestore Error Handler]
**Vulnerability:** The `handleFirestoreError` function was serializing the entire `auth.currentUser` object, including sensitive fields like `email`, `displayName`, and `photoUrl`, into an error message that was thrown and potentially exposed to the client-side UI. It also used `console.error` instead of structured logging.

**Learning:** Error handlers that attempt to provide "helpful" context by capturing state can inadvertently leak PII if they are not strictly audited for the data they include. Directly throwing JSON-serialized internal state to the UI is a high-risk pattern.

**Prevention:** Always use explicit interfaces for error metadata that exclude sensitive fields. Use a centralized, structured logger for internal tracking and return/throw generic, user-friendly error messages to the client.
