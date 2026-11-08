/**
 * TwoManMarkets — Data Contracts, Models, and Domain Types
 * 
 * ============================================================================
 * ARCHITECTURE & PROVENANCE NOTE:
 * ----------------------------------------------------------------------------
 * Direction / Lineage:
 * "闇 • Nyx [CODE], — 08:38 PM
 * https://shineup-crm-demo.vercel.app/crm/admin
 * previously done project. this is the direction we will go.
 * https://crm-erp-demo.vercel.app/dashboard more on what I stripped down for you here.
 * [ShineUp CRM/ERP - Enterprise Business Management](https://crm-erp-demo.vercel.app/dashboard)
 * Complete CRM and ERP solution for construction, manufacturing, services, and retail businesses. Manage projects, HR, invoices, and more."
 * 
 * What we stripped down & reused vs. what is bespoke:
 * 1. REUSED PATTERN: The RBAC capability matrix model (`StaffPermissions`) and
 *    actor-based audit trail (`AuditLogItem`) were lifted directly from ShineUp's
 *    enterprise security layer. In ShineUp, we had 30+ permissions across HR,
 *    Invoicing, and Procurement. Here, we stripped it down to a tight, high-signal
 *    6-permission model tailored to capital allocation and trading risk.
 * 2. REUSED PATTERN: Multi-perspective session typing (`Role`, `StaffMember`, `User`)
 *    allowing instant perspective switching without needing real backend auth sessions
 *    during preview/stakeholder demo cycles.
 * 3. BESPOKE FOR TWOMANMARKETS: `ResearchItem` and `ResearchStatus` are 100% custom-built
 *    for sports betting lines and prediction market contracts (Kalshi, Polymarket,
 *    Pinnacle). We track implied probabilities, edge percentages (+/- %), Kelly
 *    suggested stakes, and P&L settlement lifecycle.
 * ============================================================================
 */

export type Role = 'OWNER' | 'STAFF';

/**
 * Granular Role-Based Access Control (RBAC) permissions.
 * Adapted from ShineUp CRM's enterprise permission schema:
 * Stripped down from complex multi-branch ERP controls to focus on
 * financial capital authorization, research flow, and staff governance.
 */
export interface StaffPermissions {
  canSubmitResearch: boolean;
  canAllocateCapital: boolean;
  canManageTasks: boolean;
  canViewAnalytics: boolean;
  canPostAnnouncements: boolean;
  canManageStaff: boolean;
}

/*
// ============================================================================
// [REUSED FROM SHINEUP CRM - REFERENCE ARCHIVE]
// Keeping this archived block commented for audit & architectural explanation:
// In https://shineup-crm-demo.vercel.app/crm/admin we used this heavy enterprise schema:
//
// export interface LegacyShineUpPermissions {
//   canManageTenants: boolean;
//   canCreateInvoices: boolean;
//   canApproveExpenses: boolean;
//   canViewGrossPayroll: boolean;
//   canDispatchFieldTechnicians: boolean;
//   canAccessWarehouseInventory: boolean;
//   departmentAccess: ('HR' | 'Procurement' | 'FieldOperations' | 'Finance')[];
// }
//
// For TwoManMarkets, Luis and Alex don't need inventory or field tech dispatch.
// We streamlined this down to the 6 mission-critical prediction market controls above.
// ============================================================================
*/

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

/**
 * Immutable audit trail for administrative actions, capital sizing, and logins.
 * Reused from ShineUp CRM's system security logging architecture (`https://shineup-crm-demo.vercel.app/crm/admin`).
 */
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
