import { apiRequest } from './apiClient';

export const adminService = {
  /**
   * Fetch all users across the platform (/api/users)
   */
  async getAllUsers() {
    return apiRequest('/api/users', { method: 'GET' });
  },

  /**
   * Suspend a user account (/api/users/{id}/suspend)
   */
  async suspendUser(userId) {
    return apiRequest(`/api/users/${userId}/suspend`, { method: 'PATCH' });
  },

  /**
   * Activate a user account (/api/users/{id}/activate)
   */
  async activateUser(userId) {
    return apiRequest(`/api/users/${userId}/activate`, { method: 'PATCH' });
  },

  /**
   * Delete a user account (/api/users/{id})
   */
  async deleteUser(userId) {
    return apiRequest(`/api/users/${userId}`, { method: 'DELETE' });
  },

  /**
   * Fetch all companies (/api/companies)
   */
  async getAllCompanies() {
    return apiRequest('/api/companies', { method: 'GET' });
  },

  /**
   * Verify a company (/api/companies/{id}/verify)
   */
  async verifyCompany(companyId) {
    return apiRequest(`/api/companies/${companyId}/verify`, { method: 'PATCH' });
  },

  /**
   * Deactivate a company (/api/companies/{id}/deactivate)
   */
  async deactivateCompany(companyId) {
    return apiRequest(`/api/companies/${companyId}/deactivate`, { method: 'PATCH' });
  },

  /**
   * Delete a company (/api/companies/{id})
   */
  async deleteCompany(companyId) {
    return apiRequest(`/api/companies/${companyId}`, { method: 'DELETE' });
  },

  /**
   * Fetch all jobs (Admin perspective) (/api/jobs/admin)
   */
  async getAllJobs() {
    return apiRequest('/api/jobs/admin', { method: 'GET' });
  },

  /**
   * Delete a job post (/api/jobs/{id})
   */
  async deleteJob(jobId) {
    return apiRequest(`/api/jobs/${jobId}`, { method: 'DELETE' });
  },

  /**
   * Fetch all applications (/api/applications)
   */
  async getAllApplications() {
    return apiRequest('/api/applications', { method: 'GET' });
  },
};
