import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import notificationAPI from '../../api/notification'; // Assuming you have this API
import UserContext from './UserContext';
import { NotificationContext } from './NotificationContext';

 

export const NotificationProvider = ({ children }) => {
  const { user, isLoggedIn } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const stompClientRef = useRef(null);

  const mapDtoToUi = useCallback((dto) => ({
    id: dto.id ?? `ws-${Date.now()}`,
    title: dto.title,
    description: dto.description ?? dto.message,
    notificationType: dto.notificationType ?? dto.type,
    createdDate: dto.createdDate ?? dto.createdAt ?? new Date().toISOString(),
    isRead: dto.isRead ?? false,
  }), []);

  const isTransientId = useCallback((id) => typeof id === 'string' && id.startsWith('ws-'), []);

  const fetchNotifications = useCallback(async () => {
    if (user?.accountId) {
      setLoading(true);
      try {
        const response = await notificationAPI.getUserNotifications(user.accountId, 0, 20); // Fetch more for initial view
        const items = (response?.data?.content || []).map(mapDtoToUi);
        setNotifications(items);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    }
  }, [user?.accountId, mapDtoToUi]);

  const fetchUnreadCount = useCallback(async () => {
    if (user?.accountId) {
      try {
        const response = await notificationAPI.getUnreadCount(user.accountId);
        const count = response?.data?.data?.count ?? response?.data ?? 0;
        setUnreadCount(count);
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
      }
    }
  }, [user?.accountId]);

  const handleNewNotification = useCallback((notification) => {
    console.log('[WebSocket] New notification received:', notification);
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);

    toast.info(
      <div>
        <p className="font-bold">{notification.title || 'New Notification'}</p>
        <p>{notification.message}</p>
      </div>,
      {
        icon: '🔔',
        autoClose: 5000,
      }
    );
  }, []);

  useEffect(() => {
    console.log('[DEBUG] useEffect triggered:', { isLoggedIn, user });
    console.log('[DEBUG] Condition check:', { 
      isLoggedIn, 
      hasUser: !!user, 
      hasUsername: !!user?.username,
      username: user?.username,
      userKeys: user ? Object.keys(user) : 'no user'
    });
    
    if (user?.username) {
      console.log('[NotificationProvider] User logged in. Initializing notifications...');
      console.log('[DEBUG] User details:', { username: user.username, accountId: user.accountId });
      fetchUnreadCount();
      fetchNotifications();
      
      // Get auth token from localStorage
      const token = localStorage.getItem('accessToken');
      console.log('[DEBUG] Auth token:', token ? 'present' : 'missing');
      
      // Build WebSocket URL with token as query parameter
      const wsUrl = token 
        ? `http://localhost:8080/ws?token=${encodeURIComponent(token)}`
        : 'http://localhost:8080/ws';
      
      const socket = new SockJS(wsUrl);
      
      const client = new Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log('[STOMP Debug]', str),
        connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
        onConnect: (frame) => {
          console.log('✅ Connected to WebSocket:', frame);
          stompClientRef.current = client;

          const subscriptionPath = `/user/${user.username}/queue/new-notification`;
          console.log('🔔 Subscribing to:', subscriptionPath);
          
          const subscription = client.subscribe(subscriptionPath, (message) => {
            console.log('📨 WebSocket message received:', message);
            try {
              const notification = JSON.parse(message.body);
              console.log('📋 Parsed notification:', notification);

              toast.success(
                (t) => (
                  <div onClick={() => toast.dismiss(t.id)}>
                    <p className="font-bold">{notification.title}</p>
                    <p>{notification.message}</p>
                  </div>
                ), { 
                  icon: '⏰',
                  duration: 10000 
                }
              );

              // Push into local list so the bell shows it immediately (even if backend persistence is stubbed)
              const uiItem = mapDtoToUi(notification);
              setNotifications(prev => [uiItem, ...prev]);
              setUnreadCount(prev => prev + 1);
            } catch (e) {
              console.error("❌ Error parsing WebSocket notification:", e);
            }
          });
          
          console.log('✅ Subscription created:', subscription);
        },
        onStompError: (error) => {
          console.error('WebSocket connection error:', error);
        }
      });
      
      client.activate();

      return () => {
        if (stompClientRef.current) {
          stompClientRef.current.disconnect(() => {
            console.log('WebSocket disconnected');
          });
          stompClientRef.current = null;
        }
      };
    } else {
      setUnreadCount(0);
      setLoading(false);
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
        stompClientRef.current = null;
      }
    }
  }, [user?.username, fetchNotifications, fetchUnreadCount]);

  const markAsRead = async (notificationId) => {
    try {
      if (isTransientId(notificationId)) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
        );
        const notification = notifications.find(n => n.id === notificationId);
        if (notification && !notification.isRead) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
        return;
      }

      await notificationAPI.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && !notification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if(user?.accountId) {
      try {
        await notificationAPI.markAllAsRead(user.accountId);
      } catch (error) {
        console.error('Failed to mark all notifications as read:', error);
      } finally {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const notification = notifications.find(n => n.id === notificationId);
      const wasUnread = notification && !notification.isRead;

      if (isTransientId(notificationId)) {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        if (wasUnread) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
        return;
      }

      await notificationAPI.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      if (wasUnread) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast.error('Could not delete notification.');
    }
  };


  const contextValue = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};
