import React from 'react';

export default function ApplicationPipeline() {
    // Mock application data representing the pipeline stages
    const stages = [
        { id: 1, label: 'Applied', count: 12, isActive: true },
        { id: 2, label: 'Shortlisted', count: 3, isActive: true },
        { id: 3, label: 'Interview', count: 1, isActive: true },
        { id: 4, label: 'Selected', count: 0, isActive: false, isGold: true }
    ];

    return (
        <div className="dash-card">
            <h3 className="dash-section-title">Internship Application Status</h3>

            <div className="dash-pipeline">
                {stages.map((stage, index) => (
                    <React.Fragment key={stage.id}>
                        {/* The Node */}
                        <div className="dash-pipeline-node">
                            <div className={`dash-pipeline-dot ${stage.isActive ? 'active' : ''} ${stage.isGold ? 'gold' : ''}`}></div>
                            <span className="dash-pipeline-label">{stage.label}</span>
                            <span className="dash-pipeline-count">{stage.count}</span>
                        </div>

                        {/* The Connecting Line (except for the last node) */}
                        {index < stages.length - 1 && (
                            <div className={`dash-pipeline-line ${stages[index + 1].isActive ? 'active' : ''}`}></div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
