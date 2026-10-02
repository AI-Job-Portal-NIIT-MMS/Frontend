import { apiRequest } from './apiClient';

export const authService = {
  /**
   * User Sign In (Spring Boot AuthController -> /api/auth/login)
   */
  async login(credentials) {
    const res = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const token = res.jwt || res.jwtToken || res.token;
    if (token) {
      localStorage.setItem('auth_token', token);
    }
    if (res.user) {
      if (res.user.id) localStorage.setItem('user_id', res.user.id);
      if (res.user.email) localStorage.setItem('user_email', res.user.email);
      if (res.user.role) localStorage.setItem('user_role', res.user.role);
    }
    return res;
  },

  async register(userData) {
    let role = 'ROLE_JOB_SEEKER';
    if (userData.role === 'Employer' || userData.role === 'ROLE_EMPLOYER' || userData.role === 'HR Manager') {
      role = 'ROLE_EMPLOYER';
    } else if (userData.role === 'Admin' || userData.role === 'ROLE_ADMIN') {
      role = 'ROLE_ADMIN';
    }

    const signupPayload = {
      fullName: (userData.fullName || userData.name || 'New User').trim(),
      email: (userData.email || '').trim().toLowerCase(),
      password: userData.password,
      role: role,
      phone: userData.phone || ''
    };

    const res = await apiRequest('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(signupPayload),
    });

    const token = res.jwt || res.jwtToken || res.token;
    if (token) {
      localStorage.setItem('auth_token', token);
    }
    if (res.user) {
      if (res.user.id) localStorage.setItem('user_id', res.user.id);
      if (res.user.email) localStorage.setItem('user_email', res.user.email);
      if (res.user.role) localStorage.setItem('user_role', res.user.role);
    }
    return res;
  },

  /**
   * User Logout
   */
  async logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    return { success: true };
  },
};
