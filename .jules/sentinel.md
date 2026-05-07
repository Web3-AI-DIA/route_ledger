## 2026-05-07 - [PII Leakage in Error Handlers]
**Vulnerability:** Personally Identifiable Information (PII) like emails and display names were being logged and thrown in errors, potentially leaking to logs and client-side UI.
**Learning:** Re-throwing stringified internal error objects often accidentally includes sensitive metadata collected during the error lifecycle.
**Prevention:** Always sanitize error objects before logging and return generic, non-descriptive error messages to the client.
