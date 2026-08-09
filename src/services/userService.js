import { apiRequest } from './apiClient';
import { USER_PROFILE } from '../data/mockData';

export const userService = {
  /**
   * Fetch current user profile
   */
  async getProfile() {
    return apiRequest('/user/profile', { method: 'GET' }, USER_PROFILE);
  },

  /**
   * Update user profile information
   */
  async updateProfile(profileData) {
    return apiRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }, { ...USER_PROFILE, ...profileData });
  },

  /**
   * Add a new skill to user profile
   */
  async addSkill(skill) {
    const updatedSkills = [...(USER_PROFILE.skills || []), skill];
    return apiRequest('/user/skills', {
      method: 'POST',
      body: JSON.stringify({ skill }),
    }, { success: true, skills: updatedSkills });
  },
};
