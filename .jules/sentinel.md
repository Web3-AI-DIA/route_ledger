# Sentinel Journal

## 2026-04-23 - [PII Leakage in Firestore Error Handler]
**Vulnerability:** Personal Identifiable Information (PII) such as email, display name, and photo URL from the current user was being logged and thrown in errors, potentially exposing it to the client-side UI and external logging systems.
**Learning:** Error handlers should explicitly sanitize all data before logging or throwing, especially when dealing with user objects.
**Prevention:** Always strip PII from objects before logging and return generic error messages to the client.

## 2026-04-23 - [XUMM Authentication Bypass in Production]
**Vulnerability:** XUMM API routes were providing mock sign-in and payload responses when API keys were missing, which could allow users to bypass authentication or payment requirements in a production environment if keys were misconfigured.
**Learning:** Mocking functionality for development/MVP should always be guarded by environment checks to ensure it never leaks into production.
**Prevention:** Use `process.env.NODE_ENV !== 'production'` guards for any mock logic that affects security or financial transactions.
