import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Import New Dashboard Components
import StudentSidebar from '../components/StudentSidebar';
import DashboardTopNav from '../components/DashboardTopNav';
import StatsCard from '../components/StatsCard';
import ApplicationPipeline from '../components/ApplicationPipeline';
import ActivityFeed from '../components/ActivityFeed';
import RecommendationCard from '../components/RecommendationCard';
import DocumentStatusCard from '../components/DocumentStatusCard';

export default function StudentDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading state to show skeletons/fade-in
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    function handleLogout() {
        logout();
        navigate('/login', { replace: true });
    }

    const recs = [
        { id: 1, title: 'Summer Software Engineering Intern', desc: 'TechCorp is looking for React developers.', link: '#' },
        { id: 2, title: 'AI Research Assistant', desc: 'Join the university Lab for Quantum AI.', link: '#' },
        { id: 3, title: 'Hackathon 2026', desc: 'Compete with 500+ students globally.', link: '#' }
    ];

    return (
        <div className="dash-layout">
            <StudentSidebar onLogout={handleLogout} />

            <div className="dash-main">
                <DashboardTopNav />

                <div className="dash-content">
                    {/* Welcome Header */}
                    <div className="dash-header">
                        <h1 className="dash-title">Welcome back, {user?.email?.split('@')[0] || 'Student'}</h1>
                        <p className="dash-subtitle">
                            Track your internship applications, project participation, and competition activities in one place.
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="dash-skeleton-grid">
                            {/* Stats Skeletons */}
                            <div className="dash-stats-row">
                                {[1, 2, 3, 4].map(n => <div key={n} className="in-skeleton dash-stat-card"></div>)}
                            </div>
                            {/* Main Body Skeleton */}
                            <div className="dash-grid-primary">
                                <div className="dash-col-left">
                                    <div className="in-skeleton dash-card" style={{ height: '200px' }}></div>
                                    <div className="in-skeleton dash-card" style={{ height: '300px' }}></div>
                                </div>
                                <div className="dash-col-right">
                                    <div className="in-skeleton dash-card" style={{ height: '150px' }}></div>
                                    <div className="in-skeleton dash-card" style={{ height: '300px' }}></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="dash-fade-in">
                            {/* Key Stats Row */}
                            <div className="dash-stats-row">
                                <StatsCard title="Applications Submitted" count="12" iconName="Briefcase" trend="+2 this week" />
                                <StatsCard title="Interviews Scheduled" count="1" iconName="Calendar" />
                                <StatsCard title="Projects Joined" count="3" iconName="BookOpen" />
                                <StatsCard title="Competitions Registered" count="2" iconName="Trophy" trend="1 active" />
                            </div>

                            {/* Main Content Grid */}
                            <div className="dash-grid-primary">
                                {/* Left Column: 2/3 width */}
                                <div className="dash-col-left">
                                    <ApplicationPipeline />

                                    <div className="dash-card">
                                        <h3 className="dash-section-title">Recommended for You</h3>
                                        <div className="dash-rec-grid">
                                            {recs.map(rec => (
                                                <RecommendationCard key={rec.id} title={rec.title} description={rec.desc} />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: 1/3 width */}
                                <div className="dash-col-right">
                                    <ActivityFeed />
                                    <DocumentStatusCard />
                                </div>
                            </div>

                            <div className="dash-security-note">
                                <p>Your data is securely encrypted and role-protected.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
