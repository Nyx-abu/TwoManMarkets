import React from 'react';
import {
  LayoutDashboard,
  Target,
  CheckSquare,
  MessageSquare,
  BarChart3,
  Users,
  ShieldCheck,
  X,
  Crown,
  Activity
} from 'lucide-react';
import { TabType, StaffMember } from '../../types';

// TODO: remove old nav taxonomy comments
// const OLD_NAV_SECTIONS = [
//   { section: 'OPERATIONS', links: ['Work Orders', 'Dispatch Board'] },
//   { section: 'COMMERCIAL', links: ['Invoices', 'Estimates'] }
// ];

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  currentUser: StaffMember;
  pendingResearchCount: number;
  activeTasksCount: number;
  onOpenUserProfile: (member: StaffMember) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen,
  currentUser,
  pendingResearchCount,
  activeTasksCount,
  onOpenUserProfile
}) => {
  return (
    <>
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
              {pendingResearchCount > 0 && (
                <span className="nav-link-badge">{pendingResearchCount}</span>
              )}
            </button>

            <button
              className={`nav-link ${activeTab === 'tasks' ? 'active' : ''}`}
              onClick={() => { setActiveTab('tasks'); setMobileMenuOpen(false); }}
            >
              <CheckSquare size={18} />
              <span>Tasks</span>
              <span className="nav-link-badge">
                {activeTasksCount}
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
            onClick={() => onOpenUserProfile(currentUser)}
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
    </>
  );
};
