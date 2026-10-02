import { apiRequest } from './apiClient';

export const interviewService = {
  /**
   * Fetch scheduled interviews from Spring Boot backend (/api/interviews)
   */
  async getInterviews() {
    const token = localStorage.getItem('auth_token');
    if (!token) return [];
    try {
      const res = await apiRequest('/api/interviews', { method: 'GET' });
      return Array.isArray(res) ? res : [];
    } catch (e) {
      console.warn('Interviews unavailable, returning empty list:', e.message);
      return [];
    }
  },

  /**
   * Fetch candidate interviews (/api/interviews/candidate)
   */
  async getCandidateInterviews() {
    const token = localStorage.getItem('auth_token');
    const userId = localStorage.getItem('user_id');
    if (!token || !userId) return [];
    try {
      const res = await apiRequest('/api/interviews/candidate', { method: 'GET' });
      return Array.isArray(res) ? res : [];
    } catch (e) {
      console.warn('Candidate interviews unavailable, returning empty list:', e.message);
      return [];
    }
  },

  /**
   * Fetch employer interviews (/api/interviews/employer)
   */
  async getEmployerInterviews() {
    const token = localStorage.getItem('auth_token');
    const userId = localStorage.getItem('user_id');
    if (!token || !userId) return [];
    try {
      const res = await apiRequest('/api/interviews/employer', { method: 'GET' });
      return Array.isArray(res) ? res : [];
    } catch (e) {
      console.warn('Employer interviews unavailable, returning empty list:', e.message);
      return [];
    }
  },

  /**
   * Schedule a new interview session (/api/interviews)
   */
  async scheduleInterview(interviewData) {
    return apiRequest('/api/interviews', {
      method: 'POST',
      body: JSON.stringify(interviewData),
    });
  },

  /**
   * Cancel an interview (/api/interviews/{id})
   */
  async cancelInterview(interviewId) {
    return apiRequest(`/api/interviews/${interviewId}`, {
      method: 'DELETE',
    });
  },
};
