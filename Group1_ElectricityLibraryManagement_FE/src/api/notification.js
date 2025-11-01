import axiosClient from './axiosClient';

const notificationAPI = {
  /**
   * Get all notifications for a specific user
   * @param {number} userId - User ID
   * @param {number} page - Page number (default: 0)
   * @param {number} size - Page size (default: 10)
   * @returns {Promise} Paginated notifications
   */
  getUserNotifications: (userId, page = 0, size = 10) => {
    return axiosClient.get(`/api/v1/admin/notifications/user/${userId}`, {
      params: { page, size }
    });
  },

  /**
   * Get unread notifications count for a user
   * @param {number} userId - User ID
   * @returns {Promise} Unread count
   */
  getUnreadCount: (userId) => {
    return axiosClient.get(`/api/v1/admin/notifications/user/${userId}/unread-count`);
  },

  /**
   * Get unread notifications for a user
   * @param {number} userId - User ID
   * @param {number} page - Page number (default: 0)
   * @param {number} size - Page size (default: 10)
   * @returns {Promise} Unread notifications
   */
  getUnreadNotifications: (userId, page = 0, size = 10) => {
    return axiosClient.get(`/api/v1/admin/notifications/user/${userId}/unread`, {
      params: { page, size }
    });
  },

  /**
   * Mark a notification as read
   * @param {number} notificationId - Notification ID
   * @returns {Promise} Updated notification
   */
  markAsRead: (notificationId) => {
    return axiosClient.put(`/api/v1/admin/notifications/${notificationId}/read`);
  },

  /**
   * Mark all notifications as read for a user
   * @param {number} userId - User ID
   * @returns {Promise} Response
   */
  markAllAsRead: (userId) => {
    return axiosClient.put(`/api/v1/admin/notifications/user/${userId}/read-all`);
  },

  /**
   * Delete a notification
   * @param {number} notificationId - Notification ID
   * @returns {Promise} Response
   */
  deleteNotification: (notificationId) => {
    return axiosClient.delete(`/api/v1/admin/notifications/${notificationId}`);
  },

  /**
   * Delete all notifications for a user
   * @param {number} userId - User ID
   * @returns {Promise} Response
   */
  deleteAllNotifications: (userId) => {
    return axiosClient.delete(`/api/v1/admin/notifications/user/${userId}`);
  },

  /**
   * Get notifications by type
   * @param {number} userId - User ID
   * @param {string} type - Notification type (NEW_BOOK, NEW_EVENT, REMINDER, OVERDUE)
   * @param {number} page - Page number (default: 0)
   * @param {number} size - Page size (default: 10)
   * @returns {Promise} Filtered notifications
   */
  getNotificationsByType: (userId, type, page = 0, size = 10) => {
    return axiosClient.get(`/api/v1/admin/notifications/user/${userId}/type/${type}`, {
      params: { page, size }
    });
  },

  /**
   * Send a new book notification (Admin only)
   * @param {Object} data - Notification data
   * @returns {Promise} Response
   */
  sendNewBookNotification: (data) => {
    return axiosClient.post('/api/v1/admin/notifications/new-book', data);
  },

  /**
   * Send a new event notification (Admin only)
   * @param {Object} data - Notification data
   * @returns {Promise} Response
   */
  sendNewEventNotification: (data) => {
    return axiosClient.post('/api/v1/admin/notifications/new-event', data);
  }
};

export default notificationAPI;

