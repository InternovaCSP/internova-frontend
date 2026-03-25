import React from 'react';

export default function RecommendationCard({ title, description, link }) {
    return (
        <div className="dash-rec-card">
            <div className="dash-rec-content">
                <h4 className="dash-rec-title">{title}</h4>
                <p className="dash-rec-desc">{description}</p>
            </div>
            <button className="dash-rec-btn">View Details</button>
        </div>
    );
}
