import React from 'react';
import ActiveRoomsWidget from '../components/dashboard-v2/ActiveRoomsWidget';
import DashboardWelcomeRow from '../components/dashboard-v2/DashboardWelcomeRow';
import { Video, Layers, Info } from 'lucide-react';

/**
 * BreakoutRoomsPage Component
 * 
 * A dedicated top-level page for student-led Breakout Rooms.
 * Reuses the ActiveRoomsWidget but provides more context and a focused collaboration space.
 * 
 * @returns {JSX.Element} The breakout rooms hub layout.
 */
export default function BreakoutRoomsPage() {
    return (
        <div className="dash-v2-layout" style={{ minHeight: '100vh', paddingBottom: '60px' }}>
            <div className="dash-v2-container">
                <div className="dash-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    
                    {/* Header Section */}
                    <div className="dash-v2-welcome-row" style={{ alignItems: 'flex-start' }}>
                        <div>
                            <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>
                                Breakout <span style={{ color: '#10b981' }}>Rooms</span>
                            </h1>
                            <p style={{ fontSize: '16px', color: '#64748b', marginTop: '8px', maxWidth: '600px', lineHeight: 1.6 }}>
                                Real-time collaboration space for InterNova students. Create a room, share a Google Meet link, and collaborate on projects or competition ideas immediately.
                            </p>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div className="dash-v2-card" style={{ padding: '16px', background: '#f0fdf4', border: '1px solid #dcfce7', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Video size={20} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#065f46' }}>Student-Led</div>
                                    <div style={{ fontSize: '11px', color: '#059669' }}>Self-Service Hub</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Widget Section */}
                    <ActiveRoomsWidget />

                    {/* Info Section */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div className="dash-v2-card" style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                <Layers size={20} color="#10b981" />
                                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>How it works</h3>
                            </div>
                            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {[
                                    "Generate a unique Google Meet link with one click.",
                                    "Rooms are public to all InterNova students via this hub.",
                                    "Students can join sessions instantly without permission gating.",
                                    "Awarded skills are recorded to your profile after the session."
                                ].map((item, idx) => (
                                    <li key={idx} style={{ display: 'flex', gap: '10px', fontSize: '14px', color: '#64748b' }}>
                                        <div style={{ minWidth: '20px', height: '20px', borderRadius: '50%', background: '#f0fdf4', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>{idx + 1}</div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="dash-v2-card" style={{ padding: '24px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                <Info size={20} color="white" />
                                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Collaboration Tips</h3>
                            </div>
                            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, opacity: 0.9 }}>
                                Looking to find teammates for a hackathon? Start a breakout room with the competition title! 
                                Use clear descriptions to attract voters and participants who share your skill interests.
                            </p>
                            <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '13px' }}>
                                <strong>Pro-Tip:</strong> Complete sessions once finished to ensure your earned skills are updated on your student profile.
                            </div>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', fontSize: '13px', color: '#94a3b8', marginTop: '16px' }}>
                        Breakout Room infrastructure is powered by <span style={{ fontWeight: 600 }}>Google Cloud</span> and <span style={{ fontWeight: 600 }}>InterNova API</span>.
                    </div>
                </div>
            </div>
        </div>
    );
}
