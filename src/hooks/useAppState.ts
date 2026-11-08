import { useState, useMemo } from 'react';
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
} from '../types';
import {
  INITIAL_STAFF,
  INITIAL_RESEARCH,
  INITIAL_TASKS,
  INITIAL_CHATS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_ANNOUNCEMENT
} from '../data/mockData';
import {
  calculateFirmMetrics,
  calculateCategoryMetrics,
  calculateTaskProgress,
  calculatePersonalMetrics,
  getChartConfig
} from '../utils/telemetry';
import { exportResearchLedgerToCsv } from '../utils/csvExport';

/**
 * TwoManMarkets — Central Application State Hook
 * 
 * ============================================================================
 * ARCHITECTURE & LINEAGE NOTE:
 * ----------------------------------------------------------------------------
 * Direction / Lineage:
 * "闇 • Nyx [CODE], — 08:38 PM
 * https://shineup-crm-demo.vercel.app/crm/admin
 * previously done project. this is the direction we will go.
 * https://crm-erp-demo.vercel.app/dashboard more on what I stripped down for you here.
 * [ShineUp CRM/ERP - Enterprise Business Management](https://crm-erp-demo.vercel.app/dashboard)
 * Complete CRM and ERP solution for construction, manufacturing, services, and retail businesses. Manage projects, HR, invoices, and more."
 * 
 * Reused from ShineUp ERP:
 * Headless state management pattern separating business operations, audit event logging,
 * and multi-perspective user switching from presentation layout.
 * ============================================================================
 */
