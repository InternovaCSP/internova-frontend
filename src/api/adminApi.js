/**
 * api/adminApi.js
 * 
 * Specialized API client for Administrative operations.
 * Extends the base apiClient to handle company approvals and platform management.
 */
import apiClient from './authApi';

/**
 * Fetches the list of companies awaiting administrative approval.
 * @returns {Promise<Array>} List of pending companies.
 */
export const fetchPendingCompanies = async () => {
    const response = await apiClient.get('/api/admin/companies/pending');
    return response.data;
};

/**
 * Approves a company registration.
 * @param {string|number} companyId - ID of the company to approve.
 * @returns {Promise<Object>} Success response.
 */
export const approveCompany = async (companyId) => {
    // 1 corresponds to CompanyStatus.Active in the backend enum
    const response = await apiClient.patch(`/api/admin/companies/${companyId}/status`, { status: 1 });
    return response.data;
};
