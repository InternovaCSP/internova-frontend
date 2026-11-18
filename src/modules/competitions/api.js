import apiClient, { unwrapList } from '../../shared/api/client';

export const competitionsApi = {
  getAll: async () => {
    const { data } = await apiClient.get('/competitions');
    return unwrapList(data);
  },
  getById: async (id) => {
    const { data } = await apiClient.get(`/competitions/${id}`);
    return data;
  },
  create: async (payload) => {
    const { data } = await apiClient.post('/competitions', payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await apiClient.put(`/competitions/${id}`, payload);
    return data;
  },
  remove: async (id) => {
    await apiClient.delete(`/competitions/${id}`);
  },
};
