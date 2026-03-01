import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FiltersBar from '../components/FiltersBar';
import InternshipCard from '../components/InternshipCard';
import { initialMockInternships } from '../data/mockInternships';

const InternshipsPage = () => {
    const { user } = useAuth();

    const [internships, setInternships] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [durationFilter, setDurationFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    // Load mock data with fake delay
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setInternships(initialMockInternships);
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
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
            {/* ── Navbar ── */}
            <nav className="lp-nav lp-nav--scrolled" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
                <div className="lp-container">
                    <Link to="/" className="lp-nav-logo">
                        <img src="/logo-mono-long.png" alt="InterNova" />
                    </Link>
                    <div className="lp-nav-links">
                        <Link to="/internships" className="lp-nav-link">Internships</Link>
                        <a href="/#projects" className="lp-nav-link">Projects</a>
                        <a href="/#competitions" className="lp-nav-link">Competitions</a>
                    </div>
                    <div className="lp-nav-actions">
                        {user ? (
                            <Link to={`/${user.role.toLowerCase()}/dashboard`} className="lp-btn lp-btn--primary">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="lp-btn lp-btn--outline">Login</Link>
                                <Link to="/register" className="lp-btn lp-btn--primary">Register</Link>
                            </>
                        )}
                        <button className="lp-hamburger"><Menu size={24} /></button>
                    </div>
                </div>
            </nav>

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

            </div>
        </div>
    );
};

export default InternshipsPage;
