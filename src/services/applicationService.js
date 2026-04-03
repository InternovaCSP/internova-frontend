import api from './api';

export const applicationService = {
    getCompanyApplications: () => api.get('/applications/company'),
    updateStatus: (id, status) => api.patch(`/applications/${id}/status`, { status }),
    getStudentApplications: () => api.get('/applications/student'),
    getPipelineStats: () => api.get('/applications/pipeline-stats'),
};

export default applicationService;
