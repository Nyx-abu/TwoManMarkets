import React from 'react';
import {
  X,
  Check,
  Edit,
  Key,
  UserX,
  UserCheck
} from 'lucide-react';
import { StaffMember } from '../../types';

/**
 * View Individual Employee Profile Modal Component
 * 
 * ============================================================================
 * ARCHITECTURE & LINEAGE NOTE (Nyx - 08:38 PM):
 * ----------------------------------------------------------------------------
 * Direction / Lineage:
 * - https://shineup-crm-demo.vercel.app/crm/admin
 * - https://crm-erp-demo.vercel.app/dashboard
 * 
 * Reused Architecture:
 * Adapted from ShineUp CRM's complete staff telemetry dossier.
 * Displays individual quantitative metrics (hit rate, streak, net profit,
 * tasks completed) alongside core responsibilities and active permissions.
 * ============================================================================
 */

interface ViewStaffProfileModalProps {
  member: StaffMember | null;
  onClose: () => void;
  currentUser: StaffMember;
  onEditStaff: (member: StaffMember) => void;
  onOpenPasswordModal: (member: StaffMember) => void;
  onToggleStaffStatus: (memberId: string) => void;
}

export const ViewStaffProfileModal: React.FC<ViewStaffProfileModalProps> = ({
  member,
  onClose,
  currentUser,
  onEditStaff,
  onOpenPasswordModal,
  onToggleStaffStatus
}) => {
  if (!member) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className={`user-avatar ${member.avatarClass}`} style={{ width: 42, height: 42, fontSize: 16 }}>
              {member.initials}
            </div>
            <div>
              <h3 className="modal-title">{member.name}</h3>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                @{member.username} · {member.email} · {member.title}
              </div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Account Overview Chips */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span className={`status-pill ${member.role === 'OWNER' ? 'won' : 'invested'}`}>
              {member.role === 'OWNER' ? 'CO-OWNER / ADMIN' : 'STAFF RESEARCHER'}
            </span>
            <span className={`status-pill ${member.status === 'Active' ? 'won' : 'inactive'}`}>
              Account: {member.status}
            </span>
            <span className="category-chip">Joined: {member.joinedDate}</span>
            <span className="category-chip">Last Active: {member.lastActive}</span>
          </div>

          {/* Performance Metrics Grid */}
          <div className="profile-metrics-grid">
            <div className="profile-metric-box">
              <span className="profile-metric-lbl">Win Rate</span>
              <span className="profile-metric-val green">{member.metrics.winRate.toFixed(1)}%</span>
            </div>
            <div className="profile-metric-box">
              <span className="profile-metric-lbl">Theses Logged</span>
              <span className="profile-metric-val">{member.metrics.thesesCount}</span>
            </div>
            <div className="profile-metric-box">
              <span className="profile-metric-lbl">Net Profit</span>
              <span className="profile-metric-val green">
                +${member.metrics.netProfit.toLocaleString()}
              </span>
            </div>
            <div className="profile-metric-box">
              <span className="profile-metric-lbl">Tasks Done</span>
              <span className="profile-metric-val">
                {member.metrics.tasksCompleted}/{member.metrics.tasksTotal}
              </span>
            </div>
            <div className="profile-metric-box">
              <span className="profile-metric-lbl">Streak</span>
              <span className="profile-metric-val">{member.metrics.streak}</span>
            </div>
          </div>

          {/* Responsibilities */}
          <div className="form-group">
            <label className="form-label">Core Responsibilities</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {member.responsibilities.map((resp, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <Check size={14} style={{ color: 'var(--emerald)' }} />
                  <span>{resp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Permissions Summary */}
          <div className="form-group">
            <label className="form-label">Active Permissions</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {Object.entries(member.permissions).map(([key, val]) => (
                <span
                  key={key}
                  className="category-chip"
                  style={{ opacity: val ? 1 : 0.4, borderColor: val ? 'var(--emerald)' : 'var(--border-subtle)' }}
                >
                  {val ? <Check size={11} style={{ color: 'var(--emerald)' }} /> : <X size={11} />}
                  {key.replace('can', '')}
                </span>
              ))}
            </div>
          </div>

          {/* Admin Actions */}
          {currentUser.role === 'OWNER' && (
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                className="btn-secondary"
                onClick={() => {
                  onEditStaff(member);
                  onClose();
                }}
              >
                <Edit size={14} />
                <span>Edit Permissions</span>
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  onOpenPasswordModal(member);
                  onClose();
                }}
              >
                <Key size={14} />
                <span>Reset Credentials</span>
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  onToggleStaffStatus(member.id);
                  onClose();
                }}
              >
                {member.status === 'Active' ? <UserX size={14} /> : <UserCheck size={14} />}
                <span>{member.status === 'Active' ? 'Deactivate Account' : 'Reactivate Account'}</span>
              </button>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
