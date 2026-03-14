import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FiltersBar from '../components/FiltersBar';
import InternshipCard from '../components/InternshipCard';
import internshipService from '../services/internshipService';
import Modal from '../components/Modal';

/**
 * InternshipsPage Component
 * 
 * The primary public-facing grid displaying available internship opportunities.
 * Connects with `FiltersBar` for complex active filtering by Role, Location, and Work Type.
 * Implements a responsive grid containing `InternshipCard` components based on mock data.
 * 
 * @returns {JSX.Element} The list/filter page for internships.
 */
const InternshipsPage = () => {
    const { user } = useAuth();

    const [internships, setInternships] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedInternship, setSelectedInternship] = useState(null);

    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [durationFilter, setDurationFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    // Load real data from database
    useEffect(() => {
        const fetchInternships = async () => {
            setIsLoading(true);
            try {
                const data = await internshipService.getAllInternships();
                setInternships(data);
            } catch (error) {
                console.error('Failed to load internships:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInternships();
    }, []);

    // Handle actions (mock)
    const handleApply = (id) => {
        setInternships(prev => prev.map(internship => {
            if (internship.id === id) {
                return { ...internship, currentUserStatus: 'Applied' };
            }
            return internship;
        }));
    };

    const handleViewDetails = (internship) => {
        setSelectedInternship(internship);
    };

    const handleCloseModal = () => {
        setSelectedInternship(null);
    };

    // Derived state: Filtered & Sorted Data
    const filteredData = useMemo(() => {
        let result = [...internships];

        // Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(item =>
                item.title.toLowerCase().includes(q) ||
                item.company.toLowerCase().includes(q)
            );
        }

        // Filters
        if (locationFilter) {
            if (locationFilter === 'Remote') {
                result = result.filter(item => item.location.includes('Remote'));
            } else if (locationFilter === 'On-site') {
                result = result.filter(item => !item.location.includes('Remote') && !item.location.includes('Hybrid'));
            } else if (locationFilter === 'Hybrid') {
                result = result.filter(item => item.location.includes('Hybrid'));
            }
        }

        if (durationFilter) {
            result = result.filter(item => item.duration === durationFilter);
        }

        if (statusFilter) {
            result = result.filter(item => item.status === statusFilter);
        }

        // Sort
        result.sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.postedAt) - new Date(a.postedAt);
            if (sortBy === 'deadline') return new Date(a.deadline) - new Date(b.deadline);
            return 0; // Default or Popular
        });

        return result;
    }, [internships, searchQuery, locationFilter, durationFilter, statusFilter, sortBy]);

    // Derived arrays for dropdown options
    const durationOptions = [...new Set(internships.map(i => i.duration))];

    return (
        <div className="in-shell">


            <div className="in-container">

                {/* Header Section */}
                <section className="in-header-section">
                    <div>
                        <h1 className="in-h1">Explore Verified Internship Opportunities</h1>
                        <p className="in-header-desc">
                            Browse university-approved internship opportunities from trusted companies.
                        </p>
                    </div>

                    {user?.role === 'Admin' && (
                        <button className="in-btn in-btn-primary">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Post Internship
                        </button>
                    )}
                </section>

                {/* Filters Section */}
                <FiltersBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    locationFilter={locationFilter}
                    setLocationFilter={setLocationFilter}
                    durationFilter={durationFilter}
                    setDurationFilter={setDurationFilter}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    durationOptions={durationOptions}
                />

                {/* Content Section */}
                {isLoading ? (
                    <div className="in-grid">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="in-sk-card in-shimmer" />
                        ))}
                    </div>
                ) : filteredData.length > 0 ? (
                    <>
                        <div className="in-grid">
                            {filteredData.map(internship => (
                                <InternshipCard
                                    key={internship.id}
                                    internship={internship}
                                    userRole={user?.role}
                                    onApply={() => handleApply(internship.id)}
                                    onViewDetails={handleViewDetails}
                                />
                            ))}
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '48px' }}>
                            <button className="in-btn in-btn-outline">
                                Load More Opportunities
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="in-empty-state">
                        <svg className="in-empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <h3 className="in-card-title">No internships found</h3>
                        <p className="in-card-desc">Try adjusting your filters or search terms to find what you're looking for.</p>
                        <button
                            className="in-btn in-btn-outline"
                            onClick={() => {
                                setSearchQuery(''); setLocationFilter(''); setDurationFilter(''); setStatusFilter('');
                            }}
                        >
                            Clear all filters
                        </button>
                    </div>
                )}

                {/* Internship Detail Modal */}
                <Modal
                    isOpen={!!selectedInternship}
                    onClose={handleCloseModal}
                    title="Internship Overview"
                    footer={
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button className="in-btn in-btn-outline" onClick={handleCloseModal}>
                                Dismiss
                            </button>
                            {user?.role === 'Student' && (
                                <button 
                                    className={`in-btn ${selectedInternship?.currentUserStatus ? 'in-btn-disabled' : 'in-btn-secondary'}`}
                                    disabled={!!selectedInternship?.currentUserStatus || selectedInternship?.status === 'Closed'}
                                    onClick={() => {
                                        handleApply(selectedInternship.id);
                                        handleCloseModal();
                                    }}
                                >
                                    {selectedInternship?.currentUserStatus ? 'Already Applied' : 'Apply for this Role'}
                                </button>
                            )}
                        </div>
                    }
                >
                    {selectedInternship && (
                        <div className="in-modal-content-refined">
                            <div style={{ marginBottom: '32px', borderBottom: '1px solid #f1f5f9', paddingBottom: '24px' }}>
                                <h3 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>{selectedInternship.title}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ color: '#0ea5e9', fontWeight: 700, fontSize: '18px' }}>@ {selectedInternship.company}</span>
                                    <span style={{ width: '4px', height: '4px', background: '#cbd5e1', borderRadius: '50%' }}></span>
                                    <span style={{ color: '#64748b', fontSize: '15px' }}>{selectedInternship.location}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', marginBottom: '40px' }}>
                                <div style={{ flex: '1 1 200px' }}>
                                    <h4 style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Experience Details</h4>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <li style={{ fontSize: '15px', color: '#334155' }}>
                                            <strong style={{ color: '#0f172a' }}>Duration:</strong> {selectedInternship.duration}
                                        </li>
                                        <li style={{ fontSize: '15px', color: '#334155' }}>
                                            <strong style={{ color: '#0f172a' }}>Posted On:</strong> {new Date(selectedInternship.postedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </li>
                                        <li style={{ fontSize: '15px', color: '#334155' }}>
                                            <strong style={{ color: '#0f172a' }}>Status:</strong> {selectedInternship.status}
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <section style={{ marginBottom: '32px' }}>
                                <h4 style={{ fontSize: '14px', color: '#0f172a', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    About the Role
                                </h4>
                                <div style={{ fontSize: '16px', lineHeight: '1.7', color: '#475569', background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                                    {selectedInternship.description}
                                </div>
                            </section>

                            {selectedInternship.companyDescription && (
                                <section style={{ marginBottom: '32px' }}>
                                    <h4 style={{ fontSize: '14px', color: '#0f172a', fontWeight: 700, marginBottom: '12px' }}>About {selectedInternship.company}</h4>
                                    <div style={{ fontSize: '15px', lineHeight: '1.6', color: '#475569' }}>
                                        {selectedInternship.companyDescription}
                                    </div>
                                </section>
                            )}

                            {selectedInternship.requirements && (
                                <section>
                                    <h4 style={{ fontSize: '14px', color: '#0f172a', fontWeight: 700, marginBottom: '12px' }}>Key Requirements</h4>
                                    <div style={{ paddingLeft: '20px' }}>
                                        {selectedInternship.requirements.split('\n').map((req, i) => (
                                            <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '8px', fontSize: '15px', color: '#475569' }}>
                                                <span style={{ color: '#0ea5e9', fontWeight: 900 }}>•</span>
                                                <span>{req}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    )}
                </Modal>

            </div>
        </div>
    );
};

export default InternshipsPage;
