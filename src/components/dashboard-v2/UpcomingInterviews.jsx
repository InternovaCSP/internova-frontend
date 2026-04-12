import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { interviewService } from '../../services/interviewService';

/**
 * UpcomingInterviews Component
 * 
 * Lists scheduled interviews for the student.
 * Fetches data from the /api/interviews/student endpoint.
 * 
 * @returns {JSX.Element} The upcoming interviews card.
 */
export default function UpcomingInterviews() {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                setLoading(true);
                const { data } = await interviewService.getStudentInterviews();
                setInterviews(data);
            } catch (err) {
                console.error("Failed to fetch interviews:", err);
                setError("Could not load your interviews.");
            } finally {
                setLoading(false);
            }
        };

        fetchInterviews();
    }, []);

    if (loading) {
        return (
            <div className="dash-v2-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                <Loader2 size={24} className="animate-spin" color="#3b82f6" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="dash-v2-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: '#ef4444' }}>
                <AlertCircle size={20} /> {error}
            </div>
        );
    }

    return (
        <div className="dash-v2-card">
            <div className="dash-v2-section-title">
                <span>Upcoming Interviews</span>
                <div style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>
                    {interviews.length} Scheduled
                </div>
            </div>

            {interviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Calendar size={40} color="#94a3b8" style={{ marginBottom: '12px' }} />
                    <p style={{ color: '#64748b', fontSize: '14px' }}>No interviews scheduled yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {interviews.map(interview => (
                        <div key={interview.id} style={{ 
                            padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s'
                        }}>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ 
                                    width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6'
                                }}>
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{interview.internshipTitle}</h4>
                                    <p style={{ margin: '2px 0 6px 0', fontSize: '14px', color: '#64748b', fontWeight: 500 }}>{interview.companyName}</p>
                                    <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#64748b' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Calendar size={14} /> {new Date(interview.interviewDate).toLocaleDateString()}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Clock size={14} /> {new Date(interview.interviewDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <a href={interview.locationOrLink.startsWith('http') ? interview.locationOrLink : '#'} 
                               target="_blank" rel="noopener noreferrer"
                               style={{ 
                                   padding: '8px 16px', borderRadius: '10px', background: 'white', border: '1px solid #e2e8f0',
                                   fontSize: '13px', fontWeight: 600, color: '#1e293b', textDecoration: 'none',
                                   display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s'
                               }}
                               onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                               onMouseLeave={e => e.currentTarget.style.background = 'white'}
                            >
                                <Video size={14} /> Join Meeting
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
