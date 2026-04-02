import React, { useState, useEffect } from 'react';
import { Video, Plus, Loader2, AlertCircle, Users, Clock } from 'lucide-react';
import { breakoutRoomService } from '../../services/breakoutRoomService';

/**
 * ActiveRoomsWidget Component
 * 
 * Displays a list of active student-led breakout rooms.
 * Allows students to create a new room (generating a Google Meet link).
 * 
 * @returns {JSX.Element} The active rooms card.
 */
export default function ActiveRoomsWidget() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState(null);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const { data } = await breakoutRoomService.getActive();
            setRooms(data);
        } catch (err) {
            console.error("Failed to fetch breakout rooms:", err);
            setError("Could not load active rooms.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleCreateRoom = async () => {
        try {
            setCreating(true);
            const newRoom = {
                title: `Collaboration Session - ${new Date().toLocaleDateString()}`,
                description: "Open discussion for project collaboration.",
                scheduledAt: new Date().toISOString(),
                awardSkills: "Collaboration, Communication"
            };
            
            await breakoutRoomService.create(newRoom);
            await fetchRooms(); // Refresh the list
        } catch (err) {
            console.error("Failed to create room:", err);
            alert("Failed to create breakout room. Check console for details.");
        } finally {
            setCreating(false);
        }
    };

    if (loading && rooms.length === 0) {
        return (
            <div className="dash-v2-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '150px' }}>
                <Loader2 size={24} className="animate-spin" color="#10b981" />
            </div>
        );
    }

    return (
        <div className="dash-v2-card" style={{ borderLeft: '4px solid #10b981' }}>
            <div className="dash-v2-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Video size={20} color="#10b981" />
                    <span>Active Breakout Rooms</span>
                </div>
                <button 
                    onClick={handleCreateRoom}
                    disabled={creating}
                    style={{ 
                        padding: '6px 12px', borderRadius: '8px', background: '#10b981', color: 'white',
                        border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                    {creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                    Create Room
                </button>
            </div>

            {error && (
                <div style={{ padding: '12px', background: '#fef2f2', color: '#ef4444', borderRadius: '8px', fontSize: '13px', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            {rooms.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                    <Users size={32} color="#94a3b8" style={{ marginBottom: '8px' }} />
                    <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>No active breakout rooms.</p>
                    <p style={{ color: '#94a3b8', fontSize: '12px' }}>Be the first to start a session!</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                    {rooms.map(room => (
                        <div key={room.id} style={{ 
                            padding: '16px', background: '#f0fdf4', borderRadius: '16px', border: '1px solid #dcfce7',
                            display: 'flex', flexDirection: 'column', gap: '12px', transition: 'all 0.2s'
                        }}>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#065f46' }}>{room.title}</h4>
                                <p style={{ margin: '4px 0', fontSize: '13px', color: '#059669', fontWeight: 500 }}>Host: {room.organizerName || 'Student'}</p>
                                <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#34d399', marginTop: '4px' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Clock size={12} /> Live since {new Date(room.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>

                            <a href={room.meetingLink} 
                               target="_blank" rel="noopener noreferrer"
                               style={{ 
                                   padding: '8px', borderRadius: '10px', background: '#10b981', 
                                   textAlign: 'center', fontSize: '13px', fontWeight: 600, color: 'white', 
                                   textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                               }}
                            >
                                <Video size={14} /> Join Daily Room
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
