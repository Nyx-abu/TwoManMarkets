import { useEffect, useRef, useState, type ReactNode } from "react";

type Page = "overview" | "research" | "tasks" | "chat" | "analytics" | "team" | "admin";
type Status = "Pending review" | "Invested" | "Passed" | "Won" | "Lost";
type ResearchItem = {
  id: string; market: string; category: string; odds: string; stake: string;
  author: string; initials: string; date: string; status: Status; analysis: string; source: string;
};
type Task = { title: string; description: string; assignee: string; initials: string; due: string; priority: "High" | "Medium" | "Low" };

const research: ResearchItem[] = [
  { id: "R-0248", market: "Fed cuts rates by September?", category: "Economics", odds: "42¢", stake: "$1,200", author: "Jordan Lee", initials: "JL", date: "Today, 9:42 AM", status: "Pending review", analysis: "Recent labor data and forward guidance suggest the market may be underpricing a first cut. The thesis is conditional on the next CPI print cooling; revisit sizing after the release.", source: "research.example/markets/fed-september" },
  { id: "R-0247", market: "Celtics win the championship", category: "Basketball", odds: "31¢", stake: "$850", author: "Maya Chen", initials: "MC", date: "Today, 8:16 AM", status: "Invested", analysis: "Illustrative thesis: model projections give Boston a modest edge after accounting for the current bracket. Position is sized below the usual limit because of series volatility.", source: "research.example/sports/nba-finals" },
  { id: "R-0246", market: "Bitcoin above $80k by year end", category: "Crypto", odds: "56¢", stake: "$500", author: "Sam Rivera", initials: "SR", date: "Yesterday", status: "Passed", analysis: "Upside case is plausible, but the thesis does not clear the current risk-adjusted threshold. Reassess if implied volatility falls.", source: "research.example/markets/btc-80k" },
  { id: "R-0245", market: "Team USA wins the opening match", category: "Soccer", odds: "67¢", stake: "$600", author: "Jordan Lee", initials: "JL", date: "Nov 6, 2026", status: "Won", analysis: "Illustrative matchup analysis based on squad depth and recent form. The quoted probability left a small positive edge in the internal model.", source: "research.example/sports/opening-match" },
];

const tasks: Record<"Pending" | "In progress" | "Completed", Task[]> = {
  Pending: [
    { title: "Review CPI release scenarios", description: "Update the rate decision thesis after Thursday's data.", assignee: "Jordan Lee", initials: "JL", due: "Due today", priority: "High" },
    { title: "Refresh NBA futures model", description: "Reconcile updated injury reports with market prices.", assignee: "Maya Chen", initials: "MC", due: "Due Nov 12", priority: "Medium" },
  ],
  "In progress": [
    { title: "Compare BTC market depth", description: "Check liquidity across the current year-end contracts.", assignee: "Sam Rivera", initials: "SR", due: "Due Nov 10", priority: "High" },
    { title: "Draft weekly market brief", description: "Summarize open positions and upcoming catalysts.", assignee: "Maya Chen", initials: "MC", due: "Due Nov 11", priority: "Low" },
  ],
  Completed: [
    { title: "Log weekend settlement results", description: "Reconcile completed sports positions.", assignee: "Jordan Lee", initials: "JL", due: "Completed Nov 7", priority: "Medium" },
    { title: "Review exposure limits", description: "Check category and event concentration.", assignee: "Sam Rivera", initials: "SR", due: "Completed Nov 6", priority: "Low" },
  ],
};

const navGroups: { label: string; items: { id: Page; label: string; icon: string }[] }[] = [
  { label: "Workspace", items: [{ id: "overview", label: "Overview", icon: "grid" }, { id: "research", label: "Research", icon: "target" }, { id: "tasks", label: "Tasks", icon: "check" }, { id: "chat", label: "Chat & updates", icon: "chat" }] },
  { label: "Insights", items: [{ id: "analytics", label: "Analytics", icon: "chart" }, { id: "team", label: "Team", icon: "users" }] },
  { label: "Workspace admin", items: [{ id: "admin", label: "Admin", icon: "settings" }] },
];

