# Sentinel Journal 🛡️

## 2026-06-12 - PII Leakage Remediation in Firestore Error Handler
**Vulnerability:** The `handleFirestoreError` function was stringifying internal error objects containing sensitive PII (emails, display names) and throwing them to the client-side UI, while also logging them via `console.error`.
**Learning:** Error objects in Firebase/Firestore often contain nested authentication state if not carefully sanitized. Stringifying these objects for "convenience" in debugging can inadvertently expose user data to the frontend and logs.
**Prevention:** Adopt a "redact-by-default" strategy for error metadata. Use a centralized, structured logger (Pino) that can be configured for different environments, and always return generic, non-descriptive error messages to the client for internal failures.

## 2026-06-12 - Circular Dependency in Firebase Modules
**Vulnerability:** A circular dependency existed between `lib/firebase.ts` and `lib/error-handler.ts`, which could lead to runtime initialization errors.
**Learning:** Importing the `auth` object directly in the error handler created a tight coupling with the main Firebase initialization file.
**Prevention:** Break circular dependencies by passing required state (like `userId`) as function arguments rather than importing it from the module that is also a consumer of the error handler.
