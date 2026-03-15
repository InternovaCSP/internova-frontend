/**
 * api/adminApi.js
 * 
 * Specialized API client for Administrative operations.
 * Extends the base apiClient to handle company approvals and platform management.
 */
import api from '../services/api';

const apiClient = api;


/**
 * Fetches the list of companies awaiting administrative approval.
 * @returns {Promise<Array>} List of pending companies.
 */
export const fetchPendingCompanies = async () => {
    const response = await apiClient.get('/admin/companies/pending');
    return response.data;
};

export const fetchAllCompanies = async () => {
    const response = await apiClient.get('/admin/companies');
    return response.data;
};

/**
 * Approves a company registration.
 * @param {string|number} companyId - ID of the company to approve.
 * @returns {Promise<Object>} Success response.
 */
export const approveCompany = async (companyId) => {
    // 1 corresponds to CompanyStatus.Active in the backend enum
    const response = await apiClient.patch(`/admin/companies/${companyId}/status`, { status: 1 });
    return response.data;
};

export const fetchPendingInternships = async () => {
    const response = await apiClient.get('/admin/internships/pending');
    return response.data;
};

/**
 * Fetches all internships for a specific company (for admin review).
 * @param {string|number} companyId 
 * @returns {Promise<Array>}
 */
export const fetchCompanyInternships = async (companyId) => {
    const response = await apiClient.get(`/admin/companies/${companyId}/internships`);
    return response.data;
};

/**
 * Approves an internship posting.
 * @param {string|number} internshipId - ID of the internship to approve.
 * @returns {Promise<Object>} Success response.
 */
export const approveInternship = async (internshipId) => {
    // We send the string "Active" since we've enabled string enums in the backend
    const response = await apiClient.patch(`/admin/internships/${internshipId}/status`, { status: "Active" });
    return response.data;
};
