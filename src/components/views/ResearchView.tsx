import React from 'react';
import { Plus, TrendingUp } from 'lucide-react';
import { StaffMember, ResearchItem, ResearchStatus } from '../../types';

/**
 * Research Pipeline View Component
 * 
 * ============================================================================
 * ARCHITECTURE & LINEAGE NOTE (Nyx - 08:38 PM):
 * ----------------------------------------------------------------------------
 * Direction / Lineage:
 * - https://shineup-crm-demo.vercel.app/crm/admin
 * - https://crm-erp-demo.vercel.app/dashboard
 * 
 * Reused vs. Bespoke Architecture:
 * 1. REUSED PATTERN: Multi-state pipeline filtering toolbar with active counters
 *    adapted from ShineUp's work order ticketing system.
 * 2. REUSED PATTERN: Dual layout rendering (Desktop data table vs. Mobile trading card
 *    stack) ensuring responsive parity across 360px phones to 4K ultra-wides.
 * 3. BESPOKE FOR TWOMANMARKETS: Prediction market pricing metrics — Implied probabilities,
 *    closing line value (CLV), fractional Kelly stake sizing recommendations, and
 *    bookmaker odds normalization (-110, +145, 78¢ Kalshi cents).
 * ============================================================================
 */

/*
// ============================================================================
// [REUSED FROM SHINEUP CRM - TICKET STATUS FILTER ARCHITECTURE]
// In ShineUp CRM, tickets transitioned through:
// const LEGACY_TICKET_STATES = ['Open', 'Dispatched', 'In Progress', 'Invoiced', 'Archived'];
//
// Refactored below into betting settlement lifecycle:
// ['All', 'Pending', 'Invested', 'Won', 'Lost', 'Passed']
// ============================================================================
*/

interface ResearchViewProps {
  currentUser: StaffMember;
  researchList: ResearchItem[];
  researchFilter: 'All' | ResearchStatus;
  setResearchFilter: (filter: 'All' | ResearchStatus) => void;
  categoryFilter: string;
  setCategoryFilter: (cat: string) => void;
  setNewSubmissionModalOpen: (open: boolean) => void;
  onReviewItem: (item: ResearchItem) => void;
}

export const ResearchView: React.FC<ResearchViewProps> = ({
  currentUser,
  researchList,
  researchFilter,
  setResearchFilter,
  categoryFilter,
  setCategoryFilter,
  setNewSubmissionModalOpen,
  onReviewItem
}) => {
  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>Prediction Market Research Pipeline</h1>
          <p>Staff analysts submit structured research theses; Co-Owners review, size positions, and allocate capital.</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setNewSubmissionModalOpen(true)}>
            <Plus size={16} />
            <span>Submit New Thesis</span>
          </button>
        </div>
      </div>

      {/* Status and Category Filter Controls */}
      <div className="filter-toolbar">
        <div className="filter-group">
          {(['All', 'Pending', 'Invested', 'Won', 'Lost', 'Passed'] as const).map(st => (
            <button
              key={st}
              className={`filter-tab-btn ${researchFilter === st ? 'active' : ''}`}
              onClick={() => setResearchFilter(st)}
            >
              {st}
              {st !== 'All' && (
                <span className="counter-pill">
                  {researchList.filter(r => r.status === st).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="category-select-wrap">
          <select
            className="category-dropdown"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            aria-label="Filter research by category"
          >
            <option value="All">All Categories</option>
            <option value="Sports">Sports</option>
            <option value="Macro">Macro</option>
            <option value="Crypto">Crypto</option>
            <option value="Politics">Politics</option>
          </select>
        </div>
      </div>

      {/* Research Items Table */}
      <div className="panel-card">
        <div className="table-responsive desktop-only-table">
          <table className="data-table">
            <thead>
              <tr>
                <th>Market &amp; Platform</th>
                <th>Category</th>
                <th>Price / Odds</th>
                <th>Calculated Edge</th>
                <th>Stake Allocation</th>
                <th>Analyst</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {researchList
                .filter(r => researchFilter === 'All' || r.status === researchFilter)
                .filter(r => categoryFilter === 'All' || r.category === categoryFilter)
                .map(item => (
                  <tr key={item.id}>
                    <td>
                      <span className="table-market-title">{item.market}</span>
                      <span className="table-sub-info">{item.id} · {item.book} · {item.date}</span>
                    </td>
                    <td>
                      <span className="category-chip">{item.category}</span>
                    </td>
                    <td>
                      <span className="odds-chip">{item.odds}</span>
                    </td>
                    <td>
                      <span className="edge-badge">
                        <TrendingUp size={12} /> {item.edge}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        {item.status === 'Invested' || item.status === 'Won' || item.status === 'Lost' ? (
                          <span style={{ color: 'var(--win-green)' }}>${item.actualInvested.toLocaleString()} deployed</span>
                        ) : (
                          <span>${item.suggestedStake.toLocaleString()} suggested</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div className="user-avatar staff" style={{ width: 22, height: 22, fontSize: 10 }}>
                          {item.authorInitials}
                        </div>
                        <span style={{ fontSize: '12px' }}>{item.author}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-pill ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '11px' }}
                        onClick={() => onReviewItem(item)}
                      >
                        {currentUser.role === 'OWNER' ? 'Review & Size' : 'View Details'}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List */}
        <div className="mobile-only-cards">
          {researchList
            .filter(r => researchFilter === 'All' || r.status === researchFilter)
            .filter(r => categoryFilter === 'All' || r.category === categoryFilter)
            .map(item => (
              <div key={item.id} className="mobile-research-card">
                <div className="mobile-card-header">
                  <div className="mobile-card-badges">
                    <span className="category-chip">{item.category}</span>
                    <span className="exchange-tag">{item.book}</span>
                  </div>
                  <span className={`status-pill ${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </div>

                <h4 className="mobile-card-title">{item.market}</h4>
                <div className="mobile-card-meta">{item.id} · {item.date}</div>

                <div className="mobile-metrics-strip">
                  <div className="mobile-metric-item">
                    <span className="metric-lbl">Market Odds</span>
                    <span className="metric-val odds">{item.odds}</span>
                  </div>

                  <div className="mobile-metric-item">
                    <span className="metric-lbl">Calculated Edge</span>
                    <span className="metric-val edge">
                      <TrendingUp size={11} /> {item.edge}
                    </span>
                  </div>

                  <div className="mobile-metric-item">
                    <span className="metric-lbl">Stake</span>
                    <span className="metric-val stake">
                      ${(item.actualInvested || item.suggestedStake).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mobile-card-footer">
                  <div className="mobile-author-info">
                    <div className="user-avatar staff" style={{ width: 22, height: 22, fontSize: 10 }}>
                      {item.authorInitials}
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.author}</span>
                  </div>

                  <button
                    className="btn-secondary mobile-card-btn"
                    onClick={() => onReviewItem(item)}
                  >
                    {currentUser.role === 'OWNER' ? 'Review & Size' : 'View Details'}
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
