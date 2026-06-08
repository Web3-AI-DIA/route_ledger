# Sentinel Journal

## 2025-05-26 - Remediation of PII Leakage in Firestore Error Handler
**Vulnerability:** Internal error objects containing sensitive user data (email, displayName, photoUrl) were being stringified and leaked to the client-side UI via thrown Errors.
**Learning:** Even when logging errors, if those errors are subsequently thrown and caught by a generic global error handler or returned to the client, they can expose sensitive information if not explicitly sanitized.
**Prevention:** Always redact sensitive fields from metadata objects before they are passed to loggers or used in Error messages. Throw generic error messages to the client while logging the detailed (but sanitized) information server-side.

## 2025-06-04 - Destructive Lockfile Changes during Dependency Installation
**Vulnerability:** Running `npm install` in some environments can lead to massive, destructive rewrites of `package-lock.json` if there are peer dependency conflicts or environment mismatches.
**Learning:** `npm install --legacy-peer-deps` is often necessary but can still alter the lockfile significantly.
**Prevention:** Always audit `package-lock.json` changes after installation and restore the original state if the changes are unrelated to the task at hand.
