import React, { useEffect, useState } from 'react';
import { fetchPipelineStats } from '../api/studentApi';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

const InternshipPipeline = () => {
    const [stats, setStats] = useState({
        Applied: 0,
        Shortlisted: 0,
        Interviewing: 0,
        Selected: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getStats = async () => {
            try {
                const data = await fetchPipelineStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch pipeline stats:", error);
            } finally {
                setLoading(false);
            }
        };
        getStats();
    }, []);

    const stages = [
        { label: 'Applied', key: 'Applied', color: '#10b981' },
        { label: 'Shortlisted', key: 'Shortlisted', color: '#10b981' },
        { label: 'Interviewing', key: 'Interviewing', color: '#3b82f6' },
        { label: 'Selected', key: 'Selected', color: '#94a3b8' }
    ];

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <Loader2 size={32} className="animate-spin" color="#3b82f6" />
            </div>
        );
    }

    return (
        <div style={{ 
            background: 'white', 
            padding: '24px 32px', 
            borderRadius: '16px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '32px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b' }}>Internship Pipeline</h2>
                <button style={{ color: '#3b82f6', fontSize: '14px', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                    View Applications
                </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                {stages.map((stage, index) => (
                    <React.Fragment key={stage.key}>
                        <div style={{ 
                            flex: 1, 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            zIndex: 1,
                            padding: '16px',
                            background: stage.key === 'Interviewing' ? 'white' : 'transparent',
                            border: stage.key === 'Interviewing' ? '1px solid #3b82f6' : '1px solid #f1f5f9',
                            borderRadius: '12px',
                            boxShadow: stage.key === 'Interviewing' ? '0 4px 12px rgba(59, 130, 246, 0.1)' : 'none'
                        }}>
                            <div style={{ 
                                width: '32px', 
                                height: '32px', 
                                borderRadius: '50%', 
                                background: stats[stage.key] > 0 ? stage.color : '#f8fafc', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                color: 'white',
                                marginBottom: '12px',
                                fontWeight: 700,
                                fontSize: '14px'
                            }}>
                                {stats[stage.key]}
                            </div>
                            <span style={{ 
                                fontSize: '14px', 
                                fontWeight: stage.key === 'Interviewing' ? 600 : 500, 
                                color: stats[stage.key] > 0 ? '#1e293b' : '#94a3b8' 
                            }}>
                                {stage.label}
                            </span>
                        </div>
                        {index < stages.length - 1 && (
                            <div style={{ 
                                flex: 0.5, 
                                height: '3px', 
                                background: stats[stages[index+1].key] > 0 ? '#10b981' : '#f1f5f9',
                                margin: '0 -10px'
                            }} />
                        )}
                    </React.Fragment>
                ))}
            </div>
            
            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin { animation: spin 1s linear infinite; }
            `}</style>
        </div>
    );
};

export default InternshipPipeline;
