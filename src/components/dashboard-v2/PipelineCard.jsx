import React from 'react';

/**
 * PipelineCard Component
 * 
 * Visualizes the classic Application tracking funnel (Applied -> Shortlisted -> Interviewing).
 * Uses absolute positioning for a horizontal connection line indicating drop-off stages.
 * 
 * @returns {JSX.Element} The application pipeline funnel card.
 */
export default function PipelineCard() {
    return (
        <div className="dash-v2-card">
            <div className="dash-v2-section-title" style={{ marginBottom: '8px' }}>
                <span>Internship Pipeline</span>
                <a href="#" className="dash-v2-link">View Applications</a>
            </div>

            <div className="dash-v2-pipeline-grid">
                {/* Connecting Line behind the cards (pseudo-line effect) */}
                <div style={{ position: 'absolute', top: '32px', left: '12%', right: '12%', height: '4px', backgroundColor: '#e2e8f0', zIndex: 0 }}></div>
                <div style={{ position: 'absolute', top: '32px', left: '12%', width: '50%', height: '4px', backgroundColor: 'var(--lp-teal)', zIndex: 1 }}></div>

                {/* Applied */}
                <div className="dash-v2-pipeline-card" style={{ zIndex: 2 }}>
                    <div className="dash-v2-pipeline-badge badge-teal">12</div>
                    <div className="dash-v2-pipeline-label">Applied</div>
                </div>

                {/* Shortlisted */}
                <div className="dash-v2-pipeline-card" style={{ zIndex: 2 }}>
                    <div className="dash-v2-pipeline-badge badge-teal">5</div>
                    <div className="dash-v2-pipeline-label">Shortlisted</div>
                </div>

                {/* Interview (Active) */}
                <div className="dash-v2-pipeline-card active" style={{ zIndex: 2 }}>
                    <div className="dash-v2-pipeline-badge badge-azure">3</div>
                    <div className="dash-v2-pipeline-label" style={{ color: 'var(--lp-azure)' }}>Interviewing</div>
                </div>

                {/* Selected */}
                <div className="dash-v2-pipeline-card" style={{ zIndex: 2, borderStyle: 'dashed' }}>
                    <div className="dash-v2-pipeline-badge" style={{ backgroundColor: '#f1f5f9', color: '#94a3b8' }}>0</div>
                    <div className="dash-v2-pipeline-label" style={{ color: '#94a3b8' }}>Selected</div>
                </div>
            </div>
        </div>
    );
}
