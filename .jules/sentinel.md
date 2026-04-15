## 2025-05-22 - PII leak and Information Exposure in Firestore error handler
**Vulnerability:** The `handleFirestoreError` function was leaking PII (email, providerInfo) in browser console logs and exposing internal database structure by throwing stringified error objects containing operation types and paths.
**Learning:** Error handlers often log too much information in an attempt to be helpful for debugging, which can lead to PII leakage to the client-side and information exposure that aids attackers in understanding the system's internals.
**Prevention:** Always sanitize logs in the browser environment, use structured logging that integrates with secure backend tools like Sentry, and throw generic error messages to the UI.
