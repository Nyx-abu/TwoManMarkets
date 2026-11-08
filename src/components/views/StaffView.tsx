import React from 'react';
import {
  Plus,
  Search,
  Crown,
  Activity,
  Edit,
  UserX,
  UserCheck
} from 'lucide-react';
import { StaffMember } from '../../types';

/**
 * Staff Directory View Component
 * 
 * ============================================================================
 * ARCHITECTURE & LINEAGE NOTE (Nyx - 08:38 PM):
 * ----------------------------------------------------------------------------
 * Direction / Lineage:
 * - https://shineup-crm-demo.vercel.app/crm/admin
 * - https://crm-erp-demo.vercel.app/dashboard
 * 
 * Reused Architecture:
 * 1. WORKFORCE DIRECTORY & PROFILE DRAWER TRIGGER:
 *    Adapted from ShineUp CRM's employee & contractor registry.
 *    Supports instant search indexing across name, @username handle, and job focus.
 * 2. OWNER-CONTROLLED ADMINISTRATIVE TOGGLE:
 *    Account deactivation/reactivation actions are gated behind the Co-Owner role.
 *    Staff analysts can inspect their peers' track record and credentials,
 *    but cannot tamper with role assignments.
 * ============================================================================
 */

/*
// ============================================================================
// [REUSED FROM SHINEUP CRM - EMPLOYEE MANAGEMENT DIRECTORY]
// In ShineUp CRM, human resource profiles tracked certifications and licenses:
//
// const SHINEUP_STAFF_ROW = {
//   name: 'John Doe',
//   certifications: ['EPA 608 Universal', 'OSHA 30'],
//   billingMultiplier: 2.4
// };
//
// Transformed below for quantitative sports and prediction market analysts.
// ============================================================================
*/

interface StaffViewProps {
  currentUser: StaffMember;
  filteredStaffList: StaffMember[];
  staffList: StaffMember[];
  staffStatusFilter: 'All' | 'Active' | 'Inactive';
  setStaffStatusFilter: (status: 'All' | 'Active' | 'Inactive') => void;
  staffSearchQuery: string;
  setStaffSearchQuery: (query: string) => void;
  setAddStaffModalOpen: (open: boolean) => void;
  onViewStaff: (member: StaffMember) => void;
  onEditStaff: (member: StaffMember) => void;
  onToggleStaffStatus: (memberId: string) => void;
}

export const StaffView: React.FC<StaffViewProps> = ({
  currentUser,
  filteredStaffList,
  staffList,
  staffStatusFilter,
  setStaffStatusFilter,
  staffSearchQuery,
  setStaffSearchQuery,
  setAddStaffModalOpen,
  onViewStaff,
  onEditStaff,
  onToggleStaffStatus
}) => {
  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>Staff Management &amp; Team Directory</h1>
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
                <th>Title &amp; Focus</th>
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
                        onClick={() => onViewStaff(member)}
                        title="View Complete Employee Profile"
                      >
                        Profile
                      </button>

                      {currentUser.role === 'OWNER' && (
                        <>
                          <button
                            className="btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                            onClick={() => onEditStaff(member)}
                            title="Edit Roles & Permissions"
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            className="btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                            onClick={() => onToggleStaffStatus(member.id)}
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
                  onClick={() => onViewStaff(member)}
                >
                  View Profile
                </button>
                {currentUser.role === 'OWNER' && (
                  <button
                    className="btn-secondary mobile-card-btn"
                    onClick={() => onEditStaff(member)}
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
  );
};
