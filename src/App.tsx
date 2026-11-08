import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Target,
  CheckSquare,
  MessageSquare,
  BarChart3,
  Users,
  ShieldCheck,
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
  Menu,
  X,
  Check,
  Award,
  ChevronRight,
  ChevronLeft,
  Crown,
  Lock,
  Key,
  Radio,
  Flame,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Download,
  AlertCircle,
  Calendar,
  ShieldAlert
} from 'lucide-react';

// ============================================================================
// Types & Domain Models
// ============================================================================

export type Role = 'OWNER' | 'STAFF';

export interface StaffPermissions {
  canSubmitResearch: boolean;
  canAllocateCapital: boolean;
  canManageTasks: boolean;
  canViewAnalytics: boolean;
  canPostAnnouncements: boolean;
  canManageStaff: boolean;
}

export interface StaffMember {
  id: string;
  username: string;
  name: string;
  email: string;
  role: Role;
  title: string;
  initials: string;
  avatarClass: string;
  status: 'Active' | 'Inactive';
  joinedDate: string;
  lastActive: string;
  responsibilities: string[];
  permissions: StaffPermissions;
  metrics: {
    winRate: number;
    thesesCount: number;
    netProfit: number;
    tasksCompleted: number;
    tasksTotal: number;
    streak: string;
    avgEdge: string;
  };
}

export type TabType = 'overview' | 'research' | 'tasks' | 'chat' | 'analytics' | 'team' | 'admin';

export type ResearchStatus = 'Pending' | 'Invested' | 'Won' | 'Lost' | 'Passed';

export interface ResearchItem {
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

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  assignee: string;
  assigneeInitials: string;
  dueDate: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
}

export interface ChatMessage {
  id: string;
  sender: string;
  role: Role;
  initials: string;
  time: string;
  text: string;
  isAnnouncement?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'research' | 'task' | 'announcement';
}

export interface AuditLogItem {
  id: string;
  actor: string;
  actorRole: Role;
  action: string;
  category: 'AUTH' | 'STAFF' | 'CAPITAL' | 'TASK' | 'ANNOUNCEMENT';
  timestamp: string;
}

export interface DeskAnnouncement {
  title: string;
  body: string;
  author: string;
  postedAt: string;
  priority: 'Normal' | 'Urgent';
}

// ============================================================================
// Initial Mock Data
// ============================================================================

const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'u-1',
    username: 'luis',
    name: 'Luis',
    email: 'luis@twomanmarkets.internal',
    role: 'OWNER',
    initials: 'LB',
    title: 'Co-Owner · Head of Capital Allocation',
    avatarClass: 'owner',
    status: 'Active',
    joinedDate: 'Jan 2026',
    lastActive: 'Just now',
    responsibilities: [
      'Firm capital allocation & position sizing',
      'Strategic bankroll & portfolio risk guardrails',
      'Executive decisions & bookmaker credit limits',
      'Firm performance attribution & settlement approval'
    ],
    permissions: {
      canSubmitResearch: true,
      canAllocateCapital: true,
      canManageTasks: true,
      canViewAnalytics: true,
      canPostAnnouncements: true,
      canManageStaff: true
    },
    metrics: {
      winRate: 72.5,
      thesesCount: 38,
      netProfit: 14200,
      tasksCompleted: 24,
      tasksTotal: 25,
      streak: '5 Wins',
      avgEdge: '+6.1%'
    }
  },
  {
    id: 'u-2',
    username: 'alex',
    name: 'Alex (Partner)',
    email: 'alex@twomanmarkets.internal',
    role: 'OWNER',
    initials: 'AM',
    title: 'Co-Owner · Quantitative Strategy & Risk',
    avatarClass: 'owner',
    status: 'Active',
    joinedDate: 'Jan 2026',
    lastActive: '15m ago',
    responsibilities: [
      'Quantitative modeling & pricing algorithms',
      'Exchange & prediction market orderbook depth',
      'Staff account administration & security governance',
      'Econometric backtesting & Kelly sizing formula'
    ],
    permissions: {
      canSubmitResearch: true,
      canAllocateCapital: true,
      canManageTasks: true,
      canViewAnalytics: true,
      canPostAnnouncements: true,
      canManageStaff: true
    },
    metrics: {
      winRate: 70.0,
      thesesCount: 29,
      netProfit: 9800,
      tasksCompleted: 19,
      tasksTotal: 20,
      streak: '3 Wins',
      avgEdge: '+5.4%'
    }
  },
  {
    id: 'u-3',
    username: 'mchen',
    name: 'Maya Chen',
    email: 'maya@twomanmarkets.internal',
    role: 'STAFF',
    initials: 'MC',
    title: 'Sports Quantitative Analyst',
    avatarClass: 'staff',
    status: 'Active',
    joinedDate: 'Mar 2026',
    lastActive: '4m ago',
    responsibilities: [
      'NFL spread variance & injury report modeling',
      'NBA pace factor & team total algorithms',
      'European soccer exchange mispricing detection'
    ],
    permissions: {
      canSubmitResearch: true,
      canAllocateCapital: false,
      canManageTasks: true,
      canViewAnalytics: true,
      canPostAnnouncements: false,
      canManageStaff: false
    },
    metrics: {
      winRate: 75.0,
      thesesCount: 16,
      netProfit: 4220,
      tasksCompleted: 11,
      tasksTotal: 13,
      streak: '4 Wins',
      avgEdge: '+5.8%'
    }
  },
  {
    id: 'u-4',
    username: 'jlee',
    name: 'Jordan Lee',
    email: 'jordan@twomanmarkets.internal',
    role: 'STAFF',
    initials: 'JL',
    title: 'Senior Macro & Kalshi Analyst',
    avatarClass: 'staff',
    status: 'Active',
    joinedDate: 'Feb 2026',
    lastActive: '25m ago',
    responsibilities: [
      'Kalshi Fed interest rate contract analysis',
      'CPI & Non-Farm Payroll econometric modeling',
      'Treasury yield curve implied probability mapping'
    ],
    permissions: {
      canSubmitResearch: true,
      canAllocateCapital: false,
      canManageTasks: true,
      canViewAnalytics: true,
      canPostAnnouncements: false,
      canManageStaff: false
    },
    metrics: {
      winRate: 66.7,
      thesesCount: 12,
      netProfit: 2840,
      tasksCompleted: 14,
      tasksTotal: 16,
      streak: '2 Wins',
      avgEdge: '+6.2%'
    }
  },
  {
    id: 'u-5',
    username: 'srivera',
    name: 'Sam Rivera',
    email: 'sam@twomanmarkets.internal',
    role: 'STAFF',
    initials: 'SR',
    title: 'Crypto & Prediction Market Analyst',
    avatarClass: 'staff',
    status: 'Active',
    joinedDate: 'Apr 2026',
    lastActive: '1h ago',
    responsibilities: [
      'Polymarket volume & orderbook depth analysis',
      'Crypto derivatives momentum & fee slippage',
      'Political and regulatory event contract research'
    ],
    permissions: {
      canSubmitResearch: true,
      canAllocateCapital: false,
      canManageTasks: true,
      canViewAnalytics: true,
      canPostAnnouncements: false,
      canManageStaff: false
    },
    metrics: {
      winRate: 62.5,
      thesesCount: 8,
      netProfit: 1980,
      tasksCompleted: 8,
      tasksTotal: 10,
      streak: '1 Win',
      avgEdge: '+4.9%'
    }
  },
  {
    id: 'u-6',
    username: 'dvance',
    name: 'David Vance',
    email: 'david@twomanmarkets.internal',
    role: 'STAFF',
    initials: 'DV',
    title: 'Junior Data Analyst',
    avatarClass: 'staff',
    status: 'Inactive',
    joinedDate: 'May 2026',
    lastActive: '4d ago',
    responsibilities: [
      'Closing line value data collection',
      'Bookmaker odds scraping & historical archive',
      'Weekly research summary formatting'
    ],
    permissions: {
      canSubmitResearch: false,
      canAllocateCapital: false,
      canManageTasks: false,
      canViewAnalytics: true,
      canPostAnnouncements: false,
      canManageStaff: false
    },
    metrics: {
      winRate: 50.0,
      thesesCount: 4,
      netProfit: -350,
      tasksCompleted: 5,
      tasksTotal: 8,
      streak: 'Inactive',
      avgEdge: '+2.1%'
    }
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
    description: 'Log verified outcomes, execute returns into ledger, and update hit-rates.',
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
      text: 'Desk Notice: Super Bowl rematch lines and Kalshi December rate cut lines have capital allocated. Please keep all model updates in the #sports-picks and #macro-theses channels.',
      isAnnouncement: true
    },
    {
      id: 'c-2',
      sender: 'Luis',
      role: 'OWNER',
      initials: 'LB',
      time: 'Today 08:00 AM',
      text: 'Reminder: Any pick proposed with under +3.0% edge must include explicit hedge rationale. Capital discipline is priority #1.',
      isAnnouncement: true
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
  ],
  'Maya Chen': [
    {
      id: 'c-dm-1',
      sender: 'Luis',
      role: 'OWNER',
      initials: 'LB',
      time: 'Yesterday 04:30 PM',
      text: 'Hey Maya, how is the injury variance model looking for NFL Week 10?'
    },
    {
      id: 'c-dm-2',
      sender: 'Maya Chen',
      role: 'STAFF',
      initials: 'MC',
      time: 'Yesterday 04:35 PM',
      text: 'Looking strong. Chiefs line moved favorably to -2.5. Submitting the ticket now.'
    }
  ],
  'Jordan Lee': [
    {
      id: 'c-dm-3',
      sender: 'Alex (Partner)',
      role: 'OWNER',
      initials: 'AM',
      time: 'Today 08:15 AM',
      text: 'Jordan, make sure the Kalshi inflation spread accounts for Thursday morning revisions.'
    },
    {
      id: 'c-dm-4',
      sender: 'Jordan Lee',
      role: 'STAFF',
      initials: 'JL',
      time: 'Today 08:20 AM',
      text: 'On it Alex. Factored into ticket TMM-1041.'
    }
  ],
  'Sam Rivera': [
    {
      id: 'c-dm-5',
      sender: 'Luis',
      role: 'OWNER',
      initials: 'LB',
      time: 'Nov 6, 2026',
      text: 'Sam, solid execution on the BTC target.'
    }
  ],
  'Alex (Partner)': [
    {
      id: 'c-dm-6',
      sender: 'Luis',
      role: 'OWNER',
      initials: 'LB',
      time: 'Today 07:30 AM',
      text: 'Morning Alex, firm capital allocation stands at $60,200 total active. Reviewing Jordan ticket.'
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

const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'aud-1',
    actor: 'Luis',
    actorRole: 'OWNER',
    action: 'Allocated $1,500 stake into TMM-1042 (Chiefs -2.5)',
    category: 'CAPITAL',
    timestamp: 'Today 10:20 AM'
  },
  {
    id: 'aud-2',
    actor: 'Jordan Lee',
    actorRole: 'STAFF',
    action: 'Submitted research thesis TMM-1041 (US Fed Rate Cut in Dec)',
    category: 'AUTH',
    timestamp: 'Today 08:30 AM'
  },
  {
    id: 'aud-3',
    actor: 'Luis',
    actorRole: 'OWNER',
    action: 'Published desk announcement: "Desk Priority · Kalshi & NFL Week 10 Allocations"',
    category: 'ANNOUNCEMENT',
    timestamp: 'Today 08:00 AM'
  },
  {
    id: 'aud-4',
    actor: 'Alex (Partner)',
    actorRole: 'OWNER',
    action: 'Verified security permissions for Sports Quantitative Desk',
    category: 'STAFF',
    timestamp: 'Yesterday 04:15 PM'
  },
  {
    id: 'aud-5',
    actor: 'Maya Chen',
    actorRole: 'STAFF',
    action: 'Updated status of task "Model NFL Week 10 Spread Variance" to In Progress',
    category: 'TASK',
    timestamp: 'Yesterday 02:00 PM'
  },
  {
    id: 'aud-6',
    actor: 'Luis',
    actorRole: 'OWNER',
    action: 'Settled position TMM-1039 (Arsenal Clean Sheet) as WON (+$1,160 Net P&L)',
    category: 'CAPITAL',
    timestamp: 'Nov 6, 2026'
  }
];

const INITIAL_ANNOUNCEMENT: DeskAnnouncement = {
  title: 'Desk Priority · Kalshi & NFL Week 10 Allocations',
  body: 'Capital deployed into TMM-1042 (Chiefs -2.5) and pending review on TMM-1041. Analysts should review secondary injury releases before 4 PM EST today.',
  author: 'Luis (Co-Owner)',
  postedAt: 'Today 08:00 AM',
  priority: 'Normal'
};

// ============================================================================
// Main Application Component
// ============================================================================

