import React from 'react';
import { ArrowRight } from 'lucide-react';

const TYPE_COLORS = {
    Internship: '#0078d4',
    Project: '#1d8954',
    Competition: '#f9a825',
};

const recommendations = [
    { id: 1, title: 'Frontend Developer Intern', company: 'Spotify', type: 'Internship', skills: ['React', 'TypeScript', 'CSS'] },
    { id: 2, title: 'Cloud Architecture Research', company: 'University Lab', type: 'Project', skills: ['Azure', 'System Design'] },
    { id: 3, title: 'Global Fintech Hackathon', company: 'Stripe', type: 'Competition', skills: ['APIs', 'Node.js', 'Finance'] },
];

export default function RecommendationsPanel() {
    return (
        <div className="dash-v2-card">
            <div className="dash-v2-section-title">
                <span>Recommended for You</span>
            </div>

            <div className="dash-v2-rec-list">
                {recommendations.map(rec => {
                    const color = TYPE_COLORS[rec.type] || '#0f172a';
                    return (
                        <div key={rec.id} className="dash-v2-rec-item">
                            <div className="dash-v2-rec-accent" style={{ background: color }} />
                            <div className="dash-v2-rec-type" style={{ color }}>{rec.type}</div>
                            <div className="dash-v2-rec-title">{rec.title}</div>
                            <div className="dash-v2-rec-company">{rec.company}</div>
                            <div className="dash-v2-rec-skills">
                                {rec.skills.map(s => (
                                    <span key={s} className="dash-v2-skill-chip">{s}</span>
                                ))}
                            </div>
                            <a href="#" className="dash-v2-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                View Details <ArrowRight size={13} />
                            </a>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
