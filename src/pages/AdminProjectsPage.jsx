import React, { useEffect, useState } from 'react';
import CreateProjectModal from '../components/CreateProjectModal';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProjects, deleteProject } from '../api/projectApi';
import {
    FolderKanban, Plus, Search, Bell, ArrowLeft, Loader2, AlertCircle,
    Trash2, Eye
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';

/**
 * AdminProjectsPage Component
 *
 * Admin interface for managing university projects.
 * Admins can view all projects and create new ones.
 */
export default function AdminProjectsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => { 
        loadData(); 
        
        // Check if we should open the create modal immediately
        const params = new URLSearchParams(location.search);
        if (params.get('create') === 'true') {
            setShowCreateModal(true);
            // Clean up the URL
            navigate('/admin/projects', { replace: true });
        }
    }, [location.search]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getProjects();
            const list = Array.isArray(data) ? data : (data?.$values || []);
            setProjects(list);
        } catch (err) {
            console.error("Error loading projects:", err);
            setError("Failed to load projects.");
        } finally {
            setLoading(false);
        }
    };

    const filteredProjects = projects.filter(p => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return p.title?.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q) ||
            p.creatorName?.toLowerCase().includes(q);
    });

    const handleDelete = async (projectId, title) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;
        try {
            await deleteProject(projectId);
            setProjects(prev => prev.filter(p => p.id !== projectId));
        } catch (err) {
            console.error('Failed to delete project:', err);
            alert(err.response?.data?.error || 'Failed to delete project.');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Open':
            case 'Active':
                return { background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' };
            case 'Closed':
                return { background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' };
            case 'Completed':
                return { background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd' };
            default:
                return { background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' };
        }
    };

    const getCategoryStyle = (category) => {
        switch (category) {
            case 'Research':
                return { background: 'rgba(0, 120, 212, 0.08)', color: '#0369a1' };
            case 'Startup':
                return { background: 'rgba(249, 168, 37, 0.1)', color: '#b45309' };
            case 'Product Development':
                return { background: 'rgba(29, 137, 84, 0.08)', color: '#15803d' };
            case 'Innovation Lab':
                return { background: 'rgba(139, 92, 246, 0.08)', color: '#7c3aed' };
            default:
                return { background: '#f1f5f9', color: '#475569' };
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
            <AdminSidebar />

            <main style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* ── Sticky Header ── */}
                <header style={{
                    height: '70px',
                    background: 'white',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 40px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '8px' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Project Management</h2>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                style={{
                                    padding: '8px 12px 8px 38px',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '14px',
                                    outline: 'none',
                                    width: '240px'
                                }}
                            />
                        </div>
                        <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                            <Bell size={20} />
                        </button>
                    </div>
                </header>

                {/* ── Content ── */}
                <div style={{ padding: '32px 40px', maxWidth: '1200px' }}>
                    {/* Title + Create Button */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <div>
                            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>All Projects</h1>
                            <p style={{ color: '#64748b', margin: 0 }}>Manage university projects, research initiatives, and startups.</p>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '12px 24px', borderRadius: '10px',
                                background: '#2563eb', border: 'none', color: 'white',
                                fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                                transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(37, 99, 235, 0.3)'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#1d4ed8'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            <Plus size={18} /> Create Project
                        </button>
                    </div>

                    {/* Stats Bar */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
                        {[
                            { label: 'Total Projects', value: projects.length, color: '#2563eb', bg: '#eff6ff' },
                            { label: 'Active', value: projects.filter(p => p.status === 'Open' || p.status === 'Active').length, color: '#15803d', bg: '#f0fdf4' },
                            { label: 'Completed', value: projects.filter(p => p.status === 'Completed').length, color: '#0369a1', bg: '#f0f9ff' },
                            { label: 'Closed', value: projects.filter(p => p.status === 'Closed').length, color: '#b91c1c', bg: '#fef2f2' },
                        ].map((stat) => (
                            <div key={stat.label} style={{
                                background: 'white', borderRadius: '14px', padding: '20px 24px',
                                border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                            }}>
                                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 8px', fontWeight: 500 }}>{stat.label}</p>
                                <p style={{ fontSize: '28px', fontWeight: 700, color: stat.color, margin: 0 }}>{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Projects Table */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '100px 0' }}>
                            <Loader2 style={{ animation: 'spin 1s linear infinite' }} size={40} color="#2563eb" />
                            <p style={{ marginTop: '16px', color: '#64748b' }}>Loading projects...</p>
                        </div>
                    ) : error ? (
                        <div style={{ padding: '24px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <AlertCircle size={24} />
                            <p style={{ margin: 0 }}>{error}</p>
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <div style={{ padding: '80px 24px', textAlign: 'center', background: 'white', borderRadius: '24px', border: '1px dashed #cbd5e1' }}>
                            <div style={{ width: '80px', height: '80px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                <FolderKanban size={40} color="#15803d" />
                            </div>
                            <h2 style={{ color: '#0f172a', fontSize: '24px', marginBottom: '8px', fontWeight: 700 }}>
                                {searchQuery ? 'No Matching Projects' : 'No Projects Yet'}
                            </h2>
                            <p style={{ color: '#64748b', margin: '0 0 24px 0' }}>
                                {searchQuery ? 'Try a different search term.' : 'Create your first project to get started.'}
                            </p>
                            {!searchQuery && (
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        padding: '12px 24px', borderRadius: '10px',
                                        background: '#2563eb', border: 'none', color: 'white',
                                        fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                                        margin: '0 auto'
                                    }}
                                >
                                    <Plus size={18} /> Create First Project
                                </button>
                            )}
                        </div>
                    ) : (
                        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                            {/* Table Header */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '2fr 1fr 1fr 1fr 100px',
                                padding: '14px 32px',
                                background: '#f8fafc',
                                borderBottom: '1px solid #e2e8f0',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#94a3b8',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                <span>Project</span>
                                <span>Category</span>
                                <span>Creator</span>
                                <span>Status</span>
                                <span style={{ textAlign: 'center' }}>Actions</span>
                            </div>

                            {/* Table Rows */}
                            {filteredProjects.map((project, index) => (
                                <div key={project.id} style={{
                                    display: 'grid',
                                    gridTemplateColumns: '2fr 1fr 1fr 1fr 100px',
                                    padding: '20px 32px',
                                    alignItems: 'center',
                                    borderBottom: index < filteredProjects.length - 1 ? '1px solid #f1f5f9' : 'none',
                                    transition: 'background 0.15s ease'
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    {/* Project Name */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                        <div style={{
                                            width: '42px', height: '42px', borderRadius: '10px',
                                            background: '#eff6ff', display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', color: '#2563eb', flexShrink: 0
                                        }}>
                                            <FolderKanban size={20} />
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{project.title}</h4>
                                            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {project.description?.slice(0, 60) || 'No description'}{project.description?.length > 60 ? '...' : ''}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <span style={{
                                            padding: '4px 12px', borderRadius: '20px',
                                            fontSize: '12px', fontWeight: 600,
                                            ...getCategoryStyle(project.category)
                                        }}>
                                            {project.category || 'General'}
                                        </span>
                                    </div>

                                    {/* Creator */}
                                    <span style={{ fontSize: '14px', color: '#475569', fontWeight: 500 }}>
                                        {project.creatorName || 'Unknown'}
                                    </span>

                                    {/* Status */}
                                    <div>
                                        <span style={{
                                            padding: '4px 12px', borderRadius: '20px',
                                            fontSize: '11px', fontWeight: 700,
                                            textTransform: 'uppercase',
                                            ...getStatusStyle(project.status)
                                        }}>
                                            {project.status}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                        <button
                                            title="View"
                                            style={{
                                                width: '34px', height: '34px', borderRadius: '8px',
                                                background: '#f1f5f9', border: 'none', color: '#64748b',
                                                cursor: 'pointer', display: 'flex', alignItems: 'center',
                                                justifyContent: 'center', transition: 'all 0.15s'
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; }}
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            title="Delete"
                                            onClick={() => handleDelete(project.id, project.title)}
                                            style={{
                                                width: '34px', height: '34px', borderRadius: '8px',
                                                background: '#fef2f2', border: 'none', color: '#ef4444',
                                                cursor: 'pointer', display: 'flex', alignItems: 'center',
                                                justifyContent: 'center', transition: 'all 0.15s'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                                            onMouseLeave={e => e.currentTarget.style.background = '#fef2f2'}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* ── Create Project Modal ── */}
            {showCreateModal && (
                <CreateProjectModal
                    onClose={() => setShowCreateModal(false)}
                    onCreated={(newProject) => {
                        setProjects(prev => [newProject, ...prev]);
                        setShowCreateModal(false);
                    }}
                />
            )}

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes adminModalIn { from { opacity:0; transform: translateY(20px) scale(0.97); } to { opacity:1; transform: translateY(0) scale(1); } }
                @keyframes adminOverlayIn { from { opacity:0; } to { opacity:1; } }
            `}</style>
        </div>
    );
}


/* ──────────────────────────────────────────────────────────── */
/* Create Project Modal (inline component)                      */
/* ──────────────────────────────────────────────────────────── */
function CreateProjectModal({ onClose, onCreated }) {
    const [form, setForm] = useState({ title: '', description: '', category: 'Research', teamSize: '', requiredSkills: [] });
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const categories = ['Research', 'Startup', 'Product Development', 'Innovation Lab'];

    const skillOptions = [
        'React', 'Angular', 'Vue.js', 'Node.js', 'Python', 'Java', 'C#', '.NET',
        'Machine Learning', 'Data Analysis', 'UI/UX Design', 'Cloud Computing',
        'DevOps', 'Mobile Development', 'Cybersecurity', 'Blockchain',
        'Database Management', 'Project Management', 'IoT', 'Embedded Systems'
    ];

    const toggleSkill = (skill) => {
        setForm(prev => ({
            ...prev,
            requiredSkills: prev.requiredSkills.includes(skill)
                ? prev.requiredSkills.filter(s => s !== skill)
                : [...prev.requiredSkills, skill]
        }));
        if (formError) setFormError('');
    };

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (formError) setFormError('');
    };

    const handleSubmit = async () => {
        if (!form.title.trim()) {
            setFormError('Project title is required.');
            return;
        }
        try {
            setSubmitting(true);
            const created = await createProject({
                Title: form.title.trim(),
                Description: form.description.trim(),
                Category: form.category,
                TeamSize: form.teamSize ? parseInt(form.teamSize, 10) : null,
                RequiredSkills: form.requiredSkills.length > 0 ? form.requiredSkills.join(', ') : null
            });
            onCreated(created);
        } catch (err) {
            console.error('Failed to create project:', err);
            setFormError(err.response?.data?.error || 'Failed to create project.');
        } finally {
            setSubmitting(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        fontSize: '14px',
        fontFamily: "'Inter', sans-serif",
        outline: 'none',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box'
    };

    const labelStyle = {
        fontSize: '13px',
        fontWeight: 600,
        color: '#374151',
        marginBottom: '6px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    };

    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                background: 'rgba(15, 23, 42, 0.5)',
                backdropFilter: 'blur(4px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '24px',
                animation: 'adminOverlayIn 0.2s ease'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'white', borderRadius: '20px',
                    width: '100%', maxWidth: '560px',
                    padding: '36px', position: 'relative',
                    boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
                    animation: 'adminModalIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '16px', right: '16px',
                        width: '36px', height: '36px', borderRadius: '50%',
                        border: 'none', background: '#f1f5f9', color: '#64748b',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 0.15s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; }}
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div style={{ marginBottom: '28px' }}>
                    <div style={{
                        width: '48px', height: '48px', borderRadius: '12px',
                        background: '#eff6ff', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: '#2563eb', marginBottom: '16px'
                    }}>
                        <FolderKanban size={24} />
                    </div>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>Create New Project</h2>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Add a new university project or research initiative.</p>
                </div>

                {/* Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Title & Category Row */}
                    <div style={{ display: 'flex', gap: '20px' }}>
                        {/* Title */}
                        <div style={{ flex: 1.5 }}>
                            <label style={labelStyle}><FileText size={14} /> Project Title</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={e => handleChange('title', e.target.value)}
                                placeholder="e.g., AI-Powered Campus Navigator"
                                style={inputStyle}
                                onFocus={e => e.target.style.borderColor = '#2563eb'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        {/* Category */}
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}><Tag size={14} /> Category</label>
                            <div style={{ position: 'relative' }}>
                                <select
                                    value={form.category}
                                    onChange={e => handleChange('category', e.target.value)}
                                    style={{
                                        ...inputStyle,
                                        appearance: 'none',
                                        cursor: 'pointer',
                                        paddingRight: '40px'
                                    }}
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={16}
                                    style={{
                                        position: 'absolute', right: '14px', top: '50%',
                                        transform: 'translateY(-50%)', color: '#94a3b8',
                                        pointerEvents: 'none'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Team Size */}
                    <div>
                        <label style={labelStyle}><Hash size={14} /> Team Size</label>
                        <input
                            type="number"
                            min="1"
                            value={form.teamSize}
                            onChange={e => handleChange('teamSize', e.target.value)}
                            placeholder="e.g., 5"
                            style={inputStyle}
                            onFocus={e => e.target.style.borderColor = '#2563eb'}
                            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                        />
                    </div>

                    {/* Required Skills */}
                    <div>
                        <label style={labelStyle}><Wrench size={14} /> Required Skills</label>
                        <div style={{
                            display: 'flex', flexWrap: 'wrap', gap: '8px',
                            padding: '12px 16px', borderRadius: '10px',
                            border: '1px solid #e2e8f0', background: '#fafbfc',
                            maxHeight: '160px', overflowY: 'auto'
                        }}>
                            {skillOptions.map(skill => {
                                const isSelected = form.requiredSkills.includes(skill);
                                return (
                                    <button
                                        key={skill}
                                        type="button"
                                        onClick={() => toggleSkill(skill)}
                                        style={{
                                            padding: '5px 14px', borderRadius: '20px',
                                            fontSize: '12px', fontWeight: 600,
                                            cursor: 'pointer', transition: 'all 0.15s',
                                            border: isSelected ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                                            background: isSelected ? '#eff6ff' : 'white',
                                            color: isSelected ? '#2563eb' : '#64748b',
                                            fontFamily: "'Inter', sans-serif"
                                        }}
                                    >
                                        {isSelected && <CheckCircle size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />}
                                        {skill}
                                    </button>
                                );
                            })}
                        </div>
                        {form.requiredSkills.length > 0 && (
                            <p style={{ fontSize: '12px', color: '#64748b', margin: '6px 0 0', fontStyle: 'italic' }}>
                                {form.requiredSkills.length} skill{form.requiredSkills.length > 1 ? 's' : ''} selected
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label style={labelStyle}><FileText size={14} /> Description</label>
                        <textarea
                            value={form.description}
                            onChange={e => handleChange('description', e.target.value)}
                            placeholder="Describe the project goals, requirements, and expected outcomes..."
                            rows={4}
                            style={{
                                ...inputStyle,
                                resize: 'vertical',
                                minHeight: '100px'
                            }}
                            onFocus={e => e.target.style.borderColor = '#2563eb'}
                            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                        />
                    </div>

                    {/* Error */}
                    {formError && (
                        <div style={{
                            padding: '12px 16px', background: '#fef2f2',
                            border: '1px solid #fee2e2', borderRadius: '10px',
                            color: '#b91c1c', fontSize: '14px',
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}>
                            <AlertCircle size={16} /> {formError}
                        </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                        <button
                            onClick={onClose}
                            style={{
                                flex: 1, padding: '12px 20px', borderRadius: '10px',
                                background: 'white', border: '1px solid #e2e8f0',
                                color: '#475569', fontWeight: 600, fontSize: '14px',
                                cursor: 'pointer', transition: 'all 0.15s',
                                fontFamily: "'Inter', sans-serif"
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                            onMouseLeave={e => e.currentTarget.style.background = 'white'}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            style={{
                                flex: 1, padding: '12px 20px', borderRadius: '10px',
                                background: submitting ? '#93c5fd' : '#2563eb',
                                border: 'none', color: 'white', fontWeight: 600,
                                fontSize: '14px', cursor: submitting ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                gap: '8px', transition: 'all 0.15s',
                                fontFamily: "'Inter', sans-serif",
                                boxShadow: '0 1px 3px rgba(37,99,235,0.3)'
                            }}
                            onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = '#1d4ed8'; }}
                            onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = '#2563eb'; }}
                        >
                            {submitting ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Creating...</> : <><Plus size={16} /> Create Project</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
