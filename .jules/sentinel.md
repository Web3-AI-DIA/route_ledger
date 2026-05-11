## 2025-05-11 - [PII Leakage in Firestore Error Handler]
**Vulnerability:** The `handleFirestoreError` function was logging and throwing raw `auth.currentUser` metadata, including sensitive PII like `email`, `displayName`, and `photoUrl`.
**Learning:** Directly serializing internal error objects or auth metadata can inadvertently expose PII to logs and client-side UIs.
**Prevention:** Always explicitly sanitize error metadata by whitelist only necessary non-sensitive fields before logging or throwing.
