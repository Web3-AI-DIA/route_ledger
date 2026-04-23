## 2026-04-09 - Fix PII leakage in Firestore error handler
**Vulnerability:** Information Exposure through Error Messages. The `handleFirestoreError` function was throwing a stringified JSON object containing sensitive PII (UID, email) and internal database paths.
**Learning:** Generic error messages are crucial for preventing information leakage to the client-side UI, while detailed logging should be reserved for server-side environments.
**Prevention:** Always sanitize error messages thrown to the client and use a dedicated server-side logger for capturing sensitive debug information.
