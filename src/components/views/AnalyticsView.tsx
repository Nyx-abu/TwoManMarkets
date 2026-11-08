import React from 'react';
import {
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  Award,
  Activity,
  ShieldAlert,
  CheckCircle2,
  Flame
} from 'lucide-react';
import { StaffMember, ResearchItem, FirmMetrics, PersonalMetrics, CategoryMetric } from '../../types';

// TODO: remove old commission calc snippets
// const calcCommission = (rev: number, rate: number) => rev * rate;

interface AnalyticsViewProps {
  currentUser: StaffMember;
  staffList: StaffMember[];
  researchList: ResearchItem[];
  filteredHistoricalRecords: ResearchItem[];
  categoryMetrics: CategoryMetric[];
  metrics: FirmMetrics;
  personalMetrics: PersonalMetrics;
  analyticsTimeframe: '7D' | '30D' | '90D' | 'ALL' | 'CUSTOM';
  setAnalyticsTimeframe: (tf: '7D' | '30D' | '90D' | 'ALL' | 'CUSTOM') => void;
  customStartDate: string;
  setCustomStartDate: (d: string) => void;
  customEndDate: string;
  setCustomEndDate: (d: string) => void;
  analyticsCategoryFilter: string;
  setAnalyticsCategoryFilter: (cat: string) => void;
  analyticsStatusFilter: string;
  setAnalyticsStatusFilter: (status: string) => void;
  onExportCsv: () => void;
  onSelectStaff: (member: StaffMember) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  currentUser,
  staffList,
  researchList,
  filteredHistoricalRecords,
  categoryMetrics,
  metrics,
  personalMetrics,
  analyticsTimeframe,
  setAnalyticsTimeframe,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
  analyticsCategoryFilter,
  setAnalyticsCategoryFilter,
  analyticsStatusFilter,
  setAnalyticsStatusFilter,
  onExportCsv,
  onSelectStaff
}) => {
  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>{currentUser.role === 'OWNER' ? 'Analytics & Performance Reports' : `${currentUser.name.split(' ')[0]}'s Personal Research Telemetry`}</h1>
          <p>
            {currentUser.role === 'OWNER'
              ? 'Historical capital returns, market category win rates, and analyst performance metrics.'
              : `Individual hit rates, model edge metrics, and task completion record for ${currentUser.name}.`}
          </p>
        </div>
        <div className="header-actions">
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
          <button className="btn-secondary" onClick={onExportCsv}>
            <Download size={14} />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {analyticsTimeframe === 'CUSTOM' && (
        <div className="custom-date-range-bar" style={{ marginBottom: '20px' }}>
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

      {/* Analytics Top Metrics: Role-Segregated */}
      {currentUser.role === 'OWNER' ? (
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">TOTAL INVESTED CAPITAL</span>
              <DollarSign size={18} style={{ color: 'var(--emerald)' }} />
            </div>
            <div className="kpi-value mono">${metrics.totalInvested.toLocaleString()}</div>
            <div className="kpi-footer">
              <span className="trend-pill positive">+24.5%</span>
              <span className="kpi-subtitle">active capital deployed</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">CUMULATIVE NET PROFIT</span>
              <TrendingUp size={18} style={{ color: 'var(--win-green)' }} />
            </div>
            <div className="kpi-value mono" style={{ color: 'var(--win-green)' }}>
              +${metrics.totalProfit.toLocaleString()}
            </div>
            <div className="kpi-footer">
              <span className="trend-pill positive">ROI: {metrics.overallRoi}%</span>
              <span className="kpi-subtitle">on closed positions</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">PROFIT FACTOR</span>
              <Award size={18} style={{ color: 'var(--quant-violet)' }} />
            </div>
            <div className="kpi-value">{metrics.profitFactor}</div>
            <div className="kpi-footer">
              <span className="trend-pill positive">Sharpe: {metrics.sharpeRatio}</span>
              <span className="kpi-subtitle">risk-adjusted return</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">AVERAGE VALUE EDGE</span>
              <Activity size={18} style={{ color: 'var(--info-blue)' }} />
            </div>
            <div className="kpi-value">{metrics.avgEdge}</div>
            <div className="kpi-footer">
              <span className="trend-pill positive">Kelly Sized</span>
              <span className="kpi-subtitle">above market implied odds</span>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="staff-privacy-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={16} style={{ color: 'var(--emerald)', flexShrink: 0 }} />
              <span>
                <strong>Co-Owner Master Ledger Restricted:</strong> Total firm bankroll (${metrics.totalInvested.toLocaleString()}) and firm treasury accounts are restricted. Showing your personal research accuracy and thesis attribution below.
              </span>
            </div>
          </div>
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-title">MY RESEARCH HIT RATE</span>
                <Award size={18} style={{ color: 'var(--emerald)' }} />
              </div>
              <div className="kpi-value">{personalMetrics.hitRate}%</div>
              <div className="kpi-footer">
                <span className="trend-pill positive">{personalMetrics.streak}</span>
                <span className="kpi-subtitle">verified outcome accuracy</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-title">MY NET VALUE ADDED</span>
                <TrendingUp size={18} style={{ color: 'var(--win-green)' }} />
              </div>
              <div className="kpi-value mono" style={{ color: 'var(--win-green)' }}>
                +${personalMetrics.netProfit.toLocaleString()}
              </div>
              <div className="kpi-footer">
                <span className="trend-pill positive">Edge: {personalMetrics.avgEdge}</span>
                <span className="kpi-subtitle">realized profit on your ideas</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-title">TASK COMPLETION RATE</span>
                <CheckCircle2 size={18} style={{ color: 'var(--quant-violet)' }} />
              </div>
              <div className="kpi-value">{personalMetrics.taskCompletionRate}%</div>
              <div className="kpi-footer">
                <span className="trend-pill positive">{personalMetrics.completedTasksCount}/{personalMetrics.assignedTasksCount} Completed</span>
                <span className="kpi-subtitle">assigned operations</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-title">TOTAL THESES LOGGED</span>
                <Activity size={18} style={{ color: 'var(--info-blue)' }} />
              </div>
              <div className="kpi-value">{personalMetrics.totalTheses}</div>
              <div className="kpi-footer">
                <span className="trend-pill positive">{personalMetrics.pendingCount} Under Review · {personalMetrics.investedCount} Active</span>
                <span className="kpi-subtitle">ideas submitted</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Performance Breakdown Grid */}
      <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '20px 0 12px 0', color: 'var(--text-primary)' }}>
        Performance by Market Category
      </h3>
      <div className="category-breakdown-grid">
        {categoryMetrics.map(cm => (
          <div key={cm.category} className="category-perf-card">
            <div className="category-perf-header">
              <span className="category-chip">{cm.category}</span>
              <span className="category-perf-rate">{cm.winRate === '—' ? '—' : `${cm.winRate}%`}</span>
            </div>
            <div className="category-mini-bar">
              <div
                className="category-mini-fill"
                style={{ width: cm.winRate === '—' ? '0%' : `${cm.winRate}%` }}
              />
            </div>
            <div className="category-perf-meta">
              <span>Capital: <strong>${cm.invested.toLocaleString()}</strong></span>
              <span style={{ color: cm.profit >= 0 ? 'var(--win-green)' : 'var(--loss-red)' }}>
                P&amp;L: {cm.profit >= 0 ? `+$${cm.profit}` : `-$${Math.abs(cm.profit)}`}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Analyst Leaderboard Table */}
      <div className="panel-card" style={{ marginBottom: '24px' }}>
        <div className="panel-head">
          <div>
            <h3 className="panel-title">Analyst Performance Leaderboard</h3>
            <p className="panel-desc">Individual research track record, hit rates, and net profit generated</p>
          </div>
          <span className="eval-badge">
            <Award size={13} /> Evaluated Monthly
          </span>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Analyst</th>
                <th>Focus Area</th>
                <th>Hit Rate (%)</th>
                <th>Theses Logged</th>
                <th>Net Profit</th>
                <th>Average Edge</th>
                <th>Current Streak</th>
              </tr>
            </thead>
            <tbody>
              {staffList
                .filter(s => s.role === 'STAFF')
                .sort((a, b) => b.metrics.winRate - a.metrics.winRate)
                .map((staff, idx) => (
                  <tr key={staff.id} style={{ cursor: 'pointer' }} onClick={() => onSelectStaff(staff)}>
                    <td style={{ fontWeight: 800, color: idx === 0 ? 'var(--emerald)' : 'var(--text-secondary)' }}>
                      #{idx + 1}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="user-avatar staff" style={{ width: 24, height: 24, fontSize: 10 }}>
                          {staff.initials}
                        </div>
                        <div>
                          <strong>{staff.name}</strong>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>@{staff.username}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="category-chip">{staff.title.split('·')[0]}</span></td>
                    <td style={{ fontWeight: 700, color: staff.metrics.winRate >= 60 ? 'var(--win-green)' : 'var(--text-secondary)' }}>
                      {staff.metrics.winRate.toFixed(1)}%
                    </td>
                    <td>{staff.metrics.thesesCount} submissions</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: staff.metrics.netProfit >= 0 ? 'var(--win-green)' : 'var(--loss-red)' }}>
                      {staff.metrics.netProfit >= 0 ? `+$${staff.metrics.netProfit.toLocaleString()}` : `-$${Math.abs(staff.metrics.netProfit).toLocaleString()}`}
                    </td>
                    <td>{staff.metrics.avgEdge}</td>
                    <td>
                      <span className={`status-pill ${staff.metrics.streak.includes('Win') ? 'won' : 'passed'}`}>
                        {staff.metrics.streak.includes('Win') && <Flame size={12} />}
                        {staff.metrics.streak}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Position Records Log */}
      <div className="panel-card">
        <div className="panel-head">
          <div>
            <h3 className="panel-title">Historical Position Records</h3>
            <p className="panel-desc">Complete ledger of settled and active investment positions</p>
          </div>
          <button className="btn-secondary" onClick={onExportCsv}>
            <Download size={14} />
            <span>Download Log (CSV)</span>
          </button>
        </div>

        {/* Historical Records Filtering Controls */}
        <div className="filter-toolbar" style={{ margin: '14px 0' }}>
          <div className="category-select-wrap">
            <select
              className="category-dropdown"
              value={analyticsCategoryFilter}
              onChange={e => setAnalyticsCategoryFilter(e.target.value)}
              aria-label="Filter historical records by category"
            >
              <option value="All">All Categories</option>
              <option value="Sports">Sports</option>
              <option value="Macro">Macro</option>
              <option value="Crypto">Crypto</option>
              <option value="Politics">Politics</option>
            </select>
          </div>
          <div className="category-select-wrap">
            <select
              className="category-dropdown"
              value={analyticsStatusFilter}
              onChange={e => setAnalyticsStatusFilter(e.target.value)}
              aria-label="Filter historical records by status"
            >
              <option value="All">All Outcomes &amp; Statuses</option>
              <option value="Won">Won Positions</option>
              <option value="Lost">Lost Positions</option>
              <option value="Invested">Active Invested</option>
              <option value="Pending">Pending Review</option>
              <option value="Passed">Passed</option>
            </select>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            Showing {filteredHistoricalRecords.length} of {researchList.length} positions
          </span>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Position &amp; Platform</th>
                <th>Category</th>
                <th>Odds</th>
                <th>Edge</th>
                <th>Invested Stake</th>
                <th>Net P&amp;L</th>
                <th>ROI</th>
                <th>Outcome</th>
                <th>Analyst</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistoricalRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    No historical positions match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredHistoricalRecords.map(item => (
                  <tr key={item.id}>
                    <td>
                      <span className="table-market-title">{item.market}</span>
                      <span className="table-sub-info">{item.id} · {item.book} · {item.date}</span>
                    </td>
                    <td><span className="category-chip">{item.category}</span></td>
                    <td><span className="odds-chip">{item.odds}</span></td>
                    <td><span className="edge-badge">{item.edge}</span></td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>
                      ${(item.actualInvested || item.suggestedStake).toLocaleString()}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: (item.netProfit ?? 0) >= 0 ? 'var(--win-green)' : 'var(--loss-red)' }}>
                      {item.netProfit !== undefined ? ((item.netProfit >= 0 ? `+$${item.netProfit}` : `-$${Math.abs(item.netProfit)}`)) : '—'}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>
                      {item.roi !== undefined ? `${item.roi}%` : '—'}
                    </td>
                    <td>
                      <span className={`status-pill ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{item.author}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
