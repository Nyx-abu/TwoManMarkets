# TwoManMarkets — Preview Scope

**Phase:** 0 — Static client preview  
**Data:** Fictional fixtures; no live prices, investments or staff records.

## Included

- Overview with sample KPIs, portfolio chart, outcomes, announcements, research and team tasks.
- Research list, inspectable thesis details, evidence labels, recommended stakes and owner-action placeholders.
- Pending, In Progress and Completed task columns with assignees, deadlines and priorities.
- Chat/channel and DM shells, announcements and an example notification popover.
- Analytics with illustrative historical reporting and date/filter placeholders.
- Team directory with owner/staff roles and active/inactive profiles.
- Admin account and permission controls presented as disabled placeholders.
- Client-side screen navigation, mobile navigation and research detail dismissal.

## Not implemented

Authentication, password changes, authorization, databases, API calls, saving, task mutations, message delivery, staff lifecycle, notification delivery, calculations from business records and trading execution.

The demo owner is a fixture. Navigation and hidden controls do not enforce any permission. Business actions are disabled or identified as preview-only.

## Deliberate choices

React, TypeScript and Vite keep this shell deployable as static assets. Production architecture remains a proposal in the HLD/LLD; it requires real server implementation and acceptance tests.

Fixture totals may summarize a larger illustrative workspace than the visible example rows. Charts and metrics are hand-authored samples rather than computed financial evidence.

Only `dist/` is deployed. The confidential master specification, commercial terms and development documentation are not web assets.

## Verification

Run `npm run typecheck` and `npm run build`. Use `npm run dev` to inspect the shell locally.

On Windows with Chrome installed, `node scripts/capture-preview.mjs` captures each section at desktop/mobile widths and checks document overflow and small-screen dialog bounds. It uses a running localhost preview and writes ignored evidence to `.preview-evidence/`. Override `CHROME_PATH` or `PREVIEW_URL` when necessary.

The browser profile and captures must remain ignored. The script is local preview verification, not a production security test suite.

## Reusable development pattern

Keep sample presentation separate from production behavior. Establish the research/owner workflow first, then implement backend phases with contracts and test evidence. Avoid presenting a successful static build as proof of real permissions or financial integrity.
