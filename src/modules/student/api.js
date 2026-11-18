import apiClient, { unwrapList } from '../../shared/api/client';

export const studentApi = {
  getPipelineStats: async () => {
    const { data } = await apiClient.get('/applications/pipeline-stats');
    return data;
  },
  getKpiStats: async () => {
    const { data } = await apiClient.get('/applications/kpi-stats');
    return data;
  },
  getInterviews: async () => {
    const { data } = await apiClient.get('/interviews/student');
    return unwrapList(data);
  },
  getActiveRooms: async () => {
    const { data } = await apiClient.get('/breakout-rooms/active');
    return unwrapList(data);
  },
  createRoom: async (payload) => {
    const { data } = await apiClient.post('/breakout-rooms', payload);
    return data;
  },
  completeRoom: async (id) => {
    const { data } = await apiClient.post(`/breakout-rooms/${id}/complete`);
    return data;
  },
};
