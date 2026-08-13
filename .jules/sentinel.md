## 2026-07-02 - PII Redaction and Metadata Exposure in Firestore Error Handling

**Vulnerability:**
The centralized `handleFirestoreError` in `lib/error-handler.ts` logged and threw detailed JSON metadata of Firestore errors. This included sensitive user-identifying attributes (specifically, `email`, `displayName`, and `photoUrl` under `authInfo.providerInfo`), which leaked into both console/server logs and client-facing error responses.

**Learning:**
A circular dependency exists between `lib/firebase.ts` and `lib/error-handler.ts`, which prevents moving the firebase instance configuration out. Thus, error handling and PII sanitization must occur strictly within `lib/error-handler.ts`. Additionally, console log streams must be standardized to a centralized logger (such as Pino) under the standard `err` key instead of using default `console.error`.

**Prevention:**
Enforce strict redaction helpers on user profiles before serializing context objects in logs. Never throw detailed internal exception payloads to client routes; instead, log details securely on the server and throw generic, user-safe messages like "An internal database error occurred".
