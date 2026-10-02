import { apiRequest } from './apiClient';

export function normalizeUser(user) {
  if (!user) return null;
  const name = user.fullName || user.name || 'User';
  const avatar = user.profileImage || user.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop`;
  const title = user.jobTitle || user.title || (user.role === 'ROLE_EMPLOYER' ? 'Hiring Manager' : 'Software Professional');
  const location = user.location || 'Remote';
  const bio = user.bio || 'Passionate professional exploring career opportunities with intelligent matching.';
  const skills = Array.isArray(user.skills) ? user.skills : (user.skills ? Array.from(user.skills) : ['JavaScript', 'React', 'Java', 'Spring Boot', 'SQL']);

  return {
    ...user,
    fullName: name,
    name,
    avatar,
    profileImage: avatar,
    title,
    jobTitle: title,
    location,
    bio,
    skills,
  };
}

export const userService = {
  /**
   * Fetch current user profile from Spring Boot user-service (/api/users/profile)
   */
  async getProfile() {
    const token = localStorage.getItem('auth_token');
    const userEmail = localStorage.getItem('user_email');
    if (!token || !userEmail) {
      return null;
    }
    try {
      const res = await apiRequest('/api/users/profile', { method: 'GET' });
      return normalizeUser(res);
    } catch (e) {
      console.warn('Profile fetch note:', e.message);
      return null;
    }
  },

  /**
   * Update user profile information (/api/users/profile)
   */
  async updateProfile(profileData) {
    const res = await apiRequest('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return normalizeUser(res);
  },

  /**
   * Add a new skill to user profile
   */
  async addSkill(skill) {
    return apiRequest('/api/users/skills', {
      method: 'POST',
      body: JSON.stringify({ skill }),
    });
  },
};

