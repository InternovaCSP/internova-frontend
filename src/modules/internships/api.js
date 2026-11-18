import apiClient, { unwrapList } from '../../shared/api/client';

function normalizeInternship(item) {
  return {
    id: item.id,
    title: item.title,
    company: item.companyName || 'Unknown Company',
    companyDescription: item.companyDescription,
    status: item.status,
    description: item.description,
    location: item.location,
    duration: item.duration,
    requirements: item.requirements,
    deadline: item.createdAt,
    postedAt: item.createdAt,
    isPublished: item.isPublished,
  };
}

export const internshipsApi = {
  getAll: async () => {
    const { data } = await apiClient.get('/internships');
    return unwrapList(data).map(normalizeInternship);
  },
  getMine: async () => {
    const { data } = await apiClient.get('/internships/my/postings');
    return unwrapList(data).map(normalizeInternship);
  },
  create: async (payload) => {
    const { data } = await apiClient.post('/internships', payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await apiClient.put(`/internships/${id}`, payload);
    return data;
  },
  remove: async (id) => {
    await apiClient.delete(`/internships/${id}`);
  },
  apply: async (internshipId) => {
    const { data } = await apiClient.post('/applications/apply', { internshipId });
    return data;
  },
  getMyApplications: async () => {
    const { data } = await apiClient.get('/applications/student');
    return unwrapList(data);
  },
};