export default function App() {
  // Navigation & User State
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF);
  const [currentUser, setCurrentUser] = useState<StaffMember>(INITIAL_STAFF[0]);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Business Domain State
  const [researchList, setResearchList] = useState<ResearchItem[]>(INITIAL_RESEARCH);
  const [taskList, setTaskList] = useState<TaskItem[]>(INITIAL_TASKS);
  const [chatChannels, setChatChannels] = useState<Record<string, ChatMessage[]>>(INITIAL_CHATS);
  const [activeChannel, setActiveChannel] = useState<string>('#sports-picks');
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [deskAnnouncement, setDeskAnnouncement] = useState<DeskAnnouncement>(INITIAL_ANNOUNCEMENT);

  // Interactive Filter States
  const [researchFilter, setResearchFilter] = useState<'All' | ResearchStatus>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<'7D' | '30D' | '90D' | 'ALL' | 'CUSTOM'>('30D');
  const [customStartDate, setCustomStartDate] = useState('2026-10-15');
  const [customEndDate, setCustomEndDate] = useState('2026-11-08');
  const [analyticsCategoryFilter, setAnalyticsCategoryFilter] = useState<string>('All');
  const [analyticsStatusFilter, setAnalyticsStatusFilter] = useState<string>('All');
  const [staffStatusFilter, setStaffStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [staffSearchQuery, setStaffSearchQuery] = useState('');
  const [taskAssigneeFilter, setTaskAssigneeFilter] = useState<'All' | 'Mine'>('All');
  const [taskPriorityFilter, setTaskPriorityFilter] = useState<string>('All');
  const [auditCategoryFilter, setAuditCategoryFilter] = useState<string>('All');

  // Modal Dialog States
  const [newSubmissionModalOpen, setNewSubmissionModalOpen] = useState(false);
  const [reviewModalItem, setReviewModalItem] = useState<ResearchItem | null>(null);
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [addStaffModalOpen, setAddStaffModalOpen] = useState(false);
  const [editStaffModalMember, setEditStaffModalMember] = useState<StaffMember | null>(null);
  const [viewStaffModalMember, setViewStaffModalMember] = useState<StaffMember | null>(null);
  const [passwordModalUser, setPasswordModalUser] = useState<StaffMember | null>(null);
  const [newChatModalOpen, setNewChatModalOpen] = useState(false);
  const [newChatType, setNewChatType] = useState<'dm' | 'channel'>('dm');

  // Mobile Task Column Selector ('Pending' | 'In Progress' | 'Completed')
  const [mobileTaskCol, setMobileTaskCol] = useState<'Pending' | 'In Progress' | 'Completed'>('Pending');

  // Input states
  const [chatInput, setChatInput] = useState('');
  const [investAmountInput, setInvestAmountInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState(false);
  const [announcementEditTitle, setAnnouncementEditTitle] = useState(deskAnnouncement.title);
  const [announcementEditBody, setAnnouncementEditBody] = useState(deskAnnouncement.body);
  const [announcementSavedToast, setAnnouncementSavedToast] = useState(false);

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

  // Derived Category Metrics for Analytics
  const categoryMetrics = useMemo(() => {
    const categories: ('Sports' | 'Macro' | 'Crypto' | 'Politics')[] = ['Sports', 'Macro', 'Crypto', 'Politics'];
    return categories.map(cat => {
      const items = researchList.filter(r => r.category === cat);
      let invested = 0;
      let profit = 0;
      let won = 0;
      let settled = 0;

      items.forEach(it => {
        if (it.status === 'Won' || it.status === 'Lost') {
          settled++;
          invested += it.actualInvested;
          profit += (it.netProfit || 0);
          if (it.status === 'Won') won++;
        } else if (it.status === 'Invested') {
          invested += it.actualInvested;
        }
      });

      const winRate = settled > 0 ? ((won / settled) * 100).toFixed(1) : '—';
      return {
        category: cat,
        totalItems: items.length,
        invested,
        profit,
        winRate,
        won,
        settled
      };
    });
  }, [researchList]);

  // Derived Task Progress
  const taskProgress = useMemo(() => {
    const total = taskList.length;
    const completed = taskList.filter(t => t.status === 'Completed').length;
    const inProgress = taskList.filter(t => t.status === 'In Progress').length;
    const pending = taskList.filter(t => t.status === 'Pending').length;
    const urgent = taskList.filter(t => t.priority === 'Urgent' && t.status !== 'Completed').length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, inProgress, pending, urgent, percent };
  }, [taskList]);

  // Derived Individual Staff Telemetry (Personal Hit-Rate & Attribution)
  const personalMetrics = useMemo(() => {
    // Current user's submitted research
    const myItems = researchList.filter(
      r => r.author === currentUser.name || r.authorInitials === currentUser.initials
    );
    let myInvested = 0;
    let myProfit = 0;
    let myWon = 0;
    let myLost = 0;
    let myPending = 0;
    let myInvestedCount = 0;

    myItems.forEach(item => {
      if (item.status === 'Won') {
        myWon++;
        myInvested += item.actualInvested;
        myProfit += (item.netProfit || 0);
      } else if (item.status === 'Lost') {
        myLost++;
        myInvested += item.actualInvested;
        myProfit += (item.netProfit || 0);
      } else if (item.status === 'Invested') {
        myInvestedCount++;
        myInvested += item.actualInvested;
      } else if (item.status === 'Pending') {
        myPending++;
      }
    });

    const settled = myWon + myLost;
    const hitRate = settled > 0
      ? ((myWon / settled) * 100).toFixed(1)
      : (currentUser.metrics?.winRate ? currentUser.metrics.winRate.toFixed(1) : '71.4');

    const totalTheses = myItems.length > 0 ? myItems.length : (currentUser.metrics?.thesesCount || 19);
    const netProfit = myProfit !== 0 ? myProfit : (currentUser.metrics?.netProfit || 8950);
    const streak = currentUser.metrics?.streak || (myWon > myLost ? `${myWon} Wins` : 'Active Streak');
    const avgEdge = currentUser.metrics?.avgEdge || '+6.4%';

    // Tasks assigned to current user
    const myTasks = taskList.filter(t => t.assignee === currentUser.name);
    const myCompleted = myTasks.filter(t => t.status === 'Completed').length;
    const myActiveTasks = myTasks.filter(t => t.status !== 'Completed').length;
    const taskRate = myTasks.length > 0
      ? Math.round((myCompleted / myTasks.length) * 100)
      : (currentUser.metrics?.tasksTotal ? Math.round((currentUser.metrics.tasksCompleted / currentUser.metrics.tasksTotal) * 100) : 92);

    return {
      myItems,
      totalTheses,
      wonCount: myWon,
      lostCount: myLost,
      pendingCount: myPending,
      investedCount: myInvestedCount,
      settledCount: settled,
      hitRate,
      netProfit,
      streak,
      avgEdge,
      assignedTasksCount: myTasks.length > 0 ? myTasks.length : (currentUser.metrics?.tasksTotal || 15),
      completedTasksCount: myTasks.length > 0 ? myCompleted : (currentUser.metrics?.tasksCompleted || 14),
      activeTasks: myActiveTasks > 0 ? myActiveTasks : 1,
      taskCompletionRate: taskRate
    };
  }, [researchList, currentUser, taskList]);

  // Dynamic Chart Configuration based on selected timeframe
  const chartConfig = useMemo(() => {
    switch (analyticsTimeframe) {
      case 'CUSTOM':
        return {
          areaPath: 'M 0,165 C 80,150 160,135 250,110 C 340,90 440,75 520,50 C 600,35 650,30 700,22 L 700,200 L 0,200 Z',
          linePath: 'M 0,165 C 80,150 160,135 250,110 C 340,90 440,75 520,50 C 600,35 650,30 700,22',
          terminalY: 22,
          labels: [customStartDate, 'Mid-range', `${customEndDate} (Custom)`]
        };
      case '7D':
        return {
          areaPath: 'M 0,150 C 90,140 180,120 270,125 C 360,100 450,80 540,60 C 620,45 660,35 700,25 L 700,200 L 0,200 Z',
          linePath: 'M 0,150 C 90,140 180,120 270,125 C 360,100 450,80 540,60 C 620,45 660,35 700,25',
          terminalY: 25,
          labels: ['Nov 02', 'Nov 04', 'Nov 05', 'Nov 07', 'Nov 08 (Today)']
        };
      case '90D':
        return {
          areaPath: 'M 0,185 C 80,180 160,165 240,150 C 320,135 400,120 480,90 C 560,60 630,40 700,18 L 700,200 L 0,200 Z',
          linePath: 'M 0,185 C 80,180 160,165 240,150 C 320,135 400,120 480,90 C 560,60 630,40 700,18',
          terminalY: 18,
          labels: ['Aug 15', 'Sep 01', 'Sep 20', 'Oct 15', 'Nov 08 (Today)']
        };
      case 'ALL':
        return {
          areaPath: 'M 0,195 C 100,190 200,175 300,145 C 400,115 500,85 600,50 C 650,35 680,25 700,15 L 700,200 L 0,200 Z',
          linePath: 'M 0,195 C 100,190 200,175 300,145 C 400,115 500,85 600,50 C 650,35 680,25 700,15',
          terminalY: 15,
          labels: ['Jan 2026', 'Apr 2026', 'Jul 2026', 'Oct 2026', 'Nov 2026']
        };
      case '30D':
      default:
        return {
          areaPath: 'M 0,170 C 60,165 110,150 170,140 C 230,130 280,145 340,110 C 400,75 450,95 510,70 C 580,45 640,35 700,20 L 700,200 L 0,200 Z',
          linePath: 'M 0,170 C 60,165 110,150 170,140 C 230,130 280,145 340,110 C 400,75 450,95 510,70 C 580,45 640,35 700,20',
          terminalY: 20,
          labels: ['Oct 10', 'Oct 18', 'Oct 26', 'Nov 01', 'Nov 08 (Today)']
        };
    }
  }, [analyticsTimeframe]);

  // Dynamic Chat Channels and Direct Messages
  const publicChannels = useMemo(() => {
    const channels = Object.keys(chatChannels).filter(k => k.startsWith('#'));
    const defaultOrder = ['#announcements', '#sports-picks', '#macro-theses', '#general'];
    const customChannels = channels.filter(c => !defaultOrder.includes(c));
    return [...defaultOrder.filter(c => channels.includes(c)), ...customChannels];
  }, [chatChannels]);

  const directMessages = useMemo(() => {
    const dmKeys = Object.keys(chatChannels).filter(k => !k.startsWith('#'));
    const staffNames = staffList
      .filter(s => s.id !== currentUser.id && s.status === 'Active')
      .map(s => s.name);
    return Array.from(new Set([...dmKeys, ...staffNames]));
  }, [chatChannels, staffList, currentUser]);

  const allConversations = useMemo(() => {
    return [...publicChannels, ...directMessages];
  }, [publicChannels, directMessages]);

  // Filtered Historical Records for Analytics
  const filteredHistoricalRecords = useMemo(() => {
    return researchList.filter(item => {
      const matchCat = analyticsCategoryFilter === 'All' || item.category === analyticsCategoryFilter;
      const matchStatus = analyticsStatusFilter === 'All' || item.status === analyticsStatusFilter;
      return matchCat && matchStatus;
    });
  }, [researchList, analyticsCategoryFilter, analyticsStatusFilter]);

  // Handlers
  const addAuditLog = (action: string, category: AuditLogItem['category']) => {
    const newLog: AuditLogItem = {
      id: `aud-${Date.now()}`,
      actor: currentUser.name,
      actorRole: currentUser.role,
      action,
      category,
      timestamp: 'Just now'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    if (activeChannel === '#announcements' && currentUser.role !== 'OWNER') {
      alert('Only Owner accounts can post desk-wide announcements.');
      return;
    }

    const newMessage: ChatMessage = {
      id: `c-${Date.now()}`,
      sender: currentUser.name,
      role: currentUser.role,
      initials: currentUser.initials,
      time: 'Just now',
      text: chatInput.trim(),
      isAnnouncement: activeChannel === '#announcements'
    };

    setChatChannels(prev => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), newMessage]
    }));
    setChatInput('');
  };

  const handleApproveInvestment = (item: ResearchItem, amount: number) => {
    const actualAmount = amount > 0 ? amount : item.suggestedStake;
    setResearchList(prev => prev.map(r => {
      if (r.id === item.id) {
        return {
          ...r,
          status: 'Invested',
          actualInvested: actualAmount
        };
      }
      return r;
    }));
    addAuditLog(`Allocated $${actualAmount.toLocaleString()} stake into ${item.id} (${item.market})`, 'CAPITAL');
    setReviewModalItem(null);
  };

  const handlePassPick = (item: ResearchItem) => {
    setResearchList(prev => prev.map(r => {
      if (r.id === item.id) {
        return { ...r, status: 'Passed', actualInvested: 0 };
      }
      return r;
    }));
    addAuditLog(`Passed research thesis ${item.id} (${item.market})`, 'CAPITAL');
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
    addAuditLog(`Settled ${item.id} as ${outcome} (${profit >= 0 ? `+$${profit}` : `-$${Math.abs(profit)}`})`, 'CAPITAL');
    setReviewModalItem(null);
  };

  const handleMoveTask = (taskId: string, newStatus: 'Pending' | 'In Progress' | 'Completed') => {
    setTaskList(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: newStatus };
      }
      return t;
    }));
    const targetTask = taskList.find(t => t.id === taskId);
    if (targetTask) {
      addAuditLog(`Updated status of task "${targetTask.title}" to ${newStatus}`, 'TASK');
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const targetTask = taskList.find(t => t.id === taskId);
    setTaskList(prev => prev.filter(t => t.id !== taskId));
    if (targetTask) {
      addAuditLog(`Deleted task "${targetTask.title}"`, 'TASK');
    }
  };

  const handleToggleStaffStatus = (memberId: string) => {
    setStaffList(prev => prev.map(m => {
      if (m.id === memberId) {
        const nextStatus = m.status === 'Active' ? 'Inactive' : 'Active';
        addAuditLog(`${nextStatus === 'Active' ? 'Reactivated' : 'Deactivated'} staff account for ${m.name} (@${m.username})`, 'STAFF');
        return { ...m, status: nextStatus };
      }
      return m;
    }));
  };

  const handleDeleteStaff = (memberId: string) => {
    const member = staffList.find(m => m.id === memberId);
    if (!member) return;
    if (member.role === 'OWNER') {
      alert('Owner accounts cannot be deleted. Dual-owner governance must maintain both accounts.');
      return;
    }
    if (confirm(`Are you sure you want to delete staff account ${member.name} (@${member.username})?`)) {
      setStaffList(prev => prev.filter(m => m.id !== memberId));
      addAuditLog(`Deleted staff account ${member.name} (@${member.username})`, 'STAFF');
      if (viewStaffModalMember?.id === memberId) setViewStaffModalMember(null);
      if (editStaffModalMember?.id === memberId) setEditStaffModalMember(null);
    }
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementEditTitle.trim() || !announcementEditBody.trim()) return;

    const updated: DeskAnnouncement = {
      title: announcementEditTitle.trim(),
      body: announcementEditBody.trim(),
      author: `${currentUser.name} (${currentUser.role === 'OWNER' ? 'Co-Owner' : 'Staff'})`,
      postedAt: 'Just now',
      priority: 'Normal'
    };

    setDeskAnnouncement(updated);

    // Also post into #announcements channel
    const annMsg: ChatMessage = {
      id: `c-ann-${Date.now()}`,
      sender: currentUser.name,
      role: currentUser.role,
      initials: currentUser.initials,
      time: 'Just now',
      text: `📢 ${updated.title}\n\n${updated.body}`,
      isAnnouncement: true
    };

    setChatChannels(prev => ({
      ...prev,
      '#announcements': [...(prev['#announcements'] || []), annMsg]
    }));

    addAuditLog(`Published desk announcement: "${updated.title}"`, 'ANNOUNCEMENT');
    setAnnouncementSavedToast(true);
    setTimeout(() => setAnnouncementSavedToast(false), 3000);
  };

  const handleExportCsv = () => {
    const targetData = filteredHistoricalRecords.length > 0 ? filteredHistoricalRecords : researchList;
    const headers = ['ID', 'Market', 'Category', 'Book', 'Odds', 'Edge', 'Stake', 'Status', 'Profit', 'ROI', 'Author', 'Date'];
    const rows = targetData.map(r => [
      r.id,
      `"${r.market.replace(/"/g, '""')}"`,
      r.category,
      `"${r.book}"`,
      `"${r.odds}"`,
      r.edge,
      r.actualInvested || r.suggestedStake,
      r.status,
      r.netProfit ?? 0,
      r.roi ? `${r.roi}%` : '0%',
      `"${r.author}"`,
      `"${r.date}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TwoManMarkets_Performance_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addAuditLog(`Exported ${targetData.length} performance records to CSV`, 'AUTH');
  };

  // Filtered views
  const filteredStaffList = useMemo(() => {
    return staffList.filter(s => {
      const matchStatus = staffStatusFilter === 'All' || s.status === staffStatusFilter;
      const matchSearch = staffSearchQuery === '' ||
        s.name.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
        s.username.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
        s.title.toLowerCase().includes(staffSearchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [staffList, staffStatusFilter, staffSearchQuery]);

  const filteredTasks = useMemo(() => {
    return taskList.filter(t => {
      const matchAssignee = taskAssigneeFilter === 'All' || t.assignee.toLowerCase() === currentUser.name.toLowerCase();
      const matchPriority = taskPriorityFilter === 'All' || t.priority === taskPriorityFilter;
      return matchAssignee && matchPriority;
    });
  }, [taskList, taskAssigneeFilter, taskPriorityFilter, currentUser]);

  const filteredAuditLogs = useMemo(() => {
    if (auditCategoryFilter === 'All') return auditLogs;
    return auditLogs.filter(a => a.category === auditCategoryFilter);
  }, [auditLogs, auditCategoryFilter]);

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
          {/* Main Workspace Navigation */}
          <div className="nav-section">
            <span className="nav-section-title">WORKSPACE</span>
            <button
              className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>

            <button
              className={`nav-link ${activeTab === 'research' ? 'active' : ''}`}
              onClick={() => { setActiveTab('research'); setMobileMenuOpen(false); }}
            >
              <Target size={18} />
              <span>Research Pipeline</span>
              {metrics.pendingCount > 0 && (
                <span className="nav-link-badge">{metrics.pendingCount}</span>
              )}
            </button>

            <button
              className={`nav-link ${activeTab === 'tasks' ? 'active' : ''}`}
              onClick={() => { setActiveTab('tasks'); setMobileMenuOpen(false); }}
            >
              <CheckSquare size={18} />
              <span>Tasks</span>
              <span className="nav-link-badge">
                {taskList.filter(t => t.status !== 'Completed').length}
              </span>
            </button>

            <button
              className={`nav-link ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => { setActiveTab('chat'); setMobileMenuOpen(false); }}
            >
              <MessageSquare size={18} />
              <span>Team Chat</span>
            </button>
          </div>

          {/* Analytics & Team Section */}
          <div className="nav-section">
            <span className="nav-section-title">ANALYTICS & TEAM</span>
            <button
              className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => { setActiveTab('analytics'); setMobileMenuOpen(false); }}
            >
              <BarChart3 size={18} />
              <span>Analytics & Reports</span>
            </button>

            <button
              className={`nav-link ${activeTab === 'team' ? 'active' : ''}`}
              onClick={() => { setActiveTab('team'); setMobileMenuOpen(false); }}
            >
              <Users size={18} />
              <span>Staff Management</span>
            </button>
          </div>

          {/* Administration Section (Owner Only) */}
          {currentUser.role === 'OWNER' && (
            <div className="nav-section">
              <span className="nav-section-title">ADMINISTRATION</span>
              <button
                className={`nav-link ${activeTab === 'admin' ? 'active' : ''}`}
                onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
              >
                <ShieldCheck size={18} />
                <span>Admin Settings</span>
              </button>
            </div>
          )}
        </div>

        {/* User Profile Card & Role Indicator */}
        <div className="sidebar-footer">
          <div
            className="user-profile-card"
            style={{ cursor: 'pointer' }}
            onClick={() => setViewStaffModalMember(currentUser)}
            title="Click to view your profile"
          >
            <div className={`user-avatar ${currentUser.avatarClass}`}>
              {currentUser.initials}
            </div>
            <div className="user-info">
              <div className="user-name">{currentUser.name}</div>
              <div className={`user-role-badge ${currentUser.avatarClass}`}>
                {currentUser.role === 'OWNER' ? (
                  <span className="role-label-with-icon"><Crown size={12} /> CO-OWNER</span>
                ) : (
                  <span className="role-label-with-icon"><Activity size={12} /> ANALYST</span>
                )}
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
                {activeTab === 'overview' && 'Dashboard'}
                {activeTab === 'research' && 'Research Pipeline'}
                {activeTab === 'tasks' && 'Tasks'}
                {activeTab === 'chat' && 'Team Chat'}
                {activeTab === 'analytics' && 'Analytics & Reports'}
                {activeTab === 'team' && 'Staff Management'}
                {activeTab === 'admin' && 'Admin Settings'}
              </span>
            </div>
          </div>

          <div className="topbar-right">
            {/* Role Switcher (Switch between any registered account) */}
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
                  {staffList.map(member => (
                    <button
                      key={member.id}
                      className={`role-dropdown-item ${currentUser.id === member.id ? 'active' : ''}`}
                      onClick={() => {
                        setCurrentUser(member);
                        setRoleMenuOpen(false);
                      }}
                    >
                      <div>
                        <strong>{member.name} {member.status === 'Inactive' ? '(Inactive)' : ''}</strong>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{member.title}</div>
                      </div>
                      {currentUser.id === member.id && <Check size={14} />}
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
              <span className="ticker-change up"><TrendingUp size={11} /> +5.2% Edge</span>
            </div>
            <div className="ticker-item">
              <span className="ticker-market">Kalshi · Fed Dec Cut:</span>
              <span className="ticker-odds">78¢ (78.0%)</span>
              <span className="ticker-change up"><TrendingUp size={11} /> +6.5% Edge</span>
            </div>
            <div className="ticker-item">
              <span className="ticker-market">Polymarket · BTC &gt; $85k:</span>
              <span className="ticker-odds">62¢ (62.0%)</span>
              <span className="ticker-change up"><CheckCircle2 size={11} /> Settled Won</span>
            </div>
            <div className="ticker-item">
              <span className="ticker-market">EPL · Arsenal Clean Sheet:</span>
              <span className="ticker-odds">+145 (40.8%)</span>
              <span className="ticker-change up"><TrendingUp size={11} /> +145% ROI</span>
            </div>
          </div>

          {/* ==============================================================
              PAGE 1: DASHBOARD (OVERVIEW)
              ============================================================== */}
          {activeTab === 'overview' && (
            <div>
              <div className="page-header">
                <div className="page-title-group">
                  <h1>Welcome back, {currentUser.name}</h1>
                  <p>TwoManMarkets Internal Management · Operational Overview</p>
                </div>
                <div className="header-actions">
                  <button className="btn-secondary" onClick={() => setActiveTab('research')}>
                    <Target size={14} />
                    <span>View Research Pipeline</span>
                  </button>
                  <button className="btn-primary" onClick={() => setNewSubmissionModalOpen(true)}>
                    <Plus size={14} />
                    <span>Submit Research</span>
                  </button>
                </div>
              </div>

              {/* Top KPI Metrics Cards: Role-Aware (Owner Firm-Wide vs Staff Personal Telemetry) */}
              {currentUser.role === 'OWNER' ? (
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
                      <span className="kpi-subtitle">firm-wide bankroll deployed</span>
                    </div>
                  </div>

                  <div className="kpi-card">
                    <div className="kpi-header">
                      <span className="kpi-title">OVERALL WIN RATE</span>
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
                      <span className="kpi-title">NET REALIZED PROFIT</span>
                      <div className="kpi-icon-wrap" style={{ background: 'var(--win-green-bg)', color: 'var(--win-green)' }}>
                        <TrendingUp size={18} />
                      </div>
                    </div>
                    <div className="kpi-value mono" style={{ color: metrics.totalProfit >= 0 ? 'var(--win-green)' : 'var(--loss-red)' }}>
                      {metrics.totalProfit >= 0 ? `+$${metrics.totalProfit.toLocaleString()}` : `-$${Math.abs(metrics.totalProfit).toLocaleString()}`}
                    </div>
                    <div className="kpi-footer">
                      <span className="trend-pill positive">ROI: {metrics.overallRoi}%</span>
                      <span className="kpi-subtitle">across all verified positions</span>
                    </div>
                  </div>

                  <div className="kpi-card">
                    <div className="kpi-header">
                      <span className="kpi-title">RESEARCH PIPELINE</span>
                      <div className="kpi-icon-wrap" style={{ background: 'var(--info-blue-bg)', color: 'var(--info-blue)' }}>
                        <Target size={18} />
                      </div>
                    </div>
                    <div className="kpi-value">{metrics.pendingCount} Pending</div>
                    <div className="kpi-footer">
                      <span className="trend-pill positive">{metrics.investedCount} Active Positions</span>
                      <span className="kpi-subtitle">{metrics.totalTheses} total logged</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="staff-privacy-banner">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShieldAlert size={16} style={{ color: 'var(--emerald)', flexShrink: 0 }} />
                      <span>
                        <strong>Individual Staff Telemetry Active:</strong> Displaying personal research accuracy, thesis attribution, and assigned duties. Firm-wide treasury bankroll and partner capital decisions are restricted to Co-Owner accounts.
                      </span>
                    </div>
                  </div>
                  <div className="kpi-grid">
                    <div className="kpi-card highlight">
                      <div className="kpi-header">
                        <span className="kpi-title">MY RESEARCH HIT RATE</span>
                        <div className="kpi-icon-wrap" style={{ background: 'var(--emerald-soft)', color: 'var(--emerald)' }}>
                          <Award size={18} />
                        </div>
                      </div>
                      <div className="kpi-value">{personalMetrics.hitRate}%</div>
                      <div className="kpi-footer">
                        <span className="trend-pill positive">
                          <TrendingUp size={12} /> {personalMetrics.streak}
                        </span>
                        <span className="kpi-subtitle">verified outcome accuracy</span>
                      </div>
                    </div>

                    <div className="kpi-card">
                      <div className="kpi-header">
                        <span className="kpi-title">MY THESES LOGGED</span>
                        <div className="kpi-icon-wrap" style={{ background: 'var(--info-blue-bg)', color: 'var(--info-blue)' }}>
                          <Target size={18} />
                        </div>
                      </div>
                      <div className="kpi-value">{personalMetrics.totalTheses} Theses</div>
                      <div className="kpi-footer">
                        <span className="trend-pill positive">
                          {personalMetrics.pendingCount} Under Review · {personalMetrics.investedCount} Active
                        </span>
                        <span className="kpi-subtitle">attributed to {currentUser.name.split(' ')[0]}</span>
                      </div>
                    </div>

                    <div className="kpi-card">
                      <div className="kpi-header">
                        <span className="kpi-title">NET VALUE GENERATED</span>
                        <div className="kpi-icon-wrap" style={{ background: 'var(--win-green-bg)', color: 'var(--win-green)' }}>
                          <TrendingUp size={18} />
                        </div>
                      </div>
                      <div className="kpi-value mono" style={{ color: 'var(--win-green)' }}>
                        +${personalMetrics.netProfit.toLocaleString()}
                      </div>
                      <div className="kpi-footer">
                        <span className="trend-pill positive">Edge: {personalMetrics.avgEdge}</span>
                        <span className="kpi-subtitle">realized profit from your research</span>
                      </div>
                    </div>

                    <div className="kpi-card">
                      <div className="kpi-header">
                        <span className="kpi-title">MY ASSIGNED TASKS</span>
                        <div className="kpi-icon-wrap" style={{ background: 'var(--quant-violet-bg)', color: 'var(--quant-violet)' }}>
                          <CheckCircle2 size={18} />
                        </div>
                      </div>
                      <div className="kpi-value">{personalMetrics.taskCompletionRate}%</div>
                      <div className="kpi-footer">
                        <span className="trend-pill positive">
                          {personalMetrics.completedTasksCount}/{personalMetrics.assignedTasksCount} Completed
                        </span>
                        <span className="kpi-subtitle">on-time task completion rate</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Split Grid: Interactive Performance Chart & Position Outcomes */}
              <div className="dashboard-split-grid">
                <div className="panel-card">
                  <div className="panel-head">
                    <div>
                      <h3 className="panel-title">
                        {currentUser.role === 'OWNER'
                          ? 'Cumulative Capital Growth & Realized Returns'
                          : `${currentUser.name.split(' ')[0]}'s Research Performance & Hit-Rate Progression`}
                      </h3>
                      <p className="panel-desc">
                        {currentUser.role === 'OWNER'
                          ? 'Daily net profit & loss from verified prediction investments (Firm Treasury)'
                          : 'Cumulative outcome accuracy and attribution from your logged market research'}
                      </p>
                    </div>
                    <div className="filter-group">
                      {(['7D', '30D', '90D', 'ALL', 'CUSTOM'] as const).map(tf => (
                        <button
                          key={tf}
                          className={`filter-tab-btn ${analyticsTimeframe === tf ? 'active' : ''}`}
                          onClick={() => setAnalyticsTimeframe(tf)}
                        >
                          {tf === 'CUSTOM' ? 'Custom Range' : tf}
                        </button>
                      ))}
                    </div>
                  </div>

                  {analyticsTimeframe === 'CUSTOM' && (
                    <div className="custom-date-range-bar" style={{ margin: '0 20px 16px 20px' }}>
                      <div className="date-input-group">
                        <Calendar size={14} style={{ color: 'var(--emerald)' }} />
                        <span className="date-label">From:</span>
                        <input
                          type="date"
                          value={customStartDate}
                          onChange={e => setCustomStartDate(e.target.value)}
                          className="date-picker-input"
                        />
                      </div>
                      <div className="date-input-group">
                        <span className="date-label">To:</span>
                        <input
                          type="date"
                          value={customEndDate}
                          onChange={e => setCustomEndDate(e.target.value)}
                          className="date-picker-input"
                        />
                      </div>
                      <span className="custom-date-pill">
                        Active Filter: {customStartDate} → {customEndDate}
                      </span>
                    </div>
                  )}

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
                        d={chartConfig.areaPath}
                        className="chart-area-fill"
                      />

                      {/* Main Trend Line */}
                      <path
                        d={chartConfig.linePath}
                        className="chart-line-stroke"
                      />

                      {/* Terminal Point */}
                      <circle cx="700" cy={chartConfig.terminalY} r="4.5" fill="#10b981" stroke="#09090b" strokeWidth="2" />
                    </svg>
                    <div className="chart-axis-labels">
                      {chartConfig.labels.map((lbl, idx) => (
                        <span key={idx}>{lbl}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Outcome Breakdown Donut Panel */}
                <div className="panel-card">
                  <div className="panel-head">
                    <div>
                      <h3 className="panel-title">Position Outcomes</h3>
                      <p className="panel-desc">Settled investment hit-rate breakdown</p>
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
                          <span>Winning Positions</span>
                        </span>
                        <strong style={{ color: 'var(--win-green)' }}>{metrics.wonCount} picks</strong>
                      </div>

                      <div className="outcome-row">
                        <span className="outcome-indicator">
                          <span className="color-dot lost" />
                          <span>Losing Positions</span>
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

              {/* Pinned Desk Announcement Banner */}
              <div className="desk-announcement-card">
                <div className="announcement-icon-badge">
                  <Radio size={18} />
                </div>
                <div className="announcement-body">
                  <div className="announcement-title">{deskAnnouncement.title}</div>
                  <p className="announcement-text">{deskAnnouncement.body}</p>
                </div>
                <div className="announcement-meta">Posted by {deskAnnouncement.author} · {deskAnnouncement.postedAt}</div>
              </div>

              {/* Lower Section: Pending Theses Requiring Review */}
              <div className="panel-card">
                <div className="panel-head">
                  <div>
                    <h3 className="panel-title">Pending Research Awaiting Review</h3>
                    <p className="panel-desc">Analyst research submissions requiring capital allocation decision</p>
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
                        <th>Analyst</th>
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
                              {currentUser.role === 'OWNER' ? 'Review & Size' : 'View Details'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile & Tablet Card View for Dashboard */}
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
                          {currentUser.role === 'OWNER' ? 'Review & Size' : 'View Details'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              PAGE 2: RESEARCH & THESES PIPELINE
              ============================================================== */}
          {activeTab === 'research' && (
            <div>
              <div className="page-header">
                <div className="page-title-group">
                  <h1>Prediction Market Research Pipeline</h1>
                  <p>Staff analysts submit structured research theses; Co-Owners review, size positions, and allocate capital.</p>
                </div>
                <div className="header-actions">
                  <button className="btn-primary" onClick={() => setNewSubmissionModalOpen(true)}>
                    <Plus size={16} />
                    <span>Submit New Thesis</span>
                  </button>
                </div>
              </div>

              {/* Status and Category Filter Controls */}
              <div className="filter-toolbar">
                <div className="filter-group">
                  {(['All', 'Pending', 'Invested', 'Won', 'Lost', 'Passed'] as const).map(st => (
                    <button
                      key={st}
                      className={`filter-tab-btn ${researchFilter === st ? 'active' : ''}`}
                      onClick={() => setResearchFilter(st)}
                    >
                      {st}
                      {st !== 'All' && (
                        <span className="counter-pill">
                          {researchList.filter(r => r.status === st).length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="category-select-wrap">
                  <select
                    className="category-dropdown"
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    aria-label="Filter research by category"
                  >
                    <option value="All">All Categories</option>
                    <option value="Sports">Sports</option>
                    <option value="Macro">Macro</option>
                    <option value="Crypto">Crypto</option>
                    <option value="Politics">Politics</option>
                  </select>
                </div>
              </div>

              {/* Research Items Table */}
              <div className="panel-card">
                <div className="table-responsive desktop-only-table">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Market & Platform</th>
                        <th>Category</th>
                        <th>Price / Odds</th>
                        <th>Calculated Edge</th>
                        <th>Stake Allocation</th>
                        <th>Analyst</th>
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
                              <span className="table-sub-info">{item.id} · {item.book} · {item.date}</span>
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
                            <td>
                              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                                {item.status === 'Invested' || item.status === 'Won' || item.status === 'Lost' ? (
                                  <span style={{ color: 'var(--win-green)' }}>${item.actualInvested.toLocaleString()} deployed</span>
                                ) : (
                                  <span>${item.suggestedStake.toLocaleString()} suggested</span>
                                )}
                              </div>
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
                                {currentUser.role === 'OWNER' ? 'Review & Size' : 'View Details'}
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card List */}
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
                            <span className="metric-lbl">Stake</span>
                            <span className="metric-val stake">
                              ${(item.actualInvested || item.suggestedStake).toLocaleString()}
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
                            {currentUser.role === 'OWNER' ? 'Review & Size' : 'View Details'}
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
                  <h1>Tasks & Deliverables</h1>
                  <p>Assign responsibilities, track research deliverables, and monitor completion deadlines.</p>
                </div>
                <div className="header-actions">
                  <button className="btn-primary" onClick={() => setNewTaskModalOpen(true)}>
                    <Plus size={16} />
                    <span>Create Task</span>
                  </button>
                </div>
              </div>

              {/* Admin Task Progress Monitor Strip */}
              <div className="task-monitor-panel">
                <div className="task-monitor-header">
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      TASK COMPLETION PROGRESS
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '8px' }}>
                      {taskProgress.completed} of {taskProgress.total} tasks completed ({taskProgress.percent}%)
                    </span>
                  </div>
                  <div className="task-stats-chips">
                    <span className="task-stat-chip">
                      Pending: <strong>{taskProgress.pending}</strong>
                    </span>
                    <span className="task-stat-chip">
                      In Progress: <strong>{taskProgress.inProgress}</strong>
                    </span>
                    <span className="task-stat-chip">
                      Completed: <strong>{taskProgress.completed}</strong>
                    </span>
                    {taskProgress.urgent > 0 && (
                      <span className="status-pill lost" style={{ padding: '2px 8px', fontSize: '10px' }}>
                        <AlertCircle size={11} /> {taskProgress.urgent} Urgent
                      </span>
                    )}
                  </div>
                </div>
                <div className="task-progress-bar-track">
                  <div
                    className="task-progress-bar-fill"
                    style={{ width: `${taskProgress.percent}%` }}
                  />
                </div>
              </div>

              {/* Task View Filters */}
              <div className="filter-toolbar">
                <div className="filter-group">
                  <button
                    className={`filter-tab-btn ${taskAssigneeFilter === 'All' ? 'active' : ''}`}
                    onClick={() => setTaskAssigneeFilter('All')}
                  >
                    All Tasks ({taskList.length})
                  </button>
                  <button
                    className={`filter-tab-btn ${taskAssigneeFilter === 'Mine' ? 'active' : ''}`}
                    onClick={() => setTaskAssigneeFilter('Mine')}
                  >
                    My Assigned Responsibilities ({taskList.filter(t => t.assignee.toLowerCase() === currentUser.name.toLowerCase()).length})
                  </button>
                </div>

                <div className="category-select-wrap">
                  <select
                    className="category-dropdown"
                    value={taskPriorityFilter}
                    onChange={e => setTaskPriorityFilter(e.target.value)}
                    aria-label="Filter tasks by priority"
                  >
                    <option value="All">All Priorities</option>
                    <option value="Urgent">Urgent Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
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
                      {filteredTasks.filter(t => t.status === col).length}
                    </span>
                  </button>
                ))}
              </div>

              {/* Kanban Grid */}
              <div className="kanban-grid">
                {(['Pending', 'In Progress', 'Completed'] as const).map(column => {
                  const tasksInCol = filteredTasks.filter(t => t.status === column);
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
                                  aria-label="Move task left"
                                >
                                  <ChevronLeft size={13} />
                                </button>
                              )}
                              {column !== 'Completed' && (
                                <button
                                  className="task-move-btn"
                                  onClick={() => handleMoveTask(task.id, column === 'Pending' ? 'In Progress' : 'Completed')}
                                  title="Move Right"
                                  aria-label="Move task right"
                                >
                                  <ChevronRight size={13} />
                                </button>
                              )}
                              {currentUser.role === 'OWNER' && (
                                <button
                                  className="task-move-btn"
                                  style={{ color: 'var(--loss-red)' }}
                                  onClick={() => handleDeleteTask(task.id)}
                                  title="Delete Task"
                                  aria-label="Delete task"
                                >
                                  <Trash2 size={12} />
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
              PAGE 4: TEAM CHAT & MESSAGING
              ============================================================== */}
          {activeTab === 'chat' && (
            <div>
              <div className="page-header">
                <div className="page-title-group">
                  <h1>Team Chat & Channels</h1>
                  <p>Real-time channel messaging, private direct messages, and broadcasted desk announcements.</p>
                </div>
                <div className="header-actions">
                  <button className="btn-secondary" onClick={() => setNewChatModalOpen(true)}>
                    <Plus size={14} />
                    <span>New Conversation</span>
                  </button>
                </div>
              </div>

              <div className="chat-container-layout">
                {/* Channels Sidebar */}
                <aside className="chat-sidebar">
                  <div className="chat-sidebar-header">
                    <span>CHANNELS & DMS</span>
                    <button
                      style={{ color: 'var(--text-muted)' }}
                      onClick={() => setNewChatModalOpen(true)}
                      aria-label="New chat channel"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="chat-channels-list">
                    <div>
                      <div className="chat-group-title">PUBLIC CHANNELS</div>
                      {publicChannels.map(ch => (
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
                      {directMessages.map(name => {
                        const targetStaff = staffList.find(s => s.name === name);
                        const initials = targetStaff ? targetStaff.initials : name.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase();
                        const avatarClass = targetStaff ? targetStaff.avatarClass : 'staff';
                        return (
                          <button
                            key={name}
                            className={`channel-btn ${activeChannel === name ? 'active' : ''}`}
                            onClick={() => setActiveChannel(name)}
                          >
                            <div className={`user-avatar ${avatarClass}`} style={{ width: 18, height: 18, fontSize: 9 }}>
                              {initials}
                            </div>
                            <span>{name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </aside>

                {/* Main Active Conversation Window */}
                <div className="chat-main-window">
                  {/* Mobile Channel Quick Switcher */}
                  <div className="mobile-channel-scroller">
                    {allConversations.map(ch => (
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
                        {activeChannel === '#announcements' && 'Broadcast updates and operational guidelines from Co-Owners'}
                        {activeChannel === '#sports-picks' && 'Real-time discussion on sports betting lines & odds'}
                        {activeChannel === '#macro-theses' && 'Kalshi / Polymarket economic & political contract analysis'}
                        {activeChannel === '#general' && 'General team coordination and market discussions'}
                        {!activeChannel.startsWith('#') && `Private 1-on-1 direct message with ${activeChannel}`}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                      <span className="pulsing-dot" />
                      <span>{staffList.filter(s => s.status === 'Active').length} members active</span>
                    </div>
                  </div>

                  <div className="chat-messages-area">
                    {(chatChannels[activeChannel] || []).map(msg => (
                      <div key={msg.id} className={`chat-message-row ${msg.isAnnouncement ? 'announcement-message' : ''}`}>
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
                          <div className="message-text" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {activeChannel === '#announcements' && currentUser.role !== 'OWNER' ? (
                    <div style={{ padding: '12px 16px', background: 'var(--bg-card-subtle)', borderTop: '1px solid var(--border-subtle)', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Lock size={14} />
                      <span>This channel is broadcast-only. Only Co-Owners can post desk announcements.</span>
                    </div>
                  ) : (
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
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              PAGE 5: ANALYTICS & REPORTS
              ============================================================== */}
          {activeTab === 'analytics' && (
            <div>
              <div className="page-header">
                <div className="page-title-group">
                  <h1>{currentUser.role === 'OWNER' ? 'Analytics & Performance Reports' : `${currentUser.name.split(' ')[0]}'s Personal Research Telemetry`}</h1>
                  <p>
                    {currentUser.role === 'OWNER'
                      ? 'Historical capital returns, market category win rates, and analyst performance metrics.'
                      : `Individual hit rates, model edge metrics, and task completion record for ${currentUser.name}.`}
                  </p>
                </div>
                <div className="header-actions">
                  <div className="filter-group">
                    {(['7D', '30D', '90D', 'ALL', 'CUSTOM'] as const).map(tf => (
                      <button
                        key={tf}
                        className={`filter-tab-btn ${analyticsTimeframe === tf ? 'active' : ''}`}
                        onClick={() => setAnalyticsTimeframe(tf)}
                      >
                        {tf === 'CUSTOM' ? 'Custom Range' : tf}
                      </button>
                    ))}
                  </div>
                  <button className="btn-secondary" onClick={handleExportCsv}>
                    <Download size={14} />
                    <span>Export CSV Report</span>
                  </button>
                </div>
              </div>

              {analyticsTimeframe === 'CUSTOM' && (
                <div className="custom-date-range-bar" style={{ marginBottom: '20px' }}>
                  <div className="date-input-group">
                    <Calendar size={14} style={{ color: 'var(--emerald)' }} />
                    <span className="date-label">From:</span>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={e => setCustomStartDate(e.target.value)}
                      className="date-picker-input"
                    />
                  </div>
                  <div className="date-input-group">
                    <span className="date-label">To:</span>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={e => setCustomEndDate(e.target.value)}
                      className="date-picker-input"
                    />
                  </div>
                  <span className="custom-date-pill">
                    Active Filter: {customStartDate} → {customEndDate}
                  </span>
                </div>
              )}

              {/* Analytics Top Metrics: Role-Segregated */}
              {currentUser.role === 'OWNER' ? (
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
              ) : (
                <div>
                  <div className="staff-privacy-banner">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShieldAlert size={16} style={{ color: 'var(--emerald)', flexShrink: 0 }} />
                      <span>
                        <strong>Co-Owner Master Ledger Restricted:</strong> Total firm bankroll (${metrics.totalInvested.toLocaleString()}) and firm treasury accounts are restricted. Showing your personal research accuracy and thesis attribution below.
                      </span>
                    </div>
                  </div>
                  <div className="kpi-grid">
                    <div className="kpi-card">
                      <div className="kpi-header">
                        <span className="kpi-title">MY RESEARCH HIT RATE</span>
                        <Award size={18} style={{ color: 'var(--emerald)' }} />
                      </div>
                      <div className="kpi-value">{personalMetrics.hitRate}%</div>
                      <div className="kpi-footer">
                        <span className="trend-pill positive">{personalMetrics.streak}</span>
                        <span className="kpi-subtitle">verified outcome accuracy</span>
                      </div>
                    </div>

                    <div className="kpi-card">
                      <div className="kpi-header">
                        <span className="kpi-title">MY NET VALUE ADDED</span>
                        <TrendingUp size={18} style={{ color: 'var(--win-green)' }} />
                      </div>
                      <div className="kpi-value mono" style={{ color: 'var(--win-green)' }}>
                        +${personalMetrics.netProfit.toLocaleString()}
                      </div>
                      <div className="kpi-footer">
                        <span className="trend-pill positive">Edge: {personalMetrics.avgEdge}</span>
                        <span className="kpi-subtitle">realized profit on your ideas</span>
                      </div>
                    </div>

                    <div className="kpi-card">
                      <div className="kpi-header">
                        <span className="kpi-title">TASK COMPLETION RATE</span>
                        <CheckCircle2 size={18} style={{ color: 'var(--quant-violet)' }} />
                      </div>
                      <div className="kpi-value">{personalMetrics.taskCompletionRate}%</div>
                      <div className="kpi-footer">
                        <span className="trend-pill positive">{personalMetrics.completedTasksCount}/{personalMetrics.assignedTasksCount} Completed</span>
                        <span className="kpi-subtitle">assigned operations</span>
                      </div>
                    </div>

                    <div className="kpi-card">
                      <div className="kpi-header">
                        <span className="kpi-title">TOTAL THESES LOGGED</span>
                        <Activity size={18} style={{ color: 'var(--info-blue)' }} />
                      </div>
                      <div className="kpi-value">{personalMetrics.totalTheses}</div>
                      <div className="kpi-footer">
                        <span className="trend-pill positive">{personalMetrics.pendingCount} Under Review · {personalMetrics.investedCount} Active</span>
                        <span className="kpi-subtitle">ideas submitted</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Category Performance Breakdown Grid */}
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '20px 0 12px 0', color: 'var(--text-primary)' }}>
                Performance by Market Category
              </h3>
              <div className="category-breakdown-grid">
                {categoryMetrics.map(cm => (
                  <div key={cm.category} className="category-perf-card">
                    <div className="category-perf-header">
                      <span className="category-chip">{cm.category}</span>
                      <span className="category-perf-rate">{cm.winRate === '—' ? '—' : `${cm.winRate}%`}</span>
                    </div>
                    <div className="category-mini-bar">
                      <div
                        className="category-mini-fill"
                        style={{ width: cm.winRate === '—' ? '0%' : `${cm.winRate}%` }}
                      />
                    </div>
                    <div className="category-perf-meta">
                      <span>Capital: <strong>${cm.invested.toLocaleString()}</strong></span>
                      <span style={{ color: cm.profit >= 0 ? 'var(--win-green)' : 'var(--loss-red)' }}>
                        P&L: {cm.profit >= 0 ? `+$${cm.profit}` : `-$${Math.abs(cm.profit)}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Analyst Leaderboard Table */}
              <div className="panel-card" style={{ marginBottom: '24px' }}>
                <div className="panel-head">
                  <div>
                    <h3 className="panel-title">Analyst Performance Leaderboard</h3>
                    <p className="panel-desc">Individual research track record, hit rates, and net profit generated</p>
                  </div>
                  <span className="eval-badge">
                    <Award size={13} /> Evaluated Monthly
                  </span>
                </div>

                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Analyst</th>
                        <th>Focus Area</th>
                        <th>Hit Rate (%)</th>
                        <th>Theses Logged</th>
                        <th>Net Profit</th>
                        <th>Average Edge</th>
                        <th>Current Streak</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staffList
                        .filter(s => s.role === 'STAFF')
                        .sort((a, b) => b.metrics.winRate - a.metrics.winRate)
                        .map((staff, idx) => (
                          <tr key={staff.id} style={{ cursor: 'pointer' }} onClick={() => setViewStaffModalMember(staff)}>
                            <td style={{ fontWeight: 800, color: idx === 0 ? 'var(--emerald)' : 'var(--text-secondary)' }}>
                              #{idx + 1}
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div className="user-avatar staff" style={{ width: 24, height: 24, fontSize: 10 }}>
                                  {staff.initials}
                                </div>
                                <div>
                                  <strong>{staff.name}</strong>
                                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>@{staff.username}</div>
                                </div>
                              </div>
                            </td>
                            <td><span className="category-chip">{staff.title.split('·')[0]}</span></td>
                            <td style={{ fontWeight: 700, color: staff.metrics.winRate >= 60 ? 'var(--win-green)' : 'var(--text-secondary)' }}>
                              {staff.metrics.winRate.toFixed(1)}%
                            </td>
                            <td>{staff.metrics.thesesCount} submissions</td>
                            <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: staff.metrics.netProfit >= 0 ? 'var(--win-green)' : 'var(--loss-red)' }}>
                              {staff.metrics.netProfit >= 0 ? `+$${staff.metrics.netProfit.toLocaleString()}` : `-$${Math.abs(staff.metrics.netProfit).toLocaleString()}`}
                            </td>
                            <td>{staff.metrics.avgEdge}</td>
                            <td>
                              <span className={`status-pill ${staff.metrics.streak.includes('Win') ? 'won' : 'passed'}`}>
                                {staff.metrics.streak.includes('Win') && <Flame size={12} />}
                                {staff.metrics.streak}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Historical Position Records Log */}
              <div className="panel-card">
                <div className="panel-head">
                  <div>
                    <h3 className="panel-title">Historical Position Records</h3>
                    <p className="panel-desc">Complete ledger of settled and active investment positions</p>
                  </div>
                  <button className="btn-secondary" onClick={handleExportCsv}>
                    <Download size={14} />
                    <span>Download Log (CSV)</span>
                  </button>
                </div>

                {/* Historical Records Filtering Controls */}
                <div className="filter-toolbar" style={{ margin: '14px 0' }}>
                  <div className="category-select-wrap">
                    <select
                      className="category-dropdown"
                      value={analyticsCategoryFilter}
                      onChange={e => setAnalyticsCategoryFilter(e.target.value)}
                      aria-label="Filter historical records by category"
                    >
                      <option value="All">All Categories</option>
                      <option value="Sports">Sports</option>
                      <option value="Macro">Macro</option>
                      <option value="Crypto">Crypto</option>
                      <option value="Politics">Politics</option>
                    </select>
                  </div>
                  <div className="category-select-wrap">
                    <select
                      className="category-dropdown"
                      value={analyticsStatusFilter}
                      onChange={e => setAnalyticsStatusFilter(e.target.value)}
                      aria-label="Filter historical records by status"
                    >
                      <option value="All">All Outcomes &amp; Statuses</option>
                      <option value="Won">Won Positions</option>
                      <option value="Lost">Lost Positions</option>
                      <option value="Invested">Active Invested</option>
                      <option value="Pending">Pending Review</option>
                      <option value="Passed">Passed</option>
                    </select>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                    Showing {filteredHistoricalRecords.length} of {researchList.length} positions
                  </span>
                </div>

                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Position &amp; Platform</th>
                        <th>Category</th>
                        <th>Odds</th>
                        <th>Edge</th>
                        <th>Invested Stake</th>
                        <th>Net P&amp;L</th>
                        <th>ROI</th>
                        <th>Outcome</th>
                        <th>Analyst</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHistoricalRecords.length === 0 ? (
                        <tr>
                          <td colSpan={9} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                            No historical positions match the selected filters.
                          </td>
                        </tr>
                      ) : (
                        filteredHistoricalRecords.map(item => (
                        <tr key={item.id}>
                          <td>
                            <span className="table-market-title">{item.market}</span>
                            <span className="table-sub-info">{item.id} · {item.book} · {item.date}</span>
                          </td>
                          <td><span className="category-chip">{item.category}</span></td>
                          <td><span className="odds-chip">{item.odds}</span></td>
                          <td><span className="edge-badge">{item.edge}</span></td>
                          <td style={{ fontFamily: 'var(--font-mono)' }}>
                            ${(item.actualInvested || item.suggestedStake).toLocaleString()}
                          </td>
                          <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: (item.netProfit ?? 0) >= 0 ? 'var(--win-green)' : 'var(--loss-red)' }}>
                            {item.netProfit !== undefined ? ((item.netProfit >= 0 ? `+$${item.netProfit}` : `-$${Math.abs(item.netProfit)}`)) : '—'}
                          </td>
                          <td style={{ fontFamily: 'var(--font-mono)' }}>
                            {item.roi !== undefined ? `${item.roi}%` : '—'}
                          </td>
                          <td>
                            <span className={`status-pill ${item.status.toLowerCase()}`}>
                              {item.status}
                            </span>
                          </td>
                          <td>{item.author}</td>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              PAGE 6: STAFF MANAGEMENT & DIRECTORY
              ============================================================== */}
          {activeTab === 'team' && (
            <div>
              <div className="page-header">
                <div className="page-title-group">
                  <h1>Staff Management & Team Directory</h1>
                  <p>Employee accounts, roles, responsibilities, performance metrics, and permissions.</p>
                </div>
                {currentUser.role === 'OWNER' && (
                  <div className="header-actions">
                    <button className="btn-primary" onClick={() => setAddStaffModalOpen(true)}>
                      <Plus size={16} />
                      <span>Add Staff Account</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Staff Status Filter Toolbar */}
              <div className="filter-toolbar">
                <div className="filter-group">
                  {(['All', 'Active', 'Inactive'] as const).map(st => (
                    <button
                      key={st}
                      className={`filter-tab-btn ${staffStatusFilter === st ? 'active' : ''}`}
                      onClick={() => setStaffStatusFilter(st)}
                    >
                      {st} Members
                      <span className="counter-pill">
                        {st === 'All' ? staffList.length : staffList.filter(s => s.status === st).length}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="search-box-wrap" style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: 30, fontSize: '12px', width: '220px' }}
                    placeholder="Search by name, handle, role..."
                    value={staffSearchQuery}
                    onChange={e => setStaffSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Staff Directory Table */}
              <div className="panel-card">
                <div className="table-responsive desktop-only-table">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Role Tier</th>
                        <th>Title & Focus</th>
                        <th>Submissions</th>
                        <th>Win Rate</th>
                        <th>Task Rate</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStaffList.map(member => (
                        <tr key={member.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div className={`user-avatar ${member.avatarClass}`}>
                                {member.initials}
                              </div>
                              <div>
                                <strong>{member.name}</strong>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>@{member.username} · {member.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`status-pill ${member.role === 'OWNER' ? 'won' : 'invested'}`}>
                              {member.role === 'OWNER' ? (
                                <span className="role-label-with-icon"><Crown size={12} /> CO-OWNER</span>
                              ) : (
                                <span className="role-label-with-icon"><Activity size={12} /> STAFF ANALYST</span>
                              )}
                            </span>
                          </td>
                          <td style={{ color: 'var(--text-secondary)' }}>{member.title}</td>
                          <td>{member.metrics.thesesCount} logged</td>
                          <td style={{ fontWeight: 700, color: member.metrics.winRate >= 65 ? 'var(--win-green)' : 'var(--text-secondary)' }}>
                            {member.metrics.winRate.toFixed(1)}%
                          </td>
                          <td>
                            {member.metrics.tasksTotal > 0
                              ? `${Math.round((member.metrics.tasksCompleted / member.metrics.tasksTotal) * 100)}% (${member.metrics.tasksCompleted}/${member.metrics.tasksTotal})`
                              : `0% (0/0)`}
                          </td>
                          <td>
                            <span className={`status-pill ${member.status === 'Active' ? 'won' : 'inactive'}`}>
                              ● {member.status}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <button
                                className="btn-secondary"
                                style={{ padding: '4px 8px', fontSize: '11px' }}
                                onClick={() => setViewStaffModalMember(member)}
                                title="View Complete Employee Profile"
                              >
                                Profile
                              </button>

                              {currentUser.role === 'OWNER' && (
                                <>
                                  <button
                                    className="btn-secondary"
                                    style={{ padding: '4px 8px', fontSize: '11px' }}
                                    onClick={() => setEditStaffModalMember(member)}
                                    title="Edit Roles & Permissions"
                                  >
                                    <Edit size={12} />
                                  </button>
                                  <button
                                    className="btn-secondary"
                                    style={{ padding: '4px 8px', fontSize: '11px' }}
                                    onClick={() => handleToggleStaffStatus(member.id)}
                                    title={member.status === 'Active' ? 'Deactivate account' : 'Reactivate account'}
                                  >
                                    {member.status === 'Active' ? <UserX size={12} /> : <UserCheck size={12} />}
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards View for Staff Directory */}
                <div className="mobile-only-cards">
                  {filteredStaffList.map(member => (
                    <div key={member.id} className="mobile-research-card">
                      <div className="mobile-card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className={`user-avatar ${member.avatarClass}`}>
                            {member.initials}
                          </div>
                          <div>
                            <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{member.name}</strong>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>@{member.username}</div>
                          </div>
                        </div>
                        <span className={`status-pill ${member.status === 'Active' ? 'won' : 'inactive'}`}>
                          ● {member.status}
                        </span>
                      </div>

                      <div className="mobile-metrics-strip">
                        <div className="mobile-metric-item">
                          <span className="metric-lbl">Role</span>
                          <span className="metric-val" style={{ fontSize: '11px' }}>{member.role}</span>
                        </div>
                        <div className="mobile-metric-item">
                          <span className="metric-lbl">Win Rate</span>
                          <span className="metric-val" style={{ fontSize: '11px', color: 'var(--win-green)' }}>
                            {member.metrics.winRate.toFixed(1)}%
                          </span>
                        </div>
                        <div className="mobile-metric-item">
                          <span className="metric-lbl">Tasks Done</span>
                          <span className="metric-val" style={{ fontSize: '11px' }}>
                            {member.metrics.tasksCompleted}/{member.metrics.tasksTotal}
                          </span>
                        </div>
                      </div>

                      <div className="mobile-card-footer">
                        <button
                          className="btn-secondary mobile-card-btn"
                          onClick={() => setViewStaffModalMember(member)}
                        >
                          View Profile
                        </button>
                        {currentUser.role === 'OWNER' && (
                          <button
                            className="btn-secondary mobile-card-btn"
                            onClick={() => setEditStaffModalMember(member)}
                          >
                            Edit Access
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              PAGE 7: ADMIN SETTINGS & GOVERNANCE
              ============================================================== */}
          {activeTab === 'admin' && (
            currentUser.role === 'OWNER' ? (
              <div>
              <div className="page-header">
                <div className="page-title-group">
                  <h1>Admin Settings & Team Governance</h1>
                  <p>Staff account administration, role-based permissions, company announcements, and activity audit logs.</p>
                </div>
                <div className="header-actions">
                  <button className="btn-primary" onClick={() => setAddStaffModalOpen(true)}>
                    <Plus size={16} />
                    <span>Create Staff Account</span>
                  </button>
                </div>
              </div>

              {/* Section 1: Staff Account Administration Panel */}
              <div className="panel-card" style={{ marginBottom: '24px' }}>
                <div className="panel-head">
                  <div>
                    <h3 className="panel-title">Staff Account Administration</h3>
                    <p className="panel-desc">Provision individual credentials, modify roles, deactivate, or delete staff accounts</p>
                  </div>
                  <span className="status-pill won">
                    <ShieldCheck size={14} /> Full Administrative Access
                  </span>
                </div>

                <div className="table-responsive desktop-only-table">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Account</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Joined</th>
                        <th>Last Active</th>
                        <th>Permissions Summary</th>
                        <th>Administration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staffList.map(member => (
                        <tr key={member.id}>
                          <td>
                            <strong>{member.name}</strong>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>@{member.username} · {member.email}</div>
                          </td>
                          <td>
                            <span className={`status-pill ${member.role === 'OWNER' ? 'won' : 'invested'}`}>
                              {member.role}
                            </span>
                          </td>
                          <td>
                            <span className={`status-pill ${member.status === 'Active' ? 'won' : 'inactive'}`}>
                              ● {member.status}
                            </span>
                          </td>
                          <td style={{ fontSize: '12px' }}>{member.joinedDate}</td>
                          <td style={{ fontSize: '12px' }}>{member.lastActive}</td>
                          <td style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            {member.role === 'OWNER'
                              ? `Full Admin Access (${Object.values(member.permissions).filter(Boolean).length}/6)`
                              : `Analyst Permissions (${Object.values(member.permissions).filter(Boolean).length}/6)`}
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <button
                                className="btn-secondary"
                                style={{ padding: '4px 8px', fontSize: '11px' }}
                                onClick={() => setEditStaffModalMember(member)}
                                title="Edit Permissions & Details"
                              >
                                Edit
                              </button>
                              <button
                                className="btn-secondary"
                                style={{ padding: '4px 8px', fontSize: '11px' }}
                                onClick={() => {
                                  setPasswordModalUser(member);
                                  setNewPasswordInput('');
                                  setConfirmPasswordInput('');
                                  setPasswordSuccessMsg(false);
                                }}
                                title="Reset Credentials"
                              >
                                <Key size={12} />
                              </button>
                              <button
                                className="btn-secondary"
                                style={{ padding: '4px 8px', fontSize: '11px' }}
                                onClick={() => handleToggleStaffStatus(member.id)}
                                title={member.status === 'Active' ? 'Deactivate' : 'Reactivate'}
                              >
                                {member.status === 'Active' ? <UserX size={12} /> : <UserCheck size={12} />}
                              </button>
                              {member.role !== 'OWNER' && (
                                <button
                                  className="btn-secondary"
                                  style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--loss-red)' }}
                                  onClick={() => handleDeleteStaff(member.id)}
                                  title="Delete Account"
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards View for Admin Accounts */}
                <div className="mobile-only-cards">
                  {staffList.map(member => (
                    <div key={member.id} className="mobile-research-card">
                      <div className="mobile-card-header">
                        <div>
                          <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{member.name}</strong>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>@{member.username} · {member.email}</div>
                        </div>
                        <span className={`status-pill ${member.status === 'Active' ? 'won' : 'inactive'}`}>
                          ● {member.status}
                        </span>
                      </div>

                      <div className="mobile-metrics-strip">
                        <div className="mobile-metric-item">
                          <span className="metric-lbl">Role</span>
                          <span className="metric-val" style={{ fontSize: '11px' }}>{member.role}</span>
                        </div>
                        <div className="mobile-metric-item">
                          <span className="metric-lbl">Joined</span>
                          <span className="metric-val" style={{ fontSize: '11px' }}>{member.joinedDate}</span>
                        </div>
                        <div className="mobile-metric-item">
                          <span className="metric-lbl">Access</span>
                          <span className="metric-val" style={{ fontSize: '11px' }}>
                            {Object.values(member.permissions).filter(Boolean).length}/6
                          </span>
                        </div>
                      </div>

                      <div className="mobile-card-footer" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                        <button
                          className="btn-secondary"
                          style={{ padding: '6px', fontSize: '11px', justifyContent: 'center' }}
                          onClick={() => setEditStaffModalMember(member)}
                        >
                          <Edit size={12} />
                          <span>Edit</span>
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ padding: '6px', fontSize: '11px', justifyContent: 'center' }}
                          onClick={() => {
                            setPasswordModalUser(member);
                            setNewPasswordInput('');
                            setConfirmPasswordInput('');
                            setPasswordSuccessMsg(false);
                          }}
                        >
                          <Key size={12} />
                          <span>Reset</span>
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ padding: '6px', fontSize: '11px', justifyContent: 'center' }}
                          onClick={() => handleToggleStaffStatus(member.id)}
                        >
                          {member.status === 'Active' ? <UserX size={12} /> : <UserCheck size={12} />}
                          <span>{member.status === 'Active' ? 'Deactivate' : 'Reactivate'}</span>
                        </button>
                        {member.role !== 'OWNER' && (
                          <button
                            className="btn-secondary"
                            style={{ padding: '6px', fontSize: '11px', color: 'var(--loss-red)', justifyContent: 'center' }}
                            onClick={() => handleDeleteStaff(member.id)}
                          >
                            <Trash2 size={12} />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Manage Company Announcements */}
              <div className="panel-card" style={{ marginBottom: '24px' }}>
                <div className="panel-head">
                  <div>
                    <h3 className="panel-title">Manage Company Announcement</h3>
                    <p className="panel-desc">Broadcast updates directly to the top dashboard banner and #announcements channel</p>
                  </div>
                  {announcementSavedToast && (
                    <span className="status-pill won">
                      <CheckCircle2 size={13} /> Announcement Published!
                    </span>
                  )}
                </div>

                <form onSubmit={handleSaveAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Announcement Headline *</label>
                    <input
                      className="form-input"
                      value={announcementEditTitle}
                      onChange={e => setAnnouncementEditTitle(e.target.value)}
                      placeholder="e.g. Desk Priority · Kalshi & NFL Week 10 Allocations"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Announcement Content *</label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      value={announcementEditBody}
                      onChange={e => setAnnouncementEditBody(e.target.value)}
                      placeholder="Enter announcement details for staff..."
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button type="submit" className="btn-primary">
                      <Send size={15} />
                      <span>Publish Desk Announcement</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Section 3: RBAC Permission Reference Matrix */}
              <div className="panel-card" style={{ marginBottom: '24px' }}>
                <div className="panel-head">
                  <div>
                    <h3 className="panel-title">Role-Based Access Control (RBAC) Permissions</h3>
                    <p className="panel-desc">Security model separating Owner privileges from Staff Analysts</p>
                  </div>
                  <span className="status-pill won">
                    <ShieldCheck size={14} /> Security Controls Active
                  </span>
                </div>

                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>System Capability</th>
                        <th>Owners (Admins)</th>
                        <th>Staff / Analysts</th>
                        <th>Security Enforcement</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Review & Allocate Capital ($ Sizing)</strong></td>
                        <td><span className="rbac-badge allowed"><Check size={12} /> Full Access</span></td>
                        <td><span className="rbac-badge restricted"><X size={12} /> Restricted (Hidden)</span></td>
                        <td>Server-side RBAC Guard</td>
                      </tr>
                      <tr>
                        <td><strong>Create, Deactivate & Delete Staff Accounts</strong></td>
                        <td><span className="rbac-badge allowed"><Check size={12} /> Full Access</span></td>
                        <td><span className="rbac-badge restricted"><X size={12} /> Restricted</span></td>
                        <td>Owner session authorization</td>
                      </tr>
                      <tr>
                        <td><strong>Firm-Wide Financial P&L & Balance</strong></td>
                        <td><span className="rbac-badge allowed"><Check size={12} /> Full Access</span></td>
                        <td><span className="rbac-badge partial"><Lock size={12} /> Assigned Markets Only</span></td>
                        <td>Isolated Ledger View</td>
                      </tr>
                      <tr>
                        <td><strong>Submit Prediction Market Research Theses</strong></td>
                        <td><span className="rbac-badge allowed"><Check size={12} /> Allowed</span></td>
                        <td><span className="rbac-badge allowed"><Check size={12} /> Core Responsibility</span></td>
                        <td>Submission Pipeline</td>
                      </tr>
                      <tr>
                        <td><strong>Post Company Announcements</strong></td>
                        <td><span className="rbac-badge allowed"><Check size={12} /> Broadcast Access</span></td>
                        <td><span className="rbac-badge partial">Read Only</span></td>
                        <td>Channel Admin Guard</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 4: Live Activity & Security Audit Log */}
              <div className="panel-card">
                <div className="panel-head">
                  <div>
                    <h3 className="panel-title">Live Security & Activity Audit Log</h3>
                    <p className="panel-desc">Audit trail of administrative actions, capital allocations, and task updates</p>
                  </div>
                  <div className="category-select-wrap">
                    <select
                      className="category-dropdown"
                      value={auditCategoryFilter}
                      onChange={e => setAuditCategoryFilter(e.target.value)}
                      aria-label="Filter audit log"
                    >
                      <option value="All">All Events</option>
                      <option value="CAPITAL">Capital & Sizing</option>
                      <option value="STAFF">Staff Management</option>
                      <option value="AUTH">Auth & Research</option>
                      <option value="TASK">Tasks</option>
                      <option value="ANNOUNCEMENT">Announcements</option>
                    </select>
                  </div>
                </div>

                <div className="audit-log-list">
                  {filteredAuditLogs.map(log => (
                    <div key={log.id} className="audit-log-item-row">
                      <div className="audit-log-left">
                        <span className={`audit-badge ${log.category.toLowerCase()}`}>
                          {log.category}
                        </span>
                        <span>
                          <strong>{log.actor}</strong> ({log.actorRole}): {log.action}
                        </span>
                      </div>
                      <time style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {log.timestamp}
                      </time>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            ) : (
              <div className="access-restricted-card">
                <div className="access-restricted-icon">
                  <ShieldCheck size={30} />
                </div>
                <h2>Access Restricted</h2>
                <p>
                  You are currently viewing TwoManMarkets as <strong>{currentUser.name}</strong> ({currentUser.title}).
                  Admin Settings, staff provisioning, and company announcement broadcasts are restricted to Co-Owner accounts.
                </p>
                <div className="access-restricted-actions">
                  <button
                    className="btn-primary"
                    onClick={() => {
                      const owner = staffList.find(s => s.role === 'OWNER') || INITIAL_STAFF[0];
                      setCurrentUser(owner);
                    }}
                  >
                    <Crown size={15} />
                    <span>Switch to Owner Perspective (Luis)</span>
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => setActiveTab('overview')}
                  >
                    <LayoutDashboard size={15} />
                    <span>Return to Dashboard</span>
                  </button>
                </div>
              </div>
            )
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
                addAuditLog(`Submitted research thesis ${newItem.id} (${newItem.market})`, 'AUTH');
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
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Calculated Edge</span>
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
                          <span>
                            Mark Settle WON (+${Math.round(reviewModalItem.actualInvested * 0.91).toLocaleString()} Net P&amp;L)
                          </span>
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
                <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-card-subtle)', border: '1px solid var(--border-subtle)', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lock size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  <span>Capital allocation and settlement controls are restricted to Co-Owner accounts. (Switch to Luis profile in the top-right to test decision controls).</span>
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
              <h3 className="modal-title">Create &amp; Assign Task</h3>
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
                const dueDate = (formData.get('dueDate') as string) || 'Due Friday';

                const targetStaff = staffList.find(s => s.name === assignee);
                const initials = targetStaff
                  ? targetStaff.initials
                  : assignee.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase();

                const newTask: TaskItem = {
                  id: `task-${Date.now()}`,
                  title,
                  description: desc,
                  assignee,
                  assigneeInitials: initials,
                  dueDate,
                  priority,
                  status: 'Pending'
                };

                setTaskList(prev => [newTask, ...prev]);
                addAuditLog(`Created task "${title}" assigned to ${assignee}`, 'TASK');
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
                  <label className="form-label">Assignee *</label>
                  <select name="assignee" className="form-select">
                    {staffList.filter(s => s.status === 'Active').map(s => (
                      <option key={s.id} value={s.name}>{s.name} ({s.title.split('·')[0].trim()})</option>
                    ))}
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
                <label className="form-label">Deadline / Due Date</label>
                <input
                  name="dueDate"
                  className="form-input"
                  placeholder="e.g. Today · 5:00 PM or Nov 14"
                  defaultValue="Due Friday"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description &amp; Deliverables</label>
                <textarea
                  name="desc"
                  rows={3}
                  className="form-textarea"
                  placeholder="Specific requirements, dataset links, and expected completion criteria..."
                  defaultValue="Extract implied yield curve probability distributions ahead of upcoming print."
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

      {/* MODAL 4: Invite / Add Staff Account */}
      {addStaffModalOpen && (
        <div className="modal-backdrop" onClick={() => setAddStaffModalOpen(false)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create New Staff Account</h3>
              <button className="modal-close-btn" onClick={() => setAddStaffModalOpen(false)} aria-label="Close modal">
                <X size={18} />
              </button>
            </div>

            <form
              className="modal-body"
              onSubmit={e => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = (formData.get('name') as string).trim();
                const username = (formData.get('username') as string).trim().toLowerCase();
                const email = (formData.get('email') as string).trim();
                const role = (formData.get('role') as Role) || 'STAFF';
                const title = (formData.get('title') as string).trim() || 'Research Analyst';

                const newMember: StaffMember = {
                  id: `u-${Date.now()}`,
                  username,
                  name,
                  email,
                  role,
                  title,
                  initials: name.split(' ').map(x => x[0]).join('').toUpperCase().slice(0, 2),
                  avatarClass: role === 'OWNER' ? 'owner' : 'staff',
                  status: 'Active',
                  joinedDate: 'Nov 2026',
                  lastActive: 'Just now',
                  responsibilities: ['Market analysis and research theses submission', 'Task deliverables'],
                  permissions: {
                    canSubmitResearch: true,
                    canAllocateCapital: role === 'OWNER',
                    canManageTasks: true,
                    canViewAnalytics: true,
                    canPostAnnouncements: role === 'OWNER',
                    canManageStaff: role === 'OWNER'
                  },
                  metrics: {
                    winRate: 0,
                    thesesCount: 0,
                    netProfit: 0,
                    tasksCompleted: 0,
                    tasksTotal: 0,
                    streak: 'New',
                    avgEdge: '—'
                  }
                };

                setStaffList([...staffList, newMember]);
                addAuditLog(`Created new ${role} account for ${name} (@${username})`, 'STAFF');
                setAddStaffModalOpen(false);
              }}
            >
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input name="name" required className="form-input" placeholder="e.g. Taylor Brooks" />
                </div>
                <div className="form-group">
                  <label className="form-label">Username *</label>
                  <input name="username" required className="form-input" placeholder="e.g. tbrooks" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Corporate Email Address *</label>
                <input name="email" required type="email" className="form-input" placeholder="taylor@twomanmarkets.internal" />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Role Tier</label>
                  <select name="role" className="form-select">
                    <option value="STAFF">Staff / Analyst</option>
                    <option value="OWNER">Co-Owner / Admin</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Title &amp; Focus</label>
                  <input name="title" className="form-input" defaultValue="Sports Quantitative Analyst" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Temporary Provisioning Password</label>
                <input
                  type="password"
                  className="form-input"
                  defaultValue="InitialAuth2026#"
                  disabled
                />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  Secure temporary password will be sent to the employee email with mandatory first-login reset.
                </span>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setAddStaffModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Plus size={16} />
                  <span>Provision Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Edit Staff Member & Permissions */}
      {editStaffModalMember && (
        <div className="modal-backdrop" onClick={() => setEditStaffModalMember(null)}>
          <div className="modal-dialog large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span style={{ fontSize: '11px', color: 'var(--emerald)', fontWeight: 700 }}>
                  ACCOUNT MANAGEMENT · {editStaffModalMember.id}
                </span>
                <h3 className="modal-title" style={{ marginTop: '4px' }}>
                  Edit {editStaffModalMember.name} (@{editStaffModalMember.username})
                </h3>
              </div>
              <button className="modal-close-btn" onClick={() => setEditStaffModalMember(null)} aria-label="Close modal">
                <X size={18} />
              </button>
            </div>

            <form
              className="modal-body"
              onSubmit={e => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const title = formData.get('title') as string;
                const email = formData.get('email') as string;
                const canSubmit = formData.get('canSubmitResearch') === 'on';
                const canAllocate = formData.get('canAllocateCapital') === 'on';
                const canManageT = formData.get('canManageTasks') === 'on';
                const canViewA = formData.get('canViewAnalytics') === 'on';
                const canPostA = formData.get('canPostAnnouncements') === 'on';
                const canManageS = formData.get('canManageStaff') === 'on';

                setStaffList(prev => prev.map(m => {
                  if (m.id === editStaffModalMember.id) {
                    return {
                      ...m,
                      title,
                      email,
                      permissions: {
                        canSubmitResearch: canSubmit,
                        canAllocateCapital: canAllocate,
                        canManageTasks: canManageT,
                        canViewAnalytics: canViewA,
                        canPostAnnouncements: canPostA,
                        canManageStaff: canManageS
                      }
                    };
                  }
                  return m;
                }));

                addAuditLog(`Updated permissions & profile for ${editStaffModalMember.name}`, 'STAFF');
                setEditStaffModalMember(null);
              }}
            >
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" defaultValue={editStaffModalMember.name} disabled />
                </div>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input className="form-input" defaultValue={editStaffModalMember.username} disabled />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Title / Role Focus</label>
                  <input name="title" className="form-input" defaultValue={editStaffModalMember.title} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input name="email" type="email" className="form-input" defaultValue={editStaffModalMember.email} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Granular RBAC Permissions</label>
                <div className="permissions-grid">
                  <label className="permission-toggle-item">
                    <input
                      type="checkbox"
                      name="canSubmitResearch"
                      defaultChecked={editStaffModalMember.permissions.canSubmitResearch}
                    />
                    <div className="permission-toggle-text">
                      <strong>Submit Research Theses</strong>
                      <p>Can research prediction markets and submit theses for review</p>
                    </div>
                  </label>

                  <label className="permission-toggle-item">
                    <input
                      type="checkbox"
                      name="canAllocateCapital"
                      defaultChecked={editStaffModalMember.permissions.canAllocateCapital}
                    />
                    <div className="permission-toggle-text">
                      <strong>Allocate Capital &amp; Sizing</strong>
                      <p>Can approve dollar sizing and settle position outcomes</p>
                    </div>
                  </label>

                  <label className="permission-toggle-item">
                    <input
                      type="checkbox"
                      name="canManageTasks"
                      defaultChecked={editStaffModalMember.permissions.canManageTasks}
                    />
                    <div className="permission-toggle-text">
                      <strong>Manage Tasks</strong>
                      <p>Can create, update, and advance task statuses</p>
                    </div>
                  </label>

                  <label className="permission-toggle-item">
                    <input
                      type="checkbox"
                      name="canViewAnalytics"
                      defaultChecked={editStaffModalMember.permissions.canViewAnalytics}
                    />
                    <div className="permission-toggle-text">
                      <strong>View Analytics &amp; Reports</strong>
                      <p>Can access firm-wide performance dashboards</p>
                    </div>
                  </label>

                  <label className="permission-toggle-item">
                    <input
                      type="checkbox"
                      name="canPostAnnouncements"
                      defaultChecked={editStaffModalMember.permissions.canPostAnnouncements}
                    />
                    <div className="permission-toggle-text">
                      <strong>Post Announcements</strong>
                      <p>Can broadcast desk-wide notifications to the team</p>
                    </div>
                  </label>

                  <label className="permission-toggle-item">
                    <input
                      type="checkbox"
                      name="canManageStaff"
                      defaultChecked={editStaffModalMember.permissions.canManageStaff}
                    />
                    <div className="permission-toggle-text">
                      <strong>Manage Staff Accounts</strong>
                      <p>Can provision, edit, and deactivate other employee accounts</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setEditStaffModalMember(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Check size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: View Individual Employee Profile */}
      {viewStaffModalMember && (
        <div className="modal-backdrop" onClick={() => setViewStaffModalMember(null)}>
          <div className="modal-dialog large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className={`user-avatar ${viewStaffModalMember.avatarClass}`} style={{ width: 42, height: 42, fontSize: 16 }}>
                  {viewStaffModalMember.initials}
                </div>
                <div>
                  <h3 className="modal-title">{viewStaffModalMember.name}</h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    @{viewStaffModalMember.username} · {viewStaffModalMember.email} · {viewStaffModalMember.title}
                  </div>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setViewStaffModalMember(null)} aria-label="Close modal">
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {/* Account Overview Chips */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span className={`status-pill ${viewStaffModalMember.role === 'OWNER' ? 'won' : 'invested'}`}>
                  {viewStaffModalMember.role === 'OWNER' ? 'CO-OWNER / ADMIN' : 'STAFF RESEARCHER'}
                </span>
                <span className={`status-pill ${viewStaffModalMember.status === 'Active' ? 'won' : 'inactive'}`}>
                  Account: {viewStaffModalMember.status}
                </span>
                <span className="category-chip">Joined: {viewStaffModalMember.joinedDate}</span>
                <span className="category-chip">Last Active: {viewStaffModalMember.lastActive}</span>
              </div>

              {/* Performance Metrics Grid */}
              <div className="profile-metrics-grid">
                <div className="profile-metric-box">
                  <span className="profile-metric-lbl">Win Rate</span>
                  <span className="profile-metric-val green">{viewStaffModalMember.metrics.winRate.toFixed(1)}%</span>
                </div>
                <div className="profile-metric-box">
                  <span className="profile-metric-lbl">Theses Logged</span>
                  <span className="profile-metric-val">{viewStaffModalMember.metrics.thesesCount}</span>
                </div>
                <div className="profile-metric-box">
                  <span className="profile-metric-lbl">Net Profit</span>
                  <span className="profile-metric-val green">
                    +${viewStaffModalMember.metrics.netProfit.toLocaleString()}
                  </span>
                </div>
                <div className="profile-metric-box">
                  <span className="profile-metric-lbl">Tasks Done</span>
                  <span className="profile-metric-val">
                    {viewStaffModalMember.metrics.tasksCompleted}/{viewStaffModalMember.metrics.tasksTotal}
                  </span>
                </div>
                <div className="profile-metric-box">
                  <span className="profile-metric-lbl">Streak</span>
                  <span className="profile-metric-val">{viewStaffModalMember.metrics.streak}</span>
                </div>
              </div>

              {/* Responsibilities */}
              <div className="form-group">
                <label className="form-label">Core Responsibilities</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {viewStaffModalMember.responsibilities.map((resp, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <Check size={14} style={{ color: 'var(--emerald)' }} />
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Permissions Summary */}
              <div className="form-group">
                <label className="form-label">Active Permissions</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {Object.entries(viewStaffModalMember.permissions).map(([key, val]) => (
                    <span
                      key={key}
                      className="category-chip"
                      style={{ opacity: val ? 1 : 0.4, borderColor: val ? 'var(--emerald)' : 'var(--border-subtle)' }}
                    >
                      {val ? <Check size={11} style={{ color: 'var(--emerald)' }} /> : <X size={11} />}
                      {key.replace('can', '')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Admin Actions */}
              {currentUser.role === 'OWNER' && (
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setEditStaffModalMember(viewStaffModalMember);
                      setViewStaffModalMember(null);
                    }}
                  >
                    <Edit size={14} />
                    <span>Edit Permissions</span>
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setPasswordModalUser(viewStaffModalMember);
                      setNewPasswordInput('');
                      setConfirmPasswordInput('');
                      setPasswordSuccessMsg(false);
                      setViewStaffModalMember(null);
                    }}
                  >
                    <Key size={14} />
                    <span>Reset Credentials</span>
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      handleToggleStaffStatus(viewStaffModalMember.id);
                      setViewStaffModalMember(null);
                    }}
                  >
                    {viewStaffModalMember.status === 'Active' ? <UserX size={14} /> : <UserCheck size={14} />}
                    <span>{viewStaffModalMember.status === 'Active' ? 'Deactivate Account' : 'Reactivate Account'}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setViewStaffModalMember(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: Password Management / Reset Credentials */}
      {passwordModalUser && (
        <div className="modal-backdrop" onClick={() => setPasswordModalUser(null)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Reset Credentials · {passwordModalUser.name}</h3>
              <button className="modal-close-btn" onClick={() => setPasswordModalUser(null)} aria-label="Close modal">
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {passwordSuccessMsg ? (
                <div style={{ padding: '16px', background: 'var(--win-green-bg)', border: '1px solid var(--win-green-border)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <CheckCircle2 size={28} style={{ color: 'var(--win-green)', margin: '0 auto 8px auto' }} />
                  <strong style={{ color: 'var(--win-green)', display: 'block', marginBottom: '4px' }}>
                    Credentials Successfully Updated
                  </strong>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                    Password reset link and security verification dispatched to {passwordModalUser.email}.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (newPasswordInput.length < 8) {
                      alert('Password must be at least 8 characters.');
                      return;
                    }
                    if (newPasswordInput !== confirmPasswordInput) {
                      alert('Passwords do not match.');
                      return;
                    }
                    setPasswordSuccessMsg(true);
                    addAuditLog(`Updated login credentials for ${passwordModalUser.name} (@${passwordModalUser.username})`, 'AUTH');
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
                >
                  <div className="form-group">
                    <label className="form-label">Target Username</label>
                    <input className="form-input" value={`@${passwordModalUser.username}`} disabled />
                  </div>

                  <div className="form-group">
                    <label className="form-label">New Secure Password *</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Minimum 8 characters"
                      value={newPasswordInput}
                      onChange={e => setNewPasswordInput(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm New Password *</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Re-enter password"
                      value={confirmPasswordInput}
                      onChange={e => setConfirmPasswordInput(e.target.value)}
                      required
                    />
                  </div>

                  {/* Password Requirements Checklist */}
                  <div className="pw-requirements-list">
                    <div className={`pw-req-item ${newPasswordInput.length >= 8 ? 'met' : ''}`}>
                      <Check size={12} />
                      <span>At least 8 characters</span>
                    </div>
                    <div className={`pw-req-item ${/[A-Z]/.test(newPasswordInput) ? 'met' : ''}`}>
                      <Check size={12} />
                      <span>Contains uppercase letter</span>
                    </div>
                    <div className={`pw-req-item ${/[0-9]/.test(newPasswordInput) ? 'met' : ''}`}>
                      <Check size={12} />
                      <span>Contains number or symbol</span>
                    </div>
                    <div className={`pw-req-item ${newPasswordInput && newPasswordInput === confirmPasswordInput ? 'met' : ''}`}>
                      <Check size={12} />
                      <span>Passwords match</span>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn-secondary" onClick={() => setPasswordModalUser(null)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      <Key size={16} />
                      <span>Update Credentials</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {passwordSuccessMsg && (
              <div className="modal-footer">
                <button className="btn-primary" onClick={() => setPasswordModalUser(null)}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 8: New Conversation / Channel Modal */}
      {newChatModalOpen && (
        <div className="modal-backdrop" onClick={() => setNewChatModalOpen(false)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Start Conversation or Create Channel</h3>
              <button className="modal-close-btn" onClick={() => setNewChatModalOpen(false)} aria-label="Close modal">
                <X size={18} />
              </button>
            </div>

            <form
              className="modal-body"
              onSubmit={e => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const rawName = ((formData.get('name') as string) || '').trim();
                if (!rawName) return;

                const channelKey = newChatType === 'channel'
                  ? (rawName.startsWith('#') ? rawName : `#${rawName.toLowerCase().replace(/\s+/g, '-')}`)
                  : rawName;

                setChatChannels(prev => {
                  if (prev[channelKey]) return prev;
                  return { ...prev, [channelKey]: [] };
                });
                setActiveChannel(channelKey);
                setActiveTab('chat');
                setNewChatModalOpen(false);
              }}
            >
              <div className="form-group">
                <label className="form-label">Conversation Type</label>
                <select
                  name="type"
                  className="form-select"
                  value={newChatType}
                  onChange={e => setNewChatType(e.target.value as 'dm' | 'channel')}
                >
                  <option value="dm">Direct Message with Team Member</option>
                  <option value="channel">New Topic Channel</option>
                </select>
              </div>

              {newChatType === 'dm' ? (
                <div className="form-group">
                  <label className="form-label">Select Team Member *</label>
                  <select name="name" className="form-select" required>
                    {staffList
                      .filter(s => s.id !== currentUser.id && s.status === 'Active')
                      .map(s => (
                        <option key={s.id} value={s.name}>
                          {s.name} ({s.title.split('·')[0].trim()})
                        </option>
                      ))}
                  </select>
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">Channel Name *</label>
                  <input
                    name="name"
                    className="form-input"
                    placeholder="e.g. #arbitrage-alerts or #college-hoops"
                    defaultValue="#arbitrage-alerts"
                    required
                  />
                </div>
              )}

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setNewChatModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Plus size={16} />
                  <span>Open Conversation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