export function useAppState() {
  // Navigation & Multi-Perspective State
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
  const [researchSearchQuery, setResearchSearchQuery] = useState('');
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
  const [newAnnouncementModalOpen, setNewAnnouncementModalOpen] = useState(false);
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

  // Telemetry & Calculations
  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);
  const metrics = useMemo(() => calculateFirmMetrics(researchList), [researchList]);
  const categoryMetrics = useMemo(() => calculateCategoryMetrics(researchList), [researchList]);
  const taskProgress = useMemo(() => calculateTaskProgress(taskList), [taskList]);
  const personalMetrics = useMemo(() => calculatePersonalMetrics(researchList, taskList, currentUser), [researchList, taskList, currentUser]);
  const chartConfig = useMemo(() => getChartConfig(analyticsTimeframe, customStartDate, customEndDate), [analyticsTimeframe, customStartDate, customEndDate]);

  const publicChannels = useMemo(() => ['#announcements', '#sports-picks', '#macro-theses', '#general'], []);
  const directMessages = useMemo(() => Object.keys(chatChannels).filter(k => !k.startsWith('#')), [chatChannels]);
  const allConversations = useMemo(() => [...publicChannels, ...directMessages], [publicChannels, directMessages]);

  const filteredHistoricalRecords = useMemo(() => researchList.filter(item => {
    const matchCat = analyticsCategoryFilter === 'All' || item.category === analyticsCategoryFilter;
    const matchStatus = analyticsStatusFilter === 'All' || item.status === analyticsStatusFilter;
    return matchCat && matchStatus;
  }), [researchList, analyticsCategoryFilter, analyticsStatusFilter]);

  const filteredStaffList = useMemo(() => staffList.filter(s => {
    const matchStatus = staffStatusFilter === 'All' || s.status === staffStatusFilter;
    const q = staffSearchQuery.toLowerCase();
    const matchSearch = q === '' || s.name.toLowerCase().includes(q) || s.username.toLowerCase().includes(q) || s.title.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  }), [staffList, staffStatusFilter, staffSearchQuery]);

  const filteredTasks = useMemo(() => taskList.filter(t => {
    const matchAssignee = taskAssigneeFilter === 'All' || t.assignee.toLowerCase() === currentUser.name.toLowerCase();
    const matchPriority = taskPriorityFilter === 'All' || t.priority === taskPriorityFilter;
    return matchAssignee && matchPriority;
  }), [taskList, taskAssigneeFilter, taskPriorityFilter, currentUser]);

  const filteredAuditLogs = useMemo(() => {
    if (auditCategoryFilter === 'All') return auditLogs;
    return auditLogs.filter(a => a.category === auditCategoryFilter);
  }, [auditLogs, auditCategoryFilter]);

  // Audit Logger
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

  // Actions
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
    setResearchList(prev => prev.map(r => r.id === item.id ? { ...r, status: 'Invested', actualInvested: actualAmount } : r));
    addAuditLog(`Allocated $${actualAmount.toLocaleString()} stake into ${item.id} (${item.market})`, 'CAPITAL');
    setReviewModalItem(null);
  };

  const handlePassPick = (item: ResearchItem) => {
    setResearchList(prev => prev.map(r => r.id === item.id ? { ...r, status: 'Passed', actualInvested: 0 } : r));
    addAuditLog(`Passed research thesis ${item.id} (${item.market})`, 'CAPITAL');
    setReviewModalItem(null);
  };

  const handleSettleOutcome = (item: ResearchItem, outcome: 'Won' | 'Lost', payout: number) => {
    const profit = outcome === 'Won' ? payout - item.actualInvested : -item.actualInvested;
    const roi = item.actualInvested > 0 ? (profit / item.actualInvested) * 100 : 0;
    setResearchList(prev => prev.map(r => r.id === item.id ? {
      ...r,
      status: outcome,
      payoutAmount: payout,
      netProfit: profit,
      roi: parseFloat(roi.toFixed(1))
    } : r));
    addAuditLog(`Settled ${item.id} as ${outcome} (${profit >= 0 ? `+$${profit}` : `-$${Math.abs(profit)}`})`, 'CAPITAL');
    setReviewModalItem(null);
  };

  const handleMoveTask = (taskId: string, newStatus: 'Pending' | 'In Progress' | 'Completed') => {
    setTaskList(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    const target = taskList.find(t => t.id === taskId);
    if (target) addAuditLog(`Updated status of task "${target.title}" to ${newStatus}`, 'TASK');
  };

  const handleDeleteTask = (taskId: string) => {
    const target = taskList.find(t => t.id === taskId);
    setTaskList(prev => prev.filter(t => t.id !== taskId));
    if (target) addAuditLog(`Deleted task "${target.title}"`, 'TASK');
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

  const handlePublishDeskAnnouncement = (title: string, body: string) => {
    const updated: DeskAnnouncement = {
      title,
      body,
      author: `${currentUser.name} (${currentUser.role === 'OWNER' ? 'Co-Owner' : 'Staff'})`,
      postedAt: 'Just now',
      priority: 'Normal'
    };
    setDeskAnnouncement(updated);
    setAnnouncementEditTitle(title);
    setAnnouncementEditBody(body);
    const annMsg: ChatMessage = {
      id: `c-ann-${Date.now()}`,
      sender: currentUser.name,
      role: currentUser.role,
      initials: currentUser.initials,
      time: 'Just now',
      text: `📢 ${updated.title}\n\n${updated.body}`,
      isAnnouncement: true
    };
    setChatChannels(prev => ({ ...prev, '#announcements': [...(prev['#announcements'] || []), annMsg] }));
    addAuditLog(`Published desk announcement: "${updated.title}"`, 'ANNOUNCEMENT');
    setAnnouncementSavedToast(true);
    setTimeout(() => setAnnouncementSavedToast(false), 3000);
  };

  const handleExportCsv = () => {
    const exportedCount = exportResearchLedgerToCsv(filteredHistoricalRecords);
    addAuditLog(`Exported ${exportedCount} performance records to CSV`, 'AUTH');
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
    setStaffList(prev => prev.map(m => m.id === memberId ? { ...m, title, email, permissions } : m));
    const member = staffList.find(m => m.id === memberId);
    if (member) addAuditLog(`Updated permissions & profile for ${member.name}`, 'STAFF');
  };

  const handleSwitchToOwner = () => {
    const owner = staffList.find(s => s.role === 'OWNER') || INITIAL_STAFF[0];
    setCurrentUser(owner);
  };

  const dashboardProps = {
    currentUser,
    researchList,
    deskAnnouncement,
    setActiveTab,
    setNewSubmissionModalOpen,
    onReviewItem: handleOpenReviewModal,
    analyticsTimeframe,
    setAnalyticsTimeframe,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    chartConfig,
    metrics,
    personalMetrics,
    onOpenAnnouncementModal: () => setNewAnnouncementModalOpen(true)
  };

  const researchProps = {
    currentUser,
    researchList,
    researchFilter,
    setResearchFilter,
    categoryFilter,
    setCategoryFilter,
    searchQuery: researchSearchQuery,
    setSearchQuery: setResearchSearchQuery,
    setNewSubmissionModalOpen,
    onReviewItem: handleOpenReviewModal
  };

  const tasksProps = {
    currentUser,
    taskList,
    filteredTasks,
    taskProgress,
    taskAssigneeFilter,
    setTaskAssigneeFilter,
    taskPriorityFilter,
    setTaskPriorityFilter,
    mobileTaskCol,
    setMobileTaskCol,
    setNewTaskModalOpen,
    onMoveTask: handleMoveTask,
    onDeleteTask: handleDeleteTask
  };

  const chatProps = {
    currentUser,
    staffList,
    chatChannels,
    activeChannel,
    setActiveChannel,
    publicChannels,
    directMessages,
    allConversations,
    chatInput,
    setChatInput,
    onSendMessage: handleSendChatMessage,
    setNewChatModalOpen
  };

  const analyticsProps = {
    currentUser,
    staffList,
    researchList,
    filteredHistoricalRecords,
    categoryMetrics,
    metrics,
    personalMetrics,
    analyticsTimeframe,
    setAnalyticsTimeframe,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    analyticsCategoryFilter,
    setAnalyticsCategoryFilter,
    analyticsStatusFilter,
    setAnalyticsStatusFilter,
    onExportCsv: handleExportCsv,
    onSelectStaff: setViewStaffModalMember
  };

  const staffProps = {
    currentUser,
    filteredStaffList,
    staffList,
    staffStatusFilter,
    setStaffStatusFilter,
    staffSearchQuery,
    setStaffSearchQuery,
    setAddStaffModalOpen,
    onViewStaff: setViewStaffModalMember,
    onEditStaff: setEditStaffModalMember,
    onToggleStaffStatus: handleToggleStaffStatus
  };

  const adminProps = {
    currentUser,
    staffList,
    filteredAuditLogs,
    auditCategoryFilter,
    setAuditCategoryFilter,
    announcementEditTitle,
    setAnnouncementEditTitle,
    announcementEditBody,
    setAnnouncementEditBody,
    announcementSavedToast,
    onSaveAnnouncement: (e: React.FormEvent) => {
      e.preventDefault();
      if (!announcementEditTitle.trim() || !announcementEditBody.trim()) return;
      handlePublishDeskAnnouncement(announcementEditTitle.trim(), announcementEditBody.trim());
    },
    setAddStaffModalOpen,
    onEditStaff: setEditStaffModalMember,
    onOpenPasswordModal: handleOpenPasswordModal,
    onToggleStaffStatus: handleToggleStaffStatus,
    onDeleteStaff: handleDeleteStaff,
    onSwitchToOwner: handleSwitchToOwner,
    setActiveTab,
    onOpenAnnouncementModal: () => setNewAnnouncementModalOpen(true)
  };

  return {
    activeTab,
    setActiveTab,
    staffList,
    setStaffList,
    currentUser,
    setCurrentUser,
    roleMenuOpen,
    setRoleMenuOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
    notificationsOpen,
    setNotificationsOpen,
    researchList,
    setResearchList,
    taskList,
    setTaskList,
    notifications,
    setNotifications,
    unreadCount,
    metrics,
    newSubmissionModalOpen,
    setNewSubmissionModalOpen,
    reviewModalItem,
    setReviewModalItem,
    newTaskModalOpen,
    setNewTaskModalOpen,
    addStaffModalOpen,
    setAddStaffModalOpen,
    editStaffModalMember,
    setEditStaffModalMember,
    viewStaffModalMember,
    setViewStaffModalMember,
    passwordModalUser,
    setPasswordModalUser,
    newChatModalOpen,
    setNewChatModalOpen,
    newChatType,
    setNewChatType,
    newAnnouncementModalOpen,
    setNewAnnouncementModalOpen,
    investAmountInput,
    setInvestAmountInput,
    newPasswordInput,
    setNewPasswordInput,
    confirmPasswordInput,
    setConfirmPasswordInput,
    passwordSuccessMsg,
    setPasswordSuccessMsg,
    addAuditLog,
    handleApproveInvestment,
    handlePassPick,
    handleSettleOutcome,
    handleUpdateStaffPermissions,
    handlePublishDeskAnnouncement,
    dashboardProps,
    researchProps,
    tasksProps,
    chatProps,
    analyticsProps,
    staffProps,
    adminProps,
    setChatChannels,
    setActiveChannel
  };
}
