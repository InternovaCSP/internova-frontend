import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import internshipService from '../services/internshipService';
import { ArrowLeft, Briefcase, MapPin, Clock, FileText, CheckCircle, CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * CreateInternshipPage Component
 * 
 * Provides a form for companies to post new internship opportunities.
 * Uses Formik for form management and Yup for client-side validation.
 */
const CreateInternshipPage = () => {
    const navigate = useNavigate();
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const initialValues = {
        title: '',
        description: '',
        location: '',
        duration: '',
        requirements: '',
        isPublished: true
    };

    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .required('Job Title is required')
            .max(255, 'Title too long'),
        description: Yup.string()
            .required('Description is required')
            .min(20, 'Description should be at least 20 characters'),
        location: Yup.string().required('Location is required'),
        duration: Yup.string().required('Duration is required (e.g., 3 months, Summer 2026)'),
        requirements: Yup.string().required('Requirements/Skills are required')
    });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 5000);
    };

    const handleSubmit = async (values, { setSubmitting, setStatus, resetForm }) => {
        try {
            await internshipService.createInternship(values);
            showToast('Internship posted successfully! Redirecting...');
            setTimeout(() => navigate('/company/dashboard'), 2000);
        } catch (error) {
            console.error('Failed to create internship:', error);
            setStatus({ error: 'Failed to post internship. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="dash-v2-layout">
            {/* Toast Notification */}
            {toast.show && (
                <div className={`pr-toast ${toast.type}`}>
                    {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    <span style={{ marginLeft: '8px' }}>{toast.message}</span>
                </div>
            )}

            <div className="dash-v2-container" style={{ maxWidth: '800px' }}>
                <header className="dash-v2-welcome-row" style={{ marginBottom: '24px' }}>
                    <div className="dash-v2-welcome-text">
                        <button 
                            onClick={() => navigate('/company/dashboard')} 
                            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', padding: 0, marginBottom: '12px' }}
                        >
                            <ArrowLeft size={14} /> Back to Dashboard
                        </button>
                        <h1>Post a New Internship</h1>
                        <p>Detail your opportunity to reach talented applicants.</p>
                    </div>
                </header>

                <div className="dash-v2-card">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, status }) => (
                            <Form style={{ display: 'grid', gap: '20px' }}>
                                {status?.error && (
                                    <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
                                        {status.error}
                                    </div>
                                )}

                                <div className="form-group">
                                    <label htmlFor="title" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Briefcase size={16} /> Job Title
                                    </label>
                                    <Field 
                                        type="text" 
                                        name="title" 
                                        id="title" 
                                        className="auth-input" 
                                        placeholder="e.g. Software Engineering Intern" 
                                    />
                                    <ErrorMessage name="title" component="div" className="form-error" />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div className="form-group">
                                        <label htmlFor="location" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <MapPin size={16} /> Location
                                        </label>
                                        <Field 
                                            type="text" 
                                            name="location" 
                                            id="location" 
                                            className="auth-input" 
                                            placeholder="Remote, NYC, etc." 
                                        />
                                        <ErrorMessage name="location" component="div" className="form-error" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="duration" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Clock size={16} /> Duration
                                        </label>
                                        <Field 
                                            type="text" 
                                            name="duration" 
                                            id="duration" 
                                            className="auth-input" 
                                            placeholder="e.g. 3 Months" 
                                        />
                                        <ErrorMessage name="duration" component="div" className="form-error" />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FileText size={16} /> Description
                                    </label>
                                    <Field 
                                        as="textarea" 
                                        name="description" 
                                        id="description" 
                                        className="auth-input" 
                                        rows="5" 
                                        placeholder="Describe the role and responsibilities..." 
                                        style={{ minHeight: '120px' }}
                                    />
                                    <ErrorMessage name="description" component="div" className="form-error" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="requirements" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <CheckCircle size={16} /> Skills / Requirements
                                    </label>
                                    <Field 
                                        type="text" 
                                        name="requirements" 
                                        id="requirements" 
                                        className="auth-input" 
                                        placeholder="React, Node.js, Python..." 
                                    />
                                    <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Skills separated by commas.</p>
                                    <ErrorMessage name="requirements" component="div" className="form-error" />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                                    <Field type="checkbox" name="isPublished" id="isPublished" style={{ width: '18px', height: '18px' }} />
                                    <label htmlFor="isPublished" style={{ fontSize: '14px', fontWeight: 500, color: '#1e293b', cursor: 'pointer' }}>
                                        Publish listing immediately
                                    </label>
                                </div>

                                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting} 
                                        className="in-btn in-btn-primary-azure"
                                        style={{ flex: 1, height: '48px' }}
                                    >
                                        {isSubmitting ? 'Posting...' : 'Post Internship'}
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => navigate('/company/dashboard')} 
                                        className="in-btn in-btn-outline-teal"
                                        style={{ flex: 1, border: '1px solid #e2e8f0', color: '#64748b' }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default CreateInternshipPage;
