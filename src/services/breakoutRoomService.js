import api from './api';

/**
 * Service to handle student-led Breakout Room API calls.
 */
export const breakoutRoomService = {
    /**
     * Schedules a new breakout room and generates a Google Meet link.
     * @param {Object} data { title, description, scheduledAt, awardSkills }
     * @returns {Promise}
     */
    create: (data) => api.post('/breakout-rooms', data),

    /**
     * Fetches all active breakout rooms for the current student.
     * @returns {Promise}
     */
    getActive: () => api.get('/breakout-rooms/active'),

    /**
     * Marks a breakout room as completed.
     * @param {number} id
     * @returns {Promise}
     */
    complete: (id) => api.post(`/breakout-rooms/${id}/complete`)
};

export default breakoutRoomService;
