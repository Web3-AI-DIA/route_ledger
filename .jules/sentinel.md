## 2025-05-15 - IP Spoofing & Production Mock Guards
**Vulnerability:** IP Spoofing in Rate Limiting and Exposed Mock Responses in Production.
**Learning:** API routes were trusting the entire `x-forwarded-for` header, allowing attackers to bypass rate limits. Additionally, Xumm endpoints had fallback mock responses that were active even in production if environment variables were missing.
**Prevention:** Use a centralized IP extraction utility that takes only the first IP from `x-forwarded-for`. Always guard development/test mock responses with `process.env.NODE_ENV !== 'production'`.

## 2025-05-15 - GitHub Actions Billing Blocker
**Vulnerability:** N/A (Infrastructure)
**Learning:** CI failures with the message "The job was not started because your account is locked due to a billing issue" are account-level problems and cannot be fixed in code.
**Prevention:** Monitor GitHub account billing status; if encountered, inform the user that it is an infrastructure issue.
