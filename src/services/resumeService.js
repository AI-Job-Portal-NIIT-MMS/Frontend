import { apiRequest } from './apiClient';

export const resumeService = {
  /**
   * Fetch current user's resumes (/api/resumes/my)
   */
  async getMyResumes() {
    return apiRequest('/api/resumes/my', { method: 'GET' });
  },

  /**
   * Fetch single resume by ID (/api/resumes/{id})
   */
  async getResumeById(resumeId) {
    return apiRequest(`/api/resumes/${resumeId}`, { method: 'GET' });
  },

  /**
   * Create a new resume (/api/resumes)
   */
  async createResume(resumeData) {
    return apiRequest('/api/resumes', {
      method: 'POST',
      body: JSON.stringify({
        title: resumeData.title || 'My Professional Resume',
        template: resumeData.template || 'MODERN',
        visibility: resumeData.visibility || 'PUBLIC',
        isDefault: resumeData.isDefault ?? true,
      }),
    });
  },

  /**
   * Upload CV/Resume file (PDF, DOCX, TXT) and trigger text extraction & AI parsing
   * (/api/resumes/upload)
   */
  async uploadCv(file) {
    const formData = new FormData();
    formData.append('file', file);
    return apiRequest('/api/resumes/upload', {
      method: 'POST',
      body: formData,
    });
  },

  /**
   * Save verified/edited skills and summary after CV analysis
   * (/api/resumes/{resumeId}/enrich-skills)
   */
  async enrichSkills(resumeId, { skills, summary }) {
    return apiRequest(`/api/resumes/${resumeId}/enrich-skills`, {
      method: 'PUT',
      body: JSON.stringify({ skills, summary }),
    });
  },

  /**
   * Update resume personal info (/api/resumes/{id}/personal-info)
   */
  async updatePersonalInfo(resumeId, personalInfo) {
    return apiRequest(`/api/resumes/${resumeId}/personal-info`, {
      method: 'PUT',
      body: JSON.stringify(personalInfo),
    });
  },

  /**
   * Update resume summary (/api/resumes/{id}/summary)
   */
  async updateSummary(resumeId, summary) {
    return apiRequest(`/api/resumes/${resumeId}/summary?summary=${encodeURIComponent(summary)}`, {
      method: 'PATCH',
    });
  },

  /**
   * Set resume as default (/api/resumes/{id}/set-default)
   */
  async setDefaultResume(resumeId) {
    return apiRequest(`/api/resumes/${resumeId}/set-default`, {
      method: 'PATCH',
    });
  },

  /**
   * Delete resume (/api/resumes/{id})
   */
  async deleteResume(resumeId) {
    return apiRequest(`/api/resumes/${resumeId}`, {
      method: 'DELETE',
    });
  },
};
