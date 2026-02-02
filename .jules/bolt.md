## 2024-05-22 - Redundant DB Queries in Session Updates
**Learning:** `updateSession` was re-querying the database for `sessionId` even though `getDb` had just fetched the session row. This occurred because the domain object `ActiveSession` did not store the database `id`, forcing a second lookup.
**Action:** Added `sessionId` to the domain object to serve as a cache. Future refactors should ensure domain objects retain necessary persistence keys to avoid N+1 style redundant lookups during updates.
