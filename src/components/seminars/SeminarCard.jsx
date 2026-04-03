import React, { useState } from 'react';
import SeminarProgressBar from './SeminarProgressBar';
import seminarService from '../../services/seminarService';

/**
 * Premium Card displaying a seminar request and voting UI.
 * 
 * @param {Object} props
 * @param {Object} props.seminar - The seminar request object
 * @param {Function} props.onVoteSuccess - Callback when a vote is recorded
 */
export default function SeminarCard({ seminar, onVoteSuccess }) {
  const [isVoting, setIsVoting] = useState(false);
  const [hasVotedLocally, setHasVotedLocally] = useState(seminar.hasVoted);
  const [localVoteCount, setLocalVoteCount] = useState(seminar.voteCount);
  const [localStatus, setLocalStatus] = useState(seminar.status);

  const handleVote = async () => {
    if (isVoting || hasVotedLocally || localStatus === 'Approved') return;

    setIsVoting(true);
    try {
      const result = await seminarService.voteSeminar(seminar.id);
      setHasVotedLocally(true);
      setLocalVoteCount(result.voteCount || localVoteCount + 1);
      setLocalStatus(result.status || localStatus);
      if (onVoteSuccess) onVoteSuccess(seminar.id, result.voteCount, result.status);
    } catch (error) {
      console.error("Failed to submit vote:", error);
      alert(error.response?.data?.error || "Failed to vote. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="seminar-card">
      <div className="seminar-meta">
        <span>Requested by <strong>{seminar.studentName}</strong></span>
        <span>{new Date(seminar.createdAt).toLocaleDateString()}</span>
      </div>
      
      <h3 className="seminar-topic">{seminar.topic}</h3>
      <p className="seminar-desc">{seminar.description}</p>
      
      <div style={{ marginTop: '12px' }}>
        {localStatus === 'Approved' ? (
          <div style={{ padding: '8px 12px', background: 'rgba(52, 211, 153, 0.1)', borderRadius: '8px', color: '#059669', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Threshold Reached - Approved for Scheduling
          </div>
        ) : (
          <SeminarProgressBar current={localVoteCount} total={seminar.threshold} />
        )}
      </div>
      
      <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
        {localStatus === 'Approved' ? (
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Total Votes: {localVoteCount}</span>
        ) : hasVotedLocally ? (
          <div className="seminar-voted-badge">
             <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
             </svg>
             Voted
          </div>
        ) : (
          <button 
            className="seminar-vote-btn" 
            onClick={handleVote} 
            disabled={isVoting}
          >
            {isVoting ? (
              <span className="spinner" style={{ width: '16px', height: '16px', borderTopColor: 'rgba(255,255,255,0.7)' }}></span>
            ) : (
              <>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Support Request
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
