## 2025-05-13 - Sanitize Firestore Error Handling
**Vulnerability:** Information Exposure. The `handleFirestoreError` utility was throwing JSON-stringified objects containing PII (user emails) and internal database paths to the client.
**Learning:** Raw database errors often contain sensitive metadata that should never reach the frontend.
**Prevention:** Always log detailed error information on the server and return sanitized, generic error messages to the client.
