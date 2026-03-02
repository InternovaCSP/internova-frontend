import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function RecommendationsPanel() {
    const recommendations = [
        {
            id: 1,
            title: 'Frontend Developer Intern',
            company: 'Spotify',
            type: 'Internship',
            skills: ['React', 'TypeScript', 'CSS'],
        },
        {
            id: 2,
            title: 'Cloud Architecture Research',
            company: 'University Lab',
            type: 'Project',
            skills: ['Azure', 'System Design'],
        },
        {
            id: 3,
            title: 'Global Fintech Hackathon',
            company: 'Stripe',
            type: 'Competition',
            skills: ['APIs', 'Node.js', 'Finance'],
        }
    ];

    const getTypeColor = (type) => {
        switch (type) {
            case 'Internship': return 'var(--lp-azure)';
            case 'Project': return 'var(--lp-teal)';
            case 'Competition': return 'var(--lp-gold)';
            default: return 'var(--lp-navy)';
        }
    };

    return (
        <div className="dash-v2-card">
            <div className="dash-v2-section-title">
                <span>Recommended for You</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {recommendations.map(rec => (
                    <div key={rec.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', backgroundColor: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
                        {/* Type Indicator Line */}
                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', backgroundColor: getTypeColor(rec.type) }}></div>

                        <div style={{ paddingLeft: '8px' }}>
                            <div style={{ fontSize: '12px', color: getTypeColor(rec.type), fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.5px' }}>
                                {rec.type}
                            </div>
                            <div style={{ fontWeight: 600, color: 'var(--lp-navy)', fontSize: '16px', marginBottom: '4px' }}>
                                {rec.title}
                            </div>
                            <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '12px' }}>
                                {rec.company}
                            </div>

                            {/* Skills Chips */}
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                                {rec.skills.map(skill => (
                                    <span key={skill} style={{ backgroundColor: '#e2e8f0', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <a href="#" className="dash-v2-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                                View Details <ArrowRight size={14} />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
