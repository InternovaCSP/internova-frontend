import apiClient, { unwrapList } from '../../shared/api/client';

export const projectsApi = {
  getAll: async (category = '') => {
    const url = category ? `/projects?category=${encodeURIComponent(category)}` : '/projects';
    const { data } = await apiClient.get(url);
    return unwrapList(data);
  },
  create: async (payload) => {
    const { data } = await apiClient.post('/projects', payload);
    return data;
  },
  join: async (projectId) => {
    const { data } = await apiClient.post(`/projects/${projectId}/join`);
    return data;
  },
  getMyRequests: async () => {
    const { data } = await apiClient.get('/projects/my-requests');
    return unwrapList(data);
  },
  remove: async (projectId) => {
    const { data } = await apiClient.delete(`/projects/${projectId}`);
    return data;
  },
};
