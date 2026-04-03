import React from 'react';

/**
 * Animated progress bar for seminar approval tracking.
 * 
 * @param {Object} props
 * @param {number} props.current - Current vote count
 * @param {number} props.total - Threshold required for approval
 */
export default function SeminarProgressBar({ current = 0, total = 2 }) {
  const percentage = Math.min((current / total) * 100, 100);
  const isNearThreshold = percentage >= 80;

  return (
    <div className="seminar-progress-container">
      <div className="seminar-progress-text">
        <span>Community Support</span>
        <span>{current} / {total} votes</span>
      </div>
      <div className="seminar-track">
        <div 
          className={`seminar-bar ${isNearThreshold ? 'near-threshold' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div style={{ marginTop: '8px', fontSize: '11px', color: '#94a3b8', textAlign: 'right' }}>
        {percentage < 100 ? `${total - current} more to approve` : 'Goal reached! 🎉'}
      </div>
    </div>
  );
}
