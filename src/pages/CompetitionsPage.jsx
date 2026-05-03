import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, ChevronRight, X, Calendar, MapPin, Award, Users, BookOpen, Clock, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { competitionApi } from '../services/api';
import CompetitionCard from '../components/CompetitionCard';
import CompetitionDetailModal from '../components/CompetitionDetailModal';

export default function CompetitionsPage() {
    const { user } = useAuth();
    const [competitions, setCompetitions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [sortBy, setSortBy] = useState('newest');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

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

    useEffect(() => {
        fetchCompetitions();
    }, []);

    const fetchCompetitions = async () => {
        setIsLoading(true);
        try {
            const response = await competitionApi.getAll();
            const data = response.data || response; // Handle different API response formats
            const mappedData = data.map(comp => ({
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
                skills: comp.skills ? (Array.isArray(comp.skills) ? comp.skills : comp.skills.split(',').map(s => s.trim())) : []
            }));
            setCompetitions(mappedData);
        } catch (error) {
            console.error('Failed to fetch competitions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (id) => {
        try {
            await competitionApi.register(id);
            setCompetitions(prev => prev.map(comp => {
                if (comp.id === id) {
                    return { ...comp, currentUserStatus: 'Registered' };
                }
                return comp;
            }));

            if (selectedCompetition && selectedCompetition.id === id) {
                setSelectedCompetition(prev => ({ ...prev, currentUserStatus: 'Registered' }));
            }
            alert('Successfully registered!');
        } catch (error) {
            console.error('Registration failed:', error);
            alert(error.response?.data?.error || 'Failed to register.');
        }
    };

    const handleCreateCompetition = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...newComp, organizerId: user.userId };
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
            const payload = { ...newComp, isApproved: true };
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
        try {
            await competitionApi.delete(id);
            setCompetitions(prev => prev.filter(c => c.id !== id));
            if (selectedCompetition?.id === id) setSelectedCompetition(null);
        } catch (error) {
            console.error('Failed to delete competition:', error);
            alert("Failed to delete competition.");
        }
    };

    const filteredData = useMemo(() => {
        let result = [...competitions];
        
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(item => 
                item.title.toLowerCase().includes(q) || 
                item.organizer.toLowerCase().includes(q)
            );
        }

        if (categoryFilter) {
            result = result.filter(item => item.category === categoryFilter);
        }

        result.sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.rawStartDate || 0) - new Date(a.rawStartDate || 0);
            if (sortBy === 'deadline') return new Date(a.rawEndDate || 0) - new Date(b.rawEndDate || 0);
            return 0;
        });
        return result;
    }, [competitions, sortBy, searchQuery, categoryFilter]);



    return (
        <div className="in-shell">
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
                <div className="in-filters-bar">
                    <div className="in-search-wrap">
                        <Search size={18} className="in-search-icon" />
                        <input 
                            className="in-search-input" 
                            placeholder="Search competitions or organizers..." 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="in-filters-group">
                        <select 
                            className="in-select" 
                            style={{ minWidth: '150px' }}
                            value={categoryFilter} 
                            onChange={e => setCategoryFilter(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {[...new Set(competitions.map(c => c.category))].map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <select 
                            className="in-select" 
                            style={{ minWidth: '150px' }}
                            value={sortBy} 
                            onChange={e => setSortBy(e.target.value)}
                        >
                            <option value="newest">Newest First</option>
                            <option value="deadline">Nearest Deadline</option>
                        </select>
                    </div>
                </div>

                {/* ── Main Content Area ── */}
                {isLoading ? (
                    <div className="in-grid">
                        {[1, 2, 3].map(n => (
                            <div key={n} className="prj-card" style={{ height: '340px' }}>
                                <div className="in-skeleton in-sk-title" style={{ marginTop: '20px' }}></div>
                                <div className="in-skeleton in-sk-badge" style={{ marginTop: '12px' }}></div>
                                <div className="in-skeleton in-sk-text" style={{ marginTop: '24px' }}></div>
                                <div className="in-skeleton in-sk-text" style={{ width: '80%' }}></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="in-grid-meta" style={{ marginBottom: '16px', color: '#64748b', fontSize: '14px' }}>
                            Showing {filteredData.length} competitions
                        </div>

                        {filteredData.length === 0 ? (
                            <div className="in-empty-state">
                                <BookOpen size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                                <h3>No competitions found</h3>
                                <p>Adjust your filters or try a different search term.</p>
                            </div>
                        ) : (
                            <div className="in-grid">
                                {filteredData.map(comp => (
                                    <CompetitionCard
                                        key={comp.id}
                                        competition={comp}
                                        userRole={user?.role}
                                        onViewDetails={setSelectedCompetition}
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

            {/* ── Details Modal ── */}
            <CompetitionDetailModal 
                competition={selectedCompetition}
                onClose={() => setSelectedCompetition(null)}
                onRegister={handleRegister}
                onDelete={handleDelete}
            />

            {/* ── Create Modal ── */}
            {isCreateModalOpen && (
                <div className="prj-modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
                    <div className="prj-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <button className="prj-modal-close" onClick={() => setIsCreateModalOpen(false)}><X size={20} /></button>
                        <div className="prj-modal-header">
                            <h2 className="prj-modal-title">Post New Competition</h2>
                        </div>
                        <form onSubmit={handleCreateCompetition} className="prj-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <input className="in-input" placeholder="Title" required value={newComp.title} onChange={e => setNewComp({...newComp, title: e.target.value})} />
                            <input className="in-input" placeholder="Category" value={newComp.category} onChange={e => setNewComp({...newComp, category: e.target.value})} />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <input type="date" className="in-input" value={newComp.startDate} onChange={e => setNewComp({...newComp, startDate: e.target.value})} />
                                <input type="date" className="in-input" value={newComp.endDate} onChange={e => setNewComp({...newComp, endDate: e.target.value})} />
                            </div>
                            <textarea className="in-input" placeholder="Description" rows={3} value={newComp.description} onChange={e => setNewComp({...newComp, description: e.target.value})} />
                            <div className="prj-modal-footer" style={{ padding: 0, border: 'none', gap: '12px' }}>
                                <button type="submit" className="prj-btn prj-btn--primary" style={{ flex: 1 }}>Post Now</button>
                                <button type="button" className="prj-btn prj-btn--outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
