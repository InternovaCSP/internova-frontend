import api from './api';

/**
 * Service methods for handling Seminar Requests & Peer-Learning Voting.
 */
const seminarService = {
  /**
   * Fetches all seminar requests from the API.
   * @returns {Promise<Array>} List of seminar request objects.
   */
  getSeminars: async () => {
    const response = await api.get('/seminars');
    return response.data;
  },

  /**
   * Creates a new peer-learning seminar request.
   * Only accessible by authenticated Student users.
   * @param {Object} data - { topic, description }
   * @returns {Promise<Object>} The created seminar request.
   */
  createSeminar: async (data) => {
    const response = await api.post('/seminars', data);
    return response.data;
  },

  /**
   * Submits a vote for a specific seminar request.
   * Only accessible by authenticated Student users (one vote per request).
   * @param {number} id - Seminar request ID.
   * @returns {Promise<Object>} { message, voteCount }
   */
  voteSeminar: async (id) => {
    const response = await api.post(`/seminars/${id}/vote`);
    return response.data;
  },

  /**
   * Fetches a single seminar request by ID.
   * @param {number} id - Seminar request ID.
   * @returns {Promise<Object>} The request object.
   */
  getSeminarById: async (id) => {
    const response = await api.get(`/seminars/${id}`);
    return response.data;
  }
};

export default seminarService;
