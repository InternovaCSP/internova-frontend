import React from 'react';
import KpiCard from './KpiCard';

/**
 * KpiCardGrid Component
 * 
 * A responsive 4-column CSS grid that renders individual `KpiCard` elements.
 * Summarizes the user's top-level metrics: Applications, Interviews, Projects, and Competitions.
 * 
 * @returns {JSX.Element} The container grid with injected KPI cards.
 */
export default function KpiCardGrid() {
    return (
        <div className="dash-v2-kpi-grid">
            <KpiCard
                title="Applications Submitted"
                count="12"
                iconName="Briefcase"
                trend="+2 this week"
                iconVariant="azure"
            />
            <KpiCard
                title="Interviews Scheduled"
                count="3"
                iconName="Calendar"
                trend="+1 this week"
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
