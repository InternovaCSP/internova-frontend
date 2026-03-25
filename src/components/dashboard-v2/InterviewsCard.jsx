import React from 'react';
import { Calendar, Monitor, Building } from 'lucide-react';

/**
 * InterviewsCard Component
 * 
 * Highlights the student's upcoming scheduled interviews.
 * Maps data directly to list items, indicating company names, dates,
 * and whether the interview is Online (Monitor icon) or Onsite (Building icon).
 * 
 * @returns {JSX.Element} The upcoming interviews schedule widget.
 */
export default function InterviewsCard() {
    const interviews = [
        { id: 1, company: 'Microsoft', date: 'Oct 24, 10:00 AM', mode: 'Online', icon: Monitor },
        { id: 2, company: 'Google', date: 'Oct 26, 2:30 PM', mode: 'Onsite', icon: Building },
        { id: 3, company: 'Amazon', date: 'Nov 1, 9:00 AM', mode: 'Online', icon: Monitor },
    ];

    return (
        <div className="dash-v2-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="dash-v2-section-title">
                <span>Upcoming Interviews</span>
            </div>

            <div style={{ flex: 1 }}>
                {interviews.length > 0 ? (
                    <div>
                        {interviews.map(interview => {
                            const Icon = interview.icon;
                            return (
                                <div key={interview.id} className="dash-v2-interview-item">
                                    <div>
                                        <div className="dash-v2-company">{interview.company}</div>
                                        <div className="dash-v2-interview-meta">
                                            <Calendar size={14} /> {interview.date}
                                            <span style={{ margin: '0 4px' }}>•</span>
                                            <Icon size={14} /> {interview.mode}
                                        </div>
                                    </div>
                                    <button className="lp-btn lp-btn--outline" style={{ padding: '6px 16px', fontSize: '13px' }}>
                                        View
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8' }}>
                        <Calendar size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                        <p>No interviews scheduled.</p>
                    </div>
                )}
            </div>

            <a href="#" className="dash-v2-link" style={{ textAlign: 'center', display: 'block', marginTop: '16px' }}>View Calendar</a>
        </div>
    );
}
