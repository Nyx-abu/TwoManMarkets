import React from 'react';
import {
  X,
  ExternalLink,
  Check,
  CheckCircle2,
  XCircle,
  Lock
} from 'lucide-react';
import { StaffMember, ResearchItem } from '../../types';

/**
 * Review & Capital Allocation / Sizing Modal Component
 * 
 * ============================================================================
 * ARCHITECTURE & LINEAGE NOTE (Nyx - 08:38 PM):
 * ----------------------------------------------------------------------------
 * Direction / Lineage:
 * - https://shineup-crm-demo.vercel.app/crm/admin
 * - https://crm-erp-demo.vercel.app/dashboard
 * 
 * Reused Architecture:
 * 1. WORK ORDER CAPITAL APPROVAL HARNESS:
 *    Adapted from ShineUp CRM's expense and procurement authorization modal.
 *    In ShineUp, managers reviewed subcontractor quotes before releasing purchase orders.
 *    Here, Co-Owners review analyst quantitative theses and authorize actual cash stakes.
 * 2. POSITION SETTLEMENT LIFECYCLE:
 *    Handles P&L calculation, net profit delta tracking, and ROI attribution upon
 *    market settlement.
 * ============================================================================
 */

interface ReviewSizeModalProps {
  item: ResearchItem | null;
  onClose: () => void;
  currentUser: StaffMember;
  investAmountInput: string;
  setInvestAmountInput: (amount: string) => void;
  onPassPick: (item: ResearchItem) => void;
  onApproveInvestment: (item: ResearchItem, amount: number) => void;
  onSettleOutcome: (item: ResearchItem, outcome: 'Won' | 'Lost', payout: number) => void;
}

export const ReviewSizeModal: React.FC<ReviewSizeModalProps> = ({
  item,
  onClose,
  currentUser,
  investAmountInput,
  setInvestAmountInput,
  onPassPick,
  onApproveInvestment,
  onSettleOutcome
}) => {
  if (!item) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span style={{ fontSize: '11px', color: 'var(--emerald)', fontWeight: 700 }}>
              {item.id} · {item.category}
            </span>
            <h3 className="modal-title" style={{ marginTop: '4px' }}>
              {item.market}
            </h3>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Metrics Header */}
          <div className="form-grid-3">
            <div style={{ background: 'var(--bg-card-subtle)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Current Odds</span>
              <div style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{item.odds}</div>
            </div>

            <div style={{ background: 'var(--bg-card-subtle)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Calculated Edge</span>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--win-green)' }}>{item.edge}</div>
            </div>

            <div style={{ background: 'var(--bg-card-subtle)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Proposed Stake</span>
              <div style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>${item.suggestedStake.toLocaleString()}</div>
            </div>
          </div>

          {/* Research Thesis Details */}
          <div className="form-group">
            <label className="form-label">Research Thesis &amp; Analysis</label>
            <div style={{ background: 'var(--bg-card-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              {item.thesis}
            </div>
          </div>

          {/* Source Link */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
              <ExternalLink size={14} style={{ color: 'var(--emerald)' }} />
              <span>Market Link: <a href={item.sourceUrl} target="_blank" rel="noreferrer">{item.sourceUrl}</a></span>
            </div>
            <span className="status-pill invested">{item.book}</span>
          </div>

          {/* Capital Allocation & Outcome Controls */}
          {currentUser.role === 'OWNER' ? (
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text-primary)' }}>Co-Owner Capital Decision</h4>
                <span style={{ fontSize: '11px', color: 'var(--emerald)', fontWeight: 600 }}>Active Role: {currentUser.name}</span>
              </div>

              {item.status === 'Pending' && (
                <div className="modal-actions-row">
                  <div style={{ flex: 1, width: '100%' }}>
                    <label className="form-label">Actual Invested Stake ($)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={investAmountInput}
                      onChange={e => setInvestAmountInput(e.target.value)}
                      placeholder="e.g. 1500"
                    />
                  </div>
                  <div className="modal-action-buttons">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => onPassPick(item)}
                    >
                      Pass Pick
                    </button>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => onApproveInvestment(item, Number(investAmountInput))}
                    >
                      <Check size={16} />
                      <span>Approve &amp; Capitalize (${investAmountInput})</span>
                    </button>
                  </div>
                </div>
              )}

              {item.status === 'Invested' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Position is currently active with <b>${item.actualInvested.toLocaleString()}</b> deployed. When market settles:
                  </div>
                  <div className="modal-settle-buttons">
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => {
                        const payout = Math.round(item.actualInvested * 1.91);
                        onSettleOutcome(item, 'Won', payout);
                      }}
                    >
                      <CheckCircle2 size={16} />
                      <span>
                        Mark Settle WON (+${Math.round(item.actualInvested * 0.91).toLocaleString()} Net P&amp;L)
                      </span>
                    </button>

                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ borderColor: 'var(--loss-red)', color: 'var(--loss-red)' }}
                      onClick={() => onSettleOutcome(item, 'Lost', 0)}
                    >
                      <XCircle size={16} />
                      <span>Mark Settle LOST</span>
                    </button>
                  </div>
                </div>
              )}

              {(item.status === 'Won' || item.status === 'Lost') && (
                <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: item.status === 'Won' ? 'var(--win-green-bg)' : 'var(--loss-red-bg)', border: `1px solid ${item.status === 'Won' ? 'var(--win-green-border)' : 'var(--loss-red-border)'}` }}>
                  <strong>Position Settled as {item.status}</strong>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>
                    Net P&amp;L: {item.netProfit && item.netProfit >= 0 ? `+$${item.netProfit}` : `-$${Math.abs(item.netProfit || 0)}`} · ROI: {item.roi}%
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-card-subtle)', border: '1px solid var(--border-subtle)', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <span>Capital allocation and settlement controls are restricted to Co-Owner accounts. (Switch to Luis profile in the top-right to test decision controls).</span>
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
