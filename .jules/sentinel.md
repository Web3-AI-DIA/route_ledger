# Sentinel Security Journal

## 2025-05-15 - [PII Leakage in Firestore Error Handler]
**Vulnerability:** The Firestore error handler was logging full user objects, including emails and provider details, to the browser console. It was also throwing the full error object back to the UI.
**Learning:** Centralized error handlers that include authentication context for server-side debugging can inadvertently leak PII if shared with the client-side without environment-specific sanitization.
**Prevention:** Implement `typeof window !== 'undefined'` checks in shared utility libraries to strip PII from logs and always throw generic error messages to the UI.
