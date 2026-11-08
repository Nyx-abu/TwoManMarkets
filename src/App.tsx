import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Target,
  CheckSquare,
  MessageSquare,
  BarChart3,
  Users,
  ShieldCheck,
  Layers,
  Search,
  Bell,
  ChevronDown,
  Plus,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Send,
  TrendingUp,
  DollarSign,
  Activity,
  Sparkles,
  Menu,
  X,
  Check,
  Award,
  ChevronRight
} from 'lucide-react';

// ============================================================================
// Types & Domain Models
// ============================================================================

type Role = 'OWNER' | 'STAFF';

interface UserProfile {
  id: string;
  name: string;
  role: Role;
  initials: string;
  title: string;
  avatarClass: string;
}

type TabType = 'overview' | 'research' | 'tasks' | 'chat' | 'analytics' | 'team' | 'admin' | 'blueprint';

type ResearchStatus = 'Pending' | 'Invested' | 'Won' | 'Lost' | 'Passed';

interface ResearchItem {
  id: string;
  market: string;
  category: 'Sports' | 'Macro' | 'Crypto' | 'Politics' | 'Other';
  book: string;
  odds: string;
  impliedProb: string;
  edge: string;
  suggestedStake: number;
  actualInvested: number;
  author: string;
  authorInitials: string;
  date: string;
  status: ResearchStatus;
  thesis: string;
  sourceUrl: string;
  payoutAmount?: number;
  netProfit?: number;
  roi?: number;
}

interface TaskItem {
  id: string;
  title: string;
  description: string;
  assignee: string;
  assigneeInitials: string;
  dueDate: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
}

interface ChatMessage {
  id: string;
  sender: string;
  role: Role;
  initials: string;
  time: string;
  text: string;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'research' | 'task' | 'announcement';
}

// ============================================================================
// Initial Mock Data
// ============================================================================

const PROFILES: UserProfile[] = [
  {
    id: 'u-1',
    name: 'Luis',
    role: 'OWNER',
    initials: 'LB',
    title: 'Co-Owner · Head of Capital Allocation',
    avatarClass: 'owner'
  },
  {
    id: 'u-2',
    name: 'Alex (Partner)',
    role: 'OWNER',
    initials: 'AM',
    title: 'Co-Owner · Risk & Strategy',
    avatarClass: 'owner'
  },
  {
    id: 'u-3',
    name: 'Jordan Lee',
    role: 'STAFF',
    initials: 'JL',
    title: 'Senior Prediction Analyst',
    avatarClass: 'staff'
  },
  {
    id: 'u-4',
    name: 'Maya Chen',
    role: 'STAFF',
    initials: 'MC',
    title: 'Sports Quantitative Analyst',
    avatarClass: 'staff'
  }
];

const INITIAL_RESEARCH: ResearchItem[] = [
  {
    id: 'TMM-1042',
    market: 'Chiefs vs 49ers — Super Bowl Rematch (Spread -2.5)',
    category: 'Sports',
    book: 'Pinnacle / DraftKings',
    odds: '-110 (52.4%)',
    impliedProb: '52.4%',
    edge: '+5.2%',
    suggestedStake: 1500,
    actualInvested: 1500,
    author: 'Maya Chen',
    authorInitials: 'MC',
    date: 'Today 10:15 AM',
    status: 'Invested',
    thesis: 'Chiefs defensive efficiency ranks #2 post-bye. Line moved against public sentiment due to sharp early action. Internal power ranking indicates a -4.0 fair spread, creating a +5.2% value gap.',
    sourceUrl: 'https://pinnacle.com/football/nfl/chiefs-49ers'
  },
  {
    id: 'TMM-1041',
    market: 'US Fed Rate Cut in December (25bps cut implied)',
    category: 'Macro',
    book: 'Kalshi / Polymarket',
    odds: '78¢ (78%)',
    impliedProb: '78.0%',
    edge: '+6.5%',
    suggestedStake: 2200,
    actualInvested: 0,
    author: 'Jordan Lee',
    authorInitials: 'JL',
    date: 'Today 08:30 AM',
    status: 'Pending',
    thesis: 'Cooling non-farm payrolls and revised core PCE prints reinforce FOMC consensus. Kalshi contract trades at 78¢ vs internal econometric implied target of 84.5¢.',
    sourceUrl: 'https://kalshi.com/markets/fed-rate-dec'
  },
  {
    id: 'TMM-1040',
    market: 'Bitcoin above $85,000 by End of Month',
    category: 'Crypto',
    book: 'Polymarket',
    odds: '62¢ (62%)',
    impliedProb: '62.0%',
    edge: '+5.8%',
    suggestedStake: 1800,
    actualInvested: 1800,
    author: 'Sam Rivera',
    authorInitials: 'SR',
    date: 'Yesterday',
    status: 'Won',
    payoutAmount: 2900,
    netProfit: 1100,
    roi: 61.1,
    thesis: 'Institutional ETF inflows averaged $420M/day with aggregate orderbook bid density firm at $82K support. Target settlement achieved ahead of schedule.',
    sourceUrl: 'https://polymarket.com/market/btc-85k-nov'
  },
  {
    id: 'TMM-1039',
    market: 'Arsenal vs Chelsea (Arsenal Clean Sheet YES)',
    category: 'Sports',
    book: 'Betfair Exchange',
    odds: '+145 (40.8%)',
    impliedProb: '40.8%',
    edge: '+7.4%',
    suggestedStake: 800,
    actualInvested: 800,
    author: 'Maya Chen',
    authorInitials: 'MC',
    date: 'Nov 6, 2026',
    status: 'Won',
    payoutAmount: 1960,
    netProfit: 1160,
    roi: 145.0,
    thesis: 'Saliba & Gabriel defensive duo intact; Chelsea away xG under 0.78 in last 5 derbies. Exchange price offered mispriced plus-money return.',
    sourceUrl: 'https://betfair.com/football/premier-league'
  },
  {
    id: 'TMM-1038',
    market: 'State Senate Special Election — Democratic Win',
    category: 'Politics',
    book: 'Kalshi',
    odds: '54¢ (54%)',
    impliedProb: '54.0%',
    edge: '-1.8%',
    suggestedStake: 1000,
    actualInvested: 0,
    author: 'Sam Rivera',
    authorInitials: 'SR',
    date: 'Nov 5, 2026',
    status: 'Passed',
    thesis: 'Early voting turnout model showed volatile rural shift. Risk-adjusted Kelly sizing requires minimum +3% edge; passed due to insufficient safety margin.',
    sourceUrl: 'https://kalshi.com/markets/senate-election'
  },
  {
    id: 'TMM-1037',
    market: 'Lakers vs Warriors (Warriors Team Total Over 118.5)',
    category: 'Sports',
    book: 'DraftKings',
    odds: '-105 (51.2%)',
    impliedProb: '51.2%',
    edge: '+3.5%',
    suggestedStake: 1200,
    actualInvested: 1200,
    author: 'Maya Chen',
    authorInitials: 'MC',
    date: 'Nov 4, 2026',
    status: 'Lost',
    payoutAmount: 0,
    netProfit: -1200,
    roi: -100.0,
    thesis: 'High pace-factor projection. Warriors entered Q4 on track but suffered severe 3-pt cold streak (2/14) closing at 114 points.',
    sourceUrl: 'https://draftkings.com/sportsbook/nba'
  }
];

const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Model NFL Week 10 Spread Variance',
    description: 'Reconcile injury report impacts on Chiefs, Bills, and Ravens lines before Friday line moves.',
    assignee: 'Maya Chen',
    assigneeInitials: 'MC',
    dueDate: 'Today · 5:00 PM',
    priority: 'Urgent',
    status: 'Pending'
  },
  {
    id: 'task-2',
    title: 'Audit Kalshi Q4 Inflation Contracts',
    description: 'Extract implied yield curve probability distributions ahead of upcoming CPI print.',
    assignee: 'Jordan Lee',
    assigneeInitials: 'JL',
    dueDate: 'Nov 10',
    priority: 'High',
    status: 'In Progress'
  },
  {
    id: 'task-3',
    title: 'Deep-dive Polymarket SOL/ETH Volume',
    description: 'Evaluate order-book slippage and fee friction for high-conviction liquidity allocations.',
    assignee: 'Sam Rivera',
    assigneeInitials: 'SR',
    dueDate: 'Nov 11',
    priority: 'Medium',
    status: 'In Progress'
  },
  {
    id: 'task-4',
    title: 'Weekend Settlement Reconciliation',
    description: 'Log verified outcomes, execute returns into syndicate ledger, and update hit-rates.',
    assignee: 'Jordan Lee',
    assigneeInitials: 'JL',
    dueDate: 'Completed Nov 7',
    priority: 'Medium',
    status: 'Completed'
  },
  {
    id: 'task-5',
    title: 'Risk & Capital Exposure Assessment',
    description: 'Verify category concentration does not exceed 35% on single sport markets.',
    assignee: 'Luis',
    assigneeInitials: 'LB',
    dueDate: 'Completed Nov 6',
    priority: 'Low',
    status: 'Completed'
  }
];

