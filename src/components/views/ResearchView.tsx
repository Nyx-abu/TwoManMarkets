import React, { useState, useMemo } from 'react';
import { Plus, TrendingUp, Search } from 'lucide-react';
import { StaffMember, ResearchItem, ResearchStatus } from '../../types';

// TODO: remove legacy ticket filter states
// const OLD_TICKET_STATES = ['Open', 'Dispatched', 'Invoiced'];

interface ResearchViewProps {
  currentUser: StaffMember;
  researchList: ResearchItem[];
  researchFilter: 'All' | ResearchStatus;
  setResearchFilter: (filter: 'All' | ResearchStatus) => void;
  categoryFilter: string;
  setCategoryFilter: (cat: string) => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
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
  searchQuery,
  setSearchQuery,
  setNewSubmissionModalOpen,
  onReviewItem
}) => {
  const [internalSearch, setInternalSearch] = useState('');
  const activeSearch = searchQuery !== undefined ? searchQuery : internalSearch;
  const handleSearchChange = setSearchQuery || setInternalSearch;

  const filteredItems = useMemo(() => {
    return researchList.filter(item => {
      const matchStatus = researchFilter === 'All' || item.status === researchFilter;
      const matchCategory = categoryFilter === 'All' || item.category === categoryFilter;
      const q = activeSearch.trim().toLowerCase();
      const matchSearch = q === '' ||
        item.market.toLowerCase().includes(q) ||
        item.book.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.thesis.toLowerCase().includes(q);
      return matchStatus && matchCategory && matchSearch;
    });
  }, [researchList, researchFilter, categoryFilter, activeSearch]);

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

      {/* Status, Category, and Instant Search Filter Toolbar */}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div className="search-box-wrap" style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 30, fontSize: '12px', minWidth: '180px', maxWidth: '240px' }}
              placeholder="Search markets, books, authors..."
              value={activeSearch}
              onChange={e => handleSearchChange(e.target.value)}
              aria-label="Search research theses"
            />
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
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No research submissions match your active filter.
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => (
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
                      <div className="table-user-cell">
                        <div className="user-avatar staff" style={{ width: 22, height: 22, fontSize: 10 }}>
                          {item.authorInitials}
                        </div>
                        <span>{item.author}</span>
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Touch Trading Cards */}
        <div className="mobile-only-cards">
          {filteredItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)', fontSize: '13px' }}>
              No research submissions match your active filter.
            </div>
          ) : (
            filteredItems.map(item => (
              <div key={item.id} className="mobile-trading-card">
                <div className="mobile-card-top">
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};