const iconPaths: Record<string, ReactNode> = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  target: <><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4"/><path d="M12 2v2m10 8h-2M4 12H2m10 10v-2"/></>,
  check: <><path d="M9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>,
  chat: <><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/></>,
  chart: <><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-5 5"/></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 2.9-.2-.1a1.7 1.7 0 0 0-1.8.4l-.1.1h-3.4l-.1-.2a1.7 1.7 0 0 0-1.7-1.1 1.7 1.7 0 0 0-1.2.5l-.1.1-3-1.7.1-.2a1.7 1.7 0 0 0-.4-1.8l-.1-.1v-3.4l.2-.1A1.7 1.7 0 0 0 7.4 11a1.7 1.7 0 0 0-.5-1.2l-.1-.1 1.7-3 .2.1a1.7 1.7 0 0 0 1.8-.4l.1-.1H14l.1.2a1.7 1.7 0 0 0 1.7 1.1 1.7 1.7 0 0 0 1.2-.5l.1-.1 3 1.7-.1.2a1.7 1.7 0 0 0 .4 1.8l.1.1v3.4z"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
  menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
  arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  close: <><path d="m18 6-12 12M6 6l12 12"/></>,
  plus: <><path d="M12 5v14M5 12h14"/></>,
  external: <><path d="M14 3h7v7M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></>,
};

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{iconPaths[name] ?? iconPaths.grid}</svg>;
}

function Avatar({ initials, size = "sm" }: { initials: string; size?: "sm" | "md" }) {
  return <span className={`avatar avatar-${initials.toLowerCase()} ${size}`} aria-label={initials}>{initials}</span>;
}

function StatusPill({ status }: { status: Status | "Active" | "Inactive" }) {
  const cls = status.toLowerCase().replaceAll(" ", "-");
  return <span className={`status ${cls}`}><i />{status}</span>;
}

