# Debug Session: api-pages-failures

- Status: OPEN
- Date: 2026-07-22
- Goal: identify why multiple dashboard pages fail on API calls and fix them based on runtime evidence

## Hypotheses

1. Some pages still assume Strapi v4 response shape (`data.data`, `attributes`) while backend returns a different shape.
2. Several pages bypass shared API helpers and build requests manually, causing inconsistent auth headers, URLs, and parsing.
3. Some frontend endpoints do not match backend routes or custom Strapi handlers.
4. CORS, cookie, or token access differs between pages, so some requests are sent unauthenticated.
5. Relation field names used by pages do not exactly match backend schema, especially in messages and nested populates.

## Evidence Log

- Pending runtime reproduction.

## Fix Log

- None yet.

## Verification

- Pending.
