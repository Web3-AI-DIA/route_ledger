## 2026-04-24 - [Sanitization of PII in Error Handlers]
**Vulnerability:** Information Disclosure (PII leakage in logs and UI)
**Learning:** The `handleFirestoreError` function was stringifying and throwing the entire user object including email and provider data, which was then visible in the browser console and potentially the UI.
**Prevention:** Always strip PII from error objects before logging/throwing, and return generic error messages to the frontend.
