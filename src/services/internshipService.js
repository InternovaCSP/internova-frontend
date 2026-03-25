import api from './api';

/**
 * Internship Service
 * 
 * Handles API calls related to internships.
 */
const internshipService = {
    /**
     * Fetches all published internships from the database.
     * @returns {Promise<Array>} List of internships.
     */
    getAllInternships: async () => {
        try {
            const { data } = await api.get('/internships');
            // Normalize data if necessary (e.g., mapping backend field names to frontend expected names)
            return data.map(item => ({
                id: item.id,
                title: item.title,
                company: item.companyName || 'Unknown Company',
                companyDescription: item.companyDescription,
                status: item.status,
                description: item.description,
                location: item.location,
                duration: item.duration,
                requirements: item.requirements,
                deadline: item.createdAt, // Fallback if deadline isn't in backend yet
                postedAt: item.createdAt,
                isPublished: item.isPublished
            })).filter(item => item.isPublished || true); // Showing all for now, but usually filter by isPublished
        } catch (error) {
            console.error('Error fetching internships:', error);
            throw error;
        }
    },

    /**
     * Fetches internships posted by the authenticated company.
     * @returns {Promise<Array>} List of company's internships.
     */
    getCompanyInternships: async () => {
        try {
            const { data } = await api.get('/internships/my/postings');
            return data.map(item => ({
                id: item.id,
                title: item.title,
                status: item.status,
                description: item.description,
                location: item.location,
                duration: item.duration,
                requirements: item.requirements,
                postedAt: item.createdAt,
                isPublished: item.isPublished
            }));
        } catch (error) {
            console.error('Error fetching company internships:', error);
            throw error;
        }
    },

    /**
     * Creates a new internship posting.
     * @param {Object} internshipData The internship details.
     * @returns {Promise<Object>} The created internship.
     */
    createInternship: async (internshipData) => {
        try {
            const { data } = await api.post('/internships', internshipData);
            return data;
        } catch (error) {
            if (error.response?.status !== 403) {
                console.error('Error creating internship:', error);
            }
            throw error;
        }
    },

    /**
     * Updates an existing internship posting.
     * @param {number} id The internship ID.
     * @param {Object} internshipData The updated details.
     * @returns {Promise<Object>} The updated internship.
     */
    updateInternship: async (id, internshipData) => {
        try {
            const { data } = await api.put(`/internships/${id}`, internshipData);
            return data;
        } catch (error) {
            console.error('Error updating internship:', error);
            throw error;
        }
    },

    /**
     * Deletes an internship posting.
     * @param {number} id The internship ID.
     * @returns {Promise<boolean>} Success status.
     */
    deleteInternship: async (id) => {
        try {
            await api.delete(`/internships/${id}`);
            return true;
        } catch (error) {
            console.error('Error deleting internship:', error);
            throw error;
        }
    }
};

export default internshipService;
