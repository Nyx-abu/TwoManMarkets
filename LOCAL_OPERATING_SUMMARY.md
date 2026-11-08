# TwoManMarkets — Local Operating Summary & Architecture Remodel

## 1. Context & North Star
- **Client**: Luis (`luisballin`), Co-Owner of **TwoManMarkets** (sports & prediction market investment syndicate).
- **Core Loop**: Staff researchers analyze prediction markets (Polymarket, Kalshi, sportsbooks) and submit trade theses. The two co-owners evaluate, allocate capital, invest externally, and track settlements (Won/Lost/P&L/ROI).
- **Goal**: Deliver a world-class, believable, high-conviction client preview to deploy to Vercel and present to Luis today.
- **Client Persona**: Non-developer executive. Needs an intuitive, high-confidence experience with an executive architecture blueprint that translates technical credibility into business peace-of-mind.

## 2. Critical UI & Design Upgrades
- **Brand Identity**: Proper integration of the actual 1536x1024 TwoManMarkets logo (neon green & pure white "TM" chevron mark) across sidebar, topbar, favicon, and login preview.
- **Color Palette (Obsidian & High-Voltage Emerald)**:
  - Deep Obsidian (`#09090b` / `#0d1117`), Zinc Surfaces (`#13161c` / `#1a1e26`), Crisp Glass Borders (`#262b36`).
  - True Neon Emerald (`#00F59B` / `#10B981`) with glowing gradients, matching the brand logo.
  - Semantic colors: Win (`#00F59B`), Loss (`#FF4D4D`), Pending (`#F59E0B`), Urgent (`#F43F5E`).
- **Open-Source Influences**: Tremor Raw / shadcn / Polymarket / Linear — sleek metrics cards, interactive filter chips, probability badges, Kelly sizing, live trade memos.
- **Zero "Disabled" AI Slop**: Remove all "Action disabled in preview" banners. Instead, provide rich interactive state in-memory:
  - Role switcher (Luis - Co-Owner vs. Jordan - Senior Analyst)
  - Interactive "New Research Thesis" modal with instant addition to the live table
  - "Owner Review & Capital Sizing" modal (Invest $X, Pass, Settle Won/Lost with P&L update)
  - Interactive Task Kanban Board (drag/move tasks between Pending, In Progress, Completed)
  - Live Staff Chat (#general, #sports-picks, #macro-theses, #announcements, 1-on-1 DMs) with live message send
  - Interactive Date & Category Filters for Analytics with dynamic SVG charts & Analyst Leaderboard
  - Non-dev friendly "Architecture Blueprint & System Roadmap" tab explaining the 3-tier operating model, RBAC security, and 7-day launch plan.

## 3. First Milestone
- Complete full UI rewrite with Lucide icons, responsive layout, interactive modals, role switching, and executive architecture tab.
- Validate `npm run build` cleanly with zero TypeScript errors.
- Ensure ready for instantaneous Vercel deployment.
