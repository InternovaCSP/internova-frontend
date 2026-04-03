import React, { useState, useEffect } from 'react';
import SeminarCard from './SeminarCard';
import SeminarCreateForm from './SeminarCreateForm';
import seminarService from '../../services/seminarService';

/**
 * SeminarDashboard Component - Live Peer-Learning Hub.
 * Displays current seminar requests and provides a way for students to post new ones.
 */
export default function SeminarDashboard() {
  const [seminars, setSeminars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSeminars();
  }, []);

  const fetchSeminars = async () => {
    setLoading(true);
    try {
      const data = await seminarService.getSeminars();
      setSeminars(data);
    } catch (err) {
      console.error("Fetch seminars error:", err);
      setError("Unable to load seminar requests. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = (newSeminar) => {
    // Optimistic update: prepend the new request
    setSeminars([newSeminar, ...seminars]);
    // Optionally refetch from server to ensure all metadata is correct
    fetchSeminars();
  };

  return (
    <section className="seminar-section">
      <div className="seminar-header">
        <div>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '24px', color: '#0f172a' }}>
            Peer-Learning Seminars
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
            Voice your interest in new learning topics. Requests reaching {seminars[0]?.threshold || 2} votes will be reviewed.
          </p>
        </div>
        
        <button 
          className="seminar-vote-btn" 
          onClick={() => setShowModal(true)}
          style={{ padding: '12px 24px', fontSize: '15px' }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Request Seminar
        </button>
      </div>

      {loading ? (
        <div className="seminar-grid">
           {[1, 2, 3].map(n => (
             <div key={n} className="in-skeleton seminar-card" style={{ height: '240px' }} />
           ))}
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#fef2f2', borderRadius: '16px', color: '#991b1b' }}>
          <p>{error}</p>
          <button onClick={fetchSeminars} style={{ marginTop: '12px', color: '#991b1b', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>
             Retry Loading
          </button>
        </div>
      ) : seminars.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#f8fafc', borderRadius: '20px', border: '2px dashed #e2e8f0' }}>
           <h3 style={{ color: '#64748b', marginBottom: '8px' }}>No active seminar requests yet</h3>
           <p style={{ color: '#94a3b8', fontSize: '14px' }}>Be the first to suggest a topic for the community!</p>
        </div>
      ) : (
        <div className="seminar-grid dash-fade-in">
          {seminars.map(s => (
            <SeminarCard 
               key={s.id} 
               seminar={s} 
               onVoteSuccess={(id, count, status) => {
                 setSeminars(prev => prev.map(item => item.id === id ? { ...item, voteCount: count, hasVoted: true, status: status } : item));
               }}
            />
          ))}
        </div>
      )}

      {showModal && (
        <SeminarCreateForm 
           onClose={() => setShowModal(false)} 
           onSuccess={handleCreateSuccess}
        />
      )}
    </section>
  );
}
