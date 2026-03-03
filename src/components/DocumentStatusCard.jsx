import React from 'react';
import { UploadCloud, CheckCircle } from 'lucide-react';

export default function DocumentStatusCard() {
    // Mock user status
    const isUploaded = true;
    const lastUpdated = "Oct 15, 2025";

    return (
        <div className="dash-card dash-doc-card">
            <div className="dash-doc-header">
                <h3 className="dash-section-title">Resume & Documents</h3>
                {isUploaded ? <CheckCircle className="dash-doc-success" size={20} /> : null}
            </div>

            <div className="dash-doc-status">
                <p className="dash-doc-text">
                    {isUploaded ? 'Resume is uploaded and active.' : 'No resume uploaded yet.'}
                </p>
                {isUploaded && (
                    <span className="dash-doc-date">Last updated: {lastUpdated}</span>
                )}
            </div>

            <button className={`dash-btn ${isUploaded ? 'outline' : 'primary'}`}>
                <UploadCloud size={16} />
                {isUploaded ? 'Update Resume' : 'Upload Resume'}
            </button>
        </div>
    );
}
