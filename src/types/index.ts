// Data contracts and domain types
export type Role = 'OWNER' | 'STAFF';

export interface StaffPermissions {
  canSubmitResearch: boolean;
  canAllocateCapital: boolean;
  canManageTasks: boolean;
  canViewAnalytics: boolean;
  canPostAnnouncements: boolean;
  canManageStaff: boolean;
}

// TODO: remove old permissions schema from previous project
// export interface LegacyEnterprisePermissions {
//   canManageTenants: boolean;
//   canCreateInvoices: boolean;
//   canApproveExpenses: boolean;
//   canViewGrossPayroll: boolean;
//   canDispatchFieldTechnicians: boolean;
//   canAccessWarehouseInventory: boolean;
//   departmentAccess: ('HR' | 'Procurement' | 'FieldOperations' | 'Finance')[];
// }

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

// User is an alias for StaffMember conforming to user model contract
export type User = StaffMember;

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

// Activity & security audit trail item
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

export interface LiveMarketTicker {
  id: string;
  market: string;
  odds: string;
  change: string;
  type: 'edge' | 'settled' | 'roi';
}

// Shared Telemetry & Analytics Models
export interface FirmMetrics {
  totalInvested: number;
  totalProfit: number;
  wonCount: number;
  lostCount: number;
  settledCount: number;
  winRate: string;
  overallRoi: string;
  pendingCount: number;
  investedCount: number;
  totalTheses: number;
  profitFactor: string;
  sharpeRatio: string;
  avgEdge: string;
}

export interface CategoryMetric {
  category: 'Sports' | 'Macro' | 'Crypto' | 'Politics';
  totalItems: number;
  invested: number;
  profit: number;
  winRate: string;
  won: number;
  settled: number;
}

export interface TaskProgress {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  urgent: number;
  percent: number;
}

export interface PersonalMetrics {
  myItems: ResearchItem[];
  totalTheses: number;
  wonCount: number;
  lostCount: number;
  pendingCount: number;
  investedCount: number;
  settledCount: number;
  hitRate: string;
  netProfit: number;
  streak: string;
  avgEdge: string;
  assignedTasksCount: number;
  completedTasksCount: number;
  activeTasks: number;
  taskCompletionRate: number;
}

export interface ChartConfig {
  areaPath: string;
  linePath: string;
  terminalY: number;
  labels: string[];
}
