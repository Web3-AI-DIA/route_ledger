# Sentinel's Journal - Critical Security Learnings

## 2025-05-15 - PII Leakage in Firestore Error Handler
**Vulnerability:** The `handleFirestoreError` function was capturing and logging full user objects, including `email`, `displayName`, and `photoUrl`. These were then serialized into an error message thrown to the client-side UI.
**Learning:** Error handlers intended for debugging can accidentally become vectors for PII (Personally Identifiable Information) leakage if they capture global state (like `auth.currentUser`) without explicit sanitization.
**Prevention:** Always apply a "deny-list" or "allow-list" approach to error metadata. Specifically, redact any fields related to user identity before logging or throwing errors that might reach the client.
