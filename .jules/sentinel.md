## 2026-06-12 - PII Leakage and Circular Dependency in Firestore Error Handler

**Vulnerability:** The `handleFirestoreError` function was leaking sensitive PII (email, display name, photo URL) into logs and client-side error messages by stringifying the entire Firebase User object. Furthermore, it imported `auth` from `lib/firebase.ts`, while `lib/firebase.ts` imported the handler, creating a circular dependency that could lead to runtime issues.

**Learning:** Error handlers that interact with authentication state should be decoupled from the core Firebase initialization to avoid circularity. Logging raw error objects or user objects often captures more data than intended, leading to PII exposure in centralized logging systems.

**Prevention:** Pass only the necessary identifiers (e.g., `userId`) to error handlers. Explicitly redact sensitive fields from metadata before logging. Always throw generic, sanitized error messages to the client while logging detailed context securely on the server.
