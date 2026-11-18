import apiClient from '../../shared/api/client';

export const accountApi = {
  getProfile: async () => {
    const { data } = await apiClient.get('/profile');
    return data;
  },
  updateProfile: async (formData) => {
    const { data } = await apiClient.put('/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
  updateStudentProfile: async (formData) => {
    const { data } = await apiClient.put('/student/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
  getSettings: async () => {
    const { data } = await apiClient.get('/settings');
    return data;
  },
  updateSettings: async (payload) => {
    const { data } = await apiClient.put('/settings', payload);
    return data;
  },
  changePassword: async (payload) => {
    const { data } = await apiClient.post('/auth/change-password', payload);
    return data;
  },
  deleteAccount: async () => {
    const { data } = await apiClient.delete('/auth/account');
    return data;
  },
};
