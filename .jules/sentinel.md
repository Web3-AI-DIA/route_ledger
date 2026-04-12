# Sentinel's Journal: Critical Security Learnings

This journal documents critical security architectural patterns and remediations specific to the RouteLedger codebase.

## 2026-04-12 - Fix PII leakage in Firestore error handler
**Vulnerability:** Personal Identifiable Information (PII) like user emails and provider data were being stringified and thrown in error messages, making them visible to the client-side UI and logged in browser consoles.
**Learning:** Generic error handlers that wrap high-level library errors (like Firestore's) can inadvertently leak internal state and sensitive authentication context if they capture the full user object.
**Prevention:** Always sanitize error objects before throwing them to the UI. Differentiate between server-side logging (where full context is useful) and client-side logging/reporting.
