## 2025-05-14 - PII Leakage in Firestore Error Handling
**Vulnerability:** Personal Identifiable Information (PII) such as user emails and display names were being captured in structured logs and thrown to the client-side UI when Firestore operations failed.
**Learning:** The `handleFirestoreError` utility was designed for debugging but lacked sanitization, leading to sensitive `auth.currentUser` data being logged via `JSON.stringify(errInfo)`.
**Prevention:** Always implement a sanitization layer in global error handlers. Ensure that user-facing errors are generic and internal technical details (including PII) are stripped before being logged to external observability platforms.
