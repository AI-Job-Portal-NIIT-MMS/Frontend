import { apiRequest, simulateNetworkDelay } from './apiClient';
import { INITIAL_JOBS } from '../data/mockData';

export const jobService = {
  /**
   * Fetch all jobs
   */
  async getJobs() {
    return apiRequest('/jobs', { method: 'GET' }, INITIAL_JOBS);
  },

  /**
   * Fetch single job details by ID
   */
  async getJobById(jobId) {
    const fallback = INITIAL_JOBS.find((j) => j.id === jobId) || null;
    return apiRequest(`/jobs/${jobId}`, { method: 'GET' }, fallback);
  },

  /**
   * Post a new job
   */
  async createJob(jobData) {
    const newJobFallback = {
      id: `job-${Date.now()}`,
      title: jobData.title || 'Untitled Role',
      company: jobData.company || 'AI Power Tech',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop&crop=faces',
      location: jobData.location || 'Remote',
      type: jobData.type || 'Full-time',
      salary: jobData.salary || '$120k – $150k',
      matchScore: Math.floor(Math.random() * 10) + 90,
      category: jobData.category || 'Technology',
      description: jobData.description || 'No description provided.',
      requirements: jobData.requirements || ['Requirements to be specified.'],
      skills: jobData.skills || ['React', 'TypeScript'],
      experience: jobData.experience || '2+ years',
      postedDate: 'Just now',
      saved: false,
      applied: false,
    };

    return apiRequest('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    }, newJobFallback);
  },

  /**
   * Toggle save status for a job
   */
  async toggleSaveJob(jobId, currentSavedState) {
    return apiRequest(`/jobs/${jobId}/save`, {
      method: 'PATCH',
      body: JSON.stringify({ saved: !currentSavedState }),
    }, { success: true, jobId, saved: !currentSavedState });
  },
};
