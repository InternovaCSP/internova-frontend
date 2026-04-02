import React, { useState } from 'react';
import Modal from './Modal';
import { interviewService } from '../services/interviewService';
import { Calendar, Clock, Link as LinkIcon, Loader2, CheckCircle2 } from 'lucide-react';

const InterviewSchedulerModal = ({ isOpen, onClose, application, onScheduled }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Combine date and time
            const interviewDate = new Date(`${date}T${time}`);
            
            await interviewService.schedule({
                applicationId: application.id,
                interviewDate: interviewDate.toISOString(),
                locationOrLink: location
            });

            setSuccess(true);
            setTimeout(() => {
                onScheduled();
                onClose();
                // Reset state
                setSuccess(false);
                setDate('');
                setTime('');
                setLocation('');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to schedule interview. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="Interview Scheduled">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', textAlign: 'center' }}>
                    <CheckCircle2 size={64} color="#10b981" style={{ marginBottom: '24px' }} />
                    <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Success!</h3>
                    <p style={{ color: '#64748b', fontSize: '16px' }}>The interview for <strong>{application.studentName}</strong> has been scheduled.</p>
                </div>
            </Modal>
        );
    }

    const footer = (
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button 
                type="button"
                onClick={onClose}
                className="btn btn-ghost"
                style={{ width: 'auto', padding: '10px 20px' }}
                disabled={loading}
            >
                Cancel
            </button>
            <button 
                type="submit"
                form="scheduler-form"
                className="btn btn-primary"
                style={{ width: 'auto', padding: '10px 24px' }}
                disabled={loading || !date || !time || !location}
            >
                {loading ? <Loader2 size={20} className="animate-spin" /> : 'Confirm Schedule'}
            </button>
        </div>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Schedule Interview" footer={footer}>
            <div style={{ marginBottom: '24px' }}>
                <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>Candidate</p>
                <p style={{ color: '#1e293b', fontWeight: 600, fontSize: '18px', margin: '4px 0 0 0' }}>{application.studentName}</p>
                <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '14px' }}>{application.internshipTitle}</p>
            </div>

            <form id="scheduler-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {error && (
                    <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', color: '#b91c1c', fontSize: '14px' }}>
                        {error}
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="input-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#475569' }}>
                            <Calendar size={16} /> Date
                        </label>
                        <input 
                            type="date" 
                            className="form-input" 
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#475569' }}>
                            <Clock size={16} /> Time
                        </label>
                        <input 
                            type="time" 
                            className="form-input" 
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#475569' }}>
                        <LinkIcon size={16} /> Meeting Link or Location
                    </label>
                    <input 
                        type="text" 
                        placeholder="e.g. Zoom link, Teams, or Physical Office Address" 
                        className="form-input"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>
            </form>
        </Modal>
    );
};

export default InterviewSchedulerModal;
