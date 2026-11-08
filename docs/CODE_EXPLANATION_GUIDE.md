# TwoManMarkets — Dashboard Walkthrough & Component Guide

Internal business operations dashboard and prediction market research hub for **TwoManMarkets**.

---

## 1. Executive Summary for Luis (Non-Technical)

When presenting the dashboard to Luis (Co-Owner / Head of Capital Allocation), use this straightforward walkthrough:

> *"Luis, here is the centralized dashboard for TwoManMarkets. Everything is designed around your daily workflow: scouts submit prediction market lines and sports bets, you review the edge and size the stakes ($), and settled outcomes automatically calculate firm-wide profit, win rate, and ROI without spreadsheets. Your bankroll is hidden from employees, and everyone has their own logins and permissions."*

---

## 2. Walkthrough Guide by Feature

### 1. Dashboard (Overview)
- **Top Metrics:** Total Active Capital, Overall Win Rate, Net Realized Profit, and Active Theses.
- **Live Odds Ticker:** Ticker strip tracking active lines (NFL spreads, Kalshi Fed rate cuts, Polymarket crypto probabilities).
- **Growth Chart:** Interactive P&L curve with timeframe toggles (`7D`, `30D`, `90D`, `ALL`).
- **Category Breakdown:** Win rates and volume across Sports, Macro, Crypto, and Politics.

### 2. Research Pipeline
- **Thesis Cards / Table:** Analysts submit lines with bookmaker, odds, calculated edge %, and thesis links.
- **Filter Toolbar:** Filter by status (`All`, `Pending`, `Invested`, `Won`, `Lost`, `Passed`) or search instantly by title/bookmaker.
- **Review & Size Action (Owner Only):** Owners click "Review & Size" to allocate stakes ($) or pass.
- **Settlement:** Clicking "Mark Settle WON" or "LOST" calculates net P&L and updates the firm ledger.

### 3. Tasks
- **Kanban Board:** 3 columns (`Pending`, `In Progress`, `Completed`).
- **Details:** Priority badges (`Urgent`, `High`, `Medium`, `Low`), due dates, and assignee avatars.
- **Task Controls:** One-click buttons to advance or revert tasks between status columns.

### 4. Team Chat
- **Topic Channels:** `#announcements` (broadcast-only for Owners), `#sports-picks`, `#macro-theses`, `#general`.
- **Direct Messages:** Private 1-on-1 threads with any team member.
- **Interactive Composer:** Real-time messaging with timestamps and role badges.

### 5. Analytics & Reports
- **Key Metrics:** Profit Factor, Sharpe Ratio proxy, and Value Edge %.
- **Analyst Leaderboard:** Ranks staff by win rate, total bets, and net profit.
- **Historical Ledger:** Filterable historical records table with Category and Status dropdown filters.
- **Export CSV:** One-click download of the active filtered dataset as a spreadsheet.

### 6. Staff & Permissions
- **Staff Directory:** Active/inactive status filters, search input, and employee profile dossiers.
- **Profile Dossier:** Shows assigned markets, win rate, total submissions, profit generated, and task completion.

### 7. Admin Settings (Owner Perspective Only)
- **Account Management:** Edit permissions, reset passwords, or deactivate accounts.
- **Permissions Matrix:** Reference table of Owner vs Staff capabilities.
- **Audit Log:** Unalterable log of logins, stake sizing, and permission changes with category filters.
- **Perspective Switcher:** Test the dashboard as Luis (Owner) vs Maya Chen (Staff) to verify access restrictions.

---

## 3. Code Organization

The codebase is split into modular components:

```
src/
├── types/index.ts              # Data contracts and models
├── data/mockData.ts            # Seed fixtures and initial state
├── utils/
│   ├── telemetry.ts            # Win rate, profit factor, and metrics math
│   └── csvExport.ts            # Client-side CSV generator
├── hooks/useAppState.ts        # Central state management hook
├── components/
│   ├── layout/                 # Sidebar and Topbar navigation
│   ├── views/                  # 7 core feature views
│   └── modals/                 # 9 dialog modals
├── App.tsx                     # Top-level view router (<200 lines)
└── styles.css                  # Obsidian & Emerald responsive styling
```
