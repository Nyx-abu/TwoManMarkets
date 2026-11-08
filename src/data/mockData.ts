import {
  StaffMember,
  ResearchItem,
  TaskItem,
  ChatMessage,
  NotificationItem,
  AuditLogItem,
  DeskAnnouncement,
  LiveMarketTicker
} from '../types';

/**
 * TwoManMarkets — Initial Seed Data & State Fixtures
 * 
 * ============================================================================
 * ARCHITECTURE & DATA LINEAGE NOTE (Nyx - 08:38 PM):
 * ----------------------------------------------------------------------------
 * Direction / Lineage:
 * - https://shineup-crm-demo.vercel.app/crm/admin
 * - https://crm-erp-demo.vercel.app/dashboard
 * 
 * In ShineUp CRM/ERP, our data seeds modeled enterprise construction, retail,
 * and manufacturing companies (technicians, warehouse stock, job invoices).
 * 
 * For TwoManMarkets, we took that proven relational schema structure and
 * completely retrofitted it for a quantitative sports & prediction market syndicate:
 * - Staff members now represent Quantitative Analysts & Capital Allocators
 * - Job invoices & tickets became Research Theses with bookmaker lines & Kelly stakes
 * - Work orders became analytical due-diligence Tasks
 * - System logs became financial settlement & capital allocation Audit Trails
 * ============================================================================
 */

/*
// ============================================================================
// [REUSED FROM SHINEUP ERP - HISTORICAL DATA PATTERN]
// In ShineUp CRM, user records had department tags and hourly billable rates:
//
// const LEGACY_SHINEUP_STAFF_EXAMPLE = {
//   id: 'emp-101',
//   name: 'Marcus Vance',
//   department: 'Field Operations / HVAC',
//   billingRate: 85.00,
//   assignedVanNumber: 'VAN-04',
//   status: 'On Site'
// };
//
// Refactored below into quantitative sports betting roles (win rates, edge, bankroll).
// ============================================================================
*/

export const INITIAL_STAFF: StaffMember[] = [
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

export const INITIAL_RESEARCH: ResearchItem[] = [
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
    thesis: 'Chiefs defense coming off bye week healthy. Line opened at -3 and dipped to -2.5 on early public action, solid entry before kickoff.',
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
    thesis: 'Recent jobs data and inflation prints point to a 25bps rate cut in December. Kalshi contract trades at 78 cents which looks undervalued compared to Polymarket.',
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
    thesis: 'Strong ETF spot inflows over the last 3 days with solid support above 82k. Target hit and settled early.',
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
    thesis: 'Saliba and Gabriel both starting at center back. Chelsea struggling to score away in recent derbies, odds on clean sheet at +145 are great value.',
    sourceUrl: 'https://betfair.com/football/premier-league'
  },
  {
    id: 'TMM-1038',
    market: 'State Senate Special Election - Democratic Win',
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
    thesis: 'Turnout numbers in rural precincts are unpredictable right now. Not enough edge to justify locking up capital here.',
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
    thesis: 'Expected high pace game. Warriors were on track going into the 4th quarter but missed almost every three in the final 6 minutes to finish at 114.',
    sourceUrl: 'https://draftkings.com/sportsbook/nba'
  }
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Check Chiefs vs 49ers line on DraftKings',
    description: 'Compare spread with Pinnacle and submit pick before Friday evening.',
    assignee: 'Maya Chen',
    assigneeInitials: 'MC',
    dueDate: 'Today · 5:00 PM',
    priority: 'Urgent',
    status: 'Pending'
  },
  {
    id: 'task-2',
    title: 'Review Kalshi December Fed rate contract',
    description: 'See if price moved past 80 cents after the morning jobs report.',
    assignee: 'Jordan Lee',
    assigneeInitials: 'JL',
    dueDate: 'Tomorrow',
    priority: 'High',
    status: 'In Progress'
  },
  {
    id: 'task-3',
    title: 'Check Polymarket crypto volume trends',
    description: 'Look at 85k BTC market depth to see if liquidity is holding.',
    assignee: 'Sam Rivera',
    assigneeInitials: 'SR',
    dueDate: 'Nov 11',
    priority: 'Medium',
    status: 'In Progress'
  },
  {
    id: 'task-4',
    title: 'Test creating staff accounts and reset passwords',
    description: 'Make sure new analyst logins work and permissions save properly.',
    assignee: 'Luis',
    assigneeInitials: 'LB',
    dueDate: 'Completed yesterday',
    priority: 'Medium',
    status: 'Completed'
  },
  {
    id: 'task-5',
    title: 'Verify weekend soccer settlements',
    description: 'Double check payout numbers on the Arsenal clean sheet bet.',
    assignee: 'Maya Chen',
    assigneeInitials: 'MC',
    dueDate: 'Completed Nov 6',
    priority: 'Low',
    status: 'Completed'
  }
];

