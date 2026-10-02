import { apiRequest } from './apiClient';

export const companyService = {
  /**
   * Fetch current employer's company (/api/companies/my)
   */
  async getMyCompany() {
    return apiRequest('/api/companies/my', { method: 'GET' });
  },

  /**
   * Fetch company by ID (/api/companies/{id})
   */
  async getCompanyById(id) {
    return apiRequest(`/api/companies/${id}`, { method: 'GET' });
  },

  /**
   * Fetch all companies (/api/companies)
   */
  async getAllCompanies(params = {}) {
    const query = new URLSearchParams();
    if (params.companyType) query.append('companyType', params.companyType);
    if (params.industryType) query.append('industryType', params.industryType);
    if (params.status) query.append('status', params.status);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return apiRequest(`/api/companies${queryString}`, { method: 'GET' });
  },

  /**
   * Create a new company profile (/api/companies)
   */
  async createCompany(companyData) {
    return apiRequest('/api/companies', {
      method: 'POST',
      body: JSON.stringify(companyData),
    });
  },

  /**
   * Update company profile (/api/companies/{id})
   */
  async updateCompany(id, companyData) {
    return apiRequest(`/api/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(companyData),
    });
  },

  /**
   * Verify company (Admin operation) (/api/companies/{id}/verify)
   */
  async verifyCompany(id) {
    return apiRequest(`/api/companies/${id}/verify`, { method: 'PATCH' });
  },

  /**
   * Deactivate company (Admin operation) (/api/companies/{id}/deactivate)
   */
  async deactivateCompany(id) {
    return apiRequest(`/api/companies/${id}/deactivate`, { method: 'PATCH' });
  },

  /**
   * Delete company (/api/companies/{id})
   */
  async deleteCompany(id) {
    return apiRequest(`/api/companies/${id}`, { method: 'DELETE' });
  },
};
