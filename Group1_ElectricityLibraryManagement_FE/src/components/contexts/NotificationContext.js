import { createContext } from 'react';

const NotificationContext = createContext({
  notifications: [],
  unreadCount: 0,
  loading: false,
  connected: false,
  fetchNotifications: () => {},
  fetchUnreadCount: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  deleteNotification: () => {},
  addNotification: () => {}
});

export default NotificationContext;
