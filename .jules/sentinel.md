## 2025-05-14 - [Secure IP Extraction & Production Guards]
**Vulnerability:** IP spoofing in rate limiting and exposure of mock functionality in production.
**Learning:** Naive reliance on `X-Forwarded-For` allows attackers to bypass rate limits by spoofing the header. Additionally, failing to guard mock responses in production can mask configuration errors (missing API keys) while providing insecure defaults.
**Prevention:** Always use a secure IP extraction utility that prioritizes trusted environment properties and handles `X-Forwarded-For` by selecting the rightmost entry. Implement `NODE_ENV` checks to ensure mock data is never served in production.
