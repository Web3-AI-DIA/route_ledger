## 2025-05-14 - Sanitized Error Handling for Firestore
**Vulnerability:** Information Leakage / PII Exposure. The `handleFirestoreError` function was stringifying and throwing `authInfo` (including user emails) which could be leaked to the client-side console or UI.
**Learning:** Next.js applications sharing error handlers between client and server must explicitly sanitize PII based on the execution environment.
**Prevention:** Use `typeof window === 'undefined'` to selectively include PII in server-side logs only, and always throw a generic message ("An error occurred while processing the request.") to prevent internal details from reaching the user interface.

## 2025-05-14 - Environment-Gated Mock Responses
**Vulnerability:** Insecure Mock Fallbacks. The XUMM payload endpoint returned mock data when API keys were missing, potentially allowing bypassed or confusing behavior in production.
**Learning:** Mock data fallbacks used for development should be explicitly gated by `process.env.NODE_ENV !== 'production'`.
**Prevention:** Ensure all fallback/mock logic in API endpoints is wrapped in environment checks to prevent accidental exposure in production environments.
