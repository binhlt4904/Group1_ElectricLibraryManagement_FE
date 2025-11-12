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

  // Mark notification as read (defined early for use in handleNotificationClick)
  const markAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      
      // Decrement unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Handle notification click (defined before handleNewNotification)
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

  // Handle incoming WebSocket notifications
  // CRITICAL: NO dependencies on handleNotificationClick to prevent re-render loop
  const handleNewNotification = useCallback((notification) => {
    console.log('--- [NotificationProvider] START: New Notification Received ---');
    console.log('Raw notification object:', notification);

    // Add to notifications list
    setNotifications(prev => {
      console.log(`Updating notifications state. Previous count: ${prev.length}`);
      const newList = [notification, ...prev];
      console.log(`New notifications list created. New count: ${newList.length}`);
      return newList;
    });
    
    // Increment unread count if notification is unread
    if (!notification.isRead) {
      setUnreadCount(prev => {
        console.log(`Updating unread count. Previous count: ${prev}`);
        const newCount = prev + 1;
        console.log(`New unread count: ${newCount}`);
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
      case 'CARD_SUSPENDED':
        toast.error(`🚫 ${toastMessage}`, toastOptions);
        break;
      default:
        toast.info(toastMessage, toastOptions);
    }
    console.log('--- [NotificationProvider] END: New Notification Handled ---');
  }, []);

  // Extract userId for cleaner dependency management
  const userId = user?.accountId;

  // Effect 1: Manage WebSocket connection lifecycle
  // Only depends on userId to avoid race conditions and re-render loops
  useEffect(() => {
    console.log('[Effect 1] Managing WebSocket connection. userId:', userId);
    
    // Only proceed if we have a userId
    if (!userId) {
      console.log('[Effect 1] No userId yet. Disconnecting WebSocket.');
      webSocketService.disconnect();
      setConnected(false);
      return;
    }

    // We have a userId, establish connection
    console.log('[Effect 1] userId detected. Establishing WebSocket connection...');
    
    const onConnect = () => {
      console.log('[Effect 1] ✅ WebSocket connected successfully');
      setConnected(true);
    };
    
    const onError = (error) => {
      console.error('[Effect 1] ❌ WebSocket connection error:', error);
      setConnected(false);
      toast.error('Notification service connection failed.');
    };

    // Establish connection
    if (!webSocketService.isConnectedStatus()) {
      console.log('[Effect 1] Attempting to connect...');
      webSocketService.connect(userId, onConnect, onError);
    } else {
      console.log('[Effect 1] WebSocket already connected.');
      onConnect(); // Ensure connected state is set
    }
    
    // Cleanup: Disconnect when userId changes (logout) or component unmounts
    return () => {
      console.log('[Effect 1] Cleaning up WebSocket connection for userId:', userId);
      webSocketService.disconnect();
      setConnected(false);
    };
  }, [userId]);

  // Effect 2: Register handler and subscribe to notifications
  // Only depends on userId to ensure handler is registered once per user
  // Separated from connection effect to avoid re-render loops
  useEffect(() => {
    console.log('[Effect 2] Registering handler and subscribing. userId:', userId);
    
    // Only proceed if we have a userId
    if (!userId) {
      console.log('[Effect 2] No userId yet. Skipping handler registration.');
      return;
    }

    // Register the handler
    console.log('[Effect 2] Registering handler for type: notification');
    webSocketService.onMessage('notification', handleNewNotification);
    
    // Subscribe to the notification channel
    console.log('[Effect 2] Subscribing to /user/queue/notifications');
    webSocketService.subscribe(userId);
    
    // Cleanup: Remove handler when userId changes or component unmounts
    return () => {
      console.log('[Effect 2] Cleaning up handler and subscription for userId:', userId);
      webSocketService.clearHandlers('notification');
    };
  }, [userId]);


  // Fetch initial data on mount and when user changes
  useEffect(() => {
    console.log('[Effect] Fetching initial data. User:', user?.accountId);
    if (user && user.accountId) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [user]);

  // handleNotificationClick moved above

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

  // markAsRead moved above

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
