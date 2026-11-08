# TwoManMarkets — Executive Platform Architecture & Operational Blueprint

> **Prepared for**: Luis & Co-Owners, TwoManMarkets  
> **Prepared by**: Development & Engineering Team  
> **Target Date**: November 8, 2026  
> **Project Scope**: Centralized Syndicate Operations, Prediction Market Research, & Capital Ledger Terminal  
> **Interactive Live Preview**: Deployed via Vercel Edge  

---

## 1. Executive Summary

**TwoManMarkets** is transitioning from fragmented communication (Discord, spreadsheets, and loose messages) to a **proprietary, institutional-grade internal operations terminal**. 

This platform serves as the central nervous system for your investment syndicate:
1. **Scouting & Research**: Staff researchers identify high-conviction lines on Polymarket, Kalshi, and leading sportsbooks, submitting structured theses with odds, implied probabilities, and calculated edge.
2. **Owner Decision & Capital Allocation**: The two Co-Owners (Luis & Partner) review theses, size positions via disciplined bankroll rules, and log deployed capital with one click.
3. **Settlement & Attribution Ledger**: Once events resolve, outcomes are recorded to automatically compute firm-wide ROI, net profit/loss, and individual analyst hit-rate leaderboards.

The system is designed with **strict bankroll privacy**: employees only see their own research track record and assigned tasks, while total firm capital and master controls remain strictly restricted to the two Co-Owners.

---

## 2. The 3-Tier Operating Architecture

```
+-----------------------------------------------------------------------------------+
|                           TIER 1: RESEARCH SCOUTS (STAFF)                         |
|  - Real-time line scanning across Polymarket, Kalshi, Pinnacle, DraftKings        |
|  - Structured thesis intake: Market, Current Odds, Implied Prob, Calculated Edge   |
|  - Kelly Criterion stake suggestions & supporting evidence links                  |
+-----------------------------------------------------------------------------------+
                                          |
                                          | Instant In-App Dispatcher
                                          v
+-----------------------------------------------------------------------------------+
|                    TIER 2: OWNERS' CAPITAL & SIZING ENGINE                        |
|  - Master review queue for the two Co-Owners (Luis & Partner)                    |
|  - Independent position sizing & one-click capital deployment approval ($)        |
|  - Pass reason logging (e.g., "Edge below 3% threshold", "Hedge required")        |
+-----------------------------------------------------------------------------------+
                                          |
                                          | External Execution & Position Hold
                                          v
+-----------------------------------------------------------------------------------+
|                    TIER 3: SETTLEMENT LEDGER & PERFORMANCE ALPHA                  |
|  - Market outcome verification (Won / Lost / Push) & payout logging               |
|  - Automated firm-wide Net P&L ($) and ROI (%) calculation                        |
|  - Monthly Analyst Leaderboard (Hit Rate %, Net Alpha Generated, Streak)          |
+-----------------------------------------------------------------------------------+
```

---

## 3. Security, Privacy & Permission Matrix (RBAC)

Because prediction syndicate balances must remain confidential, the system enforces **Zero-Trust Role-Based Access Control**:

| System Capability | Two Co-Owners (Luis & Partner) | Staff / Researchers | Security Safeguard |
| :--- | :---: | :---: | :--- |
| **Review & Size Capital ($)** | **Full Control** | **Restricted** | Sizing buttons hidden & locked server-side |
| **Firm-Wide Financial Balance & P&L** | **Full Access** | **Restricted** | Staff view only shows personal picks |
| **Create, Deactivate & Delete Staff** | **Full Control** | **Restricted** | Master session authentication |
| **Submit Prediction Theses** | **Allowed** | **Core Duty** | Structured submission validation |
| **Manage & Reorder Kanban Tasks** | **Full Control** | **Assigned Only** | Drag-and-drop scoped to permissions |
| **Broadcast Syndicate Announcements** | **Full Access** | **Read Only** | Pinned notification broadcast channel |
| **Internal Chat & Direct Messages** | **Full Access** | **Full Access** | Encrypted real-time messaging bus |

