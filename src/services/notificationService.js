import api from './api';

const notificationService = {
  /**
   * Fetches paginated notifications for the current user.
   * @param {number} page 
   * @param {number} pageSize 
   */
  getNotifications: (page = 1, pageSize = 10) => 
    api.get(`/notifications?page=${page}&pageSize=${pageSize}`),

  /**
   * Marks a specific notification as read.
   * @param {number} id 
   */
  markAsRead: (id) => api.put(`/notifications/${id}/read`),

  /**
   * Marks all notifications as read for the current user.
   */
  markAllAsRead: () => api.put('/notifications/read-all')
};

export default notificationService;
