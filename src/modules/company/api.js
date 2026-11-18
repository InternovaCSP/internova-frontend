import apiClient, { unwrapList } from '../../shared/api/client';

export const companyApi = {
  getApplications: async () => {
    const { data } = await apiClient.get('/applications/company');
    return unwrapList(data);
  },
  updateApplicationStatus: async (applicationId, status) => {
    const { data } = await apiClient.patch(`/applications/${applicationId}/status`, { status });
    return data;
  },
  getStudentProfile: async (studentId) => {
    const { data } = await apiClient.get(`/applications/student/${studentId}/profile`);
    return data;
  },
  scheduleInterview: async (payload) => {
    const { data } = await apiClient.post('/interviews/schedule', payload);
    return data;
  },
};
