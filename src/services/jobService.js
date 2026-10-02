import { apiRequest } from './apiClient';

export function normalizeJob(job) {
  if (!job) return null;
  const companyName = job.company?.name || (typeof job.company === 'string' ? job.company : 'Tech Company');
  const companyLogo = job.company?.logoUrl || job.logo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&fit=crop';
  const locationStr = [job.city, job.state, job.country].filter(Boolean).join(', ') || job.location || (job.workMode === 'REMOTE' ? 'Remote' : 'Location Not Specified');
  
  let formattedSalary = job.salary;
  if (!formattedSalary && (job.minSalary || job.maxSalary)) {
    const min = job.minSalary ? `$${Number(job.minSalary).toLocaleString()}` : '';
    const max = job.maxSalary ? `$${Number(job.maxSalary).toLocaleString()}` : '';
    formattedSalary = min && max ? `${min} - ${max}/yr` : (min ? `From ${min}/yr` : `Up to ${max}/yr`);
  } else if (!formattedSalary) {
    formattedSalary = 'Competitive';
  }

  const rawSkills = Array.isArray(job.skills) ? job.skills : (job.skills ? Array.from(job.skills) : []);
  const skillNames = rawSkills.map(s => typeof s === 'string' ? s : (s.skillName || s.name || '')).filter(Boolean);

  const rawTags = Array.isArray(job.tags) ? job.tags : (job.tags ? Array.from(job.tags) : []);
  const tagNames = rawTags.map(t => typeof t === 'string' ? t : (t.tagName || t.name || '')).filter(Boolean);

  const jobTypeStr = job.jobType ? job.jobType.replace(/_/g, ' ') : (job.type || 'Full Time');

  return {
    ...job,
    company: companyName,
    companyObj: job.company,
    logo: companyLogo,
    companyLogo: companyLogo,
    location: locationStr,
    salary: formattedSalary,
    type: jobTypeStr,
    skills: skillNames.length > 0 ? skillNames : tagNames,
    matchScore: job.aiScore || job.matchScore || Math.floor(85 + (Number(job.id || 1) % 12)),
    category: job.category?.name || job.category || 'Technology',
  };
}

export const jobService = {
  /**
   * Fetch all jobs from Spring Boot job-service
   */
  async getJobs() {
    const res = await apiRequest('/api/jobs', { method: 'GET' });
    const list = Array.isArray(res) ? res : (res?.content || []);
    return list.map(normalizeJob);
  },

  /**
   * Fetch single job details by ID
   */
  async getJobById(jobId) {
    const res = await apiRequest(`/api/jobs/${jobId}`, { method: 'GET' });
    return normalizeJob(res);
  },

  /**
   * Post a new job
   */
  async createJob(jobData) {
    const res = await apiRequest('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
    if (res && res.id) {
      try {
        await apiRequest(`/api/jobs/${res.id}/publish`, { method: 'PATCH' });
        res.status = 'OPEN';
        res.active = true;
      } catch (e) {
        console.warn('Auto-publish note:', e.message);
      }
    }
    return normalizeJob(res);
  },

  /**
   * Toggle save status for a job
   */
  async toggleSaveJob(jobId, currentSavedState) {
    return apiRequest(`/api/jobs/${jobId}/save`, {
      method: 'PATCH',
      body: JSON.stringify({ saved: !currentSavedState }),
    });
  },
};

