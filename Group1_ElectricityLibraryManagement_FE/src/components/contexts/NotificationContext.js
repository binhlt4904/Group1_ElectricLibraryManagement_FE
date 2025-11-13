import { createContext } from 'react';

export const NotificationContext = createContext({
  notifications: [],
  unreadCount: 0,
  loading: true,
  fetchNotifications: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  deleteNotification: () => {},
});
