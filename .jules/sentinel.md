## 2026-07-02 - Mitigating IP Spoofing in Rate Limiting
**Vulnerability:** Rate limiting was relying solely on the `x-forwarded-for` header, which can be easily spoofed by clients to bypass rate limits.
**Learning:** Next.js 15.0.0 removed the `.ip` property from `NextRequest`, forcing manual extraction from headers. Relying on `x-forwarded-for` without validation is insecure.
**Prevention:** Always prioritize secure, platform-provided headers like `cf-connecting-ip` (Cloudflare) or `x-vercel-forwarded-for` (Vercel) and use a centralized utility to ensure consistency across all API routes.

## 2026-07-02 - Environment Management and Lockfile Bloat
**Vulnerability:** N/A (Process Learning)
**Learning:** Running `npm install --legacy-peer-deps` to facilitate local type-checking can cause massive, destructive changes to `package-lock.json` if not carefully managed, potentially leading to the accidental removal of core project dependencies in a PR.
**Prevention:** Always verify staged changes with `git status` and `git diff` before submission, and explicitly restore the original `package-lock.json` after environment-altering commands like `npm install`.