function App() {
  const [page, setPage] = useState<Page>("overview");
  const [activeChannel, setActiveChannel] = useState("# general");
  const [selected, setSelected] = useState<ResearchItem | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navigate = (next: Page) => { setPage(next); setMobileNavOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const heading = ({ overview: "Overview", research: "Research", tasks: "Tasks", chat: "Chat & updates", analytics: "Analytics", team: "Team", admin: "Admin" } as const)[page];

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNavOpen ? "sidebar-open" : ""}`}>
      <div className="brand-row"><img src="/logo.png" alt="TwoManMarkets" className="brand-logo" /><span className="preview-tag">PREVIEW</span><button className="icon-button mobile-close" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation"><Icon name="close" /></button></div>
      <div className="workspace-switch"><div className="workspace-mark">TM</div><div><strong>TwoManMarkets</strong><small>Internal workspace</small></div><span className="chevron">⌄</span></div>
      <div className="sidebar-scroll">
        {navGroups.map((group) => <section className="nav-group" key={group.label} aria-label={group.label}>
          <p className="nav-label">{group.label}</p>
          {group.items.map((item) => <button key={item.id} className={`nav-item ${page === item.id ? "active" : ""}`} onClick={() => navigate(item.id)} aria-current={page === item.id ? "page" : undefined}>
            <Icon name={item.icon} /><span>{item.label}</span>{item.id === "tasks" && <b className="nav-count">4</b>}
          </button>)}
        </section>)}
      </div>
      <div className="sidebar-footer"><div className="presence-dot" /><div className="profile-copy"><strong>Alex Morgan</strong><small>Owner · Demo profile</small></div><Avatar initials="AM" /></div>
    </aside>

    <div className="main-wrap">
      <header className="topbar">
        <div className="topbar-left"><button className="icon-button mobile-menu" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation"><Icon name="menu" /></button><span className="breadcrumb">Workspace</span><span className="crumb-slash">/</span><span className="breadcrumb current">{heading}</span></div>
        <div className="topbar-actions"><span className="sample-label"><span /> Sample workspace</span><button className="icon-button search-button" disabled title="Search is not connected in this preview" aria-label="Search"><Icon name="search" /></button><div className="notification-wrap"><button className={`icon-button ${notificationsOpen ? "selected" : ""}`} onClick={() => setNotificationsOpen(!notificationsOpen)} aria-expanded={notificationsOpen} aria-label="Notifications"><Icon name="bell" /><i className="notification-count">3</i></button>
          {notificationsOpen && <div className="notification-popover"><div className="popover-head"><strong>Notifications</strong><span>3 new</span></div><div className="notification-item"><span className="notification-icon green"><Icon name="target" size={15} /></span><div><strong>Research ready for review</strong><p>Jordan submitted a rate decision thesis.</p><small>12 min ago</small></div></div><div className="notification-item"><span className="notification-icon blue"><Icon name="check" size={15} /></span><div><strong>Task assigned to you</strong><p>Review CPI release scenarios.</p><small>1 hour ago</small></div></div><div className="notification-item"><span className="notification-icon amber">↗</span><div><strong>Weekly desk update</strong><p>New announcement from the owners.</p><small>Yesterday</small></div></div><div className="popover-foot">Notifications are sample content</div></div>}
        </div><button className="profile-button" title="Demo owner profile"><Avatar initials="AM" /><span>Alex Morgan</span><span className="chevron">⌄</span></button></div>
      </header>

      <main className="content">
        {page === "overview" && <Overview navigate={navigate} onSelect={setSelected} />}
        {page === "research" && <ResearchPage onSelect={setSelected} />}
        {page === "tasks" && <TasksPage />}
        {page === "chat" && <ChatPage activeChannel={activeChannel} setActiveChannel={setActiveChannel} />}
        {page === "analytics" && <AnalyticsPage />}
        {page === "team" && <TeamPage />}
        {page === "admin" && <AdminPage />}
      </main>
      <footer className="app-footer"><span>TwoManMarkets internal dashboard</span><span>Preview build · Illustrative data only</span></footer>
    </div>
    {mobileNavOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />}
    {selected && <ResearchModal item={selected} onClose={() => setSelected(null)} />}
  </div>;
}

function PageHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-dot" /> INTERNAL WORKSPACE</div><h1>{title}</h1><p>{subtitle}</p></div>{action && <div className="heading-action">{action}</div>}</div>;
}

function DisabledAction({ children, icon }: { children: string; icon?: string }) {
  return <button className="button button-primary" disabled title="Business actions are disabled in this UI preview">{icon && <Icon name={icon} size={16} />}{children}</button>;
}

function Metric({ label, value, change, icon, tone = "green", note }: { label: string; value: string; change: string; icon: string; tone?: string; note: string }) {
  return <article className="metric-card"><div className="metric-top"><span>{label}</span><span className={`metric-icon ${tone}`}><Icon name={icon} size={16} /></span></div><div className="metric-value">{value}</div><div className="metric-bottom"><span className="metric-change">↗ {change}</span><span>{note}</span></div></article>;
}

function Overview({ navigate, onSelect }: { navigate: (page: Page) => void; onSelect: (item: ResearchItem) => void }) {
  return <>
    <PageHeader title="Good morning, Alex" subtitle="Here’s what’s happening across your desk." action={<span className="date-chip"><span className="calendar-icon">▦</span> November 8, 2026 <span className="chevron">⌄</span></span>} />
    <div className="metrics-grid"><Metric label="Active tasks" value="4" change="2 due soon" icon="check" note="team-wide assignments" /><Metric label="Research submitted" value="38" change="3 new" icon="target" tone="blue" note="all-time recommendations" /><Metric label="Win rate" value="68.4%" change="4.2%" icon="check" tone="violet" note="19 settled positions" /><Metric label="Overall ROI" value="15.4%" change="2.1%" icon="chart" note="on invested capital" /></div>
    <div className="overview-grid"><section className="panel performance-panel"><div className="panel-head"><div><h2>Portfolio performance</h2><p>Net profit & loss · illustrative records</p></div><button className="subtle-select" disabled title="Date filtering is disabled in this preview">Last 30 days <span>⌄</span></button></div><div className="chart-legend"><span><i className="legend-line green-line" />Net P&amp;L</span><span><i className="legend-line gray-line" />Invested capital</span></div><div className="chart-wrap"><div className="y-axis"><span>$4k</span><span>$3k</span><span>$2k</span><span>$1k</span><span>$0</span></div><svg className="performance-chart" viewBox="0 0 720 190" role="img" aria-label="Illustrative portfolio performance rising over the last 30 days"><path d="M0 160H720M0 120H720M0 80H720M0 40H720" className="chart-grid"/><path d="M0 159 C38 150 57 155 82 140 S127 134 153 141 S194 115 222 123 S274 120 299 108 S346 120 372 99 S415 96 444 102 S485 77 518 88 S558 64 591 71 S630 52 655 60 S690 32 720 26 L720 190 L0 190Z" className="chart-area"/><path d="M0 159 C38 150 57 155 82 140 S127 134 153 141 S194 115 222 123 S274 120 299 108 S346 120 372 99 S415 96 444 102 S485 77 518 88 S558 64 591 71 S630 52 655 60 S690 32 720 26" className="chart-line"/><path d="M0 170 C50 166 80 168 120 164 S190 159 240 157 S310 151 360 149 S430 141 480 138 S550 128 600 125 S670 116 720 112" className="chart-line secondary-line"/><circle cx="720" cy="26" r="4" className="chart-point"/></svg></div><div className="x-axis"><span>Oct 10</span><span>Oct 17</span><span>Oct 24</span><span>Oct 31</span><span>Nov 8</span></div></section>
      <section className="panel outcomes-panel"><div className="panel-head"><div><h2>Position outcomes</h2><p>Resolved owner investments</p></div><span className="round-icon"><Icon name="arrow" size={16} /></span></div><div className="outcome-main"><div className="donut" aria-label="13 wins, 6 losses"><div><strong>19</strong><small>settled</small></div></div><div className="outcome-stats"><div><i className="outcome-dot won-dot"/><span>Won</span><strong>13</strong></div><div><i className="outcome-dot lost-dot"/><span>Lost</span><strong>6</strong></div></div></div><div className="outcome-foot"><span>Win / loss ratio</span><strong>2.17 : 1</strong></div></section></div>
    <div className="announcement"><div className="announcement-mark">i</div><div><strong>Desk update · Weekly risk review</strong><p>Open positions will be reviewed at Monday’s desk meeting. Please add any new catalysts to the research channel before then.</p></div><span className="announcement-date">Yesterday</span></div>
    <div className="lower-grid"><section className="panel table-panel"><div className="panel-head"><div><h2>Recent research</h2><p>Latest recommendations from your team</p></div><button className="text-button" onClick={() => navigate("research")}>View all <Icon name="arrow" size={15} /></button></div><ResearchTable items={research.slice(0, 3)} onSelect={onSelect} compact /></section>
      <section className="panel task-panel"><div className="panel-head"><div><h2>Team tasks</h2><p>2 of 6 completed this week</p></div><button className="text-button" onClick={() => navigate("tasks")}>View all <Icon name="arrow" size={15} /></button></div><div className="task-list"><TaskRow task={tasks.Pending[0]} /><TaskRow task={tasks["In progress"][1]} /><TaskRow task={tasks.Completed[0]} done /></div><div className="task-progress"><div><span>Weekly progress</span><strong>33%</strong></div><div className="progress-track"><i style={{ width: "33%" }} /></div></div></section></div>
    <div className="activity-strip"><div className="activity-heading"><span className="activity-pulse"/><strong>Recent activity</strong><span className="muted">Latest updates from your workspace</span></div><span><Avatar initials="MC" /> <b>Maya Chen</b> submitted a new recommendation <time>18m ago</time></span><span><Avatar initials="SR" /> <b>Sam Rivera</b> completed “Review exposure limits” <time>1h ago</time></span></div>
  </>;
}

function ResearchTable({ items, onSelect, compact = false }: { items: ResearchItem[]; onSelect: (item: ResearchItem) => void; compact?: boolean }) {
  return <div className={`table-scroll ${compact ? "compact-table" : ""}`}><table><thead><tr><th>Market</th><th>Category</th><th>Market price</th><th>Suggested stake</th><th>Submitted by</th><th>Status</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td><button className="market-link" onClick={() => onSelect(item)}><span>{item.market}</span><small>{item.id} · {item.date}</small></button></td><td><span className="category-label">{item.category}</span></td><td className="price-cell">{item.odds}</td><td>{item.stake}</td><td><span className="person-cell"><Avatar initials={item.initials} />{item.author}</span></td><td><StatusPill status={item.status} /></td></tr>)}</tbody></table></div>;
}

function ResearchPage({ onSelect }: { onSelect: (item: ResearchItem) => void }) {
  return <><PageHeader title="Research" subtitle="Review market theses submitted by the team." action={<DisabledAction icon="plus">New submission</DisabledAction>} /><div className="research-summary"><div className="summary-item"><span className="summary-dot pending-dot"/><span>Pending review</span><strong>4</strong></div><div className="summary-item"><span className="summary-dot invested-dot"/><span>Invested</span><strong>6</strong></div><div className="summary-item"><span className="summary-dot passed-dot"/><span>Passed</span><strong>9</strong></div><div className="summary-item"><span className="summary-dot settled-dot"/><span>Settled</span><strong>19</strong></div></div><section className="panel page-table"><div className="panel-head"><div><h2>All recommendations</h2><p>Sample research records · select a market to inspect the thesis</p></div><span className="read-only-label">Read only</span></div><div className="filter-row"><span className="filter-chip active">All <b>38</b></span><span className="filter-chip">Pending <b>4</b></span><span className="filter-chip">Invested <b>6</b></span><span className="filter-chip">Resolved <b>19</b></span><span className="spacer"/><button className="subtle-select" disabled title="Filtering is disabled in this preview">All categories <span>⌄</span></button></div><ResearchTable items={research} onSelect={onSelect} /><div className="table-pager"><span>Showing 4 of 38 sample records</span><button disabled aria-label="Previous page">‹</button><button disabled aria-label="Next page">›</button></div></section><div className="info-note"><strong>Workflow preview</strong><span>Researchers submit a market, category, current odds, suggested stake, analysis, and source. Owners review the thesis and record an investment decision in the full application.</span></div></>;
}

function TaskRow({ task, done = false }: { task: Task; done?: boolean }) {
  return <div className={`task-row ${done ? "done" : ""}`}><span className="task-check">{done ? "✓" : ""}</span><div className="task-copy"><strong>{task.title}</strong><small>{task.due} · {task.priority} priority</small></div><Avatar initials={task.initials} /></div>;
}

function TasksPage() {
  const columns: (keyof typeof tasks)[] = ["Pending", "In progress", "Completed"];
  return <><PageHeader title="Tasks" subtitle="A shared view of assignments and team progress." action={<DisabledAction icon="plus">Create task</DisabledAction>} /><div className="board-toolbar"><div className="board-tabs"><span className="active">Board</span><span>Assigned to me <b>4</b></span></div><div className="toolbar-right"><span className="board-filter">All assignees <b>⌄</b></span><span className="read-only-label">Sample board</span></div></div><div className="kanban-board">{columns.map((column) => <section className="kanban-column" key={column}><div className="column-head"><span className={`column-mark ${column.toLowerCase().replace(" ", "-")}`} /> <strong>{column}</strong><span className="column-count">{tasks[column].length}</span><button className="dots-button" disabled aria-label={`${column} options`}>···</button></div>{tasks[column].map((task) => <article className="kanban-card" key={task.title}><div className="card-topline"><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority} priority</span><button className="dots-button" disabled aria-label="Task options">···</button></div><h3>{task.title}</h3><p>{task.description}</p><div className="kanban-card-footer"><span><Avatar initials={task.initials} />{task.assignee}</span><small>{task.due}</small></div></article>)}</section>)}</div><div className="info-note"><strong>Task status</strong><span>Owners assign work and researchers update status in the full application. Board controls are disabled in this preview.</span></div></>;
}

const chatContent: Record<string, { name: string; subtitle: string; messages: { initials: string; name: string; time: string; text: string }[] }> = {
  "# general": { name: "general", subtitle: "Company-wide discussion", messages: [{ initials: "AM", name: "Alex Morgan", time: "9:05 AM", text: "Morning team — please add any positions that need a second look to the review list before the desk call." }, { initials: "JL", name: "Jordan Lee", time: "9:14 AM", text: "I added the rate decision thesis. The next CPI release is the main catalyst; I noted the invalidation level in the analysis." }, { initials: "MC", name: "Maya Chen", time: "9:28 AM", text: "Thanks. I’ll check the latest futures pricing and add a comparison before the afternoon review." }, { initials: "SR", name: "Sam Rivera", time: "10:02 AM", text: "BTC liquidity summary is in progress. I’ll flag any contracts with wider spreads." }] },
  "# research": { name: "research", subtitle: "Market theses and supporting data", messages: [{ initials: "MC", name: "Maya Chen", time: "8:42 AM", text: "I’m tracking the championship futures after the latest bracket update. The sample recommendation is in the research queue." }, { initials: "JL", name: "Jordan Lee", time: "9:02 AM", text: "Please include the current market price and source timestamp so we can compare it to the model estimate." }] },
  "# announcements": { name: "announcements", subtitle: "Owner updates for the team", messages: [{ initials: "AM", name: "Alex Morgan", time: "Yesterday", text: "Weekly risk review is set for Monday. Please update open thesis notes and flag upcoming events that could change exposure." }] },
  "Jordan Lee": { name: "Jordan Lee", subtitle: "Direct message · Researcher", messages: [{ initials: "JL", name: "Jordan Lee", time: "Yesterday", text: "I’ve added the market source and the scenario notes to the pending recommendation." }, { initials: "AM", name: "Alex Morgan", time: "Yesterday", text: "Great, thank you. We’ll review it with the rest of the queue." }] },
};

function ChatPage({ activeChannel, setActiveChannel }: { activeChannel: string; setActiveChannel: (channel: string) => void }) {
  const selected = chatContent[activeChannel];
  return <><PageHeader title="Chat & updates" subtitle="Keep research, task coordination, and team announcements together." /><div className="chat-layout"><aside className="chat-sidebar"><div className="chat-section-title">CHANNELS <button disabled title="Channel management is disabled in this preview">+</button></div>{["# general", "# research", "# announcements"].map((channel) => <button key={channel} className={`channel-link ${activeChannel === channel ? "active" : ""}`} onClick={() => setActiveChannel(channel)}><span>{channel}</span>{channel === "# announcements" && <i className="unread-dot" />}</button>)}<div className="chat-section-title dm-title">DIRECT MESSAGES <button disabled title="Messaging is disabled in this preview">+</button></div><button className={`channel-link dm-link ${activeChannel === "Jordan Lee" ? "active" : ""}`} onClick={() => setActiveChannel("Jordan Lee")}><Avatar initials="JL" /><span>Jordan Lee</span><i className="online-dot" /></button><button className="channel-link dm-link" disabled title="Messaging is disabled in this preview"><Avatar initials="MC" /><span>Maya Chen</span></button><button className="channel-link dm-link" disabled title="Messaging is disabled in this preview"><Avatar initials="SR" /><span>Sam Rivera</span></button><div className="chat-sidebar-foot"><div className="presence-dot"/>3 teammates online</div></aside><section className="chat-conversation"><div className="chat-head"><div><strong>{selected.name}</strong><span>{selected.subtitle}</span></div><span className="read-only-label">Sample messages</span></div><div className="message-list">{selected.messages.map((message, i) => <div className="message" key={`${message.name}-${i}`}><Avatar initials={message.initials} size="md"/><div><div className="message-meta"><strong>{message.name}</strong><time>{message.time}</time></div><p>{message.text}</p></div></div>)}</div><div className="message-compose"><span className="compose-plus">+</span><input aria-label="Message input" disabled placeholder="Messaging is disabled in this preview"/><button disabled title="Sending is disabled in this preview"><Icon name="arrow" /></button></div></section></div></>;
}

function AnalyticsPage() {
  return <><PageHeader title="Analytics" subtitle="Historical performance for owner-invested positions and team operations." action={<button className="subtle-select" disabled title="Date controls are disabled in this preview">Last 90 days <span>⌄</span></button>} /><div className="metrics-grid analytics-metrics"><Metric label="Net profit / loss" value="+$2,846" change="12.8%" icon="chart" note="sample period" /><Metric label="Return on investment" value="15.4%" change="2.1%" icon="chart" note="on invested capital" /><Metric label="Win / loss ratio" value="2.17 : 1" change="3 positions" icon="check" tone="violet" note="13 wins · 6 losses" /><Metric label="Task completion" value="86%" change="5.6%" icon="check" tone="blue" note="team average" /></div><div className="analytics-grid"><section className="panel analytics-chart"><div className="panel-head"><div><h2>Net returns over time</h2><p>Settled positions · USD</p></div><span className="positive-value">+$2,846</span></div><div className="chart-legend"><span><i className="legend-line green-line" />Cumulative P&amp;L</span></div><div className="chart-wrap tall"><div className="y-axis"><span>$3k</span><span>$2k</span><span>$1k</span><span>$0</span><span>−$1k</span></div><svg className="performance-chart" viewBox="0 0 720 210" role="img" aria-label="Illustrative cumulative profit and loss chart"><path d="M0 165H720M0 125H720M0 85H720M0 45H720M0 5H720" className="chart-grid"/><path d="M0 169 C44 176 72 157 110 162 S170 142 207 149 S258 120 299 132 S344 102 382 110 S426 76 466 91 S508 63 548 75 S593 44 630 57 S681 20 720 26 L720 210 L0 210Z" className="chart-area"/><path d="M0 169 C44 176 72 157 110 162 S170 142 207 149 S258 120 299 132 S344 102 382 110 S426 76 466 91 S508 63 548 75 S593 44 630 57 S681 20 720 26" className="chart-line"/><circle cx="720" cy="26" r="4" className="chart-point"/></svg></div><div className="x-axis"><span>Aug 10</span><span>Sep 1</span><span>Sep 22</span><span>Oct 13</span><span>Nov 8</span></div></section><section className="panel category-panel"><div className="panel-head"><div><h2>By category</h2><p>Resolved positions</p></div></div>{[{ name: "Sports", pct: "42%", value: "+$1,194", width: "74%" }, { name: "Economics", pct: "26%", value: "+$930", width: "58%" }, { name: "Crypto", pct: "21%", value: "+$486", width: "42%" }, { name: "Politics", pct: "11%", value: "+$236", width: "25%" }].map((row) => <div className="category-row" key={row.name}><div><strong>{row.name}</strong><span>{row.pct} of positions</span><b>{row.value}</b></div><div className="progress-track"><i style={{ width: row.width }} /></div></div>)}</section></div><section className="panel page-table analytics-records"><div className="panel-head"><div><h2>Recent settled positions</h2><p>Illustrative performance records</p></div><span className="read-only-label">Owner investments</span></div><div className="table-scroll"><table><thead><tr><th>Market</th><th>Category</th><th>Invested</th><th>Net P&amp;L</th><th>ROI</th><th>Outcome</th></tr></thead><tbody><tr><td>Team USA wins the opening match</td><td>Soccer</td><td>$600</td><td className="positive-value">+$402</td><td className="positive-value">67.0%</td><td><StatusPill status="Won" /></td></tr><tr><td>Bitcoin above $75k by October</td><td>Crypto</td><td>$500</td><td className="negative-value">−$500</td><td className="negative-value">−100%</td><td><StatusPill status="Lost" /></td></tr><tr><td>Candidate wins state primary</td><td>Politics</td><td>$750</td><td className="positive-value">+$318</td><td className="positive-value">42.4%</td><td><StatusPill status="Won" /></td></tr></tbody></table></div></section></>;
}

function TeamPage() {
  const people = [{ name: "Jamie Park", initials: "JP", role: "Co-owner", status: "Active" as const, tasks: "—", picks: "—", roi: "—" }, { name: "Jordan Lee", initials: "JL", role: "Senior Researcher", status: "Active" as const, tasks: "14 / 16", picks: "12", roi: "+18.2%" }, { name: "Maya Chen", initials: "MC", role: "Sports Analyst", status: "Active" as const, tasks: "11 / 13", picks: "9", roi: "+11.6%" }, { name: "Sam Rivera", initials: "SR", role: "Market Researcher", status: "Active" as const, tasks: "9 / 12", picks: "8", roi: "+7.4%" }, { name: "Taylor Brooks", initials: "TB", role: "Researcher", status: "Inactive" as const, tasks: "6 / 8", picks: "5", roi: "+4.8%" }];
  return <><PageHeader title="Team" subtitle="People, roles, and a sample view of team activity." action={<DisabledAction icon="plus">Invite member</DisabledAction>} /><div className="team-summary"><div className="panel team-stat"><span className="metric-icon green"><Icon name="users" size={17}/></span><div><strong>6</strong><span>Team members</span></div></div><div className="panel team-stat"><span className="presence-dot large"/><div><strong>4</strong><span>Active today</span></div></div><div className="panel team-stat"><span className="metric-icon blue"><Icon name="check" size={17}/></span><div><strong>86%</strong><span>Task completion</span></div></div><div className="panel team-stat"><span className="metric-icon violet"><Icon name="target" size={17}/></span><div><strong>34</strong><span>Submitted picks</span></div></div></div><section className="panel page-table"><div className="panel-head"><div><h2>Workspace members</h2><p>Role and activity summary · sample profiles</p></div><button className="subtle-select" disabled title="Member filters are disabled">All members <span>⌄</span></button></div><div className="table-scroll"><table><thead><tr><th>Member</th><th>Role</th><th>Status</th><th>Tasks completed</th><th>Research picks</th><th>Personal ROI</th></tr></thead><tbody>{people.map((person) => <tr key={person.name}><td><span className="person-cell"><Avatar initials={person.initials}/><strong>{person.name}</strong></span></td><td>{person.role}</td><td><StatusPill status={person.status}/></td><td>{person.tasks}</td><td>{person.picks}</td><td className={person.roi.startsWith("+") ? "positive-value" : ""}>{person.roi}</td></tr>)}</tbody></table></div></section><div className="info-note"><strong>Role separation</strong><span>Owners review recommendations, record capital decisions, and view business-wide financial metrics. Researchers submit theses, manage assigned tasks, and see their personal performance.</span></div></>;
}

function AdminPage() {
  const permissions = [{ label: "Review research and record decisions", owner: true, staff: false }, { label: "View business financial analytics", owner: true, staff: false }, { label: "Assign and manage tasks", owner: true, staff: false }, { label: "Submit market research", owner: true, staff: true }, { label: "Update assigned task status", owner: true, staff: true }, { label: "Chat and view announcements", owner: true, staff: true }];
  return <><PageHeader title="Admin" subtitle="Owner controls and workspace access overview." action={<DisabledAction icon="plus">Add team member</DisabledAction>} /><div className="admin-banner"><span className="admin-shield">✓</span><div><strong>Owner view</strong><p>Admin tools are shown for review. Account changes and permission updates are not connected.</p></div><span className="role-tag">OWNER</span></div><div className="admin-grid"><section className="panel access-panel"><div className="panel-head"><div><h2>Role permissions</h2><p>Read-only permission matrix</p></div><span className="lock-label">⌑ Protected</span></div><div className="permission-table"><div className="permission-row permission-head"><span>Capability</span><b>Owner</b><b>Researcher</b></div>{permissions.map((permission) => <div className="permission-row" key={permission.label}><span>{permission.label}</span><b className={permission.owner ? "allowed" : "denied"}>{permission.owner ? "✓" : "—"}</b><b className={permission.staff ? "allowed" : "denied"}>{permission.staff ? "✓" : "—"}</b></div>)}</div></section><section className="panel audit-panel"><div className="panel-head"><div><h2>Recent audit activity</h2><p>Sample workspace events</p></div></div><div className="audit-item"><span className="audit-symbol">↗</span><div><strong>Research marked as invested</strong><p>Alex Morgan · R-0247</p><small>Today, 8:40 AM</small></div></div><div className="audit-item"><span className="audit-symbol">✓</span><div><strong>Task completed</strong><p>Sam Rivera · Exposure limits</p><small>Yesterday, 3:12 PM</small></div></div><div className="audit-item"><span className="audit-symbol">＋</span><div><strong>Research submitted</strong><p>Jordan Lee · R-0248</p><small>Today, 9:42 AM</small></div></div></section></div><section className="panel page-table account-panel"><div className="panel-head"><div><h2>Account access</h2><p>Sample members and roles</p></div><span className="read-only-label">Read only</span></div><div className="table-scroll"><table><thead><tr><th>Member</th><th>Role</th><th>Account status</th><th>Last active</th><th>Access</th></tr></thead><tbody><tr><td><span className="person-cell"><Avatar initials="AM"/><strong>Alex Morgan</strong></span></td><td>Owner</td><td><StatusPill status="Active"/></td><td>Now</td><td><button className="text-button" disabled title="Account controls are disabled">Manage</button></td></tr><tr><td><span className="person-cell"><Avatar initials="JL"/><strong>Jordan Lee</strong></span></td><td>Researcher</td><td><StatusPill status="Active"/></td><td>12 min ago</td><td><button className="text-button" disabled title="Account controls are disabled">Manage</button></td></tr></tbody></table></div></section></>;
}

function ResearchModal({ item, onClose }: { item: ResearchItem; onClose: () => void }) {
  const closeButton = useRef<HTMLButtonElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") closeRef.current(); };
    window.addEventListener("keydown", onKeyDown);
    return () => { window.removeEventListener("keydown", onKeyDown); previouslyFocused?.focus(); };
  }, []);
  return <div className="modal-backdrop" role="presentation" onClick={onClose}><section className="research-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(event) => event.stopPropagation()}><div className="modal-head"><div><span className="eyebrow">{item.id} · {item.category}</span><button ref={closeButton} className="icon-button" onClick={onClose} aria-label="Close details"><Icon name="close" /></button></div><h2 id="modal-title">{item.market}</h2><div className="modal-subline"><span>Submitted by <b>{item.author}</b></span><span>{item.date}</span><StatusPill status={item.status}/></div></div><div className="modal-metrics"><div><small>Current market price</small><strong>{item.odds}</strong></div><div><small>Suggested stake</small><strong>{item.stake}</strong></div><div><small>Category</small><strong>{item.category}</strong></div></div><div className="modal-section"><h3>Research thesis</h3><p>{item.analysis}</p></div><div className="modal-section source-row"><div><h3>Supporting source</h3><span>{item.source}</span></div><Icon name="external" size={16}/></div><div className="modal-actions"><span>Owner review actions are preview only</span><div><button className="button button-secondary" disabled title="Decision controls are disabled in this preview">Pass</button><button className="button button-primary" disabled title="Investment controls are disabled in this preview">Record investment</button></div></div></section></div>;
}

export default App;
