import React, { useEffect, useState } from 'react';
import { fetchPipelineStats } from '../api/studentApi';
import { ArrowRight } from 'lucide-react';

/**
 * Stage definitions — icon, accent colour, and background tint per pipeline step.
 */
const STAGES = [
    {
        key: 'Applied',
        label: 'Applied',
        sub: 'Submitted',
        color: '#6c63ff',
        bg: 'rgba(108, 99, 255, 0.08)',
        border: 'rgba(108, 99, 255, 0.2)',
    },
    {
        key: 'Shortlisted',
        label: 'Shortlisted',
        sub: 'Reviewed',
        color: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.08)',
        border: 'rgba(245, 158, 11, 0.2)',
    },
    {
        key: 'Interviewing',
        label: 'Interviewing',
        sub: 'In Progress',
        color: '#3b82f6',
        bg: 'rgba(59, 130, 246, 0.08)',
        border: 'rgba(59, 130, 246, 0.2)',
    },
    {
        key: 'Selected',
        label: 'Selected',
        sub: 'Offer Made',
        color: '#10b981',
        bg: 'rgba(16, 185, 129, 0.08)',
        border: 'rgba(16, 185, 129, 0.2)',
    },
];

export default function InternshipPipeline() {
    const [stats, setStats] = useState({ Applied: 0, Shortlisted: 0, Interviewing: 0, Selected: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPipelineStats()
            .then(data => setStats(data))
            .catch(err => console.error('Pipeline fetch failed:', err))
            .finally(() => setLoading(false));
    }, []);

    const total = stats.Applied || 1; // avoid divide-by-zero

    return (
        <div className="pip-card">
            {/* Header */}
            <div className="pip-header">
                <div>
                    <h2 className="pip-title">Application Pipeline</h2>
                </div>
                <button className="pip-view-btn">
                    View all <ArrowRight size={14} />
                </button>
            </div>

            {/* Stage cards */}
            <div className="pip-stages">
                {loading
                    ? STAGES.map(s => (
                        <div key={s.key} className="pip-stage-skeleton" />
                    ))
                    : STAGES.map((stage, i) => {
                        const count = stats[stage.key] ?? 0;
                        const active = count > 0;
                        return (
                            <React.Fragment key={stage.key}>
                                <div
                                    className={`pip-stage ${active ? 'pip-stage--active' : ''}`}
                                    style={active ? { '--s-color': stage.color, '--s-bg': stage.bg, '--s-border': stage.border } : {}}
                                >
                                    <div className="pip-stage-count">{count}</div>
                                    <div className="pip-stage-label">{stage.label}</div>
                                    <div className="pip-stage-sub">{stage.sub}</div>
                                </div>
                                {i < STAGES.length - 1 && (
                                    <div className={`pip-connector ${stats[STAGES[i + 1].key] > 0 ? 'pip-connector--lit' : ''}`} />
                                )}
                            </React.Fragment>
                        );
                    })
                }
            </div>
        </div>
    );
}
