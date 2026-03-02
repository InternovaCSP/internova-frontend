import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Plus, X, Calendar, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CompetitionsFilterBar from '../components/CompetitionsFilterBar';
import CompetitionCard from '../components/CompetitionCard';
import { mockCompetitions } from '../data/mockCompetitions';

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

    // Details Modal State
    const [selectedCompetition, setSelectedCompetition] = useState(null);

    // Initial Load
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setCompetitions(mockCompetitions);
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Registration Handler
    const handleRegister = (id) => {
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
        return [...new Set(mockCompetitions.map(c => c.eligibility))];
    }, []);

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
                            <button className="in-btn in-btn-primary">
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
                            <p className="lp-body" style={{ marginBottom: '24px' }}>{selectedCompetition.description}</p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                                <div>
                                    <h4 style={{ fontFamily: 'var(--lp-font-heading)', fontSize: '14px', marginBottom: '8px', color: 'var(--lp-navy)' }}>Eligibility</h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--lp-text-secondary)' }}>
                                        <Users size={16} /> {selectedCompetition.eligibility}
                                    </div>
                                </div>
                                <div>
                                    <h4 style={{ fontFamily: 'var(--lp-font-heading)', fontSize: '14px', marginBottom: '8px', color: 'var(--lp-navy)' }}>Dates</h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--lp-text-secondary)' }}>
                                        <Calendar size={16} /> {selectedCompetition.startDate} - {selectedCompetition.endDate}
                                    </div>
                                    <div style={{ fontSize: '13px', color: 'var(--lp-text-secondary)', marginTop: '4px' }}>
                                        Deadline: {selectedCompetition.deadline}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 style={{ fontFamily: 'var(--lp-font-heading)', fontSize: '14px', marginBottom: '12px', color: 'var(--lp-navy)' }}>Required Domains / Skills</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {selectedCompetition.skills.map((skill, index) => (
                                        <span key={index} className="in-tag">{skill}</span>
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
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
