# Sentinel Journal - Critical Security Learnings

## 2026-07-02 - PII Leakage in Global Firestore Error Handler
**Vulnerability:** The `handleFirestoreError` function in `lib/error-handler.ts` was serializing and logging the entire `auth.currentUser` object, including sensitive PII such as `email`, `displayName`, and `photoURL`. Furthermore, it threw this serialized JSON as an error, potentially exposing it to the client-side UI and external log aggregators.
**Learning:** Attaching raw authentication objects to error metadata for debugging convenience often leads to unintentional PII exposure. In Next.js applications, errors thrown in shared libraries can propagate to the frontend, making this a high-risk data leak.
**Prevention:** Always redact or whitelist fields when logging user objects. Implement a centralized logging strategy that enforces PII stripping and ensures only generic, safe messages are returned to the client-side.