export const INITIAL_CHATS: Record<string, ChatMessage[]> = {
  '#announcements': [
    {
      id: 'c-1',
      sender: 'Luis',
      role: 'OWNER',
      initials: 'LB',
      time: 'Yesterday 09:00 AM',
      text: 'Hey team, testing out the new internal dashboard today. Please submit all sports and prediction market picks through the Research tab instead of DMing screenshots.',
      isAnnouncement: true
    },
    {
      id: 'c-2',
      sender: 'Luis',
      role: 'OWNER',
      initials: 'LB',
      time: 'Today 08:00 AM',
      text: 'Check your assigned tasks in the Tasks tab and let me know if anything looks buggy or if you have suggestions.',
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
      text: 'pinnacle just moved Chiefs to -2.5, submitted research in the tab with notes'
    },
    {
      id: 'c-4',
      sender: 'Luis',
      role: 'OWNER',
      initials: 'LB',
      time: '10:20 AM',
      text: 'looks good Maya, approved and put in $1,500 at -110'
    },
    {
      id: 'c-5b',
      sender: 'Maya Chen',
      role: 'STAFF',
      initials: 'MC',
      time: '10:22 AM',
      text: 'sweet, watching the injury report today to see if line shifts again'
    }
  ],
  '#macro-theses': [
    {
      id: 'c-5',
      sender: 'Jordan Lee',
      role: 'STAFF',
      initials: 'JL',
      time: '08:35 AM',
      text: 'fed dec rate cut on kalshi is trading at 78 cents right now'
    },
    {
      id: 'c-6',
      sender: 'Jordan Lee',
      role: 'STAFF',
      initials: 'JL',
      time: '08:42 AM',
      text: 'submitted research for review, thinking we size this before tomorrow'
    },
    {
      id: 'c-6b',
      sender: 'Alex (Partner)',
      role: 'OWNER',
      initials: 'AM',
      time: '08:45 AM',
      text: 'checking now Jordan, will review in a sec'
    }
  ],
  '#general': [
    {
      id: 'c-7',
      sender: 'Sam Rivera',
      role: 'STAFF',
      initials: 'SR',
      time: '09:12 AM',
      text: 'morning guys! btc hit 85k overnight so that polymarket bet settled won'
    },
    {
      id: 'c-8',
      sender: 'Luis',
      role: 'OWNER',
      initials: 'LB',
      time: '09:15 AM',
      text: 'nice catch on that one Sam'
    },
    {
      id: 'c-9',
      sender: 'Maya Chen',
      role: 'STAFF',
      initials: 'MC',
      time: '09:18 AM',
      text: 'the dark theme looks so much cleaner than our old setup haha'
    },
    {
      id: 'c-10',
      sender: 'Jordan Lee',
      role: 'STAFF',
      initials: 'JL',
      time: '09:20 AM',
      text: 'fr way easier to track tasks here'
    }
  ],
  'Maya Chen': [
    {
      id: 'c-dm-1',
      sender: 'Luis',
      role: 'OWNER',
      initials: 'LB',
      time: 'Yesterday 04:30 PM',
      text: 'hey Maya did you get a chance to check the nfl week 10 numbers?'
    },
    {
      id: 'c-dm-2',
      sender: 'Maya Chen',
      role: 'STAFF',
      initials: 'MC',
      time: 'Yesterday 04:35 PM',
      text: 'yeah just submitted the chiefs pick, checking bills game next'
    }
  ],
  'Jordan Lee': [
    {
      id: 'c-dm-3',
      sender: 'Alex (Partner)',
      role: 'OWNER',
      initials: 'AM',
      time: 'Today 08:15 AM',
      text: 'hey Jordan take a look at the kalshi rates when you get a min'
    },
    {
      id: 'c-dm-4',
      sender: 'Jordan Lee',
      role: 'STAFF',
      initials: 'JL',
      time: 'Today 08:20 AM',
      text: 'on it, posting notes in #macro-theses now'
    }
  ],
  'Sam Rivera': [
    {
      id: 'c-dm-5',
      sender: 'Luis',
      role: 'OWNER',
      initials: 'LB',
      time: 'Nov 6, 2026',
      text: 'nice call on the btc bet yesterday'
    },
    {
      id: 'c-dm-5b',
      sender: 'Sam Rivera',
      role: 'STAFF',
      initials: 'SR',
      time: 'Nov 6, 2026',
      text: 'thanks Luis! looking into solana markets next'
    }
  ],
  'Alex (Partner)': [
    {
      id: 'c-dm-6',
      sender: 'Luis',
      role: 'OWNER',
      initials: 'LB',
      time: 'Today 07:30 AM',
      text: 'morning Alex, reviewing Jordans kalshi pick right now. let me know if you want to split the stake.'
    }
  ]
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'New Research Submitted',
    message: 'Jordan submitted research on US Fed Rate Cut (Kalshi)',
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
    message: 'New urgent task: Check Chiefs vs 49ers line on DraftKings',
    time: '2 hrs ago',
    read: false,
    type: 'task'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'aud-1',
    actor: 'Luis',
    actorRole: 'OWNER',
    action: 'Allocated $1,500 stake on Chiefs vs 49ers (-110)',
    category: 'CAPITAL',
    timestamp: 'Today 10:20 AM'
  },
  {
    id: 'aud-2',
    actor: 'Jordan Lee',
    actorRole: 'STAFF',
    action: 'Submitted research on US Fed Rate Cut in Dec (Kalshi)',
    category: 'AUTH',
    timestamp: 'Today 08:30 AM'
  },
  {
    id: 'aud-3',
    actor: 'Luis',
    actorRole: 'OWNER',
    action: 'Posted announcement: "Dashboard Testing & Weekend Research"',
    category: 'ANNOUNCEMENT',
    timestamp: 'Today 08:00 AM'
  },
  {
    id: 'aud-4',
    actor: 'Alex (Partner)',
    actorRole: 'OWNER',
    action: 'Updated permissions for Sports Quantitative Desk',
    category: 'STAFF',
    timestamp: 'Yesterday 04:15 PM'
  },
  {
    id: 'aud-5',
    actor: 'Maya Chen',
    actorRole: 'STAFF',
    action: 'Updated status of task "Check Chiefs vs 49ers line on DraftKings" to In Progress',
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

export const INITIAL_ANNOUNCEMENT: DeskAnnouncement = {
  title: 'Dashboard Testing & Weekend Research',
  body: 'Hey team, we are testing the new internal dashboard. Please submit all sports and prediction market picks through the Research tab. Drop any feedback in #general.',
  author: 'Luis (Co-Owner)',
  postedAt: 'Today 09:30 AM',
  priority: 'Normal'
};

export const LIVE_ODDS_TICKER: LiveMarketTicker[] = [
  {
    id: 'tick-1',
    market: 'NFL · Chiefs -2.5:',
    odds: '-110 (52.4%)',
    change: '+5.2% Edge',
    type: 'edge'
  },
  {
    id: 'tick-2',
    market: 'Kalshi · Fed Dec Cut:',
    odds: '78¢ (78.0%)',
    change: '+6.5% Edge',
    type: 'edge'
  },
  {
    id: 'tick-3',
    market: 'Polymarket · BTC > $85k:',
    odds: '62¢ (62.0%)',
    change: 'Settled Won',
    type: 'settled'
  },
  {
    id: 'tick-4',
    market: 'EPL · Arsenal Clean Sheet:',
    odds: '+145 (40.8%)',
    change: '+145% ROI',
    type: 'roi'
  }
];
