/**
 * Base API Client Configuration directly targeting Spring Boot Microservices
 */

const MICROSERVICE_URLS = {
  auth: import.meta.env.VITE_USER_SERVICE_URL || 'https://user-service-production-8266.up.railway.app',
  user: import.meta.env.VITE_USER_SERVICE_URL || 'https://user-service-production-8266.up.railway.app',
  users: import.meta.env.VITE_USER_SERVICE_URL || 'https://user-service-production-8266.up.railway.app',
  companies: import.meta.env.VITE_COMPANY_SERVICE_URL || 'https://company-service-production-9078.up.railway.app',
  jobs: import.meta.env.VITE_JOB_SERVICE_URL || 'https://job-service-production-03a8.up.railway.app',
  'job-categories': import.meta.env.VITE_JOB_SERVICE_URL || 'https://job-service-production-03a8.up.railway.app',
  'job-skills': import.meta.env.VITE_JOB_SERVICE_URL || 'https://job-service-production-03a8.up.railway.app',
  resumes: import.meta.env.VITE_RESUME_SERVICE_URL || 'https://application-service-production-6d6e.up.railway.app',
  applications: import.meta.env.VITE_APPLICATION_SERVICE_URL || 'https://application-service-production-6d6e.up.railway.app',
  candidates: import.meta.env.VITE_APPLICATION_SERVICE_URL || 'https://application-service-production-6d6e.up.railway.app',
  interviews: import.meta.env.VITE_INTERVIEW_SERVICE_URL || 'https://application-service-production-6d6e.up.railway.app',
  notifications: import.meta.env.VITE_NOTIFICATION_SERVICE_URL || 'https://application-service-production-6d6e.up.railway.app',
};

/**
 * Resolve target Spring Boot microservice base URL according to endpoint prefix
 */
function getBaseUrlForEndpoint(endpoint) {
  const cleanEndpoint = endpoint.replace(/^\/api\//, '').replace(/^\//, '');
  const firstSegment = cleanEndpoint.split('/')[0];
  return MICROSERVICE_URLS[firstSegment] || import.meta.env.VITE_USER_SERVICE_URL || 'https://user-service-production-8266.up.railway.app';
}

/**
 * Core request wrapper connecting directly to Spring Boot backend microservices
 * @param {string} endpoint - API relative path (e.g. '/api/jobs')
 * @param {object} options - Fetch options (method, body, headers, etc.)
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('auth_token');
  const userEmail = localStorage.getItem('user_email');
  const userId = localStorage.getItem('user_id');

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(userEmail ? { 'X-User-Email': userEmail } : {}),
    ...(userId ? { 'X-User-Id': userId } : {}),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const baseUrl = getBaseUrlForEndpoint(endpoint);
  const fullUrl = `${baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

  const response = await fetch(fullUrl, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    let errMsg = errorData.message || errorData.error;

    if (endpoint.includes('/auth/signup')) {
      if (response.status === 500 || (errMsg && errMsg.toLowerCase().includes('already exists'))) {
        errMsg = 'This email address is already registered. Please log in or use a different email.';
      } else if (response.status === 400) {
        errMsg = errorData.message || 'Please make sure all fields are valid.';
      }
    } else if (endpoint.includes('/auth/login')) {
      if (response.status === 401 || response.status === 500 || response.status === 400) {
        errMsg = errorData.message || 'Invalid email or password. Please check your credentials.';
      }
    }

    throw new Error(errMsg || `Spring Boot Service at ${fullUrl} responded with status ${response.status}`);
  }

  return await response.json();
}

export { MICROSERVICE_URLS };
