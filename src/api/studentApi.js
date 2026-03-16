import api from '../services/api';

/**
 * Fetches the internship pipeline statistics for the current student.
 * @returns {Promise<Object>} Object with counts for Applied, Shortlisted, Interviewing, Selected.
 */
export const fetchPipelineStats = async () => {
    const response = await api.get('/applications/pipeline-stats');
    return response.data;
};

/**
 * Submits an internship application.
 * @param {number} internshipId 
 */
export const applyForInternship = async (internshipId) => {
    const response = await api.post('/applications/apply', { internshipId });
    return response.data;
};

/**
 * Fetches top-level KPI stats for the student dashboard.
 */
export const fetchKpiStats = async () => {
    const response = await api.get('/applications/kpi-stats');
    return response.data;
};

/**
 * Fetches all applications for the current student.
 */
export const fetchMyApplications = async () => {
    const response = await api.get('/applications/student');
    return response.data;
};
