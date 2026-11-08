import React from 'react';
import { X, Check } from 'lucide-react';
import { StaffMember, StaffPermissions } from '../../types';

/**
 * Edit Staff Member & Permissions Modal Component
 * 
 * ============================================================================
 * ARCHITECTURE & LINEAGE NOTE (Nyx - 08:38 PM):
 * ----------------------------------------------------------------------------
 * Direction / Lineage:
 * - https://shineup-crm-demo.vercel.app/crm/admin
 * - https://crm-erp-demo.vercel.app/dashboard
 * 
 * Reused Architecture:
 * Lifted directly from ShineUp CRM's RBAC matrix editor (`/crm/admin`).
 * Provides toggleable capability controls with explicit descriptions:
 * - canSubmitResearch
 * - canAllocateCapital
 * - canManageTasks
 * - canViewAnalytics
 * - canPostAnnouncements
 * - canManageStaff
 * ============================================================================
 */

interface EditPermissionsModalProps {
  member: StaffMember | null;
  onClose: () => void;
  onSave: (memberId: string, title: string, email: string, permissions: StaffPermissions) => void;
}

export const EditPermissionsModal: React.FC<EditPermissionsModalProps> = ({
  member,
  onClose,
  onSave
}) => {
  if (!member) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span style={{ fontSize: '11px', color: 'var(--emerald)', fontWeight: 700 }}>
              ACCOUNT MANAGEMENT · {member.id}
            </span>
            <h3 className="modal-title" style={{ marginTop: '4px' }}>
              Edit {member.name} (@{member.username})
            </h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form
          className="modal-body"
          onSubmit={e => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const title = formData.get('title') as string;
            const email = formData.get('email') as string;
            const canSubmit = formData.get('canSubmitResearch') === 'on';
            const canAllocate = formData.get('canAllocateCapital') === 'on';
            const canManageT = formData.get('canManageTasks') === 'on';
            const canViewA = formData.get('canViewAnalytics') === 'on';
            const canPostA = formData.get('canPostAnnouncements') === 'on';
            const canManageS = formData.get('canManageStaff') === 'on';

            const permissions: StaffPermissions = {
              canSubmitResearch: canSubmit,
              canAllocateCapital: canAllocate,
              canManageTasks: canManageT,
              canViewAnalytics: canViewA,
              canPostAnnouncements: canPostA,
              canManageStaff: canManageS
            };

            onSave(member.id, title, email, permissions);
            onClose();
          }}
        >
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" defaultValue={member.name} disabled />
            </div>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input className="form-input" defaultValue={member.username} disabled />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Title / Role Focus</label>
              <input name="title" className="form-input" defaultValue={member.title} />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input name="email" type="email" className="form-input" defaultValue={member.email} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Granular RBAC Permissions</label>
            <div className="permissions-grid">
              <label className="permission-toggle-item">
                <input
                  type="checkbox"
                  name="canSubmitResearch"
                  defaultChecked={member.permissions.canSubmitResearch}
                />
                <div className="permission-toggle-text">
                  <strong>Submit Research Theses</strong>
                  <p>Can research prediction markets and submit theses for review</p>
                </div>
              </label>

              <label className="permission-toggle-item">
                <input
                  type="checkbox"
                  name="canAllocateCapital"
                  defaultChecked={member.permissions.canAllocateCapital}
                />
                <div className="permission-toggle-text">
                  <strong>Allocate Capital &amp; Sizing</strong>
                  <p>Can approve dollar sizing and settle position outcomes</p>
                </div>
              </label>

              <label className="permission-toggle-item">
                <input
                  type="checkbox"
                  name="canManageTasks"
                  defaultChecked={member.permissions.canManageTasks}
                />
                <div className="permission-toggle-text">
                  <strong>Manage Tasks</strong>
                  <p>Can create, update, and advance task statuses</p>
                </div>
              </label>

              <label className="permission-toggle-item">
                <input
                  type="checkbox"
                  name="canViewAnalytics"
                  defaultChecked={member.permissions.canViewAnalytics}
                />
                <div className="permission-toggle-text">
                  <strong>View Analytics &amp; Reports</strong>
                  <p>Can access firm-wide performance dashboards</p>
                </div>
              </label>

              <label className="permission-toggle-item">
                <input
                  type="checkbox"
                  name="canPostAnnouncements"
                  defaultChecked={member.permissions.canPostAnnouncements}
                />
                <div className="permission-toggle-text">
                  <strong>Post Announcements</strong>
                  <p>Can broadcast desk-wide notifications to the team</p>
                </div>
              </label>

              <label className="permission-toggle-item">
                <input
                  type="checkbox"
                  name="canManageStaff"
                  defaultChecked={member.permissions.canManageStaff}
                />
                <div className="permission-toggle-text">
                  <strong>Manage Staff Accounts</strong>
                  <p>Can provision, edit, and deactivate other employee accounts</p>
                </div>
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Check size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
