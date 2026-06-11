## 2025-05-26 - Remediation of PII leakage in Firestore error handling

**Vulnerability:** The `handleFirestoreError` function was serializing the entire `auth.currentUser` object, including sensitive PII such as `email`, `displayName`, and `photoURL`, into error messages that were then logged and thrown. This could lead to PII being exposed in application logs and potentially to the client-side UI if not properly caught.

**Learning:** Error handling logic often captures too much context in an attempt to be helpful for debugging. Centralized error handlers are particularly risky as they can inadvertently leak sensitive state from global objects like authentication providers across the entire application.

**Prevention:** Always explicitly redact sensitive fields before logging or throwing error objects. Use a standardized, generic error message for client-facing responses and keep detailed, sanitized logs for internal debugging.

## 2025-06-04 - Prevention of internal schema exposure in API responses

**Vulnerability:** Multiple API routes (`quote`, `transaction`, `xumm/payload`) were returning `validation.error.format()` in 400 Bad Request responses. This leaked the internal Zod schema structure, including expected field names and validation rules, which could be used by an attacker to map the API surface and craft more sophisticated exploits.

**Learning:** Verbose validation errors are helpful for development but should never be exposed in production. Attackers can use schema details to understand backend constraints and identify potential injection points or business logic flaws.

**Prevention:** Return generic "Invalid parameters" or "Bad Request" messages to the client. Log the detailed validation errors internally for debugging purposes without exposing them to the end user.
