## 2026-04-13 - [Prevent PII leakage in Firestore error handler]
**Vulnerability:** Personally Identifiable Information (PII) like email addresses and provider details were being logged and thrown in detailed error objects, which could be exposed to the client-side UI.
**Learning:** The `handleFirestoreError` function was stringifying the entire `authInfo` object, including sensitive user data, into the error message thrown to the UI.
**Prevention:** Implement environment-aware sanitization to redact PII when running in the browser and always throw a generic error message to the user while preserving detailed logs on the server.
