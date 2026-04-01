import api from '../services/api';

const apiClient = api;

/**
 * Fetch all projects, optionally filtered by category.
 * @param {string} category - Optional category filter (e.g. 'Research').
 * @returns {Promise<Array>} List of projects.
 */
export const getProjects = async (category = '') => {
    let url = '/projects';
    if (category) {
        url += `?category=${encodeURIComponent(category)}`;
    }
    const response = await apiClient.get(url);
    return response.data;
};

/**
 * Create a new project.
 * @param {Object} projectData - Payload { Title, Description, Category }.
 * @returns {Promise<Object>} Created project response.
 */
export const createProject = async (projectData) => {
    const response = await apiClient.post('/projects', projectData);
    return response.data;
};

/**
 * Request to join a project.
 * @param {number} projectId - ID of the project to join.
 * @returns {Promise<Object>} Status message.
 */
export const joinProject = async (projectId) => {
    const response = await apiClient.post(`/projects/${projectId}/join`);
    return response.data;
};

/**
 * Get all project join requests for the current student.
 * @returns {Promise<Array>} List of requests.
 */
export const getMyRequests = async () => {
    const response = await apiClient.get('/projects/my-requests');
    return response.data;
};

export default apiClient;
