## 2025-05-15 - [PII Leakage in Firestore Error Handling]
**Vulnerability:** The `handleFirestoreError` function was capturing and logging sensitive user PII (email, displayName) and throwing the entire metadata object to the client.
**Learning:** Error handlers that wrap SDK calls (like Firebase/Firestore) often over-collect metadata for debugging purposes, which can inadvertently include PII if not carefully audited.
**Prevention:** Always explicitly redact PII fields (email, names, phone numbers) before logging or throwing errors. Use generic error messages for client-facing exceptions.
