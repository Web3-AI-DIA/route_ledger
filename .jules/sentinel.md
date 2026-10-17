## 2025-05-14 - [Insecure IP Extraction for Rate Limiting]
**Vulnerability:** Rate limiting was using raw `x-forwarded-for` header without validation or prioritization of trusted headers like `x-real-ip`.
**Learning:** Extracting IP from headers is environment-dependent. `x-forwarded-for` can be easily spoofed by clients if not handled by a trusted edge proxy. Prioritizing `x-real-ip` provides a more reliable identifier in many modern hosting environments like Vercel or Cloudflare.
**Prevention:** Always use a unified `getClientIp` utility that implements a secure priority chain for IP discovery and falls back safely to 'anonymous'.
