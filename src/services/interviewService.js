import api from './api';

export const interviewService = {
    schedule: (data) => api.post('/interviews/schedule', data),
    getStudentInterviews: () => api.get('/interviews/student'),
    getCompanyInterviews: () => api.get('/interviews/company'),
};

export default interviewService;
