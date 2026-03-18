import api from '../services/api';

/**
 * Fetches all applications for the current company's internships.
 * @returns {Promise<Array>} List of applications with student and internship info.
 */
export const fetchCompanyApplications = async () => {
    const response = await api.get('/applications/company');
    return response.data;
};

/**
 * Updates the status of an internship application.
 * @param {number} applicationId 
 * @param {string} status - One of Applied, Shortlisted, Interviewing, Selected, Rejected.
 * @returns {Promise<Object>} Success response.
 */
export const updateApplicationStatus = async (applicationId, status) => {
    const response = await api.patch(`/applications/${applicationId}/status`, { status });
    return response.data;
};

/**
 * Fetches the detailed profile of a student.
 * @param {number} studentId 
 * @returns {Promise<Object>} The student profile details.
 */
export const fetchStudentProfile = async (studentId) => {
    const response = await api.get(`/applications/student/${studentId}/profile`);
    return response.data;
};
