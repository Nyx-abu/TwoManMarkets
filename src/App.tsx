import React, { useState, useMemo } from 'react';
import { Activity, TrendingUp, CheckCircle2 } from 'lucide-react';

// Core Type Definitions & Data Contracts
import {
  StaffMember,
  TabType,
  ResearchStatus,
  ResearchItem,
  TaskItem,
  ChatMessage,
  NotificationItem,
  AuditLogItem,
  DeskAnnouncement,
  StaffPermissions
} from './types';

// Initial Fixtures & Seed Data
import {
  INITIAL_STAFF,
  INITIAL_RESEARCH,
  INITIAL_TASKS,
  INITIAL_CHATS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_ANNOUNCEMENT
} from './data/mockData';

// Layout Components
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';

// View Modules
import { DashboardView } from './components/views/DashboardView';
import { ResearchView } from './components/views/ResearchView';
import { TasksView } from './components/views/TasksView';
import { ChatView } from './components/views/ChatView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { StaffView } from './components/views/StaffView';
import { AdminView } from './components/views/AdminView';

// Modal Components
import { NewSubmissionModal } from './components/modals/NewSubmissionModal';
import { ReviewSizeModal } from './components/modals/ReviewSizeModal';
import { NewTaskModal } from './components/modals/NewTaskModal';
import { AddStaffModal } from './components/modals/AddStaffModal';
import { EditPermissionsModal } from './components/modals/EditPermissionsModal';
import { ViewStaffProfileModal } from './components/modals/ViewStaffProfileModal';
import { ResetPasswordModal } from './components/modals/ResetPasswordModal';
import { NewChatModal } from './components/modals/NewChatModal';

/**
 * TwoManMarkets — Principal Coordinator Application
 * 
 * ============================================================================
 * ARCHITECTURE & LINEAGE NOTE (Nyx - 08:38 PM):
 * ----------------------------------------------------------------------------
 * Direction / Lineage:
 * - https://shineup-crm-demo.vercel.app/crm/admin (Direct Architectural Heritage)
 * - https://crm-erp-demo.vercel.app/dashboard
 * 
 * Reused vs. Bespoke Architecture Breakdown:
 * 1. REUSED PATTERN: Modular coordinator pattern. We decomposed the monolithic
 *    file into domain views, layout wrappers, and isolated modals matching our
 *    battle-tested enterprise architecture in ShineUp CRM.
 * 2. REUSED PATTERN: Dual-Role Permission Matrix & Client-side Persona Switcher.
 *    Allows instant perspective verification (Co-Owner vs. Staff Analyst) without
 *    ephemeral state loss.
 * 3. BESPOKE FOR TWOMANMARKETS: Prediction markets research pipeline, Kelly stake
 *    sizing & odds edge calculations (+/- %), Polymarket / Kalshi sports & event
 *    settlement logging.
 * ============================================================================
 */
