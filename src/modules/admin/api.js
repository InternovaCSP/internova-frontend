import apiClient, { unwrapList } from '../../shared/api/client';

export const adminApi = {
  getStats: async () => {
    const { data } = await apiClient.get('/admin/stats');
    return data;
  },
  getPendingCompanies: async () => {
    const { data } = await apiClient.get('/admin/companies/pending');
    return unwrapList(data);
  },
  getAllCompanies: async () => {
    const { data } = await apiClient.get('/admin/companies');
    return unwrapList(data);
  },
  approveCompany: async (companyId) => {
    const { data } = await apiClient.patch(`/admin/companies/${companyId}/status`, { status: 1 });
    return data;
  },
  getPendingInternships: async () => {
    const { data } = await apiClient.get('/admin/internships/pending');
    return unwrapList(data);
  },
  getCompanyInternships: async (companyId) => {
    const { data } = await apiClient.get(`/admin/companies/${companyId}/internships`);
    return unwrapList(data);
  },
  approveInternship: async (internshipId) => {
    const { data } = await apiClient.patch(`/admin/internships/${internshipId}/status`, { status: 'Active' });
    return data;
  },
};
