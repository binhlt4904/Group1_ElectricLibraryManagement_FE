import { useState, useEffect, useContext, useCallback } from 'react';
import { toast } from 'react-toastify';
import NotificationContext from './NotificationContext';
import UserContext from './UserContext';
import notificationAPI from '../../api/notification';
import webSocketService from '../../services/webSocketService';

export const NotificationProvider = ({ children }) => {
  const { user } = useContext(UserContext) || {};
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  // Handle incoming WebSocket notifications
  const handleNewNotification = useCallback((notification) => {
    console.log('🔔 [NotificationProvider] New notification received:', notification);
    console.log('📋 Notification details:', {
      id: notification.id,
      type: notification.notificationType,
      title: notification.title,
      isRead: notification.isRead
    });
    
    // Add to notifications list
    setNotifications(prev => {
      console.log('✅ Adding notification to list. Current count:', prev.length);
      return [notification, ...prev];
    });
    
    // Increment unread count if notification is unread
    if (!notification.isRead) {
      setUnreadCount(prev => {
        const newCount = prev + 1;
        console.log('📊 Unread count updated:', prev, '→', newCount);
        return newCount;
      });
    }
    
    // Show toast notification
    const toastMessage = notification.title || 'New notification';
    const toastOptions = {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      onClick: () => handleNotificationClick(notification)
    };

    console.log('🎨 Showing toast notification:', notification.notificationType);
    
    switch (notification.notificationType) {
      case 'NEW_BOOK':
        toast.info(`📘 ${toastMessage}`, toastOptions);
        break;
      case 'NEW_EVENT':
        toast.success(`📅 ${toastMessage}`, toastOptions);
        break;
      case 'REMINDER':
        toast.warning(`⏰ ${toastMessage}`, toastOptions);
        break;
      case 'OVERDUE':
        toast.error(`⚠️ ${toastMessage}`, toastOptions);
        break;
      default:
        toast.info(toastMessage, toastOptions);
    }
  }, []);

  // Connect to WebSocket for real-time notifications
  const connectWebSocket = useCallback(() => {
    if (!user || !user.accountId) {
      console.log('No user found, skipping WebSocket connection');
      return;
    }

    if (webSocketService.isConnectedStatus()) {
      console.log('WebSocket already connected');
      return;
    }

    console.log('Connecting to WebSocket for user:', user.accountId);

    webSocketService.connect(
      user.accountId,
      () => {
        console.log('WebSocket connected successfully');
        setConnected(true);
      },
      (error) => {
        console.error('WebSocket connection error:', error);
        setConnected(false);
        
        // Show error toast
        toast.error('Failed to connect to notification service. Retrying...', {
          position: 'top-right',
          autoClose: 3000
        });
      }
    );

    // Register message handler for new notifications
    webSocketService.onMessage('notification', handleNewNotification);
  }, [user, handleNewNotification]);

  // Fetch notifications on mount and when user changes
  useEffect(() => {
    if (user && user.accountId) {
      fetchNotifications();
      fetchUnreadCount();
      connectWebSocket();
    }

    return () => {
      if (webSocketService.isConnectedStatus()) {
        webSocketService.disconnect();
      }
    };
  }, [user, connectWebSocket]);

  // Handle notification click
  const handleNotificationClick = useCallback((notification) => {
    // Mark as read
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    // Navigate based on notification type
    if (notification.relatedBookId) {
      window.location.href = `/books/${notification.relatedBookId}`;
    } else if (notification.relatedEventId) {
      window.location.href = `/events/${notification.relatedEventId}`;
    } else if (notification.relatedBorrowRecordId) {
      window.location.href = '/user/borrowed-books';
    }
  }, []);

  // Fetch all notifications
  const fetchNotifications = async () => {
    if (!user || !user.accountId) return;

    try {
      setLoading(true);
      const response = await notificationAPI.getUserNotifications(user.accountId, 0, 50);
      const notificationData = response.data.content || response.data || [];
      setNotifications(notificationData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications', {
        position: 'top-right',
        autoClose: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    if (!user || !user.accountId) return;

    try {
      const response = await notificationAPI.getUnreadCount(user.accountId);
      // Extract count from structured response data
      const count = response.data.data?.count || 0;
      setUnreadCount(count);
      console.log('[NotificationProvider] Unread count:', count);
    } catch (error) {
      console.error('[NotificationProvider] Error fetching unread count:', error);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      
      // Decrement unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read', {
        position: 'top-right',
        autoClose: 3000
      });
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user || !user.accountId) return;

    try {
      await notificationAPI.markAllAsRead(user.accountId);
      
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      
      toast.success('All notifications marked as read', {
        position: 'top-right',
        autoClose: 2000
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all as read', {
        position: 'top-right',
        autoClose: 3000
      });
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await notificationAPI.deleteNotification(notificationId);
      
      // Remove from local state
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      // Refresh unread count
      fetchUnreadCount();
      
      toast.success('Notification deleted', {
        position: 'top-right',
        autoClose: 2000
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification', {
        position: 'top-right',
        autoClose: 3000
      });
    }
  };

  // Add notification (for testing or manual addition)
  const addNotification = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.isRead) {
      setUnreadCount(prev => prev + 1);
    }
  }, []);

  const contextValue = {
    notifications,
    unreadCount,
    loading,
    connected,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
