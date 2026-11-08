# ADR-001: Modular monolith for the production workspace

## Status: Proposed

## Context

TwoManMarkets needs a small internal platform with related research, capital records, tasks and staff communication. Research decisions require transactional consistency and strict owner permissions. The current delivery is a static UI preview, not a production backend.

## Decision

Propose one TypeScript Next.js application, PostgreSQL and Prisma for future production development. Keep business rules independent of framework and persistence adapters. Use database transactions for research investment and settlement changes, and a transactional outbox for notification intent. Start communication delivery with bounded polling. Keep external trading execution manual.

Use a separate lightweight React/Vite static frontend for the current inspectable shell; do not introduce production services merely to demonstrate screens. Before production implementation, agree on the ledger assumptions, account retention and owner recovery policies described in the HLD/LLD.

## Consequences

One deployable app and one relational database simplify operations, referential integrity and development. Modules deploy together and share database capacity. Polling trades immediacy for lower infrastructure complexity. An outbox requires a dispatcher and failure monitoring. A future production implementation must add real authentication, authorization, persistence and migration/test coverage; the preview's navigation state is not reusable security logic.
