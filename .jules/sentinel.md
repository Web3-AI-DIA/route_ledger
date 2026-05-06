## 2025-05-14 - [Leaking PII in Firestore Error Handler]
**Vulnerability:** The centralized Firestore error handler was logging and throwing raw user data (email, displayName, photoUrl), exposing PII to logs and potentially the client-side UI.
**Learning:** Broad error handlers that capture current user state for "context" can easily become PII leaks if not strictly sanitized.
**Prevention:** Explicitly strip sensitive fields from auth objects before serialization in logging/error utilities. Throw generic, non-sensitive error messages to the UI.
