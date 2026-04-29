## 2025-05-14 - [Secure IP Extraction for Rate Limiting]
**Vulnerability:** IP Spoofing in Rate Limiting. The application was directly using the `x-forwarded-for` header to identify clients for rate limiting, which can be easily manipulated by attackers to bypass limits.
**Learning:** Directly trusting proxy headers like `x-forwarded-for` without validation or platform-specific extraction (like Next.js's `request.ip`) creates a security hole where a single attacker can simulate multiple users by rotating the header value.
**Prevention:** Use a centralized utility that prioritizes platform-verified IP properties (e.g., `request.ip` in Next.js/Vercel) and carefully parses proxy headers, taking only the first entry when multiple IPs are present in `x-forwarded-for`.
