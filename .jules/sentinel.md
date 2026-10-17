## 2026-07-02 - IP Spoofing Mitigation for Rate Limiting
**Vulnerability:** Client IP extraction using raw `x-forwarded-for` header allowed clients to supply forged headers or list IPs to bypass rate limits.
**Learning:** NextRequest in Next.js 15+ removed `.ip` property. Raw header retrieval requires taking the first element of `x-forwarded-for` or checking `x-real-ip` to prevent spoofing.
**Prevention:** Use a centralized `getClientIp` utility for extract client IPs across all API endpoints.
