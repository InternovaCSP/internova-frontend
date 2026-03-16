import api from '../services/api';

/**
 * Fetches the internship pipeline statistics for the current student.
 * @returns {Promise<Object>} Object with counts for Applied, Shortlisted, Interviewing, Selected.
 */
export const fetchPipelineStats = async () => {
    const response = await api.get('/applications/pipeline-stats');
    return response.data;
};
