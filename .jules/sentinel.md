## 2025-05-26 - [PII Leakage in Error Handling]
**Vulnerability:** The `handleFirestoreError` function was capturing and logging sensitive user PII (email, displayName, photoUrl) from the Firebase Auth object and throwing it as part of the error message.
**Learning:** Error handlers that automatically aggregate context can inadvertently capture sensitive data if they don't have an explicit redaction layer.
**Prevention:** Always implement a redaction step when logging or throwing error context that includes user objects or request data.
