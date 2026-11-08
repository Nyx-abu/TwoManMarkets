import React from 'react';
import { X, Check } from 'lucide-react';
import { StaffMember, TaskItem } from '../../types';

/**
 * Create & Assign Task Modal Component
 * 
 * ============================================================================
 * ARCHITECTURE & LINEAGE NOTE (Nyx - 08:38 PM):
 * ----------------------------------------------------------------------------
 * Direction / Lineage:
 * - https://shineup-crm-demo.vercel.app/crm/admin
 * - https://crm-erp-demo.vercel.app/dashboard
 * 
 * Reused Architecture:
 * Adapted from ShineUp CRM's Work Order Creation Dialog.
 * Enforces assignment to active staff members with priority tagging
 * (Urgent, High, Medium, Low) and deadline tracking.
 * ============================================================================
 */

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffList: StaffMember[];
  onSubmit: (task: TaskItem) => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  staffList,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Create &amp; Assign Task</h3>
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
            const desc = formData.get('desc') as string;
            const assignee = formData.get('assignee') as string;
            const priority = (formData.get('priority') as any) || 'Medium';
            const dueDate = (formData.get('dueDate') as string) || 'Due Friday';

            const targetStaff = staffList.find(s => s.name === assignee);
            const initials = targetStaff
              ? targetStaff.initials
              : assignee.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase();

            const newTask: TaskItem = {
              id: `task-${Date.now()}`,
              title,
              description: desc,
              assignee,
              assigneeInitials: initials,
              dueDate,
              priority,
              status: 'Pending'
            };

            onSubmit(newTask);
            onClose();
          }}
        >
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              name="title"
              required
              className="form-input"
              placeholder="e.g. Audit Kalshi Q4 Inflation Contracts"
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Assignee *</label>
              <select name="assignee" className="form-select">
                {staffList.filter(s => s.status === 'Active').map(s => (
                  <option key={s.id} value={s.name}>{s.name} ({s.title.split('·')[0].trim()})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority Level</label>
              <select name="priority" className="form-select">
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Deadline / Due Date</label>
            <input
              name="dueDate"
              className="form-input"
              placeholder="e.g. Today · 5:00 PM or Nov 14"
              defaultValue="Due Friday"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description &amp; Deliverables</label>
            <textarea
              name="desc"
              rows={3}
              className="form-textarea"
              placeholder="Specific requirements, dataset links, and expected completion criteria..."
              defaultValue="Extract implied yield curve probability distributions ahead of upcoming print."
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Check size={16} />
              <span>Assign Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
