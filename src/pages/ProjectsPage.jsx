import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProjectsFilterBar from '../components/ProjectsFilterBar';
import ProjectCard from '../components/ProjectCard';
import { mockProjects } from '../data/mockProjects';

export default function ProjectsPage() {
    const { user } = useAuth();

    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    // Load mock data with fake delay
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setProjects(mockProjects);
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Handle actions (mock)
    const handleRequestJoin = (id) => {
        setProjects(prev => prev.map(project => {
            if (project.id === id) {
                return { ...project, currentUserStatus: 'Pending' };
            }
            return project;
        }));
    };

    // Derived state: Filtered & Sorted Data
    const filteredData = useMemo(() => {
        let result = [...projects];

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(item =>
                item.title.toLowerCase().includes(q) ||
                item.description.toLowerCase().includes(q) ||
                item.skills.some(skill => skill.toLowerCase().includes(q))
            );
        }

        if (categoryFilter) {
            result = result.filter(item => item.category === categoryFilter);
        }

        if (statusFilter) {
            result = result.filter(item => item.status === statusFilter);
        }

        result.sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.postedAt) - new Date(a.postedAt);
            if (sortBy === 'popular') {
                // Sort by fewest available slots relative to team size (highest fill rate)
                const aFill = (a.teamSize - a.availableSlots) / a.teamSize;
                const bFill = (b.teamSize - b.availableSlots) / b.teamSize;
                return bFill - aFill;
            }
            return 0;
        });

        return result;
    }, [projects, searchQuery, categoryFilter, statusFilter, sortBy]);

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
                        <Link to="/projects" className="lp-nav-link">Projects</Link>
                        <Link to="/competitions" className="lp-nav-link">Competitions</Link>
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
                    <div className="in-header-text">
                        <h1 className="in-h1">University Projects & Startups</h1>
                        <p className="in-body">Join research initiatives, innovation labs, and student startups to gain real-world experience.</p>
                    </div>
                    <div className="in-header-actions">
                        {(user?.role === 'Admin' || user?.role === 'Company') && (
                            <button className="in-btn in-btn-primary">
                                <Plus size={18} /> Create Project
                            </button>
                        )}
                    </div>
                </section>

                {/* Filters Bar */}
                <ProjectsFilterBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    categoryFilter={categoryFilter}
                    setCategoryFilter={setCategoryFilter}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                />

                {/* Main Content Area */}
                {isLoading ? (
                    <div className="in-grid">
                        {[1, 2, 3].map(n => (
                            <div key={n} className="in-card" style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
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
                            <span>Showing {filteredData.length} opportunities</span>
                        </div>

                        {filteredData.length === 0 ? (
                            <div className="in-empty-state">
                                <div className="in-empty-icon">📂</div>
                                <h3 className="in-empty-title">No projects found.</h3>
                                <p className="in-empty-desc">Adjust your filters or try a different search term.</p>
                            </div>
                        ) : (
                            <div className="in-grid">
                                {filteredData.map(project => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        onRequestJoin={handleRequestJoin}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}

            </div>
        </div>
    );
}