const INITIAL_CHATS: Record<string, ChatMessage[]> = {
  '#announcements': [
    {
      id: 'c-1',
      sender: 'Luis',
      role: 'OWNER',
      initials: 'LB',
      time: 'Yesterday 09:00 AM',
      text: '🚨 Syndicate Desk Notice: Super Bowl rematch lines and Kalshi December rate cut lines have capital allocated. Please keep all model updates in the #sports-picks and #macro-theses channels.'
    },
    {
      id: 'c-2',
      sender: 'Luis',
      role: 'OWNER',
      initials: 'LB',
      time: 'Today 08:00 AM',
      text: 'Reminder: Any pick proposed with under +3.0% edge must include explicit hedge rationale. Capital discipline is priority #1.'
    }
  ],
  '#sports-picks': [
    {
      id: 'c-3',
      sender: 'Maya Chen',
      role: 'STAFF',
      initials: 'MC',
      time: '10:14 AM',
      text: 'Just submitted TMM-1042 (Chiefs -2.5). Pinnacle has heavy limit volume holding steady. Suggested $1,500 sizing.'
    },
    {
      id: 'c-4',
      sender: 'Luis',
      role: 'OWNER',
      initials: 'LB',
      time: '10:20 AM',
      text: 'Reviewed and approved. Order executed at -110. Let’s track line movements leading up to kickoff.'
    }
  ],
  '#macro-theses': [
    {
      id: 'c-5',
      sender: 'Jordan Lee',
      role: 'STAFF',
      initials: 'JL',
      time: '08:35 AM',
      text: 'Fed Dec Cut contract on Kalshi is lagging Polymarket by 4 points. Arbitrage / fundamental edge is active.'
    },
    {
      id: 'c-6',
      sender: 'Jordan Lee',
      role: 'STAFF',
      initials: 'JL',
      time: '08:42 AM',
      text: 'Thesis ticket TMM-1041 is ready in the queue for Luis & Alex to size.'
    }
  ],
  '#general': [
    {
      id: 'c-7',
      sender: 'Sam Rivera',
      role: 'STAFF',
      initials: 'SR',
      time: '09:12 AM',
      text: 'Morning everyone! Bitcoin holding steady above $85K locked in +$1,100 profit on TMM-1040.'
    },
    {
      id: 'c-8',
      sender: 'Luis',
      role: 'OWNER',
      initials: 'LB',
      time: '09:15 AM',
      text: 'Great work Sam. Solid research execution on the ETF liquidity flow.'
    }
  ]
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'New Research Submitted',
    message: 'Jordan submitted TMM-1041 (US Fed Rate Cut in Dec)',
    time: '25 min ago',
    read: false,
    type: 'research'
  },
  {
    id: 'n-2',
    title: 'Capital Allocated',
    message: 'Luis approved $1,500 stake on Chiefs vs 49ers',
    time: '1 hr ago',
    read: false,
    type: 'research'
  },
  {
    id: 'n-3',
    title: 'Task Assigned',
    message: 'New urgent task: Model NFL Week 10 Spread Variance',
    time: '2 hrs ago',
    read: false,
    type: 'task'
  }
];

// ============================================================================
// Main Application Component
// ============================================================================

