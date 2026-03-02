import React from 'react';
import PipelineCard from './PipelineCard';
import InterviewsCard from './InterviewsCard';

export default function AnalyticsRow() {
    return (
        <div className="dash-v2-analytics-row">
            <PipelineCard />
            <InterviewsCard />
        </div>
    );
}
