## 2025-04-28 - [PII Leakage in Firestore Error Handling]
**Vulnerability:** Personal Identifiable Information (PII) such as email, display name, and photo URL were being captured in structured error logs and thrown in error messages when Firestore operations failed.
**Learning:** Error handlers often aggregate as much context as possible (like `auth.currentUser`) for debugging, but this can inadvertently collect and expose PII to logging systems or the client-side UI if not explicitly sanitized.
**Prevention:** Always sanitize authentication objects before logging or throwing. Use generic error messages for client-side responses while maintaining detailed, sanitized logs for server-side debugging.
