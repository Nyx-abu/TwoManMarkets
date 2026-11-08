# TwoManMarkets — Internal Operations & Prediction Markets Dashboard

A modern, institutional-grade internal management dashboard and prediction market research hub built for **TwoManMarkets**.

![TwoManMarkets Header](public/logo-full.png)

## Overview

TwoManMarkets is a proprietary research and investment desk focused on prediction markets (Polymarket, Kalshi) and sports markets (Pinnacle, DraftKings, Betfair). This centralized platform unites:

1. **Prediction Market Research Pipeline**: Staff analysts submit structured theses with market odds, implied probabilities, calculated edge, and proposed stakes.
2. **Owner Capital Allocation Engine**: The two Co-Owners (Luis & Partner) review submitted theses, size positions via disciplined bankroll guidelines, and allocate capital with one click.
3. **Settlement Ledger & Analytics**: Tracks outcomes (Won/Lost/Push), computes firm-wide Net P&L and ROI, and ranks analysts on a monthly performance leaderboard.
4. **Task Management Board**: 3-column Kanban board for sprint deliverables and research quotas.
5. **Team Chat & Announcements**: Dedicated channels (`#announcements`, `#sports-picks`, `#macro-theses`, `#general`) and 1-on-1 direct messages.
6. **Executive System Architecture**: Embedded system blueprint and security documentation for leadership review.

---

## Tech Stack

- **Framework**: React 19 / TypeScript / Vite (Zero-dependency ultra-fast client bundle)
- **Design System**: Matte Obsidian & Natural Emerald (`#10b981`), Geist & IBM Plex typography, custom responsive CSS with zero horizontal overflow across mobile, tablet, and desktop.
- **Icons**: Lucide React
- **Hosting**: Vercel Edge / Global CDN

---

## Local Development

```powershell
# Install dependencies
npm install

# Start local dev server (available at http://localhost:5173)
npm run dev

# Typecheck and create production build
npm run build
```

---

## Deployment to Vercel

This repository is pre-configured for instant deployment on Vercel:

1. Push this repository to GitHub or GitLab.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project** and import the repository.
3. Vercel automatically detects the Vite framework settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**. Your live dashboard preview will be available instantly on a custom Vercel domain (e.g. `twomanmarkets.vercel.app`).

---

## Client Architecture & Deliverables

- [Executive System Blueprint](docs/EXECUTIVE_ARCHITECTURE_PROPOSAL.md) — Plain-English architectural proposal for Luis & partners.
- [Project Master Specification](PROJECT_MASTER_SPEC.md) — Technical operating specification and data schema.
