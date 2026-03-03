import React from 'react';
import * as LucideIcons from 'lucide-react';

/**
 * KpiCard Component
 * 
 * A reusable individual metric card intended for the top of the dashboard.
 * 
 * @param {Object} props
 * @param {string} props.title - The title of the metric (e.g., "Applications Submitted").
 * @param {string|number} props.count - The primary numerical value describing the metric.
 * @param {string} props.iconName - The string name matching a valid Lucide-react icon component.
 * @param {string} [props.trend] - Positive or negative text indicator (e.g., "+2 this week").
 * @param {string} [props.iconVariant='azure'] - Dictates the CSS color mapping of the icon badge.
 * @returns {JSX.Element} The individual styled metric box.
 */
export default function KpiCard({ title, count, iconName, trend, iconVariant = 'azure' }) {
    // Dynamically get the Lucide icon based on string name
    const IconComponent = LucideIcons[iconName];

    // Determine color classes for icon and trend chip
    const iconClass = iconVariant === 'teal' ? 'dash-v2-kpi-icon-teal' : 'dash-v2-kpi-icon-azure';
    const trendClass = trend?.includes('active') ? 'dash-v2-kpi-trend-active' : 'dash-v2-kpi-trend-positive';

    return (
        <div className="dash-v2-card dash-v2-card-interactive dash-v2-kpi-card">
            <div className="dash-v2-kpi-header">
                <div className={`dash-v2-kpi-icon-wrap ${iconClass}`}>
                    {IconComponent && <IconComponent size={24} />}
                </div>
                {trend && (
                    <span className={`dash-v2-kpi-trend ${trendClass}`}>
                        {trend}
                    </span>
                )}
            </div>

            <div>
                <div className="dash-v2-kpi-value">{count}</div>
                <div className="dash-v2-kpi-label">{title}</div>
            </div>
        </div>
    );
}
