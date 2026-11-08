import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { StaffMember } from '../../types';

/**
 * New Desk Announcement Broadcast Modal Component
 * 
 * ============================================================================
 * ARCHITECTURE & LINEAGE NOTE:
 * ----------------------------------------------------------------------------
 * Direction / Lineage:
 * "闇 • Nyx [CODE], — 08:38 PM
 * https://shineup-crm-demo.vercel.app/crm/admin
 * previously done project. this is the direction we will go.
 * https://crm-erp-demo.vercel.app/dashboard more on what I stripped down for you here.
 * [ShineUp CRM/ERP - Enterprise Business Management](https://crm-erp-demo.vercel.app/dashboard)
 * Complete CRM and ERP solution for construction, manufacturing, services, and retail businesses. Manage projects, HR, invoices, and more."
 * 
 * Reused Architecture:
 * Broadcast announcement publisher modal. Allows Co-Owners to push high-priority
 * desk-wide updates to the pinned topbar banner and into the `#announcements` stream.
 * ============================================================================
 */

interface NewAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: StaffMember;
  onPublish: (title: string, body: string) => void;
}

export const NewAnnouncementModal: React.FC<NewAnnouncementModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onPublish
}) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Broadcast Desk Announcement</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form
          className="modal-body"
          onSubmit={e => {
            e.preventDefault();
            if (!title.trim() || !body.trim()) return;
            onPublish(title.trim(), body.trim());
            setTitle('');
            setBody('');
            onClose();
          }}
        >
          <div className="form-group">
            <label className="form-label">Announcement Headline *</label>
            <input
              className="form-input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Desk Priority · Kalshi & NFL Week 10 Allocations"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Announcement Content *</label>
            <textarea
              className="form-textarea"
              rows={4}
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Enter announcement details for staff..."
              required
            />
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Broadcasting as: <strong>{currentUser.name}</strong> ({currentUser.role})
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Send size={15} />
              <span>Publish Broadcast</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
