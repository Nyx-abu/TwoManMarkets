import React from 'react';
import { X, Plus } from 'lucide-react';
import { StaffMember } from '../../types';

/**
 * New Conversation / Channel Modal Component
 * 
 * ============================================================================
 * ARCHITECTURE & LINEAGE NOTE (Nyx - 08:38 PM):
 * ----------------------------------------------------------------------------
 * Direction / Lineage:
 * - https://shineup-crm-demo.vercel.app/crm/admin
 * - https://crm-erp-demo.vercel.app/dashboard
 * 
 * Reused Architecture:
 * Adapted from ShineUp CRM's communication channel initiator.
 * Dynamically sanitizes topic channel slugs (forcing lowercase and kebab-case `#`)
 * or routes private 1-on-1 direct messages with teammates.
 * ============================================================================
 */

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: StaffMember;
  staffList: StaffMember[];
  newChatType: 'dm' | 'channel';
  setNewChatType: (type: 'dm' | 'channel') => void;
  onCreateConversation: (channelKey: string) => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  staffList,
  newChatType,
  setNewChatType,
  onCreateConversation
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Start Conversation or Create Channel</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form
          className="modal-body"
          onSubmit={e => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const rawName = ((formData.get('name') as string) || '').trim();
            if (!rawName) return;

            const channelKey = newChatType === 'channel'
              ? (rawName.startsWith('#') ? rawName : `#${rawName.toLowerCase().replace(/\s+/g, '-')}`)
              : rawName;

            onCreateConversation(channelKey);
            onClose();
          }}
        >
          <div className="form-group">
            <label className="form-label">Conversation Type</label>
            <select
              name="type"
              className="form-select"
              value={newChatType}
              onChange={e => setNewChatType(e.target.value as 'dm' | 'channel')}
            >
              <option value="dm">Direct Message with Team Member</option>
              <option value="channel">New Topic Channel</option>
            </select>
          </div>

          {newChatType === 'dm' ? (
            <div className="form-group">
              <label className="form-label">Select Team Member *</label>
              <select name="name" className="form-select" required>
                {staffList
                  .filter(s => s.id !== currentUser.id && s.status === 'Active')
                  .map(s => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.title.split('·')[0].trim()})
                    </option>
                  ))}
              </select>
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Channel Name *</label>
              <input
                name="name"
                className="form-input"
                placeholder="e.g. #arbitrage-alerts or #college-hoops"
                defaultValue="#arbitrage-alerts"
                required
              />
            </div>
          )}

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Plus size={16} />
              <span>Open Conversation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
