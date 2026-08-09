import { apiRequest } from './apiClient';

export const authService = {
  /**
   * User Sign In
   */
  async login(credentials) {
    const fallbackResponse = {
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        email: credentials.email || 'alex.johnson@example.com',
        name: credentials.email ? credentials.email.split('@')[0] : 'Alex Johnson',
        role: credentials.role || 'Job Seeker',
      },
    };

    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }, fallbackResponse);

    if (res.token) {
      localStorage.setItem('auth_token', res.token);
    }
    return res;
  },

  /**
   * User Registration
   */
  async register(userData) {
    const fallbackResponse = {
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        name: userData.fullName || 'New User',
        email: userData.email,
        role: userData.role || 'Job Seeker',
      },
    };

    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }, fallbackResponse);

    if (res.token) {
      localStorage.setItem('auth_token', res.token);
    }
    return res;
  },

  /**
   * User Logout
   */
  async logout() {
    localStorage.removeItem('auth_token');
    return apiRequest('/auth/logout', { method: 'POST' }, { success: true });
  },
};
