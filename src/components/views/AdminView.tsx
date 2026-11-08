import React from 'react';
import {
  ShieldCheck,
  Crown,
  LayoutDashboard,
  Plus,
  Key,
  UserX,
  UserCheck,
  Trash2,
  Edit,
  Send,
  CheckCircle2,
  Check,
  X,
  Lock
} from 'lucide-react';
import { StaffMember, AuditLogItem, TabType } from '../../types';

// TODO: remove old tenant permission rules
// const OLD_TENANT_RULES = ['MANAGE_SUBSCRIPTION', 'VIEW_RAW_METRICS'];

interface AdminViewProps {
  currentUser: StaffMember;
  staffList: StaffMember[];
  filteredAuditLogs: AuditLogItem[];
  auditCategoryFilter: string;
  setAuditCategoryFilter: (cat: string) => void;
  announcementEditTitle: string;
  setAnnouncementEditTitle: (title: string) => void;
  announcementEditBody: string;
  setAnnouncementEditBody: (body: string) => void;
  announcementSavedToast: boolean;
  onSaveAnnouncement: (e: React.FormEvent) => void;
  setAddStaffModalOpen: (open: boolean) => void;
  onEditStaff: (member: StaffMember) => void;
  onOpenPasswordModal: (member: StaffMember) => void;
  onToggleStaffStatus: (memberId: string) => void;
  onDeleteStaff: (memberId: string) => void;
  onSwitchToOwner: () => void;
  setActiveTab: (tab: TabType) => void;
  onOpenAnnouncementModal?: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
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
  onSaveAnnouncement,
  setAddStaffModalOpen,
  onEditStaff,
  onOpenPasswordModal,
  onToggleStaffStatus,
  onDeleteStaff,
  onSwitchToOwner,
  setActiveTab,
  onOpenAnnouncementModal
}) => {
  if (currentUser.role !== 'OWNER') {
    return (
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
            onClick={onSwitchToOwner}
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
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>Admin Settings &amp; Team Governance</h1>
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
                        onClick={() => onEditStaff(member)}
                        title="Edit Permissions & Details"
                      >
                        Edit
                      </button>
                      <button
                        className="btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                        onClick={() => onOpenPasswordModal(member)}
                        title="Reset Credentials"
                      >
                        <Key size={12} />
                      </button>
                      <button
                        className="btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                        onClick={() => onToggleStaffStatus(member.id)}
                        title={member.status === 'Active' ? 'Deactivate' : 'Reactivate'}
                      >
                        {member.status === 'Active' ? <UserX size={12} /> : <UserCheck size={12} />}
                      </button>
                      {member.role !== 'OWNER' && (
                        <button
                          className="btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--loss-red)' }}
                          onClick={() => onDeleteStaff(member.id)}
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
                  onClick={() => onEditStaff(member)}
                >
                  <Edit size={12} />
                  <span>Edit</span>
                </button>
                <button
                  className="btn-secondary"
                  style={{ padding: '6px', fontSize: '11px', justifyContent: 'center' }}
                  onClick={() => onOpenPasswordModal(member)}
                >
                  <Key size={12} />
                  <span>Reset</span>
                </button>
                <button
                  className="btn-secondary"
                  style={{ padding: '6px', fontSize: '11px', justifyContent: 'center' }}
                  onClick={() => onToggleStaffStatus(member.id)}
                >
                  {member.status === 'Active' ? <UserX size={12} /> : <UserCheck size={12} />}
                  <span>{member.status === 'Active' ? 'Deactivate' : 'Reactivate'}</span>
                </button>
                {member.role !== 'OWNER' && (
                  <button
                    className="btn-secondary"
                    style={{ padding: '6px', fontSize: '11px', color: 'var(--loss-red)', justifyContent: 'center' }}
                    onClick={() => onDeleteStaff(member.id)}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {announcementSavedToast && (
              <span className="status-pill won">
                <CheckCircle2 size={13} /> Announcement Published!
              </span>
            )}
            {onOpenAnnouncementModal && (
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '12px' }}
                onClick={onOpenAnnouncementModal}
              >
                <Send size={13} />
                <span>Open Broadcast Modal</span>
              </button>
            )}
          </div>
        </div>

        <form onSubmit={onSaveAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
                <td><strong>Review &amp; Allocate Capital ($ Sizing)</strong></td>
                <td><span className="rbac-badge allowed"><Check size={12} /> Full Access</span></td>
                <td><span className="rbac-badge restricted"><X size={12} /> Restricted (Hidden)</span></td>
                <td>Server-side RBAC Guard</td>
              </tr>
              <tr>
                <td><strong>Create, Deactivate &amp; Delete Staff Accounts</strong></td>
                <td><span className="rbac-badge allowed"><Check size={12} /> Full Access</span></td>
                <td><span className="rbac-badge restricted"><X size={12} /> Restricted</span></td>
                <td>Owner session authorization</td>
              </tr>
              <tr>
                <td><strong>Firm-Wide Financial P&amp;L &amp; Balance</strong></td>
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
            <h3 className="panel-title">Live Security &amp; Activity Audit Log</h3>
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
              <option value="CAPITAL">Capital &amp; Sizing</option>
              <option value="STAFF">Staff Management</option>
              <option value="AUTH">Auth &amp; Research</option>
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
  );
};
