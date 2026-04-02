import React, { useState } from 'react';
import seminarService from '../../services/seminarService';

/**
 * Modal for creating a new peer-learning seminar request.
 * 
 * @param {Object} props
 * @param {Function} props.onClose - Modal close handler
 * @param {Function} props.onSuccess - Callback on successful request creation
 */
export default function SeminarCreateForm({ onClose, onSuccess }) {
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic || !description) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const newSeminar = await seminarService.createSeminar({ topic, description });
      if (onSuccess) onSuccess(newSeminar);
      onClose();
    } catch (err) {
      console.error("Seminar creation error:", err);
      setError(err.response?.data?.error || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="seminar-modal-overlay" onClick={onClose}>
      <div className="seminar-modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 className="seminar-form-h2">New Seminar Request</h2>
          <button 
             onClick={onClose} 
             style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '24px' }}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="form-error" style={{ marginBottom: '16px', background: 'rgba(255, 92, 122, 0.1)', padding: '10px', borderRadius: '8px' }}>
               <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
               {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Topic Name</label>
            <input 
               type="text" 
               className="auth-input" 
               placeholder="e.g. System Design for AI Pipelines"
               value={topic}
               onChange={(e) => setTopic(e.target.value)}
               maxLength={100}
               required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Why should we organize this?</label>
            <textarea 
               className="auth-input" 
               placeholder="Describe the topics to be covered and why this peer-learning session is valuable."
               style={{ minHeight: '120px', resize: 'vertical' }}
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               required 
            />
          </div>

          <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
            <button 
              type="button" 
              className="auth-btn" 
              style={{ background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0', boxShadow: 'none' }}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="auth-btn" 
              disabled={isSubmitting || !topic || !description}
            >
              {isSubmitting ? <span className="spinner"></span> : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
