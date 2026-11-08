import React from 'react';
import {
  Menu,
  ChevronDown,
  Bell,
  Check,
  Target
} from 'lucide-react';
import { TabType, StaffMember, NotificationItem } from '../../types';

/**
 * Topbar Header & Navigation Component
 * 
 * ============================================================================
 * ARCHITECTURE & LINEAGE NOTE (Nyx - 08:38 PM):
 * ----------------------------------------------------------------------------
 * Direction / Lineage:
 * - https://shineup-crm-demo.vercel.app/crm/admin
 * - https://crm-erp-demo.vercel.app/dashboard
 * 
 * In ShineUp ERP (`https://crm-erp-demo.vercel.app/dashboard`), we implemented
 * a multi-tenant switcher ("Viewing as Store #402 Manager", "Viewing as HQ Admin")
 * so auditors and operators could instantly test role-gating and permissions without
 * logging out and back in.
 * 
 * We adapted that exact pattern here into the "Viewing as: [Name] [ROLE]" switcher.
 * When you switch between Luis (Co-Owner) and Maya Chen (Sports Analyst), the
 * entire application reacts dynamically:
 * - Admin Settings locks down into an `.access-restricted-card`
 * - Dashboard & Analytics switch between Firm-Wide Treasury & Individual Hit-Rate
 * - Capital allocation buttons in research modals disable or hide
 * ============================================================================
 */

/*
// ============================================================================
// [REUSED FROM SHINEUP ERP - MULTI-PERSPECTIVE SWITCHER PATTERN]
// In https://crm-erp-demo.vercel.app/dashboard:
//
// const SHINEUP_PERSPECTIVE_SWITCHER = {
//   label: 'Switch Store Location / Management Role',
//   trigger: `Acting as: ${currentRole.title} [${currentLocation.code}]`,
//   locations: ['Chicago Central', 'Austin Factory', 'Seattle Retail']
// };
//
// Adapted below into TwoManMarkets' dual-owner vs analyst persona switcher.
// ============================================================================
*/

interface TopbarProps {
  activeTab: TabType;
  currentUser: StaffMember;
  setCurrentUser: (member: StaffMember) => void;
  staffList: StaffMember[];
  roleMenuOpen: boolean;
  setRoleMenuOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
  notifications: NotificationItem[];
  unreadCount: number;
  onMarkAllNotificationsRead: () => void;
  onDismissNotification: (id: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  activeTab,
  currentUser,
  setCurrentUser,
  staffList,
  roleMenuOpen,
  setRoleMenuOpen,
  setMobileMenuOpen,
  notificationsOpen,
  setNotificationsOpen,
  notifications,
  unreadCount,
  onMarkAllNotificationsRead,
  onDismissNotification
}) => {
  return (
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
                    onClick={onMarkAllNotificationsRead}
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
                    onClick={() => onDismissNotification(n.id)}
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
  );
};
