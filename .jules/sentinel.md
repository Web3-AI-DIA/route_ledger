# Sentinel Journal 🛡️

## 2026-06-12 - PII Leakage and Internal Schema Exposure via Error Handler
**Vulnerability:** The centralized `handleFirestoreError` was logging and throwing raw error objects that included sensitive PII (emails, display names) and internal database paths. Since these errors were thrown and potentially caught by client-side components (like `QuoteReview.tsx`), they could be exposed to the end-user or intercepted.
**Learning:** Centralized error handlers, while good for consistency, can become a single point of failure for data leakage if they aren't designed to redact sensitive information before passing it to the logger or the caller. Circular dependencies (e.g., between `firebase.ts` and `error-handler.ts`) often indicate that the handler is trying to do too much (like accessing `auth` directly).
**Prevention:** Always sanitize/redact error metadata in centralized handlers. Return generic error messages to the client while logging detailed, sanitized info to the server. Pass necessary context (like `userId`) as arguments instead of importing stateful modules that might cause circularity.
