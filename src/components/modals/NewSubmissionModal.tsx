import React from 'react';
import { X, Plus } from 'lucide-react';
import { StaffMember, ResearchItem } from '../../types';

interface NewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: StaffMember;
  researchCount: number;
  onSubmit: (item: ResearchItem) => void;
}

export const NewSubmissionModal: React.FC<NewSubmissionModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  researchCount,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Submit Prediction Market Research Thesis</h3>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form
          className="modal-body"
          onSubmit={e => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const title = formData.get('market') as string;
            const cat = (formData.get('category') as any) || 'Sports';
            const book = (formData.get('book') as string) || 'Polymarket';
            const odds = (formData.get('odds') as string) || '-110';
            const edge = (formData.get('edge') as string) || '+4.5%';
            const stake = Number(formData.get('stake')) || 1000;
            const thesis = (formData.get('thesis') as string) || '';
            const source = (formData.get('source') as string) || 'https://polymarket.com';

            const newItem: ResearchItem = {
              id: `TMM-${1043 + researchCount}`,
              market: title,
              category: cat,
              book,
              odds,
              impliedProb: '50%',
              edge,
              suggestedStake: stake,
              actualInvested: 0,
              author: currentUser.name,
              authorInitials: currentUser.initials,
              date: 'Just now',
              status: 'Pending',
              thesis,
              sourceUrl: source
            };

            onSubmit(newItem);
            onClose();
          }}
        >
          <div className="form-group">
            <label className="form-label">Market or Event Title *</label>
            <input
              name="market"
              required
              className="form-input"
              placeholder="e.g. Chiefs vs Ravens (Spread -3.0) or Fed Rate Cut in Dec"
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select name="category" className="form-select">
                <option value="Sports">Sports (NFL, NBA, EPL, Tennis)</option>
                <option value="Macro">Macro (Fed, Inflation, CPI)</option>
                <option value="Crypto">Crypto (BTC, ETH, Altcoins)</option>
                <option value="Politics">Politics / Kalshi Events</option>
                <option value="Other">Other Prediction Contract</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Platform / Sportsbook</label>
              <input
                name="book"
                className="form-input"
                placeholder="e.g. Polymarket, Kalshi, Pinnacle, DraftKings"
                defaultValue="Polymarket"
              />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Current Quoted Odds</label>
              <input
                name="odds"
                className="form-input"
                placeholder="e.g. -110 or 68¢"
                defaultValue="-110 (52.4%)"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Calculated Edge (%)</label>
              <input
                name="edge"
                className="form-input"
                placeholder="e.g. +5.2%"
                defaultValue="+4.8%"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Suggested Stake ($)</label>
              <input
                name="stake"
                type="number"
                className="form-input"
                placeholder="1500"
                defaultValue="1500"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Research Thesis &amp; Model Rationale *</label>
            <textarea
              name="thesis"
              required
              rows={4}
              className="form-textarea"
              placeholder="Explain why the market price is incorrect, key catalysts, and model invalidation levels..."
              defaultValue="Power rating discrepancy based on post-bye injury recovery. Market is underpricing recent defensive efficiency metrics."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Source Link or Market URL</label>
            <input
              name="source"
              className="form-input"
              placeholder="https://polymarket.com/..."
              defaultValue="https://polymarket.com/market/sample"
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Plus size={16} />
              <span>Submit Thesis for Review</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
