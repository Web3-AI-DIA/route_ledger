# Sentinel's Journal - Critical Security Learnings

## 2025-05-15 - [PII leakage in Firestore error handler]
**Vulnerability:** The `handleFirestoreError` function was serializing the entire `currentUser` object, including sensitive PII like `email` and `displayName`, into error messages that were logged and thrown back to the client.
**Learning:** Error handlers that capture "context" can accidentally include PII if they aren't explicit about which fields to include. Directly serializing error objects or user objects is a common pitfall.
**Prevention:** Always use a whitelist approach for metadata in logs and error responses. Never throw internal error details or serialized user objects to the client.
