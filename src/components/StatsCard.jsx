import React from 'react';
import { Briefcase, Calendar, BookOpen, Trophy } from 'lucide-react';

const iconMap = {
    Briefcase: <Briefcase size={24} color="var(--lp-blue)" />,
    Calendar: <Calendar size={24} color="var(--lp-blue)" />,
    BookOpen: <BookOpen size={24} color="var(--lp-blue)" />,
    Trophy: <Trophy size={24} color="var(--lp-blue)" />
};

export default function StatsCard({ title, count, iconName, trend }) {
    return (
        <div className="dash-stat-card">
            <div className="dash-stat-header">
                <span className="dash-stat-title">{title}</span>
                <div className="dash-stat-icon-wrap">
                    {iconMap[iconName]}
                </div>
            </div>
            <div className="dash-stat-body">
                <h3 className="dash-stat-count">{count}</h3>
                {trend && (
                    <span className="dash-stat-trend">
                        {trend}
                    </span>
                )}
            </div>
        </div>
    );
}
