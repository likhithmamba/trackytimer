# Sentinel's Journal

## 2026-02-01 - Input Validation Gap in API
**Vulnerability:** The `POST /api/violation/record` endpoint accepted arbitrary strings for the `type` field, which were then passed directly to a database RPC function and inserted into the `violations` table.
**Learning:** Usage of TypeScript enums on the client/shared types does not guarantee runtime safety on the server. The API layer blindly trusted the input structure.
**Prevention:** Implement explicit runtime validation (e.g., allowlist checks or Zod schemas) for all user-supplied inputs in API route handlers, even if they map to internal enums.
