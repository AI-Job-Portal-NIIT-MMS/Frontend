import { apiRequest } from './apiClient';

export const notificationService = {
  /**
   * Fetch current user's notifications (/api/notifications)
   */
  async getMyNotifications() {
    return apiRequest('/api/notifications', { method: 'GET' });
  },

  /**
   * Fetch unread notifications (/api/notifications/unread)
   */
  async getUnreadNotifications() {
    return apiRequest('/api/notifications/unread', { method: 'GET' });
  },

  /**
   * Mark a notification as read (/api/notifications/{id}/read)
   */
  async markAsRead(id) {
    return apiRequest(`/api/notifications/${id}/read`, { method: 'PATCH' });
  },

  /**
   * Mark all notifications as read (/api/notifications/read-all)
   */
  async markAllAsRead() {
    return apiRequest('/api/notifications/read-all', { method: 'PATCH' });
  },

  /**
   * Delete notification (/api/notifications/{id})
   */
  async deleteNotification(id) {
    return apiRequest(`/api/notifications/${id}`, { method: 'DELETE' });
  },
};
