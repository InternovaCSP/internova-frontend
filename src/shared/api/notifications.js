import apiClient from './client';

export const notificationsApi = {
  getAll: async (page = 1, pageSize = 10) => {
    const { data } = await apiClient.get(`/notifications?page=${page}&pageSize=${pageSize}`);
    return data;
  },
  markAsRead: async (id) => {
    const { data } = await apiClient.put(`/notifications/${id}/read`);
    return data;
  },
  markAllAsRead: async () => {
    const { data } = await apiClient.put('/notifications/read-all');
    return data;
  },
};
