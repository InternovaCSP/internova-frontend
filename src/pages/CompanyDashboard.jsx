import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext'
import internshipService from '../services/internshipService'
import Modal from '../components/Modal'
import { Plus, Briefcase, MapPin, Clock, Calendar, CheckCircle, XCircle, X, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

/**
 * CompanyDashboard Component
 * 
 * The main dashboard for companies to manage their internship postings.
 * Fetches and displays the company's active and draft internships.
 * 
 * @returns {JSX.Element} The company dashboard layout.
 */
export default function CompanyDashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [myPostings, setMyPostings] = useState([])
    const [loading, setLoading] = useState(true)
    const [editingPost, setEditingPost] = useState(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 5000);
    };

    useEffect(() => {
        if (user) {
            fetchMyPostings()
        }
    }, [user])

    async function fetchMyPostings() {
        try {
            setLoading(true)
            const data = await internshipService.getCompanyInternships()
            setMyPostings(data)
        } catch (error) {
            console.error('Error loading postings:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleEditClick = (post) => {
        setEditingPost(post)
        setShowEditModal(true)
    }

    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .required('Job Title is required')
            .max(255, 'Title too long'),
        description: Yup.string()
            .required('Description is required')
            .min(20, 'Description should be at least 20 characters'),
        location: Yup.string().required('Location is required'),
        duration: Yup.string().required('Duration is required'),
        requirements: Yup.string().required('Requirements are required')
    });

    const handleUpdate = async (values, { setSubmitting }) => {
        try {
            await internshipService.updateInternship(editingPost.id, values);
            showToast('Internship updated successfully!');
            setShowEditModal(false);
            fetchMyPostings();
        } catch (error) {
            console.error('Failed to update internship:', error);
            alert('Update failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="dash-v2-layout">
            <div className="dash-v2-container">
                <header className="dash-v2-welcome-row">
                    <div className="dash-v2-welcome-text">
                        <span className="in-user-role" style={{ fontSize: '12px', padding: '2px 8px', marginBottom: '8px', display: 'inline-block' }}>
                            Company Partner
                        </span>
                        <h1>Company Dashboard</h1>
                        <p>Welcome back, <strong>{user?.email}</strong>. Manage your talent pipeline.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Link to="/company/applications" className="in-btn in-btn-outline-azure" style={{ gap: '8px' }}>
                            <CheckCircle size={18} /> Manage Applications
                        </Link>
                        <Link to="/company/create-internship" className="in-btn in-btn-primary-azure" style={{ gap: '8px' }}>
                            <Plus size={18} /> Post New Internship
                        </Link>
                    </div>
                </header>

                <section className="dash-v2-analytics-row" style={{ gridTemplateColumns: '1fr' }}>
                    <div className="dash-v2-card">
                        <div className="dash-v2-section-title">
                            <span>My Postings</span>
                            <div style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>
                                {myPostings.length} Active Opportunities
                            </div>
                        </div>

                        {loading ? (
                            <div className="dash-v2-skeleton-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                                {[1, 2, 3].map(n => (
                                    <div key={n} className="in-skeleton" style={{ height: '200px', borderRadius: '16px' }}></div>
                                ))}
                            </div>
                        ) : myPostings.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '48px 0' }}>
                                <div style={{ background: '#f8fafc', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#94a3b8' }}>
                                    <Briefcase size={32} />
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>No postings found</h3>
                                <p style={{ color: '#64748b', marginBottom: '24px', maxWidth: '320px', margin: '0 auto 24px' }}>
                                    Start attracting top talent by creating your first internship posting today.
                                </p>
                                <Link to="/company/create-internship" className="in-btn in-btn-outline-teal">
                                    Create First Posting
                                </Link>
                            </div>
                        ) : (
                            <div className="dash-v2-kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                                {myPostings.map(post => (
                                    <div key={post.id} className="dash-v2-card dash-v2-card-interactive" style={{ border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                            <div className="dash-v2-kpi-icon-wrap dash-v2-kpi-icon-azure">
                                                <Briefcase size={20} />
                                            </div>
                                            {post.status === 'Pending Approval' ? (
                                                <span className="dash-v2-kpi-trend" style={{ background: '#fff7ed', color: '#c2410c', border: '1px solid #ffedd5' }}>Awaiting Approval</span>
                                            ) : post.isPublished ? (
                                                <span className="dash-v2-kpi-trend dash-v2-kpi-trend-positive">Active</span>
                                            ) : (
                                                <span className="dash-v2-kpi-trend" style={{ background: '#f1f5f9', color: '#64748b' }}>Draft</span>
                                            )}
                                        </div>
                                        
                                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', marginBottom: '12px' }}>{post.title}</h3>
                                        
                                        <div style={{ display: 'grid', gap: '8px', marginBottom: '20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
                                                <MapPin size={14} /> {post.location}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
                                                <Clock size={14} /> {post.duration}
                                            </div>
                                        </div>

                                        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '12px' }}>
                                            <button 
                                                className="in-btn in-btn-outline-azure" 
                                                style={{ flex: 1, padding: '8px', fontSize: '14px', borderRadius: '10px' }}
                                                onClick={() => handleEditClick(post)}
                                            >
                                                Edit details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Edit Modal Refactored */}
                <Modal 
                    isOpen={showEditModal} 
                    onClose={() => setShowEditModal(false)}
                    title="Edit Internship Posting"
                    maxWidth="600px"
                >
                    {editingPost && (
                        <Formik
                            initialValues={{
                                title: editingPost.title || '',
                                description: editingPost.description || '',
                                location: editingPost.location || '',
                                duration: editingPost.duration || '',
                                requirements: editingPost.requirements || '',
                                isPublished: editingPost.isPublished ?? true
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleUpdate}
                        >
                            {({ isSubmitting }) => (
                                <Form style={{ display: 'grid', gap: '20px' }}>
                                    <div className="form-group">
                                        <label className="form-label">Job Title</label>
                                        <Field name="title" className="auth-input" placeholder="e.g. Software Intern" />
                                        <ErrorMessage name="title" component="div" className="form-error" />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <div className="form-group">
                                            <label className="form-label">Location</label>
                                            <Field name="location" className="auth-input" />
                                            <ErrorMessage name="location" component="div" className="form-error" />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Duration</label>
                                            <Field name="duration" className="auth-input" />
                                            <ErrorMessage name="duration" component="div" className="form-error" />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Description</label>
                                        <Field as="textarea" name="description" className="auth-input" rows="4" style={{ minHeight: '100px' }} />
                                        <ErrorMessage name="description" component="div" className="form-error" />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Requirements (comma-separated)</label>
                                        <Field name="requirements" className="auth-input" />
                                        <ErrorMessage name="requirements" component="div" className="form-error" />
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#f8fafc', borderRadius: '12px' }}>
                                        <Field type="checkbox" name="isPublished" id="isPublishedEdit" style={{ width: '18px', height: '18px' }} />
                                        <label htmlFor="isPublishedEdit" style={{ fontSize: '14px', fontWeight: 500, color: '#1e293b', cursor: 'pointer' }}>
                                            Keep this listing published
                                        </label>
                                    </div>

                                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting} 
                                            className="in-btn in-btn-primary-azure"
                                            style={{ flex: 1 }}
                                        >
                                            {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => setShowEditModal(false)} 
                                            className="in-btn in-btn-outline-teal"
                                            style={{ flex: 1, border: '1px solid #e2e8f0', color: '#64748b' }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    )}
                </Modal>

                {/* Toast Notification */}
                {toast.show && (
                    <div className={`pr-toast ${toast.type}`} style={{ zIndex: 2000 }}>
                        {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                        <span style={{ marginLeft: '8px' }}>{toast.message}</span>
                    </div>
                )}
                
                <footer style={{ textAlign: 'center', fontSize: '13px', color: '#94a3b8', marginTop: '16px' }}>
                    Industrial data is role-protected and securely managed.
                </footer>
            </div>
        </div>
    )
}
