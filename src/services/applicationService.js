import { apiRequest } from './apiClient';

export function normalizeApplication(app) {
  if (!app) return null;
  const companyName = app.company?.name || app.job?.company?.name || (typeof app.company === 'string' ? app.company : 'Company');
  const companyLogo = app.company?.logoUrl || app.job?.company?.logoUrl || app.companyLogo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&fit=crop';
  const jobTitle = app.job?.title || app.jobTitle || 'Application';
  const appliedDate = app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : (app.appliedDate || 'Recently');
  
  let formattedSalary = app.expectedSalary ? `$${Number(app.expectedSalary).toLocaleString()}` : app.salary;
  if (!formattedSalary && app.job) {
    if (app.job.minSalary && app.job.maxSalary) {
      formattedSalary = `$${Number(app.job.minSalary).toLocaleString()} - $${Number(app.job.maxSalary).toLocaleString()}`;
    }
  }

  const candidateName = app.candidate?.fullName || app.candidateName || app.name || 'Candidate';
  const candidateEmail = app.candidate?.email || app.email || '';
  const candidateTitle = app.candidate?.jobTitle || app.candidateTitle || app.title || 'Applicant';

  return {
    ...app,
    jobTitle,
    company: companyName,
    companyLogo,
    appliedDate,
    salary: formattedSalary || 'Competitive',
    status: app.status || 'PENDING',
    name: candidateName,
    candidateName,
    email: candidateEmail,
    title: candidateTitle,
    aiMatchScore: app.aiScore || app.matchScore || 88,
  };
}

export const applicationService = {
  /**
   * Fetch applications for current candidate (Spring Boot application-service -> /api/applications/my)
   */
  async getApplications() {
    const token = localStorage.getItem('auth_token');
    const userId = localStorage.getItem('user_id');
    if (!token || !userId) {
      return [];
    }
    try {
      const res = await apiRequest('/api/applications/my', { method: 'GET' });
      const list = Array.isArray(res) ? res : (res?.content || []);
      return list.map(normalizeApplication);
    } catch (e) {
      console.warn('Applications fetch warning:', e.message);
      return [];
    }
  },

  /**
   * Submit application to a job (Spring Boot application-service -> /api/applications)
   */
  async applyToJob(job) {
    const res = await apiRequest('/api/applications', {
      method: 'POST',
      body: JSON.stringify({ 
        jobId: job.id,
        employerId: job.employerId || job.company?.id || job.companyObj?.id
      }),
    });
    return normalizeApplication(res);
  },

  /**
   * Fetch applications / candidate list for employer (Spring Boot application-service -> /api/applications/company)
   */
  async getCandidates() {
    const token = localStorage.getItem('auth_token');
    const userId = localStorage.getItem('user_id');
    const userRole = localStorage.getItem('user_role');
    if (!token || !userId) {
      return [];
    }
    // Candidates are only relevant for employers/HR managers with a company profile
    if (userRole && userRole !== 'ROLE_EMPLOYER' && userRole !== 'Employer' && userRole !== 'HR Manager') {
      return [];
    }
    try {
      const res = await apiRequest('/api/applications/company', { method: 'GET' });
      const list = Array.isArray(res) ? res : (res?.content || []);
      return list.map(normalizeApplication);
    } catch (e) {
      return [];
    }
  },

  /**
   * Update candidate / application status (Spring Boot application-service -> /api/applications/{id}/status)
   */
  async updateCandidate(candidateId, updates) {
    return apiRequest(`/api/applications/${candidateId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },
};

