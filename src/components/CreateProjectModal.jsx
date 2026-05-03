import React, { useState } from 'react';
import { 
    X, FolderKanban, FileText, Tag, ChevronDown, Hash, Wrench, CheckCircle, AlertCircle 
} from 'lucide-react';
import { createProject } from '../api/projectApi';

/**
 * CreateProjectModal Component
 * Extracted from AdminProjectsPage to be reusable across the platform.
 */
export default function CreateProjectModal({ onClose, onCreated }) {
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
            if (onCreated) onCreated(created);
            onClose();
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
                    animation: 'adminModalIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    maxHeight: '90vh',
                    overflowY: 'auto'
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
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        {/* Title */}
                        <div style={{ flex: '1 1 300px' }}>
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
                        <div style={{ flex: '1 1 180px' }}>
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
                            type="button"
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
                            type="button"
                            onClick={handleSubmit}
                            disabled={submitting}
                            style={{
                                flex: 2, padding: '12px 20px', borderRadius: '10px',
                                background: '#2563eb', border: 'none',
                                color: 'white', fontWeight: 600, fontSize: '14px',
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                transition: 'all 0.15s', opacity: submitting ? 0.7 : 1,
                                fontFamily: "'Inter', sans-serif"
                            }}
                            onMouseEnter={e => !submitting && (e.currentTarget.style.background = '#1d4ed8')}
                            onMouseLeave={e => !submitting && (e.currentTarget.style.background = '#2563eb')}
                        >
                            {submitting ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </div>

                <style>{`
                    @keyframes adminModalIn { from { opacity:0; transform: translateY(20px) scale(0.97); } to { opacity:1; transform: translateY(0) scale(1); } }
                    @keyframes adminOverlayIn { from { opacity:0; } to { opacity:1; } }
                `}</style>
            </div>
        </div>
    );
}
