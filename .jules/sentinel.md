# Sentinel Security Journal

## 2025-05-14 - [Critical] PII Leakage Remediation in Firestore Error Handler
**Vulnerability:** The `handleFirestoreError` function was serializing the entire `auth.currentUser` object, including sensitive PII like `email`, `displayName`, and `photoURL`, into a stringified error message. This message was then logged to the console and thrown as an error, potentially exposing PII to client-side UI and centralized logging systems.
**Learning:** Automatically serializing internal state or user objects in error handlers is a common source of data leakage. Structured logging should be used with explicit redaction of sensitive fields.
**Prevention:** Always use a redaction layer or a specific DTO (Data Transfer Object) when logging user information. Ensure that errors thrown to the client-side are generic and do not contain internal metadata.
