import { apiRequest } from './apiClient';
import { INITIAL_INTERVIEWS } from '../data/mockData';

export const interviewService = {
  /**
   * Fetch all scheduled interviews
   */
  async getInterviews() {
    return apiRequest('/interviews', { method: 'GET' }, INITIAL_INTERVIEWS);
  },

  /**
   * Schedule a new interview session
   */
  async scheduleInterview(interviewData) {
    const newInterview = {
      id: `interview-${Date.now()}`,
      jobTitle: interviewData.jobTitle || 'Technical Interview',
      company: interviewData.company || 'AI Power Tech',
      date: interviewData.date || 'Tomorrow at 10:00 AM',
      interviewer: interviewData.interviewer || 'Hiring Manager',
      status: 'Confirmed',
    };

    return apiRequest('/interviews', {
      method: 'POST',
      body: JSON.stringify(interviewData),
    }, newInterview);
  },
};
