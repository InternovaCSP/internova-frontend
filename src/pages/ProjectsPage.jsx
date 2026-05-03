import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProjectsFilterBar from '../components/ProjectsFilterBar';
import ProjectCard from '../components/ProjectCard';
import ProjectDetailModal from '../components/ProjectDetailModal';
import { getProjects, joinProject, getMyRequests, createProject } from '../api/projectApi';
import CreateProjectModal from '../components/CreateProjectModal';

/**
 * ProjectsPage Component
 * 
 * The directory page designed for viewing and joining collaborative University Projects.
 * Incorporates a customized `ProjectsFilterBar` to filter by active domain and 
 * visualizes opportunities using `ProjectCard` components.
 * 
 * @returns {JSX.Element} The main projects browsing interface.
 */
export default function ProjectsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedProject, setSelectedProject] = useState(null);

    // Load real data from backend
    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                const [projectsData, requestsData] = await Promise.all([
                    getProjects(),
                    user?.role === 'Student' ? getMyRequests() : Promise.resolve([])
                ]);

                // Map requests to projects to set current status
                const requests = Array.isArray(requestsData) ? requestsData : (requestsData?.$values || []);
                const requestMap = new Map(requests.map(r => [r.projectId, r.status]));

                const enhancedProjects = projectsData.map(p => ({
                    ...p,
                    // Map backend fields to frontend expectations if necessary
                    leaderName: p.creatorName || 'Unknown',
                    leaderId: p.creatorId,
                    skills: p.requiredSkills ? p.requiredSkills.split(',').map(s => s.trim()) : [],
                    availableSlots: p.availableSlots || 0,
                    teamSize: p.teamSize || 0,
                    duration: p.duration || 'Flexible',
                    currentUserStatus: requestMap.get(p.id) || null
                }));

                setProjects(enhancedProjects);
            } catch (error) {
                console.error('Failed to load projects:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllData();
    }, [user]);

    // Handle real join request
    const handleRequestJoin = async (id) => {
        if (!user || user.role !== 'Student') {
            alert("Please log in as a student to join a project.");
            return;
        }

        try {
            await joinProject(id);
            setProjects(prev => prev.map(project => {
                if (project.id === id) {
                    return { ...project, currentUserStatus: 'Pending' };
                }
                return project;
            }));
        } catch (error) {
            console.error('Failed to join project:', error);
            alert(error.response?.data?.error || "Failed to send request.");
        }
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

        if (categoryFilter.length > 0) {
            result = result.filter(item => categoryFilter.includes(item.category));
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


            <div className="in-container">

                {/* Header Section */}
                <section className="in-header-section">
                    <div className="in-header-text">
                        <h1 className="in-h1">University Projects & Startups</h1>
                        <p className="in-body">Join research initiatives, innovation labs, and student startups to gain real-world experience.</p>
                    </div>
                    <div className="in-header-actions">
                        {(user?.role === 'Admin' || user?.role === 'Company') && (
                            <button 
                                className="in-btn in-btn-primary"
                                onClick={() => setShowCreateModal(true)}
                            >
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
                        <div className="prj-grid-meta">
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
                                        onViewDetails={setSelectedProject}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Detail Modal */}
                {selectedProject && (
                    <ProjectDetailModal
                        project={selectedProject}
                        onClose={() => setSelectedProject(null)}
                        onRequestJoin={handleRequestJoin}
                    />
                )}

            </div>
            {/* Create Project Modal */}
            {showCreateModal && (
                <CreateProjectModal 
                    onClose={() => setShowCreateModal(false)}
                    onCreated={(newProject) => {
                        setProjects(prev => [newProject, ...prev]);
                    }}
                />
            )}
        </div>
    );
}
