import { apiRequest } from './apiClient';
import { INITIAL_APPLICATIONS, INITIAL_CANDIDATES } from '../data/mockData';

export const applicationService = {
  /**
   * Fetch applications for current job seeker
   */
  async getApplications() {
    return apiRequest('/applications', { method: 'GET' }, INITIAL_APPLICATIONS);
  },

  /**
   * Submit application to a job
   */
  async applyToJob(job) {
    const newApplication = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      companyLogo: job.logo,
      appliedDate: 'Applied Just Now',
      status: 'Applied',
      matchScore: job.matchScore,
    };

    return apiRequest('/applications', {
      method: 'POST',
      body: JSON.stringify({ jobId: job.id }),
    }, newApplication);
  },

  /**
   * Fetch candidate list (Employer view)
   */
  async getCandidates() {
    return apiRequest('/candidates', { method: 'GET' }, INITIAL_CANDIDATES);
  },

  /**
   * Update candidate status or note (Employer view)
   */
  async updateCandidate(candidateId, updates) {
    return apiRequest(`/candidates/${candidateId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }, { success: true, candidateId, updates });
  },
};