---

## 4. Production Technology Stack (Explained in Plain English)

We selected a modern, proven technology foundation optimized for **blazing-fast speed (sub-50ms loads)**, **uncompromising uptime**, and **flawless financial accuracy**:

- **Interface & Terminal Experience**:
  - Built with **React 19 & Next.js** using a custom **Obsidian & High-Voltage Emerald** theme matching the official TwoManMarkets logo identity.
  - 100% responsive across desktop monitors, laptops, tablets, and mobile smartphones.
- **Database & Capital Ledger**:
  - **PostgreSQL** (hosted on Neon / Supabase). Provides bank-grade **ACID compliance**, ensuring every dollar allocated, payout received, and ROI metric is permanently accounted for with zero calculation drift.
- **Real-Time Event Dispatcher**:
  - In-app **WebSocket messaging engine** powering real-time chat, instant notification bell alerts, and live market updates without needing page refreshes.
- **Global Edge Infrastructure**:
  - Deployed to **Vercel's Global Edge Network** with automated SSL encryption, DDoS protection, and 99.99% availability.

---

## 5. 7-Day Sprint Delivery Roadmap

Following deposit confirmation, development proceeds across 7 structured daily milestones:

```
[Day 1] ───► [Day 2] ───► [Day 3] ───► [Day 4] ───► [Day 5] ───► [Day 6] ───► [Day 7]
 Auth &      Command     Research     Task Board     Chat &       Ledger &    Staging QA
 Dual-Admin   Center &   & Sizing      Kanban     Notifications  Admin Panel   & Launch
 Setup       Tickers      Portal       Engine       Center
```

- **Day 1: Foundation, Auth & Dual-Admin Accounts**  
  Database schema initialized; secure JWT login with bcrypt hashing; two master Co-Owner accounts created; role-based session guards.
- **Day 2: Command Center & Real-Time Ticker Integration**  
  Top KPI metrics cards (Active Capital, Syndicate Win Rate, Net P&L); interactive portfolio performance charts; live odds ticker strip.
- **Day 3: Research Submission & Capital Allocation Engine**  
  Scout intake form with odds, implied probability, and calculated edge; Owner review modal with custom stake entry and one-click execution.
- **Day 4: Operations Task Board & Deliverables Engine**  
  Linear-style 3-column Kanban board (Pending, In Progress, Completed); deadline monitors, priority badges, and task reassignment.
- **Day 5: Team Chat Channels & In-App Notification Center**  
  Dedicated channels (`#announcements`, `#sports-picks`, `#macro-theses`, `#general`) plus 1-on-1 staff DMs; unread counter badges.
- **Day 6: Analytics, Settlement Ledger & Admin Control Panel**  
  Outcome verification logging (Won/Lost/Push); automated ROI and P&L calculations; Analyst Performance Leaderboard; employee account lifecycle management.
- **Day 7: Mobile Responsiveness, Security Audit & Staging Handoff**  
  Full cross-device QA testing; private staging deployment on Vercel for Luis and the team to test before final launch.

---

## 6. How to Test the Live Interactive Preview

The live preview is configured with **Perspective Switching** so you can test the system through both viewpoints:
1. **Co-Owner Perspective (Luis)**: Click the profile in the top-right and select **Luis [OWNER]**. You will have access to the Admin tab, capital sizing controls, and firm-wide financial analytics.
2. **Staff Perspective (Jordan Lee)**: Switch to **Jordan Lee [STAFF]**. Observe how the Admin panel is restricted, and only personal research alpha is accessible.
3. **Interactive Modals**: Click **"Submit Pick"** to test logging a new thesis, or click **"Review & Size"** on any market to test capital approval.
4. **Interactive Tasks**: Use the arrow buttons on the Task Board to move assignments between *Pending*, *In Progress*, and *Completed*.
5. **Interactive Messaging**: Send a live message in the Syndicate Chat window to see real-time message handling.