export default function App() {
  // Navigation & User Perspective State
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

  // Input states & Toasts
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

  // Derived Firm-Wide Metrics (Owner Perspective)
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
  }, [analyticsTimeframe, customStartDate, customEndDate]);

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

  // Filtered Staff Directory
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

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return taskList.filter(t => {
      const matchAssignee = taskAssigneeFilter === 'All' || t.assignee.toLowerCase() === currentUser.name.toLowerCase();
      const matchPriority = taskPriorityFilter === 'All' || t.priority === taskPriorityFilter;
      return matchAssignee && matchPriority;
    });
  }, [taskList, taskAssigneeFilter, taskPriorityFilter, currentUser]);

  // Filtered Audit Logs
  const filteredAuditLogs = useMemo(() => {
    if (auditCategoryFilter === 'All') return auditLogs;
    return auditLogs.filter(a => a.category === auditCategoryFilter);
  }, [auditLogs, auditCategoryFilter]);

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

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.map(x => x.id === id ? { ...x, read: true } : x));
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

  const handleCreateConversation = (channelKey: string) => {
    setChatChannels(prev => {
      if (prev[channelKey]) return prev;
      return { ...prev, [channelKey]: [] };
    });
    setActiveChannel(channelKey);
    setActiveTab('chat');
  };

  const handleOpenReviewModal = (item: ResearchItem) => {
    setReviewModalItem(item);
    setInvestAmountInput(item.suggestedStake.toString());
  };

  const handleOpenPasswordModal = (member: StaffMember) => {
    setPasswordModalUser(member);
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setPasswordSuccessMsg(false);
  };

  const handleUpdateStaffPermissions = (memberId: string, title: string, email: string, permissions: StaffPermissions) => {
    setStaffList(prev => prev.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          title,
          email,
          permissions
        };
      }
      return m;
    }));
    const member = staffList.find(m => m.id === memberId);
    if (member) {
      addAuditLog(`Updated permissions & profile for ${member.name}`, 'STAFF');
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        currentUser={currentUser}
        pendingResearchCount={metrics.pendingCount}
        activeTasksCount={taskList.filter(t => t.status !== 'Completed').length}
        onOpenUserProfile={setViewStaffModalMember}
      />

      {/* Main Wrapper */}
      <div className="main-wrapper">
        {/* Top Header */}
        <Topbar
          activeTab={activeTab}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          staffList={staffList}
          roleMenuOpen={roleMenuOpen}
          setRoleMenuOpen={setRoleMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          notificationsOpen={notificationsOpen}
          setNotificationsOpen={setNotificationsOpen}
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
          onDismissNotification={handleDismissNotification}
        />

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

          {/* Dynamic Views */}
          {activeTab === 'overview' && (
            <DashboardView
              currentUser={currentUser}
              researchList={researchList}
              deskAnnouncement={deskAnnouncement}
              setActiveTab={setActiveTab}
              setNewSubmissionModalOpen={setNewSubmissionModalOpen}
              onReviewItem={handleOpenReviewModal}
              analyticsTimeframe={analyticsTimeframe}
              setAnalyticsTimeframe={setAnalyticsTimeframe}
              customStartDate={customStartDate}
              setCustomStartDate={setCustomStartDate}
              customEndDate={customEndDate}
              setCustomEndDate={setCustomEndDate}
              chartConfig={chartConfig}
              metrics={metrics}
              personalMetrics={personalMetrics}
            />
          )}

          {activeTab === 'research' && (
            <ResearchView
              currentUser={currentUser}
              researchList={researchList}
              researchFilter={researchFilter}
              setResearchFilter={setResearchFilter}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              setNewSubmissionModalOpen={setNewSubmissionModalOpen}
              onReviewItem={handleOpenReviewModal}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksView
              currentUser={currentUser}
              taskList={taskList}
              filteredTasks={filteredTasks}
              taskProgress={taskProgress}
              taskAssigneeFilter={taskAssigneeFilter}
              setTaskAssigneeFilter={setTaskAssigneeFilter}
              taskPriorityFilter={taskPriorityFilter}
              setTaskPriorityFilter={setTaskPriorityFilter}
              mobileTaskCol={mobileTaskCol}
              setMobileTaskCol={setMobileTaskCol}
              setNewTaskModalOpen={setNewTaskModalOpen}
              onMoveTask={handleMoveTask}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {activeTab === 'chat' && (
            <ChatView
              currentUser={currentUser}
              staffList={staffList}
              chatChannels={chatChannels}
              activeChannel={activeChannel}
              setActiveChannel={setActiveChannel}
              publicChannels={publicChannels}
              directMessages={directMessages}
              allConversations={allConversations}
              chatInput={chatInput}
              setChatInput={setChatInput}
              onSendMessage={handleSendChatMessage}
              setNewChatModalOpen={setNewChatModalOpen}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              currentUser={currentUser}
              staffList={staffList}
              researchList={researchList}
              filteredHistoricalRecords={filteredHistoricalRecords}
              categoryMetrics={categoryMetrics}
              metrics={metrics}
              personalMetrics={personalMetrics}
              analyticsTimeframe={analyticsTimeframe}
              setAnalyticsTimeframe={setAnalyticsTimeframe}
              customStartDate={customStartDate}
              setCustomStartDate={setCustomStartDate}
              customEndDate={customEndDate}
              setCustomEndDate={setCustomEndDate}
              analyticsCategoryFilter={analyticsCategoryFilter}
              setAnalyticsCategoryFilter={setAnalyticsCategoryFilter}
              analyticsStatusFilter={analyticsStatusFilter}
              setAnalyticsStatusFilter={setAnalyticsStatusFilter}
              onExportCsv={handleExportCsv}
              onSelectStaff={setViewStaffModalMember}
            />
          )}

          {activeTab === 'team' && (
            <StaffView
              currentUser={currentUser}
              filteredStaffList={filteredStaffList}
              staffList={staffList}
              staffStatusFilter={staffStatusFilter}
              setStaffStatusFilter={setStaffStatusFilter}
              staffSearchQuery={staffSearchQuery}
              setStaffSearchQuery={setStaffSearchQuery}
              setAddStaffModalOpen={setAddStaffModalOpen}
              onViewStaff={setViewStaffModalMember}
              onEditStaff={setEditStaffModalMember}
              onToggleStaffStatus={handleToggleStaffStatus}
            />
          )}

          {activeTab === 'admin' && (
            <AdminView
              currentUser={currentUser}
              staffList={staffList}
              filteredAuditLogs={filteredAuditLogs}
              auditCategoryFilter={auditCategoryFilter}
              setAuditCategoryFilter={setAuditCategoryFilter}
              announcementEditTitle={announcementEditTitle}
              setAnnouncementEditTitle={setAnnouncementEditTitle}
              announcementEditBody={announcementEditBody}
              setAnnouncementEditBody={setAnnouncementEditBody}
              announcementSavedToast={announcementSavedToast}
              onSaveAnnouncement={handleSaveAnnouncement}
              setAddStaffModalOpen={setAddStaffModalOpen}
              onEditStaff={setEditStaffModalMember}
              onOpenPasswordModal={handleOpenPasswordModal}
              onToggleStaffStatus={handleToggleStaffStatus}
              onDeleteStaff={handleDeleteStaff}
              onSwitchToOwner={() => {
                const owner = staffList.find(s => s.role === 'OWNER') || INITIAL_STAFF[0];
                setCurrentUser(owner);
              }}
              setActiveTab={setActiveTab}
            />
          )}
        </main>
      </div>

      {/* Modals & Dialogs */}
      <NewSubmissionModal
        isOpen={newSubmissionModalOpen}
        onClose={() => setNewSubmissionModalOpen(false)}
        currentUser={currentUser}
        researchCount={researchList.length}
        onSubmit={newItem => {
          setResearchList([newItem, ...researchList]);
          addAuditLog(`Submitted research thesis ${newItem.id} (${newItem.market})`, 'AUTH');
        }}
      />

      <ReviewSizeModal
        item={reviewModalItem}
        onClose={() => setReviewModalItem(null)}
        currentUser={currentUser}
        investAmountInput={investAmountInput}
        setInvestAmountInput={setInvestAmountInput}
        onPassPick={handlePassPick}
        onApproveInvestment={handleApproveInvestment}
        onSettleOutcome={handleSettleOutcome}
      />

      <NewTaskModal
        isOpen={newTaskModalOpen}
        onClose={() => setNewTaskModalOpen(false)}
        staffList={staffList}
        onSubmit={newTask => {
          setTaskList(prev => [newTask, ...prev]);
          addAuditLog(`Created task "${newTask.title}" assigned to ${newTask.assignee}`, 'TASK');
        }}
      />

      <AddStaffModal
        isOpen={addStaffModalOpen}
        onClose={() => setAddStaffModalOpen(false)}
        onSubmit={newMember => {
          setStaffList([...staffList, newMember]);
          addAuditLog(`Created new ${newMember.role} account for ${newMember.name} (@${newMember.username})`, 'STAFF');
        }}
      />

      <EditPermissionsModal
        member={editStaffModalMember}
        onClose={() => setEditStaffModalMember(null)}
        onSave={handleUpdateStaffPermissions}
      />

      <ViewStaffProfileModal
        member={viewStaffModalMember}
        onClose={() => setViewStaffModalMember(null)}
        currentUser={currentUser}
        onEditStaff={member => setEditStaffModalMember(member)}
        onOpenPasswordModal={handleOpenPasswordModal}
        onToggleStaffStatus={handleToggleStaffStatus}
      />

      <ResetPasswordModal
        member={passwordModalUser}
        onClose={() => setPasswordModalUser(null)}
        newPasswordInput={newPasswordInput}
        setNewPasswordInput={setNewPasswordInput}
        confirmPasswordInput={confirmPasswordInput}
        setConfirmPasswordInput={setConfirmPasswordInput}
        passwordSuccessMsg={passwordSuccessMsg}
        setPasswordSuccessMsg={setPasswordSuccessMsg}
        onSubmit={member => {
          addAuditLog(`Updated login credentials for ${member.name} (@${member.username})`, 'AUTH');
        }}
      />

      <NewChatModal
        isOpen={newChatModalOpen}
        onClose={() => setNewChatModalOpen(false)}
        currentUser={currentUser}
        staffList={staffList}
        newChatType={newChatType}
        setNewChatType={setNewChatType}
        onCreateConversation={handleCreateConversation}
      />
    </div>
  );
}
