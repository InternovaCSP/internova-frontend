import React from 'react';
import ActivityTimeline from './ActivityTimeline';
import RecommendationsPanel from './RecommendationsPanel';

export default function ActivityAndRecsRow() {
    return (
        <div className="dash-v2-activity-row">
            <ActivityTimeline />
            <RecommendationsPanel />
        </div>
    );
}
