## 2025-05-26 - [PII leakage in Firestore error handling]
**Vulnerability:** The `handleFirestoreError` function was logging raw `authInfo` (including `email`, `displayName`, and `photoUrl`) and throwing the entire metadata object as an error message, which would be exposed to the client-side UI.
**Learning:** Catch-all error handlers often inadvertently capture and expose sensitive user data if they just stringify state objects or user context.
**Prevention:** Explicitly redact PII fields before logging and always return generic, non-informative error messages to the client.
