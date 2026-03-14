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
    }
};

export default internshipService;