export default function App() {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [currentUser, setCurrentUser] = useState<UserProfile>(PROFILES[0]);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Business Domain State
  const [researchList, setResearchList] = useState<ResearchItem[]>(INITIAL_RESEARCH);
  const [taskList, setTaskList] = useState<TaskItem[]>(INITIAL_TASKS);
  const [chatChannels, setChatChannels] = useState<Record<string, ChatMessage[]>>(INITIAL_CHATS);
  const [activeChannel, setActiveChannel] = useState<string>('#sports-picks');
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Interactive Filter States
  const [researchFilter, setResearchFilter] = useState<'All' | ResearchStatus>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<'7D' | '30D' | '90D' | 'ALL'>('30D');

  // Modal Dialog States
  const [newSubmissionModalOpen, setNewSubmissionModalOpen] = useState(false);
  const [reviewModalItem, setReviewModalItem] = useState<ResearchItem | null>(null);
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);

  // Mobile Task Column Selector ('Pending' | 'In Progress' | 'Completed')
  const [mobileTaskCol, setMobileTaskCol] = useState<'Pending' | 'In Progress' | 'Completed'>('Pending');

  // Chat Composer Input
  const [chatInput, setChatInput] = useState('');

  // Sizing Input for Modal
  const [investAmountInput, setInvestAmountInput] = useState('');

  // Unread notification count
  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  // Derived Business Metrics
  const metrics = useMemo(() => {
    let totalInvested = 0;
    let totalProfit = 0;
    let wonCount = 0;
    let lostCount = 0;
    let pendingCount = 0;
    let investedCount = 0;

    researchList.forEach(item => {
      if (item.status === 'Won') {
        wonCount++;
        totalInvested += item.actualInvested;
        totalProfit += (item.netProfit || 0);
      } else if (item.status === 'Lost') {
        lostCount++;
        totalInvested += item.actualInvested;
        totalProfit += (item.netProfit || 0);
      } else if (item.status === 'Invested') {
        investedCount++;
        totalInvested += item.actualInvested;
      } else if (item.status === 'Pending') {
        pendingCount++;
      }
    });

    const settledCount = wonCount + lostCount;
    const winRate = settledCount > 0 ? (wonCount / settledCount) * 100 : 0;
    const overallRoi = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

    return {
      totalInvested,
      totalProfit,
      wonCount,
      lostCount,
      settledCount,
      winRate: winRate.toFixed(1),
      overallRoi: overallRoi.toFixed(1),
      pendingCount,
      investedCount,
      totalTheses: researchList.length
    };
  }, [researchList]);

  // Handlers
  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMessage: ChatMessage = {
      id: `c-${Date.now()}`,
      sender: currentUser.name,
      role: currentUser.role,
      initials: currentUser.initials,
      time: 'Just now',
      text: chatInput.trim()
    };

    setChatChannels(prev => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), newMessage]
    }));
    setChatInput('');
  };

  const handleApproveInvestment = (item: ResearchItem, amount: number) => {
    setResearchList(prev => prev.map(r => {
      if (r.id === item.id) {
        return {
          ...r,
          status: 'Invested',
          actualInvested: amount > 0 ? amount : r.suggestedStake
        };
      }
      return r;
    }));
    setReviewModalItem(null);
  };

  const handlePassPick = (item: ResearchItem) => {
    setResearchList(prev => prev.map(r => {
      if (r.id === item.id) {
        return { ...r, status: 'Passed', actualInvested: 0 };
      }
      return r;
    }));
    setReviewModalItem(null);
  };

  const handleSettleOutcome = (item: ResearchItem, outcome: 'Won' | 'Lost', payout: number) => {
    const profit = outcome === 'Won' ? payout - item.actualInvested : -item.actualInvested;
    const roi = item.actualInvested > 0 ? (profit / item.actualInvested) * 100 : 0;

    setResearchList(prev => prev.map(r => {
      if (r.id === item.id) {
        return {
          ...r,
          status: outcome,
          payoutAmount: payout,
          netProfit: profit,
          roi: parseFloat(roi.toFixed(1))
        };
      }
      return r;
    }));
    setReviewModalItem(null);
  };

  const handleMoveTask = (taskId: string, newStatus: 'Pending' | 'In Progress' | 'Completed') => {
    setTaskList(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: newStatus };
      }
      return t;
    }));
  };

  return (
    <div className="app-container">
      {/* ==================================================================
          1. Sidebar Navigation
          ================================================================== */}
      {mobileMenuOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close sidebar backdrop"
        />
      )}
      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-wrapper">
            <img
              src="/logo-full.png"
              alt="TwoManMarkets Logo"
              className="brand-logo-img"
            />
          </div>
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close Sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="sidebar-content">
          {/* Main Navigation Section */}
          <div className="nav-section">
            <span className="nav-section-title">CORE DESK</span>
            <button
              className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
            >
              <LayoutDashboard size={18} />
              <span>Command Center</span>
            </button>

            <button
              className={`nav-link ${activeTab === 'research' ? 'active' : ''}`}
              onClick={() => { setActiveTab('research'); setMobileMenuOpen(false); }}
            >
              <Target size={18} />
              <span>Research & Theses</span>
              {metrics.pendingCount > 0 && (
                <span className="nav-link-badge">{metrics.pendingCount}</span>
              )}
            </button>

            <button
              className={`nav-link ${activeTab === 'tasks' ? 'active' : ''}`}
              onClick={() => { setActiveTab('tasks'); setMobileMenuOpen(false); }}
            >
              <CheckSquare size={18} />
              <span>Task Management</span>
              <span className="nav-link-badge">
                {taskList.filter(t => t.status !== 'Completed').length}
              </span>
            </button>

            <button
              className={`nav-link ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => { setActiveTab('chat'); setMobileMenuOpen(false); }}
            >
              <MessageSquare size={18} />
              <span>Syndicate Chat</span>
            </button>
          </div>

          {/* Intelligence & Analytics Section */}
          <div className="nav-section">
            <span className="nav-section-title">CAPITAL & INTEL</span>
            <button
              className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => { setActiveTab('analytics'); setMobileMenuOpen(false); }}
            >
              <BarChart3 size={18} />
              <span>Portfolio & ROI</span>
            </button>

            <button
              className={`nav-link ${activeTab === 'team' ? 'active' : ''}`}
              onClick={() => { setActiveTab('team'); setMobileMenuOpen(false); }}
            >
              <Users size={18} />
              <span>Staff & Directory</span>
            </button>
          </div>

          {/* Governance & Architecture Section */}
          <div className="nav-section">
            <span className="nav-section-title">GOVERNANCE & BLUEPRINT</span>
            {currentUser.role === 'OWNER' && (
              <button
                className={`nav-link ${activeTab === 'admin' ? 'active' : ''}`}
                onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
              >
                <ShieldCheck size={18} />
                <span>Admin & RBAC Control</span>
              </button>
            )}

            <button
              className={`nav-link ${activeTab === 'blueprint' ? 'active' : ''}`}
              onClick={() => { setActiveTab('blueprint'); setMobileMenuOpen(false); }}
            >
              <Layers size={18} />
              <span>System Architecture</span>
            </button>
          </div>
        </div>

        {/* User Profile Card & Role Indicator */}
        <div className="sidebar-footer">
          <div className="user-profile-card">
            <div className={`user-avatar ${currentUser.avatarClass}`}>
              {currentUser.initials}
            </div>
            <div className="user-info">
              <div className="user-name">{currentUser.name}</div>
              <div className={`user-role-badge ${currentUser.avatarClass}`}>
                {currentUser.role === 'OWNER' ? '👑 CO-OWNER' : '📊 RESEARCHER'}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ==================================================================
          2. Main Content Wrapper
          ================================================================== */}
      <div className="main-wrapper">
        {/* Top Sticky Header */}
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation"
            >
              <Menu size={20} />
            </button>

            <div className="topbar-mobile-brand">
              <img src="/logo-mark.png" alt="TM" className="topbar-mobile-logo" />
              <span className="topbar-mobile-name">TwoManMarkets</span>
            </div>

            <div className="breadcrumbs">
              <span>TwoManMarkets</span>
              <span>/</span>
              <span className="breadcrumb-active">
                {activeTab === 'overview' && 'Command Center'}
                {activeTab === 'research' && 'Prediction Research Portal'}
                {activeTab === 'tasks' && 'Task Operations Board'}
                {activeTab === 'chat' && 'Internal Team Messaging'}
                {activeTab === 'analytics' && 'Portfolio Analytics & ROI'}
                {activeTab === 'team' && 'Syndicate Staff Directory'}
                {activeTab === 'admin' && 'Owner Admin & Permissions'}
                {activeTab === 'blueprint' && 'System Architecture Blueprint'}
              </span>
            </div>

            <div className="market-status-pill">
              <span className="pulsing-dot" />
              <span>LIVE MARKETS</span>
            </div>
          </div>

          <div className="topbar-right">
            {/* Executive Architecture Blueprint Shortcut */}
            <button
              className="blueprint-btn"
              onClick={() => setActiveTab('blueprint')}
              title="Open System Architecture Blueprint"
            >
              <Layers size={15} />
              <span className="blueprint-btn-text">Architecture</span>
            </button>

            {/* Role Switcher (Crucial for Client Review) */}
            <div className="role-switcher-dropdown">
              <button
                className="role-switcher-trigger"
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                aria-label="Switch User Perspective"
              >
                <span className="role-switcher-full">Viewing as: <b>{currentUser.name}</b></span>
                <span className="role-switcher-compact"><b>{currentUser.name.split(' ')[0]}</b></span>
                <span className="role-badge-tag">{currentUser.role}</span>
                <ChevronDown size={13} />
              </button>

              {roleMenuOpen && (
                <div className="role-dropdown-menu">
                  <div className="role-dropdown-header">SWITCH VIEWING PERSPECTIVE</div>
                  {PROFILES.map(profile => (
                    <button
                      key={profile.id}
                      className={`role-dropdown-item ${currentUser.id === profile.id ? 'active' : ''}`}
                      onClick={() => {
                        setCurrentUser(profile);
                        setRoleMenuOpen(false);
                      }}
                    >
                      <div>
                        <strong>{profile.name}</strong>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{profile.title}</div>
                      </div>
                      {currentUser.id === profile.id && <Check size={14} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Drawer Button */}
            <div style={{ position: 'relative' }}>
              <button
                className="icon-action-btn"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="Toggle notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              </button>

              {notificationsOpen && (
                <div className="notification-popover">
                  <div className="popover-header">
                    <h4>Notifications</h4>
                    {unreadCount > 0 && (
                      <button
                        style={{ fontSize: '11px', color: 'var(--emerald)' }}
                        onClick={handleMarkAllNotificationsRead}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="popover-list">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        className={`popover-item ${n.read ? '' : 'unread'}`}
                        onClick={() => {
                          setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
                        }}
                      >
                        <div className="popover-item-icon" style={{ background: 'var(--emerald-soft)', color: 'var(--emerald)' }}>
                          <Target size={15} />
                        </div>
                        <div className="popover-item-body">
                          <strong>{n.title}</strong>
                          <p>{n.message}</p>
                          <time>{n.time}</time>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action: New Research Submission */}
            <button
              className="btn-primary topbar-cta-btn"
              onClick={() => setNewSubmissionModalOpen(true)}
              title="Submit New Market Thesis"
            >
              <Plus size={16} />
              <span className="topbar-cta-text">Submit Pick</span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="page-content">
          {/* Market Ticker Strip */}
          <div className="market-ticker-strip">
            <span className="ticker-label">
              <Activity size={14} /> LIVE MARKETS
            </span>
            <div className="ticker-item">
              <span className="ticker-market">NFL · Chiefs -2.5:</span>
              <span className="ticker-odds">-110 (52.4%)</span>
              <span className="ticker-change up">▲ +5.2% Edge</span>
            </div>
            <div className="ticker-item">
              <span className="ticker-market">Kalshi · Fed Dec Cut:</span>
              <span className="ticker-odds">78¢ (78.0%)</span>
              <span className="ticker-change up">▲ +6.5% Edge</span>
            </div>
            <div className="ticker-item">
              <span className="ticker-market">Polymarket · BTC &gt; $85k:</span>
              <span className="ticker-odds">62¢ (62.0%)</span>
              <span className="ticker-change up">▲ Settled Won</span>
            </div>
            <div className="ticker-item">
              <span className="ticker-market">EPL · Arsenal Clean Sheet:</span>
              <span className="ticker-odds">+145 (40.8%)</span>
              <span className="ticker-change up">▲ +145% ROI</span>
            </div>
          </div>

          {/* ==============================================================
              PAGE 1: COMMAND CENTER (OVERVIEW)
              ============================================================== */}
          {activeTab === 'overview' && (
            <div>
              <div className="page-header">
                <div className="page-title-group">
                  <h1>Welcome back, {currentUser.name}</h1>
                  <p>Syndicate Capital & Research Intelligence Terminal · Real-time operational overview</p>
                </div>
                <div className="header-actions">
                  <button className="btn-secondary" onClick={() => setActiveTab('research')}>
                    <Target size={14} />
                    <span>View Research Pipeline</span>
                  </button>
                  <button className="btn-primary" onClick={() => setNewSubmissionModalOpen(true)}>
                    <Plus size={14} />
                    <span>New Market Thesis</span>
                  </button>
                </div>
              </div>

              {/* Top KPI Metrics Cards */}
              <div className="kpi-grid">
                <div className="kpi-card highlight">
                  <div className="kpi-header">
                    <span className="kpi-title">TOTAL ACTIVE CAPITAL</span>
                    <div className="kpi-icon-wrap" style={{ background: 'var(--emerald-soft)', color: 'var(--emerald)' }}>
                      <DollarSign size={18} />
                    </div>
                  </div>
                  <div className="kpi-value mono">${metrics.totalInvested.toLocaleString()}</div>
                  <div className="kpi-footer">
                    <span className="trend-pill positive">
                      <TrendingUp size={12} /> +18.4%
                    </span>
                    <span className="kpi-subtitle">vs previous 30-day cycle</span>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-header">
                    <span className="kpi-title">SYNDICATE WIN RATE</span>
                    <div className="kpi-icon-wrap" style={{ background: 'var(--quant-violet-bg)', color: 'var(--quant-violet)' }}>
                      <Award size={18} />
                    </div>
                  </div>
                  <div className="kpi-value">{metrics.winRate}%</div>
                  <div className="kpi-footer">
                    <span className="trend-pill positive">
                      <TrendingUp size={12} /> {metrics.wonCount}W — {metrics.lostCount}L
                    </span>
                    <span className="kpi-subtitle">{metrics.settledCount} resolved positions</span>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-header">
                    <span className="kpi-title">NET PROFIT / LOSS</span>
                    <div className="kpi-icon-wrap" style={{ background: 'var(--win-green-bg)', color: 'var(--win-green)' }}>
                      <TrendingUp size={18} />
                    </div>
                  </div>
                  <div className="kpi-value mono" style={{ color: metrics.totalProfit >= 0 ? 'var(--win-green)' : 'var(--loss-red)' }}>
                    {metrics.totalProfit >= 0 ? `+$${metrics.totalProfit.toLocaleString()}` : `-$${Math.abs(metrics.totalProfit).toLocaleString()}`}
                  </div>
                  <div className="kpi-footer">
                    <span className="trend-pill positive">ROI: {metrics.overallRoi}%</span>
                    <span className="kpi-subtitle">across all verified picks</span>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-header">
                    <span className="kpi-title">RESEARCH QUEUE</span>
                    <div className="kpi-icon-wrap" style={{ background: 'var(--info-blue-bg)', color: 'var(--info-blue)' }}>
                      <Target size={18} />
                    </div>
                  </div>
                  <div className="kpi-value">{metrics.pendingCount} Pending</div>
                  <div className="kpi-footer">
                    <span className="trend-pill positive">{metrics.investedCount} Active Bets</span>
                    <span className="kpi-subtitle">{metrics.totalTheses} total submitted</span>
                  </div>
                </div>
              </div>

              {/* Split Grid: Interactive Performance Chart & Position Outcomes */}
              <div className="dashboard-split-grid">
                <div className="panel-card">
                  <div className="panel-head">
                    <div>
                      <h3 className="panel-title">Cumulative Capital Growth & Return Trajectory</h3>
                      <p className="panel-desc">Daily net profit & loss from verified prediction investments</p>
                    </div>
                    <div className="filter-group">
                      {(['7D', '30D', '90D', 'ALL'] as const).map(tf => (
                        <button
                          key={tf}
                          className={`filter-tab-btn ${analyticsTimeframe === tf ? 'active' : ''}`}
                          onClick={() => setAnalyticsTimeframe(tf)}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* High Quality Interactive SVG Chart */}
                  <div className="chart-container">
                    <svg className="chart-svg" viewBox="0 0 700 200" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="emerald-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Grid Lines */}
                      <line x1="0" y1="40" x2="700" y2="40" className="chart-grid-line" />
                      <line x1="0" y1="90" x2="700" y2="90" className="chart-grid-line" />
                      <line x1="0" y1="140" x2="700" y2="140" className="chart-grid-line" />

                      {/* Filled Curve Area */}
                      <path
                        d="M 0,170 C 60,165 110,150 170,140 C 230,130 280,145 340,110 C 400,75 450,95 510,70 C 580,45 640,35 700,20 L 700,200 L 0,200 Z"
                        className="chart-area-fill"
                      />

                      {/* Main Trend Line */}
                      <path
                        d="M 0,170 C 60,165 110,150 170,140 C 230,130 280,145 340,110 C 400,75 450,95 510,70 C 580,45 640,35 700,20"
                        className="chart-line-stroke"
                      />

                      {/* Terminal Point */}
                      <circle cx="700" cy="20" r="4.5" fill="#10b981" stroke="#09090b" strokeWidth="2" />
                    </svg>
                    <div className="chart-axis-labels">
                      <span>Oct 10</span>
                      <span>Oct 18</span>
                      <span>Oct 26</span>
                      <span>Nov 01</span>
                      <span>Nov 08 (Today)</span>
                    </div>
                  </div>
                </div>

                {/* Outcome Breakdown Donut Panel */}
                <div className="panel-card">
                  <div className="panel-head">
                    <div>
                      <h3 className="panel-title">Position Outcomes</h3>
                      <p className="panel-desc">Settled bets hit-rate analysis</p>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--emerald)', fontWeight: 700 }}>
                      PF: 2.38x
                    </span>
                  </div>

                  <div className="donut-card-body">
                    <div
                      className="donut-visual"
                      style={{
                        background: `conic-gradient(
                          var(--win-green) 0% 69.2%,
                          var(--loss-red) 69.2% 100%
                        )`
                      }}
                    >
                      <div className="donut-inner">
                        <span className="donut-stat">{metrics.winRate}%</span>
                        <span className="donut-label">Win Rate</span>
                      </div>
                    </div>

                    <div className="outcome-breakdown-list">
                      <div className="outcome-row">
                        <span className="outcome-indicator">
                          <span className="color-dot won" />
                          <span>Winning Bets</span>
                        </span>
                        <strong style={{ color: 'var(--win-green)' }}>{metrics.wonCount} picks</strong>
                      </div>

                      <div className="outcome-row">
                        <span className="outcome-indicator">
                          <span className="color-dot lost" />
                          <span>Losing Bets</span>
                        </span>
                        <strong style={{ color: 'var(--loss-red)' }}>{metrics.lostCount} picks</strong>
                      </div>

                      <div className="outcome-row">
                        <span className="outcome-indicator">
                          <span className="color-dot pending" />
                          <span>Active / Pending</span>
                        </span>
                        <strong>{metrics.investedCount + metrics.pendingCount} picks</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pinned Syndicate Announcement */}
              <div className="syndicate-announcement-card">
                <div className="announcement-icon-badge">
                  <Sparkles size={20} />
                </div>
                <div className="announcement-body">
                  <div className="announcement-title">Desk Priority Sync · Kalshi & NFL Week 10 Allocations</div>
                  <p className="announcement-text">
                    Owners have deployed capital into TMM-1042 (Chiefs -2.5) and are reviewing TMM-1041.
                    Analysts should review secondary injury releases before 4 PM EST today.
                  </p>
                </div>
                <div className="announcement-meta">Posted by Luis · Today 08:00 AM</div>
              </div>

              {/* Lower Section: Pending Theses Requiring Review */}
              <div className="panel-card">
                <div className="panel-head">
                  <div>
                    <h3 className="panel-title">Pending Research Theses Awaiting Capital Allocation</h3>
                    <p className="panel-desc">Scouted prediction markets requiring owner sizing and decision</p>
                  </div>
                  <button className="btn-secondary" onClick={() => setActiveTab('research')}>
                    <span>View All ({researchList.length})</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div className="table-responsive desktop-only-table">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Market & Platform</th>
                        <th>Category</th>
                        <th>Current Price / Odds</th>
                        <th>Calculated Edge</th>
                        <th>Suggested Stake</th>
                        <th>Scout</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {researchList.slice(0, 4).map(item => (
                        <tr key={item.id}>
                          <td>
                            <span className="table-market-title">{item.market}</span>
                            <span className="table-sub-info">{item.id} · {item.book}</span>
                          </td>
                          <td>
                            <span className="category-chip">{item.category}</span>
                          </td>
                          <td>
                            <span className="odds-chip">{item.odds}</span>
                          </td>
                          <td>
                            <span className="edge-badge">
                              <TrendingUp size={12} /> {item.edge}
                            </span>
                          </td>
                          <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                            ${item.suggestedStake.toLocaleString()}
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <div className="user-avatar staff" style={{ width: 22, height: 22, fontSize: 10 }}>
                                {item.authorInitials}
                              </div>
                              <span style={{ fontSize: '12px' }}>{item.author}</span>
                            </div>
                          </td>
                          <td>
                            <span className={`status-pill ${item.status.toLowerCase()}`}>
                              {item.status}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn-secondary"
                              style={{ padding: '4px 10px', fontSize: '11px' }}
                              onClick={() => {
                                setReviewModalItem(item);
                                setInvestAmountInput(item.suggestedStake.toString());
                              }}
                            >
                              Review & Size
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile & Tablet Card View for Command Center */}
                <div className="mobile-only-cards">
                  {researchList.slice(0, 4).map(item => (
                    <div key={item.id} className="mobile-research-card">
                      <div className="mobile-card-header">
                        <div className="mobile-card-badges">
                          <span className="category-chip">{item.category}</span>
                          <span className="exchange-tag">{item.book}</span>
                        </div>
                        <span className={`status-pill ${item.status.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </div>

                      <h4 className="mobile-card-title">{item.market}</h4>
                      <div className="mobile-card-meta">{item.id} · {item.date}</div>

                      <div className="mobile-metrics-strip">
                        <div className="mobile-metric-item">
                          <span className="metric-lbl">Market Odds</span>
                          <span className="metric-val odds">{item.odds}</span>
                        </div>

                        <div className="mobile-metric-item">
                          <span className="metric-lbl">Calculated Edge</span>
                          <span className="metric-val edge">
                            <TrendingUp size={11} /> {item.edge}
                          </span>
                        </div>

                        <div className="mobile-metric-item">
                          <span className="metric-lbl">Suggested Stake</span>
                          <span className="metric-val stake">${item.suggestedStake.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="mobile-card-footer">
                        <div className="mobile-author-info">
                          <div className="user-avatar staff" style={{ width: 22, height: 22, fontSize: 10 }}>
                            {item.authorInitials}
                          </div>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.author}</span>
                        </div>

                        <button
                          className="btn-secondary mobile-card-btn"
                          onClick={() => {
                            setReviewModalItem(item);
                            setInvestAmountInput(item.suggestedStake.toString());
                          }}
                        >
                          Review &amp; Size
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              PAGE 2: RESEARCH & THESES SUBMISSION PORTAL
              ============================================================== */}
          {activeTab === 'research' && (
            <div>
              <div className="page-header">
                <div className="page-title-group">
                  <h1>Prediction Market Research Portal</h1>
                  <p>Staff analysts scout markets and submit theses; Co-Owners review, size capital, and execute investments.</p>
                </div>
                <div className="header-actions">
                  <button
                    className="btn-primary"
                    onClick={() => setNewSubmissionModalOpen(true)}
                  >
                    <Plus size={16} />
                    <span>New Research Thesis</span>
                  </button>
                </div>
              </div>

              {/* Filter Toolbar */}
              <div className="filter-toolbar">
                <div className="filter-group">
                  {(['All', 'Pending', 'Invested', 'Won', 'Lost', 'Passed'] as const).map(st => (
                    <button
                      key={st}
                      className={`filter-tab-btn ${researchFilter === st ? 'active' : ''}`}
                      onClick={() => setResearchFilter(st)}
                    >
                      {st} ({st === 'All' ? researchList.length : researchList.filter(r => r.status === st).length})
                    </button>
                  ))}
                </div>

                <div className="filter-secondary-group">
                  <div className="filter-group">
                    {['All', 'Sports', 'Macro', 'Crypto', 'Politics'].map(cat => (
                      <button
                        key={cat}
                        className={`filter-tab-btn ${categoryFilter === cat ? 'active' : ''}`}
                        onClick={() => setCategoryFilter(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="search-input-wrap">
                    <Search size={14} style={{ color: 'var(--text-muted)' }} />
                    <input type="text" placeholder="Filter markets or scouts..." />
                  </div>
                </div>
              </div>

              {/* Research List Table (Desktop & Tablet Wide) */}
              <div className="panel-card">
                <div className="table-responsive desktop-only-table">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Market Title</th>
                        <th>Category</th>
                        <th>Exchange / Book</th>
                        <th>Market Odds</th>
                        <th>Internal Edge</th>
                        <th>Proposed Stake</th>
                        <th>Actual Invested</th>
                        <th>Author</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {researchList
                        .filter(r => researchFilter === 'All' || r.status === researchFilter)
                        .filter(r => categoryFilter === 'All' || r.category === categoryFilter)
                        .map(item => (
                          <tr key={item.id}>
                            <td>
                              <span className="table-market-title">{item.market}</span>
                              <span className="table-sub-info">{item.id} · {item.date}</span>
                            </td>
                            <td>
                              <span className="category-chip">{item.category}</span>
                            </td>
                            <td>
                              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.book}</span>
                            </td>
                            <td>
                              <span className="odds-chip">{item.odds}</span>
                            </td>
                            <td>
                              <span className="edge-badge">
                                <TrendingUp size={12} /> {item.edge}
                              </span>
                            </td>
                            <td style={{ fontFamily: 'var(--font-mono)' }}>
                              ${item.suggestedStake.toLocaleString()}
                            </td>
                            <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: item.actualInvested > 0 ? 'var(--emerald)' : 'var(--text-muted)' }}>
                              {item.actualInvested > 0 ? `$${item.actualInvested.toLocaleString()}` : '—'}
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div className="user-avatar staff" style={{ width: 22, height: 22, fontSize: 10 }}>
                                  {item.authorInitials}
                                </div>
                                <span style={{ fontSize: '12px' }}>{item.author}</span>
                              </div>
                            </td>
                            <td>
                              <span className={`status-pill ${item.status.toLowerCase()}`}>
                                {item.status}
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn-secondary"
                                style={{ padding: '5px 12px', fontSize: '11px' }}
                                onClick={() => {
                                  setReviewModalItem(item);
                                  setInvestAmountInput(item.suggestedStake.toString());
                                }}
                              >
                                {currentUser.role === 'OWNER' ? 'Manage' : 'Inspect'}
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile & Tablet Card View (Polymarket / Fintech Mobile UX) */}
                <div className="mobile-only-cards">
                  {researchList
                    .filter(r => researchFilter === 'All' || r.status === researchFilter)
                    .filter(r => categoryFilter === 'All' || r.category === categoryFilter)
                    .map(item => (
                      <div key={item.id} className="mobile-research-card">
                        <div className="mobile-card-header">
                          <div className="mobile-card-badges">
                            <span className="category-chip">{item.category}</span>
                            <span className="exchange-tag">{item.book}</span>
                          </div>
                          <span className={`status-pill ${item.status.toLowerCase()}`}>
                            {item.status}
                          </span>
                        </div>

                        <h4 className="mobile-card-title">{item.market}</h4>
                        <div className="mobile-card-meta">{item.id} · {item.date}</div>

                        <div className="mobile-metrics-strip">
                          <div className="mobile-metric-item">
                            <span className="metric-lbl">Market Odds</span>
                            <span className="metric-val odds">{item.odds}</span>
                          </div>

                          <div className="mobile-metric-item">
                            <span className="metric-lbl">Calculated Edge</span>
                            <span className="metric-val edge">
                              <TrendingUp size={11} /> {item.edge}
                            </span>
                          </div>

                          <div className="mobile-metric-item">
                            <span className="metric-lbl">
                              {item.actualInvested > 0 ? 'Invested' : 'Proposed'}
                            </span>
                            <span className="metric-val stake">
                              ${item.actualInvested > 0 ? item.actualInvested.toLocaleString() : item.suggestedStake.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="mobile-card-footer">
                          <div className="mobile-author-info">
                            <div className="user-avatar staff" style={{ width: 22, height: 22, fontSize: 10 }}>
                              {item.authorInitials}
                            </div>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.author}</span>
                          </div>

                          <button
                            className="btn-secondary mobile-card-btn"
                            onClick={() => {
                              setReviewModalItem(item);
                              setInvestAmountInput(item.suggestedStake.toString());
                            }}
                          >
                            {currentUser.role === 'OWNER' ? 'Manage Capital' : 'Inspect Thesis'}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              PAGE 3: TASK MANAGEMENT BOARD
              ============================================================== */}
          {activeTab === 'tasks' && (
            <div>
              <div className="page-header">
                <div className="page-title-group">
                  <h1>Task Operations & Deliverables Board</h1>
                  <p>Assign responsibilities, research quotas, model audits, and track sprint deadlines.</p>
                </div>
                <div className="header-actions">
                  <button className="btn-primary" onClick={() => setNewTaskModalOpen(true)}>
                    <Plus size={16} />
                    <span>Create Task</span>
                  </button>
                </div>
              </div>

              {/* Mobile Segmented Column Tabs */}
              <div className="mobile-column-tabs">
                {(['Pending', 'In Progress', 'Completed'] as const).map(col => (
                  <button
                    key={col}
                    className={`column-tab-btn ${mobileTaskCol === col ? 'active' : ''}`}
                    onClick={() => setMobileTaskCol(col)}
                  >
                    <span>{col}</span>
                    <span className="tab-counter">
                      {taskList.filter(t => t.status === col).length}
                    </span>
                  </button>
                ))}
              </div>

              {/* Kanban Grid */}
              <div className="kanban-grid">
                {(['Pending', 'In Progress', 'Completed'] as const).map(column => {
                  const tasksInCol = taskList.filter(t => t.status === column);
                  return (
                    <div
                      key={column}
                      className={`kanban-column ${mobileTaskCol === column ? 'mobile-visible-col' : 'mobile-hidden-col'}`}
                    >
                      <div className="kanban-column-header">
                        <div className="column-title-wrap">
                          <span>{column}</span>
                          <span className="column-counter">{tasksInCol.length}</span>
                        </div>
                        <button
                          style={{ color: 'var(--text-muted)' }}
                          onClick={() => setNewTaskModalOpen(true)}
                          aria-label="Add task to column"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {tasksInCol.map(task => (
                        <div key={task.id} className="task-card">
                          <div className="task-card-header">
                            <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                              {task.priority} Priority
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              {task.dueDate}
                            </span>
                          </div>

                          <h4 className="task-title">{task.title}</h4>
                          <p className="task-desc">{task.description}</p>

                          <div className="task-card-footer">
                            <div className="task-assignee">
                              <div className="user-avatar staff" style={{ width: 20, height: 20, fontSize: 9 }}>
                                {task.assigneeInitials}
                              </div>
                              <span>{task.assignee}</span>
                            </div>

                            <div className="task-controls">
                              {column !== 'Pending' && (
                                <button
                                  className="task-move-btn"
                                  onClick={() => handleMoveTask(task.id, column === 'Completed' ? 'In Progress' : 'Pending')}
                                  title="Move Left"
                                >
                                  ◀
                                </button>
                              )}
                              {column !== 'Completed' && (
                                <button
                                  className="task-move-btn"
                                  onClick={() => handleMoveTask(task.id, column === 'Pending' ? 'In Progress' : 'Completed')}
                                  title="Move Right"
                                >
                                  ▶
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==============================================================
              PAGE 4: SYNDICATE CHAT & MESSAGING
              ============================================================== */}
          {activeTab === 'chat' && (
            <div>
              <div className="page-header">
                <div className="page-title-group">
                  <h1>Internal Syndicate Chat & Channels</h1>
                  <p>Real-time channel messaging, private coordination, and broadcasted owner announcements.</p>
                </div>
              </div>

              <div className="chat-container-layout">
                {/* Channels Sidebar */}
                <aside className="chat-sidebar">
                  <div className="chat-sidebar-header">
                    <span>CHANNELS & DMS</span>
                    <button style={{ color: 'var(--text-muted)' }} aria-label="New chat channel">
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="chat-channels-list">
                    <div>
                      <div className="chat-group-title">CHANNELS</div>
                      {['#announcements', '#sports-picks', '#macro-theses', '#general'].map(ch => (
                        <button
                          key={ch}
                          className={`channel-btn ${activeChannel === ch ? 'active' : ''}`}
                          onClick={() => setActiveChannel(ch)}
                        >
                          <MessageSquare size={14} />
                          <span>{ch}</span>
                        </button>
                      ))}
                    </div>

                    <div>
                      <div className="chat-group-title">DIRECT MESSAGES</div>
                      {['Maya Chen', 'Jordan Lee', 'Sam Rivera'].map(name => (
                        <button
                          key={name}
                          className={`channel-btn ${activeChannel === name ? 'active' : ''}`}
                          onClick={() => setActiveChannel(name)}
                        >
                          <div className="user-avatar staff" style={{ width: 18, height: 18, fontSize: 9 }}>
                            {name.split(' ').map(x => x[0]).join('')}
                          </div>
                          <span>{name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </aside>

                {/* Main Active Conversation Window */}
                <div className="chat-main-window">
                  {/* Mobile Channel Quick Switcher */}
                  <div className="mobile-channel-scroller">
                    {['#announcements', '#sports-picks', '#macro-theses', '#general', 'Maya Chen', 'Jordan Lee', 'Sam Rivera'].map(ch => (
                      <button
                        key={ch}
                        className={`mobile-channel-pill ${activeChannel === ch ? 'active' : ''}`}
                        onClick={() => setActiveChannel(ch)}
                      >
                        {ch.startsWith('#') ? <MessageSquare size={12} /> : <Users size={12} />}
                        <span>{ch}</span>
                      </button>
                    ))}
                  </div>

                  <div className="chat-active-header">
                    <div className="channel-info">
                      <h3>{activeChannel}</h3>
                      <p>
                        {activeChannel === '#announcements' && 'Broadcast updates and mandatory desk rules from Owners'}
                        {activeChannel === '#sports-picks' && 'Real-time discussion on sports betting lines & odds'}
                        {activeChannel === '#macro-theses' && 'Kalshi / Polymarket economic & political predictions'}
                        {activeChannel === '#general' && 'General daily syndicate chatter & desk coordination'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                      <span className="pulsing-dot" />
                      <span>3 analysts online</span>
                    </div>
                  </div>

                  <div className="chat-messages-area">
                    {(chatChannels[activeChannel] || []).map(msg => (
                      <div key={msg.id} className="chat-message-row">
                        <div className={`message-avatar ${msg.role === 'OWNER' ? 'owner' : 'staff'}`}>
                          {msg.initials}
                        </div>
                        <div className="message-body">
                          <div className="message-meta">
                            <span className="message-author">{msg.sender}</span>
                            <span className="message-author-badge">
                              {msg.role === 'OWNER' ? 'CO-OWNER' : 'ANALYST'}
                            </span>
                            <span className="message-time">{msg.time}</span>
                          </div>
                          <div className="message-text">{msg.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form className="chat-composer-wrap" onSubmit={handleSendChatMessage}>
                    <input
                      type="text"
                      className="composer-input"
                      placeholder={`Message ${activeChannel}... (Press Enter to send)`}
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                    />
                    <button type="submit" className="btn-primary" style={{ padding: '8px 14px' }}>
                      <Send size={15} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              PAGE 5: ANALYTICS & LEADERBOARD
              ============================================================== */}
          {activeTab === 'analytics' && (
            <div>
              <div className="page-header">
                <div className="page-title-group">
                  <h1>Syndicate Portfolio Analytics & ROI</h1>
                  <p>Historical capital performance, market category win-rates, and analyst hit-rate leaderboard.</p>
                </div>
                <div className="filter-group">
                  {(['7D', '30D', '90D', 'ALL'] as const).map(tf => (
                    <button
                      key={tf}
                      className={`filter-tab-btn ${analyticsTimeframe === tf ? 'active' : ''}`}
                      onClick={() => setAnalyticsTimeframe(tf)}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Analytics Metrics */}
              <div className="kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-header">
                    <span className="kpi-title">TOTAL INVESTED CAPITAL</span>
                    <DollarSign size={18} style={{ color: 'var(--emerald)' }} />
                  </div>
                  <div className="kpi-value mono">${metrics.totalInvested.toLocaleString()}</div>
                  <div className="kpi-footer">
                    <span className="trend-pill positive">+24.5%</span>
                    <span className="kpi-subtitle">active capital deployed</span>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-header">
                    <span className="kpi-title">CUMULATIVE NET PROFIT</span>
                    <TrendingUp size={18} style={{ color: 'var(--win-green)' }} />
                  </div>
                  <div className="kpi-value mono" style={{ color: 'var(--win-green)' }}>
                    +${metrics.totalProfit.toLocaleString()}
                  </div>
                  <div className="kpi-footer">
                    <span className="trend-pill positive">ROI: {metrics.overallRoi}%</span>
                    <span className="kpi-subtitle">on closed positions</span>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-header">
                    <span className="kpi-title">PROFIT FACTOR</span>
                    <Award size={18} style={{ color: 'var(--quant-violet)' }} />
                  </div>
                  <div className="kpi-value">2.38x</div>
                  <div className="kpi-footer">
                    <span className="trend-pill positive">Sharpe: 1.84</span>
                    <span className="kpi-subtitle">risk-adjusted return</span>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-header">
                    <span className="kpi-title">AVERAGE VALUE EDGE</span>
                    <Activity size={18} style={{ color: 'var(--info-blue)' }} />
                  </div>
                  <div className="kpi-value">+5.4%</div>
                  <div className="kpi-footer">
                    <span className="trend-pill positive">Kelly Sized</span>
                    <span className="kpi-subtitle">above market implied odds</span>
                  </div>
                </div>
              </div>

              {/* Analyst Leaderboard Table */}
              <div className="panel-card" style={{ marginBottom: '24px' }}>
                <div className="panel-head">
                  <div>
                    <h3 className="panel-title">Analyst Performance Leaderboard</h3>
                    <p className="panel-desc">Individual research track record, hit rates, and net alpha generated</p>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--emerald)', fontWeight: 600 }}>
                    🏆 Evaluated Monthly
                  </span>
                </div>

                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Scout / Analyst</th>
                        <th>Role Focus</th>
                        <th>Hit Rate (%)</th>
                        <th>Total Theses</th>
                        <th>Net Profit Generated</th>
                        <th>Average Edge</th>
                        <th>Current Streak</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ fontWeight: 800, color: 'var(--emerald)' }}>#1</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="user-avatar staff" style={{ width: 24, height: 24, fontSize: 10 }}>MC</div>
                            <strong>Maya Chen</strong>
                          </div>
                        </td>
                        <td><span className="category-chip">Sports (NFL / NBA / EPL)</span></td>
                        <td style={{ fontWeight: 700, color: 'var(--win-green)' }}>75.0%</td>
                        <td>16 picks</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--win-green)' }}>+$4,220</td>
                        <td>+5.8%</td>
                        <td><span className="status-pill won">🔥 4 Wins</span></td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 800, color: 'var(--text-secondary)' }}>#2</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="user-avatar staff" style={{ width: 24, height: 24, fontSize: 10 }}>JL</div>
                            <strong>Jordan Lee</strong>
                          </div>
                        </td>
                        <td><span className="category-chip">Macro & Fed Rates</span></td>
                        <td style={{ fontWeight: 700, color: 'var(--win-green)' }}>66.7%</td>
                        <td>12 picks</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--win-green)' }}>+$2,840</td>
                        <td>+6.2%</td>
                        <td><span className="status-pill won">2 Wins</span></td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 800, color: 'var(--text-muted)' }}>#3</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="user-avatar staff" style={{ width: 24, height: 24, fontSize: 10 }}>SR</div>
                            <strong>Sam Rivera</strong>
                          </div>
                        </td>
                        <td><span className="category-chip">Crypto & Kalshi Events</span></td>
                        <td style={{ fontWeight: 700, color: 'var(--win-green)' }}>62.5%</td>
                        <td>8 picks</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--win-green)' }}>+$1,980</td>
                        <td>+4.9%</td>
                        <td><span className="status-pill won">1 Win</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              PAGE 6: STAFF DIRECTORY
              ============================================================== */}
          {activeTab === 'team' && (
            <div>
              <div className="page-header">
                <div className="page-title-group">
                  <h1>Syndicate Team & Staff Directory</h1>
                  <p>Registered staff accounts, responsibilities, performance metrics, and account status.</p>
                </div>
                {currentUser.role === 'OWNER' && (
                  <div className="header-actions">
                    <button className="btn-primary" onClick={() => setAddMemberModalOpen(true)}>
                      <Plus size={16} />
                      <span>Invite Team Member</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="panel-card">
                <div className="table-responsive desktop-only-table">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Member Name</th>
                        <th>Role & Access Level</th>
                        <th>Title / Focus</th>
                        <th>Theses Logged</th>
                        <th>Tasks Completed</th>
                        <th>Account Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PROFILES.map(p => (
                        <tr key={p.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div className={`user-avatar ${p.avatarClass}`}>
                                {p.initials}
                              </div>
                              <div>
                                <strong>{p.name}</strong>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {p.id}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`status-pill ${p.role === 'OWNER' ? 'won' : 'invested'}`}>
                              {p.role === 'OWNER' ? '👑 CO-OWNER (ADMIN)' : '📊 STAFF RESEARCHER'}
                            </span>
                          </td>
                          <td style={{ color: 'var(--text-secondary)' }}>{p.title}</td>
                          <td>{p.role === 'OWNER' ? '— (Capital Allocator)' : '14 Submissions'}</td>
                          <td>{p.role === 'OWNER' ? '—' : '11 / 13 Tasks (85%)'}</td>
                          <td>
                            <span className="status-pill won">● Active</span>
                          </td>
                          <td>
                            {currentUser.role === 'OWNER' ? (
                              <button
                                className="btn-secondary"
                                style={{ padding: '4px 10px', fontSize: '11px' }}
                                onClick={() => setActiveTab('admin')}
                              >
                                Manage Access
                              </button>
                            ) : (
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Read only</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards View for Staff & Directory */}
                <div className="mobile-only-cards">
                  {PROFILES.map(p => (
                    <div key={p.id} className="mobile-research-card">
                      <div className="mobile-card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className={`user-avatar ${p.avatarClass}`}>
                            {p.initials}
                          </div>
                          <div>
                            <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{p.name}</strong>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {p.id}</div>
                          </div>
                        </div>
                        <span className={`status-pill ${p.role === 'OWNER' ? 'won' : 'invested'}`}>
                          {p.role === 'OWNER' ? '👑 CO-OWNER' : '📊 RESEARCHER'}
                        </span>
                      </div>

                      <div className="mobile-metrics-strip">
                        <div className="mobile-metric-item">
                          <span className="metric-lbl">Role / Title</span>
                          <span className="metric-val" style={{ fontSize: '11px' }}>{p.title}</span>
                        </div>
                        <div className="mobile-metric-item">
                          <span className="metric-lbl">Theses</span>
                          <span className="metric-val" style={{ fontSize: '11px' }}>{p.role === 'OWNER' ? 'Allocator' : '14 Logged'}</span>
                        </div>
                        <div className="mobile-metric-item">
                          <span className="metric-lbl">Tasks</span>
                          <span className="metric-val" style={{ fontSize: '11px' }}>{p.role === 'OWNER' ? 'Admin' : '85% Done'}</span>
                        </div>
                      </div>

                      <div className="mobile-card-footer">
                        <span className="status-pill won">● Active Account</span>
                        {currentUser.role === 'OWNER' ? (
                          <button
                            className="btn-secondary mobile-card-btn"
                            onClick={() => setActiveTab('admin')}
                          >
                            Manage Access
                          </button>
                        ) : (
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Read only</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              PAGE 7: OWNER ADMIN CONTROL PANEL
              ============================================================== */}
          {activeTab === 'admin' && currentUser.role === 'OWNER' && (
            <div>
              <div className="page-header">
                <div className="page-title-group">
                  <h1>Co-Owner Master Control Panel</h1>
                  <p>Full control over employee accounts, RBAC permissions, company announcements, and security audit logs.</p>
                </div>
                <div className="header-actions">
                  <button className="btn-primary" onClick={() => setAddMemberModalOpen(true)}>
                    <Plus size={16} />
                    <span>Add Staff Account</span>
                  </button>
                </div>
              </div>

              {/* RBAC Permission Matrix */}
              <div className="panel-card" style={{ marginBottom: '24px' }}>
                <div className="panel-head">
                  <div>
                    <h3 className="panel-title">Role-Based Access Control (RBAC) Matrix</h3>
                    <p className="panel-desc">Strict security separation between Co-Owners and Staff Researchers</p>
                  </div>
                  <span className="status-pill won">
                    <ShieldCheck size={14} /> Security Active
                  </span>
                </div>

                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>System Capability</th>
                        <th>Two Co-Owners (Master Admin)</th>
                        <th>Staff / Researchers</th>
                        <th>Security Enforcement</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Review & Allocate Capital ($ Sizing)</strong></td>
                        <td style={{ color: 'var(--win-green)', fontWeight: 700 }}>✓ FULL ACCESS</td>
                        <td style={{ color: 'var(--loss-red)', fontWeight: 600 }}>✕ RESTRICTED (Hidden)</td>
                        <td>Server-side RBAC Guard</td>
                      </tr>
                      <tr>
                        <td><strong>Create, Deactivate & Delete Staff Accounts</strong></td>
                        <td style={{ color: 'var(--win-green)', fontWeight: 700 }}>✓ FULL ACCESS</td>
                        <td style={{ color: 'var(--loss-red)', fontWeight: 600 }}>✕ RESTRICTED</td>
                        <td>Master Key Signature</td>
                      </tr>
                      <tr>
                        <td><strong>Firm-Wide Financial P&L & Balance</strong></td>
                        <td style={{ color: 'var(--win-green)', fontWeight: 700 }}>✓ FULL ACCESS</td>
                        <td style={{ color: 'var(--loss-red)', fontWeight: 600 }}>✕ Personal Alpha Only</td>
                        <td>Isolated Ledger View</td>
                      </tr>
                      <tr>
                        <td><strong>Submit Prediction Market Research Theses</strong></td>
                        <td style={{ color: 'var(--win-green)', fontWeight: 700 }}>✓ ALLOWED</td>
                        <td style={{ color: 'var(--win-green)', fontWeight: 700 }}>✓ CORE RESPONSIBILITY</td>
                        <td>Submission Pipeline</td>
                      </tr>
                      <tr>
                        <td><strong>Post Company Announcements</strong></td>
                        <td style={{ color: 'var(--win-green)', fontWeight: 700 }}>✓ BROADCAST ACCESS</td>
                        <td style={{ color: 'var(--text-muted)' }}>View & React Only</td>
                        <td>Channel Admin Guard</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Security Audit Log */}
              <div className="panel-card">
                <div className="panel-head">
                  <div>
                    <h3 className="panel-title">Real-Time Security Audit Log</h3>
                    <p className="panel-desc">Cryptographically verifiable record of administrative actions</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--emerald)' }} />
                      <span><b>Luis (Co-Owner)</b> sized and deployed $1,500 into TMM-1042 (Chiefs -2.5)</span>
                    </div>
                    <time style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Today 10:20 AM</time>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--emerald)' }} />
                      <span><b>Jordan Lee</b> submitted research thesis TMM-1041 (US Fed Rate Cut in Dec)</span>
                    </div>
                    <time style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Today 08:30 AM</time>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <ShieldCheck size={16} style={{ color: 'var(--info-blue)' }} />
                      <span><b>Alex (Co-Owner)</b> updated permissions for Sports Quantitative Desk</span>
                    </div>
                    <time style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Yesterday 04:15 PM</time>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              PAGE 8: SYSTEM ARCHITECTURE & TECHNICAL BLUEPRINT (EXECUTIVE VIEW)
              ============================================================== */}
          {activeTab === 'blueprint' && (
            <div>
              <div className="page-header">
                <div className="page-title-group">
                  <h1>TwoManMarkets — Executive Architecture Blueprint</h1>
                  <p>Comprehensive operating architecture, security isolation framework, and capital execution pipeline.</p>
                </div>
                <div className="status-pill won">
                  <ShieldCheck size={14} /> Verified Architecture
                </div>
              </div>

              <div className="blueprint-grid">
                {/* 1. The 3-Tier Operating Pipeline */}
                <div className="blueprint-card">
                  <div className="blueprint-card-header">
                    <span className="blueprint-step-num">1</span>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
                        The 3-Tier Syndication Operating Flow
                      </h3>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                        How research moves safely from employee scouts to owner capital allocation
                      </p>
                    </div>
                  </div>

                  <div className="blueprint-flow-diagram">
                    <div className="flow-step-box">
                      <h4>TIER 1: RESEARCH SCOUTS</h4>
                      <p>
                        Employees identify high-conviction lines on Polymarket, Kalshi, or sportsbooks.
                        They input Market Name, Current Odds, Implied Probability, Calculated Edge, and Thesis Link.
                      </p>
                    </div>

                    <div className="flow-step-box active">
                      <h4>TIER 2: OWNERS CAPITAL ENGINE</h4>
                      <p>
                        The two Co-Owners (Luis & Partner) receive instant in-app alerts.
                        Owners independently size positions, approve exact investment amounts ($), or pass with notes.
                      </p>
                    </div>

                    <div className="flow-step-box">
                      <h4>TIER 3: LEDGER & P&amp;L SETTLEMENT</h4>
                      <p>
                        Once markets resolve, outcomes (Won/Lost/Push) are logged with payouts.
                        Automated ledger computes firm-wide ROI, net profit, and analyst leaderboard metrics.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Security & Bankroll Privacy Model */}
                <div className="blueprint-card">
                  <div className="blueprint-card-header">
                    <span className="blueprint-step-num">2</span>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
                        Enterprise Security & Data Privacy Isolation
                      </h3>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                        Strict zero-trust boundaries protecting firm financial balances
                      </p>
                    </div>
                  </div>

                  <div className="tech-spec-grid">
                    <div className="tech-spec-item">
                      <strong>🔒 Bankroll Privacy</strong>
                      <span>Staff can never see the syndicate's total balance or other analysts' allocations unless permitted.</span>
                    </div>

                    <div className="tech-spec-item">
                      <strong>🔑 Dual-Owner Governance</strong>
                      <span>Only the 2 master admin accounts hold keys to create/edit staff, assign permissions, or execute payouts.</span>
                    </div>

                    <div className="tech-spec-item">
                      <strong>⚡ 100% In-App Notifications</strong>
                      <span>Zero dependency on third-party webhooks. Clean, instant notification center with unread counters.</span>
                    </div>

                    <div className="tech-spec-item">
                      <strong>🛡️ Row-Level Database Security</strong>
                      <span>PostgreSQL database tables protected by cryptographic user session tokens and role guards.</span>
                    </div>
                  </div>
                </div>

                {/* 3. Production Technology Stack */}
                <div className="blueprint-card">
                  <div className="blueprint-card-header">
                    <span className="blueprint-step-num">3</span>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
                        Production Tech Stack (Built for 60fps &amp; Reliability)
                      </h3>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                        Modern, proven software engineering stack deployed globally
                      </p>
                    </div>
                  </div>

                  <div className="tech-spec-grid">
                    <div className="tech-spec-item">
                      <strong>Frontend &amp; UI</strong>
                      <span>React 19 / TypeScript with Obsidian &amp; Natural Emerald theme. Fully responsive across desktop, tablet, and mobile.</span>
                    </div>

                    <div className="tech-spec-item">
                      <strong>Database &amp; Storage</strong>
                      <span>PostgreSQL on Neon/Supabase with Prisma ORM. Fully ACID-compliant for financial accuracy.</span>
                    </div>

                    <div className="tech-spec-item">
                      <strong>Real-Time Messaging</strong>
                      <span>WebSocket event bus powering instant chat feeds, odds alerts, and task updates without page reload.</span>
                    </div>

                    <div className="tech-spec-item">
                      <strong>Hosting &amp; Edge</strong>
                      <span>Vercel Global Edge CDN with SSL encryption, DDoS mitigation, and 99.99% availability.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ==================================================================
          3. Modals & Interactive Popups
          ================================================================== */}

      {/* MODAL 1: Submit New Research Thesis */}
      {newSubmissionModalOpen && (
        <div className="modal-backdrop" onClick={() => setNewSubmissionModalOpen(false)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Submit Prediction Market Research Thesis</h3>
              <button
                className="modal-close-btn"
                onClick={() => setNewSubmissionModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form
              className="modal-body"
              onSubmit={e => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const title = formData.get('market') as string;
                const cat = (formData.get('category') as any) || 'Sports';
                const book = (formData.get('book') as string) || 'Polymarket';
                const odds = (formData.get('odds') as string) || '-110';
                const edge = (formData.get('edge') as string) || '+4.5%';
                const stake = Number(formData.get('stake')) || 1000;
                const thesis = (formData.get('thesis') as string) || '';
                const source = (formData.get('source') as string) || 'https://polymarket.com';

                const newItem: ResearchItem = {
                  id: `TMM-${1043 + researchList.length}`,
                  market: title,
                  category: cat,
                  book,
                  odds,
                  impliedProb: '50%',
                  edge,
                  suggestedStake: stake,
                  actualInvested: 0,
                  author: currentUser.name,
                  authorInitials: currentUser.initials,
                  date: 'Just now',
                  status: 'Pending',
                  thesis,
                  sourceUrl: source
                };

                setResearchList([newItem, ...researchList]);
                setNewSubmissionModalOpen(false);
              }}
            >
              <div className="form-group">
                <label className="form-label">Market or Event Title *</label>
                <input
                  name="market"
                  required
                  className="form-input"
                  placeholder="e.g. Chiefs vs Ravens (Spread -3.0) or Fed Rate Cut in Dec"
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select name="category" className="form-select">
                    <option value="Sports">Sports (NFL, NBA, EPL, Tennis)</option>
                    <option value="Macro">Macro (Fed, Inflation, CPI)</option>
                    <option value="Crypto">Crypto (BTC, ETH, Altcoins)</option>
                    <option value="Politics">Politics / Kalshi Events</option>
                    <option value="Other">Other Prediction Contract</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Platform / Sportsbook</label>
                  <input
                    name="book"
                    className="form-input"
                    placeholder="e.g. Polymarket, Kalshi, Pinnacle, DraftKings"
                    defaultValue="Polymarket"
                  />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Current Quoted Odds</label>
                  <input
                    name="odds"
                    className="form-input"
                    placeholder="e.g. -110 or 68¢"
                    defaultValue="-110 (52.4%)"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Calculated Edge (%)</label>
                  <input
                    name="edge"
                    className="form-input"
                    placeholder="e.g. +5.2%"
                    defaultValue="+4.8%"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Suggested Stake ($)</label>
                  <input
                    name="stake"
                    type="number"
                    className="form-input"
                    placeholder="1500"
                    defaultValue="1500"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Research Thesis &amp; Model Rationale *</label>
                <textarea
                  name="thesis"
                  required
                  rows={4}
                  className="form-textarea"
                  placeholder="Explain why the market price is incorrect, key catalysts, and model invalidation levels..."
                  defaultValue="Power rating discrepancy based on post-bye injury recovery. Market is underpricing recent defensive efficiency metrics."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Source Link or Market URL</label>
                <input
                  name="source"
                  className="form-input"
                  placeholder="https://polymarket.com/..."
                  defaultValue="https://polymarket.com/market/sample"
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setNewSubmissionModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Plus size={16} />
                  <span>Submit Thesis for Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Owner Review & Capital Allocation Modal */}
      {reviewModalItem && (
        <div className="modal-backdrop" onClick={() => setReviewModalItem(null)}>
          <div className="modal-dialog large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span style={{ fontSize: '11px', color: 'var(--emerald)', fontWeight: 700 }}>
                  {reviewModalItem.id} · {reviewModalItem.category}
                </span>
                <h3 className="modal-title" style={{ marginTop: '4px' }}>
                  {reviewModalItem.market}
                </h3>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setReviewModalItem(null)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {/* Metrics Header */}
              <div className="form-grid-3">
                <div style={{ background: 'var(--bg-card-subtle)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Current Odds</span>
                  <div style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{reviewModalItem.odds}</div>
                </div>

                <div style={{ background: 'var(--bg-card-subtle)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Internal Edge</span>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--win-green)' }}>{reviewModalItem.edge}</div>
                </div>

                <div style={{ background: 'var(--bg-card-subtle)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Proposed Stake</span>
                  <div style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>${reviewModalItem.suggestedStake.toLocaleString()}</div>
                </div>
              </div>

              {/* Research Thesis Details */}
              <div className="form-group">
                <label className="form-label">Research Thesis &amp; Analysis</label>
                <div style={{ background: 'var(--bg-card-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                  {reviewModalItem.thesis}
                </div>
              </div>

              {/* Source Link */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                  <ExternalLink size={14} style={{ color: 'var(--emerald)' }} />
                  <span>Market Link: <a href={reviewModalItem.sourceUrl} target="_blank" rel="noreferrer">{reviewModalItem.sourceUrl}</a></span>
                </div>
                <span className="status-pill invested">{reviewModalItem.book}</span>
              </div>

              {/* Capital Allocation & Outcome Controls */}
              {currentUser.role === 'OWNER' ? (
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text-primary)' }}>Co-Owner Capital Decision</h4>
                    <span style={{ fontSize: '11px', color: 'var(--emerald)', fontWeight: 600 }}>Active Role: {currentUser.name}</span>
                  </div>

                  {reviewModalItem.status === 'Pending' && (
                    <div className="modal-actions-row">
                      <div style={{ flex: 1, width: '100%' }}>
                        <label className="form-label">Actual Invested Stake ($)</label>
                        <input
                          type="number"
                          className="form-input"
                          value={investAmountInput}
                          onChange={e => setInvestAmountInput(e.target.value)}
                          placeholder="e.g. 1500"
                        />
                      </div>
                      <div className="modal-action-buttons">
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => handlePassPick(reviewModalItem)}
                        >
                          Pass Pick
                        </button>
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={() => handleApproveInvestment(reviewModalItem, Number(investAmountInput))}
                        >
                          <Check size={16} />
                          <span>Approve &amp; Capitalize (${investAmountInput})</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {reviewModalItem.status === 'Invested' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        Position is currently active with <b>${reviewModalItem.actualInvested.toLocaleString()}</b> deployed. When market settles:
                      </div>
                      <div className="modal-settle-buttons">
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={() => {
                            const payout = Math.round(reviewModalItem.actualInvested * 1.91);
                            handleSettleOutcome(reviewModalItem, 'Won', payout);
                          }}
                        >
                          <CheckCircle2 size={16} />
                          <span>Mark Settle WON (+$1,365 P&amp;L)</span>
                        </button>

                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ borderColor: 'var(--loss-red)', color: 'var(--loss-red)' }}
                          onClick={() => handleSettleOutcome(reviewModalItem, 'Lost', 0)}
                        >
                          <XCircle size={16} />
                          <span>Mark Settle LOST</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {(reviewModalItem.status === 'Won' || reviewModalItem.status === 'Lost') && (
                    <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: reviewModalItem.status === 'Won' ? 'var(--win-green-bg)' : 'var(--loss-red-bg)', border: `1px solid ${reviewModalItem.status === 'Won' ? 'var(--win-green-border)' : 'var(--loss-red-border)'}` }}>
                      <strong>Position Settled as {reviewModalItem.status}</strong>
                      <div style={{ fontSize: '12px', marginTop: '4px' }}>
                        Net P&amp;L: {reviewModalItem.netProfit && reviewModalItem.netProfit >= 0 ? `+$${reviewModalItem.netProfit}` : `-$${Math.abs(reviewModalItem.netProfit || 0)}`} · ROI: {reviewModalItem.roi}%
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-card-subtle)', border: '1px solid var(--border-subtle)', fontSize: '12px', color: 'var(--text-muted)' }}>
                  🔒 Capital allocation &amp; settlement buttons are restricted to Co-Owner accounts. (Switch to Luis profile in the top-right to test decision controls).
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setReviewModalItem(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Create Task Modal */}
      {newTaskModalOpen && (
        <div className="modal-backdrop" onClick={() => setNewTaskModalOpen(false)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create &amp; Assign Operations Task</h3>
              <button className="modal-close-btn" onClick={() => setNewTaskModalOpen(false)} aria-label="Close modal">
                <X size={18} />
              </button>
            </div>

            <form
              className="modal-body"
              onSubmit={e => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const title = formData.get('title') as string;
                const desc = formData.get('desc') as string;
                const assignee = formData.get('assignee') as string;
                const priority = (formData.get('priority') as any) || 'Medium';

                const newTask: TaskItem = {
                  id: `task-${Date.now()}`,
                  title,
                  description: desc,
                  assignee,
                  assigneeInitials: assignee.split(' ').map(x => x[0]).join(''),
                  dueDate: 'Due Friday',
                  priority,
                  status: 'Pending'
                };

                setTaskList([...taskList, newTask]);
                setNewTaskModalOpen(false);
              }}
            >
              <div className="form-group">
                <label className="form-label">Task Title *</label>
                <input
                  name="title"
                  required
                  className="form-input"
                  placeholder="e.g. Audit Kalshi Q4 Inflation Contracts"
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Assignee</label>
                  <select name="assignee" className="form-select">
                    <option value="Maya Chen">Maya Chen (Sports Quant)</option>
                    <option value="Jordan Lee">Jordan Lee (Senior Analyst)</option>
                    <option value="Sam Rivera">Sam Rivera (Macro Scout)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Priority Level</label>
                  <select name="priority" className="form-select">
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description &amp; Deliverable Requirements</label>
                <textarea
                  name="desc"
                  rows={3}
                  className="form-textarea"
                  placeholder="Specific requirements, dataset links, and expected completion criteria..."
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setNewTaskModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Check size={16} />
                  <span>Assign Task</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Invite Team Member Modal */}
      {addMemberModalOpen && (
        <div className="modal-backdrop" onClick={() => setAddMemberModalOpen(false)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Invite Team Member to Syndicate</h3>
              <button className="modal-close-btn" onClick={() => setAddMemberModalOpen(false)} aria-label="Close modal">
                <X size={18} />
              </button>
            </div>

            <form
              className="modal-body"
              onSubmit={e => {
                e.preventDefault();
                alert('Staff account invited with customized role-based permissions.');
                setAddMemberModalOpen(false);
              }}
            >
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input required className="form-input" placeholder="e.g. Taylor Brooks" />
                </div>
                <div className="form-group">
                  <label className="form-label">Unique Username *</label>
                  <input required className="form-input" placeholder="e.g. tbrooks" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Corporate / Personal Email *</label>
                <input required type="email" className="form-input" placeholder="taylor@twomanmarkets.internal" />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Role Tier</label>
                  <select className="form-select">
                    <option value="STAFF">Staff / Prediction Analyst</option>
                    <option value="OWNER">Co-Owner / Admin</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Focus Area</label>
                  <select className="form-select">
                    <option>Sports Quantitative Modeling</option>
                    <option>Macro &amp; Interest Rates</option>
                    <option>Crypto Liquidity Scout</option>
                    <option>General Research Analyst</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setAddMemberModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Plus size={16} />
                  <span>Send Credentials &amp; Provision</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
