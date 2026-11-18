import apiClient, { unwrapList } from '../../shared/api/client';

export const seminarsApi = {
  getAll: async () => {
    const { data } = await apiClient.get('/seminars');
    return unwrapList(data);
  },
  getById: async (id) => {
    const { data } = await apiClient.get(`/seminars/${id}`);
    return data;
  },
  create: async (payload) => {
    const { data } = await apiClient.post('/seminars', payload);
    return data;
  },
  vote: async (id) => {
    const { data } = await apiClient.post(`/seminars/${id}/vote`);
    return data;
  },
};
