import React from 'react';
import {
  Target,
  Plus,
  DollarSign,
  Award,
  TrendingUp,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  Radio,
  ChevronRight,
  Activity
} from 'lucide-react';
import { StaffMember, ResearchItem, DeskAnnouncement, TabType, FirmMetrics, PersonalMetrics, ChartConfig } from '../../types';
import { LIVE_ODDS_TICKER } from '../../data/mockData';

// TODO: remove old KPI card layout comments
// <div className="kpi-grid">
//   <div className="kpi-card">Gross Revenue</div>
//   <div className="kpi-card">Operating Margin</div>
// </div>

interface DashboardViewProps {
  currentUser: StaffMember;
  researchList: ResearchItem[];
  deskAnnouncement: DeskAnnouncement;
  setActiveTab: (tab: TabType) => void;
  setNewSubmissionModalOpen: (open: boolean) => void;
  onReviewItem: (item: ResearchItem) => void;
  analyticsTimeframe: '7D' | '30D' | '90D' | 'ALL' | 'CUSTOM';
  setAnalyticsTimeframe: (tf: '7D' | '30D' | '90D' | 'ALL' | 'CUSTOM') => void;
  customStartDate: string;
  setCustomStartDate: (d: string) => void;
  customEndDate: string;
  setCustomEndDate: (d: string) => void;
  chartConfig: ChartConfig;
  metrics: FirmMetrics;
  personalMetrics: PersonalMetrics;
  onOpenAnnouncementModal?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  researchList,
  deskAnnouncement,
  setActiveTab,
  setNewSubmissionModalOpen,
  onReviewItem,
  analyticsTimeframe,
  setAnalyticsTimeframe,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
  chartConfig,
  metrics,
  personalMetrics,
  onOpenAnnouncementModal
}) => {
  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>Welcome back, {currentUser.name}</h1>
          <p>TwoManMarkets Internal Management · Operational Overview</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => setActiveTab('research')}>
            <Target size={14} />
            <span>View Research Pipeline</span>
          </button>
          <button className="btn-primary" onClick={() => setNewSubmissionModalOpen(true)}>
            <Plus size={14} />
            <span>Submit Research</span>
          </button>
        </div>
      </div>

      {/* Live Odds Market Ticker Strip */}
      <div className="market-ticker-strip">
        <span className="ticker-label">
          <Activity size={14} /> LIVE MARKETS
        </span>
        {LIVE_ODDS_TICKER.map(tick => (
          <div key={tick.id} className="ticker-item">
            <span className="ticker-market">{tick.market}</span>
            <span className="ticker-odds">{tick.odds}</span>
            <span className="ticker-change up">
              {tick.type === 'settled' ? <CheckCircle2 size={11} /> : <TrendingUp size={11} />} {tick.change}
            </span>
          </div>
        ))}
      </div>

      {/* Top KPI Metrics Cards: Role-Aware (Owner Firm-Wide vs Staff Personal Telemetry) */}
      {currentUser.role === 'OWNER' ? (
        <div className="kpi-grid">
          <div className="kpi-card highlight">
            <div className="kpi-header">
              <span className="kpi-title">TOTAL ACTIVE CAPITAL</span>
              <div className="kpi-icon-wrap" style={{ background: 'var(--emerald-soft)', color: 'var(--emerald)' }}>
                <DollarSign size={18} />
              </div>
            </div>
            <div className="kpi-value mono">${metrics.totalInvested.toLocaleString()}</div>
            <div className="kpi-footer">
              <span className="trend-pill positive">
                <TrendingUp size={12} /> +18.4%
              </span>
              <span className="kpi-subtitle">firm-wide bankroll deployed</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">OVERALL WIN RATE</span>
              <div className="kpi-icon-wrap" style={{ background: 'var(--quant-violet-bg)', color: 'var(--quant-violet)' }}>
                <Award size={18} />
              </div>
            </div>
            <div className="kpi-value">{metrics.winRate}%</div>
            <div className="kpi-footer">
              <span className="trend-pill positive">
                <TrendingUp size={12} /> {metrics.wonCount}W — {metrics.lostCount}L
              </span>
              <span className="kpi-subtitle">{metrics.settledCount} resolved positions</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">NET REALIZED PROFIT</span>
              <div className="kpi-icon-wrap" style={{ background: 'var(--win-green-bg)', color: 'var(--win-green)' }}>
                <TrendingUp size={18} />
              </div>
            </div>
            <div className="kpi-value mono" style={{ color: metrics.totalProfit >= 0 ? 'var(--win-green)' : 'var(--loss-red)' }}>
              {metrics.totalProfit >= 0 ? `+$${metrics.totalProfit.toLocaleString()}` : `-$${Math.abs(metrics.totalProfit).toLocaleString()}`}
            </div>
            <div className="kpi-footer">
              <span className="trend-pill positive">ROI: {metrics.overallRoi}%</span>
              <span className="kpi-subtitle">across all verified positions</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">RESEARCH PIPELINE</span>
              <div className="kpi-icon-wrap" style={{ background: 'var(--info-blue-bg)', color: 'var(--info-blue)' }}>
                <Target size={18} />
              </div>
            </div>
            <div className="kpi-value">{metrics.pendingCount} Pending</div>
            <div className="kpi-footer">
              <span className="trend-pill positive">{metrics.investedCount} Active Positions</span>
              <span className="kpi-subtitle">{metrics.totalTheses} total logged</span>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="staff-privacy-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={16} style={{ color: 'var(--emerald)', flexShrink: 0 }} />
              <span>
                <strong>Individual Staff Telemetry Active:</strong> Displaying personal research accuracy, thesis attribution, and assigned duties. Firm-wide treasury bankroll and partner capital decisions are restricted to Co-Owner accounts.
              </span>
            </div>
          </div>
          <div className="kpi-grid">
            <div className="kpi-card highlight">
              <div className="kpi-header">
                <span className="kpi-title">MY RESEARCH HIT RATE</span>
                <div className="kpi-icon-wrap" style={{ background: 'var(--emerald-soft)', color: 'var(--emerald)' }}>
                  <Award size={18} />
                </div>
              </div>
              <div className="kpi-value">{personalMetrics.hitRate}%</div>
              <div className="kpi-footer">
                <span className="trend-pill positive">
                  <TrendingUp size={12} /> {personalMetrics.streak}
                </span>
                <span className="kpi-subtitle">verified outcome accuracy</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-title">MY THESES LOGGED</span>
                <div className="kpi-icon-wrap" style={{ background: 'var(--info-blue-bg)', color: 'var(--info-blue)' }}>
                  <Target size={18} />
                </div>
              </div>
              <div className="kpi-value">{personalMetrics.totalTheses} Theses</div>
              <div className="kpi-footer">
                <span className="trend-pill positive">
                  {personalMetrics.pendingCount} Under Review · {personalMetrics.investedCount} Active
                </span>
                <span className="kpi-subtitle">attributed to {currentUser.name.split(' ')[0]}</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-title">NET VALUE GENERATED</span>
                <div className="kpi-icon-wrap" style={{ background: 'var(--win-green-bg)', color: 'var(--win-green)' }}>
                  <TrendingUp size={18} />
                </div>
              </div>
              <div className="kpi-value mono" style={{ color: 'var(--win-green)' }}>
                +${personalMetrics.netProfit.toLocaleString()}
              </div>
              <div className="kpi-footer">
                <span className="trend-pill positive">Edge: {personalMetrics.avgEdge}</span>
                <span className="kpi-subtitle">realized profit from your research</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-title">MY ASSIGNED TASKS</span>
                <div className="kpi-icon-wrap" style={{ background: 'var(--quant-violet-bg)', color: 'var(--quant-violet)' }}>
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <div className="kpi-value">{personalMetrics.taskCompletionRate}%</div>
              <div className="kpi-footer">
                <span className="trend-pill positive">
                  {personalMetrics.completedTasksCount}/{personalMetrics.assignedTasksCount} Completed
                </span>
                <span className="kpi-subtitle">on-time task completion rate</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Split Grid: Interactive Performance Chart & Position Outcomes */}
      <div className="dashboard-split-grid">
        <div className="panel-card">
          <div className="panel-head">
            <div>
              <h3 className="panel-title">
                {currentUser.role === 'OWNER'
                  ? 'Cumulative Capital Growth & Realized Returns'
                  : `${currentUser.name.split(' ')[0]}'s Research Performance & Hit-Rate Progression`}
              </h3>
              <p className="panel-desc">
                {currentUser.role === 'OWNER'
                  ? 'Daily net profit & loss from verified prediction investments (Firm Treasury)'
                  : 'Cumulative outcome accuracy and attribution from your logged market research'}
              </p>
            </div>
            <div className="filter-group">
              {(['7D', '30D', '90D', 'ALL', 'CUSTOM'] as const).map(tf => (
                <button
                  key={tf}
                  className={`filter-tab-btn ${analyticsTimeframe === tf ? 'active' : ''}`}
                  onClick={() => setAnalyticsTimeframe(tf)}
                >
                  {tf === 'CUSTOM' ? 'Custom Range' : tf}
                </button>
              ))}
            </div>
          </div>

          {analyticsTimeframe === 'CUSTOM' && (
            <div className="custom-date-range-bar" style={{ margin: '0 20px 16px 20px' }}>
              <div className="date-input-group">
                <Calendar size={14} style={{ color: 'var(--emerald)' }} />
                <span className="date-label">From:</span>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={e => setCustomStartDate(e.target.value)}
                  className="date-picker-input"
                />
              </div>
              <div className="date-input-group">
                <span className="date-label">To:</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={e => setCustomEndDate(e.target.value)}
                  className="date-picker-input"
                />
              </div>
              <span className="custom-date-pill">
                Active Filter: {customStartDate} → {customEndDate}
              </span>
            </div>
          )}

          {/* High Quality Interactive SVG Chart */}
          <div className="chart-container">
            <svg className="chart-svg" viewBox="0 0 700 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="emerald-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="700" y2="40" className="chart-grid-line" />
              <line x1="0" y1="90" x2="700" y2="90" className="chart-grid-line" />
              <line x1="0" y1="140" x2="700" y2="140" className="chart-grid-line" />

              {/* Filled Curve Area */}
              <path
                d={chartConfig.areaPath}
                className="chart-area-fill"
              />

              {/* Main Trend Line */}
              <path
                d={chartConfig.linePath}
                className="chart-line-stroke"
              />

              {/* Terminal Point */}
              <circle cx="700" cy={chartConfig.terminalY} r="4.5" fill="#10b981" stroke="#09090b" strokeWidth="2" />
            </svg>
            <div className="chart-axis-labels">
              {chartConfig.labels.map((lbl, idx) => (
                <span key={idx}>{lbl}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Outcome Breakdown Donut Panel */}
        <div className="panel-card">
          <div className="panel-head">
            <div>
              <h3 className="panel-title">Position Outcomes</h3>
              <p className="panel-desc">Settled investment hit-rate breakdown</p>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--emerald)', fontWeight: 700 }}>
              PF: 2.38x
            </span>
          </div>

          <div className="donut-card-body">
            <div
              className="donut-visual"
              style={{
                background: `conic-gradient(
                  var(--win-green) 0% 69.2%,
                  var(--loss-red) 69.2% 100%
                )`
              }}
            >
              <div className="donut-inner">
                <span className="donut-stat">{metrics.winRate}%</span>
                <span className="donut-label">Win Rate</span>
              </div>
            </div>

            <div className="outcome-breakdown-list">
              <div className="outcome-row">
                <span className="outcome-indicator">
                  <span className="color-dot won" />
                  <span>Winning Positions</span>
                </span>
                <strong style={{ color: 'var(--win-green)' }}>{metrics.wonCount} picks</strong>
              </div>

              <div className="outcome-row">
                <span className="outcome-indicator">
                  <span className="color-dot lost" />
                  <span>Losing Positions</span>
                </span>
                <strong style={{ color: 'var(--loss-red)' }}>{metrics.lostCount} picks</strong>
              </div>

              <div className="outcome-row">
                <span className="outcome-indicator">
                  <span className="color-dot pending" />
                  <span>Active / Pending</span>
                </span>
                <strong>{metrics.investedCount + metrics.pendingCount} picks</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pinned Desk Announcement Banner */}
      <div className="desk-announcement-card">
        <div className="announcement-icon-badge">
          <Radio size={18} />
        </div>
        <div className="announcement-body">
          <div className="announcement-title">{deskAnnouncement.title}</div>
          <p className="announcement-text">{deskAnnouncement.body}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
          <div className="announcement-meta">Posted by {deskAnnouncement.author} · {deskAnnouncement.postedAt}</div>
          {currentUser.role === 'OWNER' && onOpenAnnouncementModal && (
            <button
              className="btn-secondary"
              style={{ padding: '4px 10px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              onClick={onOpenAnnouncementModal}
            >
              <Radio size={12} style={{ color: 'var(--emerald)' }} />
              <span>Broadcast New</span>
            </button>
          )}
        </div>
      </div>

      {/* Lower Section: Pending Theses Requiring Review */}
      <div className="panel-card">
        <div className="panel-head">
          <div>
            <h3 className="panel-title">Pending Research Awaiting Review</h3>
            <p className="panel-desc">Analyst research submissions requiring capital allocation decision</p>
          </div>
          <button className="btn-secondary" onClick={() => setActiveTab('research')}>
            <span>View All ({researchList.length})</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="table-responsive desktop-only-table">
          <table className="data-table">
            <thead>
              <tr>
                <th>Market &amp; Platform</th>
                <th>Category</th>
                <th>Current Price / Odds</th>
                <th>Calculated Edge</th>
                <th>Suggested Stake</th>
                <th>Analyst</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {researchList.slice(0, 4).map(item => (
                <tr key={item.id}>
                  <td>
                    <span className="table-market-title">{item.market}</span>
                    <span className="table-sub-info">{item.id} · {item.book}</span>
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
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    ${item.suggestedStake.toLocaleString()}
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

        {/* Mobile & Tablet Card View for Dashboard */}
        <div className="mobile-only-cards">
          {researchList.slice(0, 4).map(item => (
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
                  <span className="metric-lbl">Suggested Stake</span>
                  <span className="metric-val stake">${item.suggestedStake.toLocaleString()}</span>
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
