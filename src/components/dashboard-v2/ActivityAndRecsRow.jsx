import React from 'react';
import ActivityTimeline from './ActivityTimeline';
import RecommendationsPanel from './RecommendationsPanel';

/**
 * ActivityAndRecsRow Component
 * 
 * A dual-column layout tailored for the student dashboard.
 * Left Side: Displays a chronological feed of user activity (ActivityTimeline).
 * Right Side: Displays intelligent opportunity suggestions (RecommendationsPanel).
 * 
 * @returns {JSX.Element} The composed row of activity and recommendations.
 */
export default function ActivityAndRecsRow() {
    return (
        <div className="dash-v2-activity-row">
            <ActivityTimeline />
            <RecommendationsPanel />
        </div>
    );
}
