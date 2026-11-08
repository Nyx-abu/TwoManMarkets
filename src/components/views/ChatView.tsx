import React from 'react';
import {
  Plus,
  MessageSquare,
  Users,
  Send,
  Lock
} from 'lucide-react';
import { StaffMember, ChatMessage } from '../../types';

/**
 * Team Chat & Communication View Component
 * 
 * ============================================================================
 * ARCHITECTURE & LINEAGE NOTE (Nyx - 08:38 PM):
 * ----------------------------------------------------------------------------
 * Direction / Lineage:
 * - https://shineup-crm-demo.vercel.app/crm/admin
 * - https://crm-erp-demo.vercel.app/dashboard
 * 
 * Reused Architecture:
 * 1. PERSISTENT WORKSPACE STREAM:
 *    Adapted from ShineUp CRM's multi-dispatch communication room.
 *    Provides real-time team chat with channel switching (`#announcements`,
 *    `#sports-picks`, `#macro-theses`, `#general`) plus 1-on-1 direct messages.
 * 2. BROADCAST CHANNEL ROLE GUARD:
 *    `#announcements` is locked down to read-only for Staff analysts. Only Co-Owners
 *    have the broadcast key to prevent noise in the official announcement log.
 * 3. MOBILE QUICK-SWITCHER PILL SCROLLER:
 *    Horizontal scrollable chip strip (`.mobile-channel-scroller`) for instant
 *    channel jumps on mobile devices without needing a nested drawer.
 * ============================================================================
 */

/*
// ============================================================================
// [REUSED FROM SHINEUP CRM - CHANNEL ROUTER SCHEMA]
// In ShineUp CRM, dispatchers and field technicians shared:
// channels: ['#field-dispatch', '#urgent-repairs', '#warehouse-parts']
//
// Refactored below for sports picks, macro theses, and direct partner DMs.
// ============================================================================
*/

interface ChatViewProps {
  currentUser: StaffMember;
  staffList: StaffMember[];
  chatChannels: Record<string, ChatMessage[]>;
  activeChannel: string;
  setActiveChannel: (channel: string) => void;
  publicChannels: string[];
  directMessages: string[];
  allConversations: string[];
  chatInput: string;
  setChatInput: (input: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  setNewChatModalOpen: (open: boolean) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  currentUser,
  staffList,
  chatChannels,
  activeChannel,
  setActiveChannel,
  publicChannels,
  directMessages,
  allConversations,
  chatInput,
  setChatInput,
  onSendMessage,
  setNewChatModalOpen
}) => {
  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>Team Chat &amp; Channels</h1>
          <p>Real-time channel messaging, private direct messages, and broadcasted desk announcements.</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => setNewChatModalOpen(true)}>
            <Plus size={14} />
            <span>New Conversation</span>
          </button>
        </div>
      </div>

      <div className="chat-container-layout">
        {/* Channels Sidebar */}
        <aside className="chat-sidebar">
          <div className="chat-sidebar-header">
            <span>CHANNELS &amp; DMS</span>
            <button
              style={{ color: 'var(--text-muted)' }}
              onClick={() => setNewChatModalOpen(true)}
              aria-label="New chat channel"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="chat-channels-list">
            <div>
              <div className="chat-group-title">PUBLIC CHANNELS</div>
              {publicChannels.map(ch => (
                <button
                  key={ch}
                  className={`channel-btn ${activeChannel === ch ? 'active' : ''}`}
                  onClick={() => setActiveChannel(ch)}
                >
                  <MessageSquare size={14} />
                  <span>{ch}</span>
                </button>
              ))}
            </div>

            <div>
              <div className="chat-group-title">DIRECT MESSAGES</div>
              {directMessages.map(name => {
                const targetStaff = staffList.find(s => s.name === name);
                const initials = targetStaff ? targetStaff.initials : name.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase();
                const avatarClass = targetStaff ? targetStaff.avatarClass : 'staff';
                return (
                  <button
                    key={name}
                    className={`channel-btn ${activeChannel === name ? 'active' : ''}`}
                    onClick={() => setActiveChannel(name)}
                  >
                    <div className={`user-avatar ${avatarClass}`} style={{ width: 18, height: 18, fontSize: 9 }}>
                      {initials}
                    </div>
                    <span>{name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Active Conversation Window */}
        <div className="chat-main-window">
          {/* Mobile Channel Quick Switcher */}
          <div className="mobile-channel-scroller">
            {allConversations.map(ch => (
              <button
                key={ch}
                className={`mobile-channel-pill ${activeChannel === ch ? 'active' : ''}`}
                onClick={() => setActiveChannel(ch)}
              >
                {ch.startsWith('#') ? <MessageSquare size={12} /> : <Users size={12} />}
                <span>{ch}</span>
              </button>
            ))}
          </div>

          <div className="chat-active-header">
            <div className="channel-info">
              <h3>{activeChannel}</h3>
              <p>
                {activeChannel === '#announcements' && 'Broadcast updates and operational guidelines from Co-Owners'}
                {activeChannel === '#sports-picks' && 'Real-time discussion on sports betting lines & odds'}
                {activeChannel === '#macro-theses' && 'Kalshi / Polymarket economic & political contract analysis'}
                {activeChannel === '#general' && 'General team coordination and market discussions'}
                {!activeChannel.startsWith('#') && `Private 1-on-1 direct message with ${activeChannel}`}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <span className="pulsing-dot" />
              <span>{staffList.filter(s => s.status === 'Active').length} members active</span>
            </div>
          </div>

          <div className="chat-messages-area">
            {(chatChannels[activeChannel] || []).map(msg => (
              <div key={msg.id} className={`chat-message-row ${msg.isAnnouncement ? 'announcement-message' : ''}`}>
                <div className={`message-avatar ${msg.role === 'OWNER' ? 'owner' : 'staff'}`}>
                  {msg.initials}
                </div>
                <div className="message-body">
                  <div className="message-meta">
                    <span className="message-author">{msg.sender}</span>
                    <span className="message-author-badge">
                      {msg.role === 'OWNER' ? 'CO-OWNER' : 'ANALYST'}
                    </span>
                    <span className="message-time">{msg.time}</span>
                  </div>
                  <div className="message-text" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                </div>
              </div>
            ))}
          </div>

          {activeChannel === '#announcements' && currentUser.role !== 'OWNER' ? (
            <div style={{ padding: '12px 16px', background: 'var(--bg-card-subtle)', borderTop: '1px solid var(--border-subtle)', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={14} />
              <span>This channel is broadcast-only. Only Co-Owners can post desk announcements.</span>
            </div>
          ) : (
            <form className="chat-composer-wrap" onSubmit={onSendMessage}>
              <input
                type="text"
                className="composer-input"
                placeholder={`Message ${activeChannel}... (Press Enter to send)`}
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
              />
              <button type="submit" className="btn-primary" style={{ padding: '8px 14px' }}>
                <Send size={15} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
