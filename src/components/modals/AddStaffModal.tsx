import React from 'react';
import { X, Plus } from 'lucide-react';
import { StaffMember, Role } from '../../types';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (member: StaffMember) => void;
}

export const AddStaffModal: React.FC<AddStaffModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Create New Staff Account</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form
          className="modal-body"
          onSubmit={e => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const name = (formData.get('name') as string).trim();
            const username = (formData.get('username') as string).trim().toLowerCase();
            const email = (formData.get('email') as string).trim();
            const role = (formData.get('role') as Role) || 'STAFF';
            const title = (formData.get('title') as string).trim() || 'Research Analyst';

            const newMember: StaffMember = {
              id: `u-${Date.now()}`,
              username,
              name,
              email,
              role,
              title,
              initials: name.split(' ').map(x => x[0]).join('').toUpperCase().slice(0, 2),
              avatarClass: role === 'OWNER' ? 'owner' : 'staff',
              status: 'Active',
              joinedDate: 'Nov 2026',
              lastActive: 'Just now',
              responsibilities: ['Market analysis and research theses submission', 'Task deliverables'],
              permissions: {
                canSubmitResearch: true,
                canAllocateCapital: role === 'OWNER',
                canManageTasks: true,
                canViewAnalytics: true,
                canPostAnnouncements: role === 'OWNER',
                canManageStaff: role === 'OWNER'
              },
              metrics: {
                winRate: 0,
                thesesCount: 0,
                netProfit: 0,
                tasksCompleted: 0,
                tasksTotal: 0,
                streak: 'New',
                avgEdge: '—'
              }
            };

            onSubmit(newMember);
            onClose();
          }}
        >
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input name="name" required className="form-input" placeholder="e.g. Taylor Brooks" />
            </div>
            <div className="form-group">
              <label className="form-label">Username *</label>
              <input name="username" required className="form-input" placeholder="e.g. tbrooks" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Corporate Email Address *</label>
            <input name="email" required type="email" className="form-input" placeholder="taylor@twomanmarkets.internal" />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Role Tier</label>
              <select name="role" className="form-select">
                <option value="STAFF">Staff / Analyst</option>
                <option value="OWNER">Co-Owner / Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Title &amp; Focus</label>
              <input name="title" className="form-input" defaultValue="Sports Quantitative Analyst" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Temporary Provisioning Password</label>
            <input
              type="password"
              className="form-input"
              defaultValue="InitialAuth2026#"
              disabled
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              Secure temporary password will be sent to the employee email with mandatory first-login reset.
            </span>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Plus size={16} />
              <span>Provision Account</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
