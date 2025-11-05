import { create } from 'zustand';
import notificationAPI from '../api/notification';
import webSocketService from '../services/webSocketService';
import { toast } from 'react-toastify';

/**
 * Notification type to icon and color mapping
 */
const notificationTypeConfig = {
  NEW_BOOK: {
    icon: 'BookFill',
    color: '#0d6efd',
    bgColor: 'rgba(13, 110, 253, 0.1)',
    label: 'New Book',
    priority: 'medium'
  },
  NEW_EVENT: {
    icon: 'CalendarEvent',
    color: '#6f42c1',
    bgColor: 'rgba(111, 66, 193, 0.1)',
    label: 'New Event',
    priority: 'medium'
  },
  REMINDER: {
    icon: 'Clock',
    color: '#ffc107',
    bgColor: 'rgba(255, 193, 7, 0.1)',
    label: 'Reminder',
    priority: 'high'
  },
  OVERDUE: {
    icon: 'ExclamationTriangle',
    color: '#dc3545',
    bgColor: 'rgba(220, 53, 69, 0.1)',
    label: 'Overdue',
    priority: 'high'
  }
};

/**
 * Zustand store for notification state management
 */
const useNotificationStore = create((set, get) => ({
  // State
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  isWebSocketConnected: false,

  // Actions
  /**
   * Set notifications list
   */
  setNotifications: (notifications) => {
    set({ notifications });
    // Update unread count
    const unreadCount = notifications.filter(n => !n.isRead).length;
    set({ unreadCount });
  },

  /**
   * Add a new notification
   */
  addNotification: (notification) => {
    set((state) => {
      const updated = [notification, ...state.notifications];
      const unreadCount = updated.filter(n => !n.isRead).length;
      return { notifications: updated, unreadCount };
    });
  },

  /**
   * Update a notification
   */
  updateNotification: (id, updates) => {
    set((state) => {
      const updated = state.notifications.map(n =>
        n.id === id ? { ...n, ...updates } : n
      );
      const unreadCount = updated.filter(n => !n.isRead).length;
      return { notifications: updated, unreadCount };
    });
  },

  /**
   * Remove a notification
   */
  removeNotification: (id) => {
    set((state) => {
      const updated = state.notifications.filter(n => n.id !== id);
      const unreadCount = updated.filter(n => !n.isRead).length;
      return { notifications: updated, unreadCount };
    });
  },

  /**
   * Mark notification as read
   */
  markAsRead: (id) => {
    get().updateNotification(id, { isRead: true });
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: () => {
    set((state) => {
      const updated = state.notifications.map(n => ({ ...n, isRead: true }));
      return { notifications: updated, unreadCount: 0 };
    });
  },

  /**
   * Clear all notifications
   */
  clearAll: () => {
    set({ notifications: [], unreadCount: 0 });
  },

  /**
   * Set unread count
   */
  setUnreadCount: (count) => {
    set({ unreadCount: count });
  },

  /**
   * Set loading state
   */
  setLoading: (isLoading) => {
    set({ isLoading });
  },

  /**
   * Set error
   */
  setError: (error) => {
    set({ error });
  },

  /**
   * Set WebSocket connection status
   */
  setWebSocketConnected: (isConnected) => {
    set({ isWebSocketConnected: isConnected });
  },

  /**
   * Get notification config by type
   */
  getNotificationConfig: (type) => {
    return notificationTypeConfig[type] || notificationTypeConfig.NEW_BOOK;
  },

  /**
   * Filter notifications by type
   */
  filterByType: (type) => {
    const state = get();
    return state.notifications.filter(n => n.notificationType === type);
  },

  /**
   * Filter unread notifications
   */
  getUnreadNotifications: () => {
    const state = get();
    return state.notifications.filter(n => !n.isRead);
  },

  /**
   * Get recent notifications (last N)
   */
  getRecentNotifications: (limit = 5) => {
    const state = get();
    return state.notifications.slice(0, limit);
  },

  /**
   * Fetch notifications from API
   */
  fetchNotifications: async (userId, page = 0, size = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await notificationAPI.getUserNotifications(userId, page, size);
      const notifications = response.data.content || response.data || [];
      set({ notifications, isLoading: false });
      return notifications;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch notifications';
      set({ error: errorMessage, isLoading: false });
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  /**
   * Mark notification as read via API
   */
  markAsReadAPI: async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      get().markAsRead(notificationId);
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  /**
   * Mark all notifications as read via API
   */
  markAllAsReadAPI: async (userId) => {
    try {
      await notificationAPI.markAllAsRead(userId);
      get().markAllAsRead();
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  /**
   * Delete notification via API
   */
  deleteNotificationAPI: async (notificationId) => {
    try {
      await notificationAPI.deleteNotification(notificationId);
      get().removeNotification(notificationId);
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  /**
   * Delete all notifications for a user via API
   */
  deleteAllNotificationsAPI: async (userId) => {
    try {
      await notificationAPI.deleteAllNotifications(userId);
      get().clearAll();
      return true;
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      throw error;
    }
  },

  /**
   * Get notifications by type via API
   */
  fetchNotificationsByType: async (userId, type, page = 0, size = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await notificationAPI.getNotificationsByType(userId, type, page, size);
      const notifications = response.data.content || response.data || [];
      return notifications;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch notifications';
      set({ error: errorMessage, isLoading: false });
      console.error('Error fetching notifications by type:', error);
      throw error;
    }
  },

  /**
   * Connect to WebSocket and set up message handlers
   */
  connectWebSocket: (userId) => {
    set({ isLoading: true });

    webSocketService.connect(
      userId,
      () => {
        set({ isWebSocketConnected: true, isLoading: false });
        console.log('WebSocket connected');
      },
      (error) => {
        set({ isWebSocketConnected: false, isLoading: false });
        console.error('WebSocket error:', error);
      }
    );

    // Register message handler for incoming notifications
    webSocketService.onMessage('notification', (notification) => {
      get().addNotification(notification);

      // Show toast notification based on priority
      const config = get().getNotificationConfig(notification.notificationType);
      const toastType = config.priority === 'high' ? 'warning' : 'info';

      toast[toastType](
        `${config.label}: ${notification.message}`,
        {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    });
  },

  /**
   * Disconnect from WebSocket
   */
  disconnectWebSocket: () => {
    webSocketService.disconnect();
    set({ isWebSocketConnected: false });
  }
}));

export default useNotificationStore;
export { notificationTypeConfig };

