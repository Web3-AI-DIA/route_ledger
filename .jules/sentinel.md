## 2026-05-03 - Firestore Error Handler PII Leakage
**Vulnerability:** The `handleFirestoreError` utility was collecting and exporting sensitive user information (email, displayName, photoUrl) from the Firebase Auth context and including it in both console logs and thrown Error messages. This exposed Personally Identifiable Information (PII) to the client-side console and potentially to any UI components that catch and display these errors.

**Learning:** Error handlers designed for "better debugging" often inadvertently become sources of PII leakage by over-collecting context. In this case, attaching the full `auth.currentUser` metadata to an error that propagates to the UI violated the principle of least privilege.

**Prevention:** Always sanitize error metadata before it leaves the application layer. Use a centralized logger that handles PII masking, and ensure that any error thrown to the UI uses a generic, safe message while the detailed, sanitized context is preserved only in secure server-side logs.
