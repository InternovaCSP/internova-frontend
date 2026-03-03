import React from 'react';
import PipelineCard from './PipelineCard';
import InterviewsCard from './InterviewsCard';

/**
 * AnalyticsRow Component
 * 
 * Renders a split-view analytics section for the dashboard.
 * Contains the visual Application Pipeline stages and the upcoming Interviews schedule.
 * 
 * @returns {JSX.Element} The composed analytics row component.
 */
export default function AnalyticsRow() {
    return (
        <div className="dash-v2-analytics-row">
            <PipelineCard />
            <InterviewsCard />
        </div>
    );
}
