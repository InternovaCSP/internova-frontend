import React, { useEffect, useState } from 'react';
import KpiCard from './KpiCard';
import { fetchKpiStats } from '../../api/studentApi';

/**
 * KpiCardGrid Component
 * 
 * A responsive 4-column CSS grid that renders individual `KpiCard` elements.
 * Summarizes the user's top-level metrics: Applications, Interviews, Projects, and Competitions.
 * 
 * @returns {JSX.Element} The container grid with injected KPI cards.
 */
export default function KpiCardGrid() {
    const [stats, setStats] = useState({ Applications: '0', Interviews: '0' });

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await fetchKpiStats();
                setStats(data);
            } catch (err) {
                console.error("Failed to load KPI stats:", err);
            }
        };
        loadStats();
    }, []);

    return (
        <div className="dash-v2-kpi-grid">
            <KpiCard
                title="Applications Submitted"
                count={stats.Applications}
                iconName="Briefcase"
                trend="+0 this week"
                iconVariant="azure"
            />
            <KpiCard
                title="Interviews Scheduled"
                count={stats.Interviews}
                iconName="Calendar"
                trend="+0 this week"
                iconVariant="azure"
            />
            <KpiCard
                title="Projects Joined"
                count="2"
                iconName="BookOpen"
                iconVariant="teal"
            />
            <KpiCard
                title="Competitions Registered"
                count="2"
                iconName="Trophy"
                trend="1 active"
                iconVariant="teal"
            />
        </div>
    );
}
