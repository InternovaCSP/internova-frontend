import React, { useState, useEffect } from 'react';

// Import V2 Dashboard Components
import DashboardWelcomeRow from '../components/dashboard-v2/DashboardWelcomeRow';
import KpiCardGrid from '../components/dashboard-v2/KpiCardGrid';
import AnalyticsRow from '../components/dashboard-v2/AnalyticsRow';
import ActivityAndRecsRow from '../components/dashboard-v2/ActivityAndRecsRow';

/**
 * StudentDashboard Component (V2)
 * 
 * The primary authenticated view for Student users.
 * Composes the Dashboard V2 layout using modular rows (Welcome, KPI Grid, Analytics, and Activity).
 * Implements a brief artificial loading delay on mount to demonstrate skeleton loaders
 * and simulate fetching complex dashboard metrics.
 * 
 * @returns {JSX.Element} The composed dashboard grid layout.
 */
export default function StudentDashboard() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate a fast API load to ensure skeletons flash nicely on entry
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="dash-v2-layout">
            <div className="dash-v2-container">
                {isLoading ? (
                    <div className="dash-v2-skeleton-grid" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        {/* Welcome Skeleton */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className="in-skeleton" style={{ width: '400px', height: '60px', borderRadius: '8px' }}></div>
                            <div className="in-skeleton" style={{ width: '340px', height: '120px', borderRadius: '16px' }}></div>
                        </div>

                        {/* KPI Grid Skeleton */}
                        <div className="dash-v2-kpi-grid">
                            {[1, 2, 3, 4].map(n => <div key={n} className="in-skeleton dash-v2-card" style={{ height: '140px' }}></div>)}
                        </div>

                        {/* Main Body Skeleton */}
                        <div className="dash-v2-analytics-row">
                            <div className="in-skeleton dash-v2-card" style={{ height: '300px' }}></div>
                            <div className="in-skeleton dash-v2-card" style={{ height: '300px' }}></div>
                        </div>
                    </div>
                ) : (
                    <div className="dash-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <DashboardWelcomeRow />
                        <KpiCardGrid />
                        <AnalyticsRow />
                        <ActivityAndRecsRow />

                        <div style={{ textAlign: 'center', fontSize: '13px', color: '#94a3b8', marginTop: '16px' }}>
                            Your data is securely encrypted and role-protected via <span style={{ fontWeight: 600 }}>Azure</span>.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
