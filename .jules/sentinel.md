# Sentinel Security Journal 🛡️

This journal records critical security learnings and architectural insights for the codebase.

## 2026-11-07 - Cross-chain destination address validation in schemas
**Vulnerability:** API endpoints accepting transaction execution requests and Xumm payloads relied only on non-empty string checks for destination addresses, allowing malformed or mismatched blockchain addresses to reach downstream execution layers.
**Learning:** In multi-chain routing applications, string length checks (`.min(1)`) are insufficient for addresses. Because `isValidAddress` utility exists in `lib/utils.ts`, Zod schemas can enforce target-chain address format constraints at the API validation layer using `.refine()`.
**Prevention:** Always pair multi-chain destination schemas with chain-aware cryptographic format validation before processing financial transactions.
