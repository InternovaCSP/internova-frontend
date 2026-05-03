import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Plus, X, Calendar, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CompetitionsFilterBar from '../components/CompetitionsFilterBar';
import CompetitionCard from '../components/CompetitionCard';
import { competitionApi } from '../services/api';

/**
 * CompetitionsPage Component
 * 
 * An advanced feature page listing University/Global Hackathons and Competitions.
 * Supports specialized filters (Team Size, Category), rendering `CompetitionCard` components,
 * and maintains an active Modal dialog state for viewing extended competition details in a popup.
 * 
 * @returns {JSX.Element} The competitions interface.
 */
export default function CompetitionsPage() {
    const { user } = useAuth();
    const [competitions, setCompetitions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [eligibilityFilter, setEligibilityFilter] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    // Modal States
    const [selectedCompetition, setSelectedCompetition] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [newComp, setNewComp] = useState({
        title: '',
        description: '',
        category: '',
        eligibilityCriteria: '',
        startDate: '',
        endDate: '',
        skills: ''
    });

    // Initial Load
    useEffect(() => {
        const fetchCompetitions = async () => {
            setIsLoading(true);
            try {
                const response = await competitionApi.getAll();
                const mappedData = response.data.map(comp => ({
                    ...comp,
                    organizer: comp.organizerName || 'University Organizer',
                    description: comp.description || 'No description available.',
                    category: comp.category || 'General',
                    status: new Date(comp.endDate) < new Date() ? 'Closed' : 'Upcoming',
                    eligibility: comp.eligibilityCriteria || 'Open to all students',
                    startDate: comp.startDate ? new Date(comp.startDate).toLocaleDateString() : 'TBD',
                    endDate: comp.endDate ? new Date(comp.endDate).toLocaleDateString() : 'TBD',
                    deadline: comp.endDate ? new Date(comp.endDate).toLocaleDateString() : 'TBD',
                    rawStartDate: comp.startDate,
                    rawEndDate: comp.endDate,
                    skills: comp.skills ? comp.skills.split(',').map(s => s.trim()) : []
                }));
                setCompetitions(mappedData);
            } catch (error) {
                console.error('Failed to fetch competitions:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompetitions();
    }, []);

    // Registration Handler
    const handleRegister = async (id) => {
        try {
            await competitionApi.register(id);
            setCompetitions(prev => prev.map(comp => {
                if (comp.id === id) {
                    return { ...comp, currentUserStatus: 'Registered' };
                }
                return comp;
            }));

            // Update modal state if it's currently open
            if (selectedCompetition && selectedCompetition.id === id) {
                setSelectedCompetition(prev => ({ ...prev, currentUserStatus: 'Registered' }));
            }
        } catch (error) {
            console.error('Registration failed:', error);
            alert(error.response?.data?.error || 'Failed to register for competition.');
        }
    };

    const handleCreateCompetition = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...newComp,
                organizerId: user.userId
            };
            await competitionApi.create(payload);
            setIsCreateModalOpen(false);
            setNewComp({ title: '', description: '', category: '', eligibilityCriteria: '', startDate: '', endDate: '', skills: '' });
            fetchCompetitions();
        } catch (error) {
            console.error('Failed to create competition:', error);
        }
    };

    const handleEditClick = (comp) => {
        setEditingId(comp.id);
        setNewComp({
            title: comp.title,
            description: comp.description,
            category: comp.category,
            eligibilityCriteria: comp.eligibility,
            startDate: comp.rawStartDate ? comp.rawStartDate.split('T')[0] : '',
            endDate: comp.rawEndDate ? comp.rawEndDate.split('T')[0] : '',
            skills: comp.skills.join(', ')
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateCompetition = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...newComp,
                isApproved: true
            };
            await competitionApi.update(editingId, payload);
            setIsEditModalOpen(false);
            setEditingId(null);
            setNewComp({ title: '', description: '', category: '', eligibilityCriteria: '', startDate: '', endDate: '', skills: '' });
            fetchCompetitions();
        } catch (error) {
            console.error('Failed to update competition:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this competition?')) return;
        
        try {
            await competitionApi.delete(id);
            setCompetitions(prev => prev.filter(c => c.id !== id));
            if (selectedCompetition?.id === id) setSelectedCompetition(null);
        } catch (error) {
            console.error('Failed to delete competition:', error);
            alert("Failed to delete competition. You may not have permission.");
        }
    };

    // Filter Logic
    const filteredData = useMemo(() => {
        let result = [...competitions];

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(item =>
                item.title.toLowerCase().includes(q) ||
                item.organizer.toLowerCase().includes(q) ||
                item.skills.some(skill => skill.toLowerCase().includes(q))
            );
        }

        if (categoryFilter) {
            result = result.filter(item => item.category === categoryFilter);
        }

        if (statusFilter) {
            result = result.filter(item => item.status === statusFilter);
        }

        if (eligibilityFilter) {
            result = result.filter(item => item.eligibility === eligibilityFilter);
        }

        result.sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.startDate) - new Date(a.startDate);
            if (sortBy === 'deadline') return new Date(a.deadline) - new Date(b.deadline);
            return 0; // Default or Popular logic can be extended
        });

        return result;
    }, [competitions, searchQuery, categoryFilter, statusFilter, eligibilityFilter, sortBy]);

    const eligibilityOptions = useMemo(() => {
        return [...new Set(competitions.map(c => c.eligibility))];
    }, [competitions]);

    return (
        <div className="in-shell">
            <style>{`
                /* ── Internova Specialized UI Components ────────────────── */
                .in-card {
                  background: var(--lp-white);
                  border-radius: 12px;
                  padding: 24px;
                  border: 1px solid var(--lp-border);
                  box-shadow: 0 4px 12px rgba(13, 27, 42, 0.03);
                  transition: transform 0.2s, box-shadow 0.2s;
                }

                .in-tag {
                  display: inline-flex;
                  align-items: center;
                  padding: 4px 10px;
                  border-radius: 6px;
                  font-size: 12px;
                  font-weight: 600;
                  background: var(--lp-slate);
                  color: var(--lp-navy);
                  border: 1px solid var(--lp-border);
                  transition: all 0.2s;
                }

                .in-tag:hover {
                  background: white;
                  border-color: var(--lp-blue);
                  color: var(--lp-blue);
                  transform: translateY(-1px);
                }

                .in-btn {
                  display: inline-flex;
                  align-items: center;
                  gap: 8px;
                  padding: 10px 18px;
                  border-radius: 8px;
                  font-size: 14px;
                  font-weight: 600;
                  cursor: pointer;
                  transition: all 0.2s;
                  border: 1px solid transparent;
                }
            `}</style>

            <div className="in-container">
                {/* ── Header Section ── */}
                <section className="in-header-section">
                    <div className="in-header-text">
                        <h1 className="in-h1">Discover Academic & Industry Competitions</h1>
                        <p className="in-body">
                            Explore coding challenges, research contests, innovation events, and hackathons approved by the university.
                        </p>
                    </div>
                    <div className="in-header-actions">
                        {user?.role === 'Admin' && (
                            <button className="in-btn in-btn-primary" onClick={() => setIsCreateModalOpen(true)}>
                                <Plus size={18} /> Post Competition
                            </button>
                        )}
                    </div>
                </section>

                {/* ── Filter Bar ── */}
                <CompetitionsFilterBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    categoryFilter={categoryFilter}
                    setCategoryFilter={setCategoryFilter}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    eligibilityFilter={eligibilityFilter}
                    setEligibilityFilter={setEligibilityFilter}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    eligibilityOptions={eligibilityOptions}
                />

                {/* ── Main Content Area ── */}
                {isLoading ? (
                    <div className="in-grid">
                        {[1, 2, 3, 4, 5, 6].map(n => (
                            <div key={n} className="in-card" style={{ height: '340px', display: 'flex', flexDirection: 'column' }}>
                                <div className="in-skeleton in-sk-title" style={{ marginTop: '20px' }}></div>
                                <div className="in-skeleton in-sk-badge" style={{ marginTop: '12px' }}></div>
                                <div className="in-skeleton in-sk-text" style={{ marginTop: '24px' }}></div>
                                <div className="in-skeleton in-sk-text" style={{ width: '80%' }}></div>
                                <div className="in-skeleton in-sk-text" style={{ width: '60%' }}></div>
                                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                    <div className="in-skeleton in-sk-btn"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="in-grid-meta">
                            <span>Showing {filteredData.length} competitions</span>
                        </div>

                        {filteredData.length === 0 ? (
                            <div className="in-empty-state">
                                <div className="in-empty-icon" style={{ opacity: 0.5 }}>🏆</div>
                                <h3 className="in-empty-title">No competitions found.</h3>
                                <p className="in-empty-desc">Adjust your filters or try a different search term.</p>
                            </div>
                        ) : (
                            <div className="in-grid">
                                {filteredData.map(comp => (
                                    <CompetitionCard
                                        key={comp.id}
                                        competition={comp}
                                        userRole={user?.role}
                                        onViewDetails={(c) => setSelectedCompetition(c)}
                                        onRegister={handleRegister}
                                        onEdit={handleEditClick}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ── Details Modal Overlay ── */}
            {selectedCompetition && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(13, 27, 42, 0.4)', backdropFilter: 'blur(4px)',
                    zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
                }}>
                    <div style={{
                        backgroundColor: 'var(--lp-white)', borderRadius: '12px', width: '100%', maxWidth: '640px',
                        boxShadow: '0 24px 64px rgba(13, 27, 42, 0.12)', border: '1px solid var(--lp-border)',
                        display: 'flex', flexDirection: 'column', maxHeight: '90vh'
                    }}>
                        {/* Modal Header */}
                        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--lp-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h2 className="lp-h2" style={{ marginBottom: '8px' }}>{selectedCompetition.title}</h2>
                                <p className="lp-body" style={{ fontSize: '14px' }}>{selectedCompetition.organizer}</p>
                            </div>
                            <button onClick={() => setSelectedCompetition(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--lp-text-secondary)', padding: '4px' }}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: '32px', overflowY: 'auto' }}>
                            <div style={{ marginBottom: '24px' }}>
                                <h4 style={{ fontFamily: 'var(--lp-font-heading)', fontSize: '12px', fontWeight: '700', color: 'var(--lp-blue)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Description</h4>
                                <p className="lp-body" style={{ fontSize: '15px', color: 'var(--lp-text-primary)', lineHeight: '1.7' }}>{selectedCompetition.description}</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px', padding: '20px', background: 'var(--lp-gray)', borderRadius: '12px', border: '1px solid var(--lp-border)' }}>
                                <div>
                                    <h4 style={{ fontFamily: 'var(--lp-font-heading)', fontSize: '13px', fontWeight: '700', marginBottom: '10px', color: 'var(--lp-navy)' }}>Eligibility</h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--lp-text-secondary)' }}>
                                        <Users size={16} /> {selectedCompetition.eligibility}
                                    </div>
                                </div>
                                <div>
                                    <h4 style={{ fontFamily: 'var(--lp-font-heading)', fontSize: '13px', fontWeight: '700', marginBottom: '10px', color: 'var(--lp-navy)' }}>Important Dates</h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--lp-text-secondary)' }}>
                                        <Calendar size={16} /> {selectedCompetition.startDate} - {selectedCompetition.endDate}
                                    </div>
                                    <div style={{ fontSize: '13px', color: 'var(--lp-blue)', fontWeight: '600', marginTop: '6px' }}>
                                        Deadline: {selectedCompetition.deadline}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 style={{ fontFamily: 'var(--lp-font-heading)', fontSize: '12px', fontWeight: '700', color: 'var(--lp-blue)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Required Domains & Skills</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {selectedCompetition.skills.map((skill, index) => (
                                        <span key={index} className="in-tag" style={{ padding: '6px 14px', fontSize: '13px', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div style={{ padding: '24px 32px', borderTop: '1px solid var(--lp-border)', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                            <button className="lp-btn lp-btn--outline" onClick={() => setSelectedCompetition(null)}>Close</button>
                            {user?.role === 'Student' && (
                                <button
                                    className={`lp-btn ${selectedCompetition.currentUserStatus ? '' : 'lp-btn--primary'}`}
                                    disabled={!!selectedCompetition.currentUserStatus}
                                    onClick={() => handleRegister(selectedCompetition.id)}
                                    style={{
                                        backgroundColor: selectedCompetition.currentUserStatus ? 'var(--lp-gray)' : 'var(--lp-blue)',
                                        color: selectedCompetition.currentUserStatus ? 'var(--lp-text-secondary)' : 'var(--lp-white)',
                                        border: '1px solid transparent',
                                        cursor: selectedCompetition.currentUserStatus ? 'default' : 'pointer'
                                    }}
                                >
                                    {selectedCompetition.currentUserStatus ? 'Already Registered' : 'Register Now'}
                                </button>
                            )}
                            {user?.role === 'Admin' && (
                                <button
                                    className="lp-btn lp-btn--danger"
                                    onClick={() => handleDelete(selectedCompetition.id)}
                                    style={{
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Delete Competition
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* ── Create Competition Modal ── */}
            {isCreateModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(13, 27, 42, 0.4)', backdropFilter: 'blur(4px)',
                    zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
                }}>
                    <div style={{
                        backgroundColor: 'var(--lp-white)', borderRadius: '12px', width: '100%', maxWidth: '500px',
                        boxShadow: '0 24px 64px rgba(13, 27, 42, 0.12)', border: '1px solid var(--lp-border)',
                        display: 'flex', flexDirection: 'column', maxHeight: '90vh'
                    }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--lp-border)', display: 'flex', justifyContent: 'space-between' }}>
                            <h2 className="lp-h3">Post New Competition</h2>
                            <button onClick={() => setIsCreateModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleCreateCompetition} style={{ padding: '24px', overflowY: 'auto' }}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Title</label>
                                <input type="text" className="in-input" required value={newComp.title} onChange={e => setNewComp({ ...newComp, title: e.target.value })} />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Category</label>
                                <input type="text" className="in-input" placeholder="e.g. Hackathon, Research" value={newComp.category} onChange={e => setNewComp({ ...newComp, category: e.target.value })} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Start Date</label>
                                    <input type="date" className="in-input" value={newComp.startDate} onChange={e => setNewComp({ ...newComp, startDate: e.target.value })} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>End Date</label>
                                    <input type="date" className="in-input" value={newComp.endDate} onChange={e => setNewComp({ ...newComp, endDate: e.target.value })} />
                                </div>
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Skills (comma separated)</label>
                                <input type="text" className="in-input" placeholder="React, Python, UI/UX" value={newComp.skills} onChange={e => setNewComp({ ...newComp, skills: e.target.value })} />
                            </div>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Description</label>
                                <textarea className="in-input" rows="3" value={newComp.description} onChange={e => setNewComp({ ...newComp, description: e.target.value })}></textarea>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button type="button" className="lp-btn lp-btn--outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
                                <button type="submit" className="lp-btn lp-btn--primary">Post Now</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* ── Edit Competition Modal ── */}
            {isEditModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(13, 27, 42, 0.4)', backdropFilter: 'blur(4px)',
                    zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
                }}>
                    <div style={{
                        backgroundColor: 'var(--lp-white)', borderRadius: '12px', width: '100%', maxWidth: '500px',
                        boxShadow: '0 24px 64px rgba(13, 27, 42, 0.12)', border: '1px solid var(--lp-border)',
                        display: 'flex', flexDirection: 'column', maxHeight: '90vh'
                    }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--lp-border)', display: 'flex', justifyContent: 'space-between' }}>
                            <h2 className="lp-h3">Edit Competition</h2>
                            <button onClick={() => { setIsEditModalOpen(false); setEditingId(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleUpdateCompetition} style={{ padding: '24px', overflowY: 'auto' }}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Title</label>
                                <input type="text" className="in-input" required value={newComp.title} onChange={e => setNewComp({ ...newComp, title: e.target.value })} />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Category</label>
                                <input type="text" className="in-input" placeholder="e.g. Hackathon, Research" value={newComp.category} onChange={e => setNewComp({ ...newComp, category: e.target.value })} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Start Date</label>
                                    <input type="date" className="in-input" value={newComp.startDate} onChange={e => setNewComp({ ...newComp, startDate: e.target.value })} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>End Date</label>
                                    <input type="date" className="in-input" value={newComp.endDate} onChange={e => setNewComp({ ...newComp, endDate: e.target.value })} />
                                </div>
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Skills (comma separated)</label>
                                <input type="text" className="in-input" placeholder="React, Python, UI/UX" value={newComp.skills} onChange={e => setNewComp({ ...newComp, skills: e.target.value })} />
                            </div>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Description</label>
                                <textarea className="in-input" rows="3" value={newComp.description} onChange={e => setNewComp({ ...newComp, description: e.target.value })}></textarea>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button type="button" className="lp-btn lp-btn--outline" onClick={() => { setIsEditModalOpen(false); setEditingId(null); }}>Cancel</button>
                                <button type="submit" className="lp-btn lp-btn--primary">Update Competition</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
