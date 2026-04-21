## 2026-04-21 - [PII Leakage in Error Handlers]
**Vulnerability:** Error handlers were logging and throwing raw auth objects containing PII (email, displayName, photoUrl).
**Learning:** Default Firebase Auth objects are verbose and contain sensitive user data that shouldn't be exposed to client-side logs or UI.
**Prevention:** Explicitly sanitize error objects by picking only non-sensitive fields before logging or throwing.
