// Layout Chrome
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';

// Domain Views
import { DashboardView } from './components/views/DashboardView';
import { ResearchView } from './components/views/ResearchView';
import { TasksView } from './components/views/TasksView';
import { ChatView } from './components/views/ChatView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { StaffView } from './components/views/StaffView';
import { AdminView } from './components/views/AdminView';

// Production Dialog Harness
import { NewSubmissionModal } from './components/modals/NewSubmissionModal';
import { ReviewSizeModal } from './components/modals/ReviewSizeModal';
import { NewTaskModal } from './components/modals/NewTaskModal';
import { AddStaffModal } from './components/modals/AddStaffModal';
import { EditPermissionsModal } from './components/modals/EditPermissionsModal';
import { ViewStaffProfileModal } from './components/modals/ViewStaffProfileModal';
import { ResetPasswordModal } from './components/modals/ResetPasswordModal';
import { NewChatModal } from './components/modals/NewChatModal';
import { NewAnnouncementModal } from './components/modals/NewAnnouncementModal';

// Headless State Hook
import { useAppState } from './hooks/useAppState';

// Top-level application coordinator & view router
export default function App() {
  const s = useAppState();

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={s.activeTab}
        setActiveTab={s.setActiveTab}
        mobileMenuOpen={s.mobileMenuOpen}
        setMobileMenuOpen={s.setMobileMenuOpen}
        currentUser={s.currentUser}
        pendingResearchCount={s.metrics.pendingCount}
        activeTasksCount={s.taskList.filter(t => t.status !== 'Completed').length}
        onOpenUserProfile={s.setViewStaffModalMember}
      />

      {/* Main Content Layout */}
      <div className="main-wrapper">
        <Topbar
          activeTab={s.activeTab}
          currentUser={s.currentUser}
          setCurrentUser={s.setCurrentUser}
          staffList={s.staffList}
          roleMenuOpen={s.roleMenuOpen}
          setRoleMenuOpen={s.setRoleMenuOpen}
          setMobileMenuOpen={s.setMobileMenuOpen}
          notificationsOpen={s.notificationsOpen}
          setNotificationsOpen={s.setNotificationsOpen}
          notifications={s.notifications}
          unreadCount={s.unreadCount}
          onMarkAllNotificationsRead={() => s.setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
          onDismissNotification={id => s.setNotifications(prev => prev.map(x => x.id === id ? { ...x, read: true } : x))}
        />

        <main className="page-content">
          {s.activeTab === 'overview' && <DashboardView {...s.dashboardProps} />}
          {s.activeTab === 'research' && <ResearchView {...s.researchProps} />}
          {s.activeTab === 'tasks' && <TasksView {...s.tasksProps} />}
          {s.activeTab === 'chat' && <ChatView {...s.chatProps} />}
          {s.activeTab === 'analytics' && <AnalyticsView {...s.analyticsProps} />}
          {s.activeTab === 'team' && <StaffView {...s.staffProps} />}
          {s.activeTab === 'admin' && <AdminView {...s.adminProps} />}
        </main>
      </div>

      {/* Production Dialog Harness (All 9 Modals Fully Integrated) */}
      <NewSubmissionModal
        isOpen={s.newSubmissionModalOpen}
        onClose={() => s.setNewSubmissionModalOpen(false)}
        currentUser={s.currentUser}
        researchCount={s.researchList.length}
        onSubmit={newItem => {
          s.setResearchList([newItem, ...s.researchList]);
          s.addAuditLog(`Submitted research thesis ${newItem.id} (${newItem.market})`, 'AUTH');
        }}
      />

      <ReviewSizeModal
        item={s.reviewModalItem}
        onClose={() => s.setReviewModalItem(null)}
        currentUser={s.currentUser}
        investAmountInput={s.investAmountInput}
        setInvestAmountInput={s.setInvestAmountInput}
        onPassPick={s.handlePassPick}
        onApproveInvestment={s.handleApproveInvestment}
        onSettleOutcome={s.handleSettleOutcome}
      />

      <NewTaskModal
        isOpen={s.newTaskModalOpen}
        onClose={() => s.setNewTaskModalOpen(false)}
        staffList={s.staffList}
        onSubmit={newTask => {
          s.setTaskList(prev => [newTask, ...prev]);
          s.addAuditLog(`Created task "${newTask.title}" assigned to ${newTask.assignee}`, 'TASK');
        }}
      />

      <AddStaffModal
        isOpen={s.addStaffModalOpen}
        onClose={() => s.setAddStaffModalOpen(false)}
        onSubmit={newMember => {
          s.setStaffList([...s.staffList, newMember]);
          s.addAuditLog(`Created new ${newMember.role} account for ${newMember.name} (@${newMember.username})`, 'STAFF');
        }}
      />

      <EditPermissionsModal
        member={s.editStaffModalMember}
        onClose={() => s.setEditStaffModalMember(null)}
        onSave={s.handleUpdateStaffPermissions}
      />

      <ViewStaffProfileModal
        member={s.viewStaffModalMember}
        onClose={() => s.setViewStaffModalMember(null)}
        currentUser={s.currentUser}
        onEditStaff={member => s.setEditStaffModalMember(member)}
        onOpenPasswordModal={member => {
          s.setPasswordModalUser(member);
          s.setNewPasswordInput('');
          s.setConfirmPasswordInput('');
          s.setPasswordSuccessMsg(false);
        }}
        onToggleStaffStatus={s.staffProps.onToggleStaffStatus}
      />

      <ResetPasswordModal
        member={s.passwordModalUser}
        onClose={() => s.setPasswordModalUser(null)}
        newPasswordInput={s.newPasswordInput}
        setNewPasswordInput={s.setNewPasswordInput}
        confirmPasswordInput={s.confirmPasswordInput}
        setConfirmPasswordInput={s.setConfirmPasswordInput}
        passwordSuccessMsg={s.passwordSuccessMsg}
        setPasswordSuccessMsg={s.setPasswordSuccessMsg}
        onSubmit={member => {
          s.addAuditLog(`Updated login credentials for ${member.name} (@${member.username})`, 'AUTH');
        }}
      />

      <NewChatModal
        isOpen={s.newChatModalOpen}
        onClose={() => s.setNewChatModalOpen(false)}
        currentUser={s.currentUser}
        staffList={s.staffList}
        newChatType={s.newChatType}
        setNewChatType={s.setNewChatType}
        onCreateConversation={channelKey => {
          s.setChatChannels(prev => prev[channelKey] ? prev : { ...prev, [channelKey]: [] });
          s.setActiveChannel(channelKey);
          s.setActiveTab('chat');
        }}
      />

      <NewAnnouncementModal
        isOpen={s.newAnnouncementModalOpen}
        onClose={() => s.setNewAnnouncementModalOpen(false)}
        currentUser={s.currentUser}
        onPublish={(title, body) => s.handlePublishDeskAnnouncement(title, body)}
      />
    </div>
  );
}
