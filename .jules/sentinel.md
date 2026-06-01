## 2025-05-26 - [PII Leakage in Firestore Error Handler]
**Vulnerability:** The `handleFirestoreError` function was serializing the entire `auth.currentUser` object (including `email`, `displayName`, and `photoUrl`) into a JSON string, which was then both logged to the console and thrown as an error.
**Learning:** Automatically including full authentication metadata in error handlers can inadvertently lead to PII leakage in logs and client-side error messages.
**Prevention:** Explicitly redact sensitive fields from error metadata before logging or throwing. Use standardized, generic error messages for any errors that may reach the client.
