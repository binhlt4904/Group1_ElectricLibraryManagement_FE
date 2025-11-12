import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.isConnecting = false;
    this.subscriptions = new Map();
    this.messageHandlers = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.currentUserId = null;
    this.pendingSubscriptions = new Set();
  }

  /**
   * Connect to WebSocket server
   * @param {number} userId - User ID for subscription
   * @param {Function} onConnect - Callback when connected
   * @param {Function} onError - Callback on error
   */
  connect(userId, onConnect, onError) {
    // Prevent duplicate connection attempts
    if (this.isConnected) {
      console.log('[WebSocket] Already connected');
      if (onConnect) onConnect();
      return;
    }

    if (this.isConnecting) {
      console.log('[WebSocket] Connection already in progress');
      return;
    }

    // Get JWT token from localStorage
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      console.error('[WebSocket] No access token found. Cannot establish WebSocket connection.');
      if (onError) {
        onError(new Error('Authentication token not found'));
      }
      return;
    }

    // Remember the current user for (re)subscription needs
    this.currentUserId = userId;

    this.isConnecting = true;
    console.log('[WebSocket] Connecting with JWT authentication...');
    const socket = new SockJS('http://localhost:8080/ws');
    
    this.client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: (str) => {
        console.log('[WebSocket]', str);
      },
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame) => {
        console.log('[WebSocket] ✅ Connected successfully:', frame);
        this.isConnected = true;
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        
        if (onConnect) {
          onConnect();
        }

        // Flush any pending subscriptions queued before connection was established
        if (this.pendingSubscriptions.size > 0) {
          console.log(`[WebSocket] Flushing ${this.pendingSubscriptions.size} pending subscription(s) after connect`);
          for (const path of this.pendingSubscriptions) {
            if (!this.subscriptions.has(path)) {
              // Only one subscription currently used; reuse subscribe logic
              this.subscribe(this.currentUserId);
            }
          }
          this.pendingSubscriptions.clear();
        }
      },
      onStompError: (frame) => {
        console.error('[WebSocket] ❌ STOMP error:', frame);
        this.isConnected = false;
        this.isConnecting = false;
        
        if (onError) {
          onError(frame);
        }
      },
      onWebSocketError: (error) => {
        console.error('[WebSocket] ❌ Connection error:', error);
        this.isConnected = false;
        this.isConnecting = false;
        
        if (onError) {
          onError(error);
        }
      },
      onDisconnect: () => {
        console.log('[WebSocket] 🔌 Disconnected');
        this.isConnected = false;
        this.isConnecting = false;
      }
    });

    this.client.activate();
  }

  /**
   * Subscribe to notification channel
   * @param {number} userId - User ID
   * @param {Function} onMessage - Callback for new messages
   */
  subscribe(userId, onMessage) {
    const subscriptionPath = `/user/queue/notifications`;
    
    // If not connected yet, queue and return. It will be flushed in onConnect
    if (!this.client || !this.client.connected) {
      console.warn('[WebSocket] Not connected yet. Queuing subscription for path:', subscriptionPath);
      this.pendingSubscriptions.add(subscriptionPath);
      return;
    }
    
    console.log('[WebSocket] 📡 Subscription details:');
    console.log('   → User ID passed:', userId);
    console.log('   → Subscription path:', subscriptionPath);
    console.log('   → Expected server destination: /user/{username}/queue/notifications');
    console.log('   → Current handlers registered:', Array.from(this.messageHandlers.keys()));
    
    // Avoid duplicate subscriptions
    if (this.subscriptions.has(subscriptionPath)) {
      console.log('Already subscribed to:', subscriptionPath);
      return;
    }

    const subscription = this.client.subscribe(subscriptionPath, (message) => {
      try {
        const notification = JSON.parse(message.body);
        console.log('🔔 [WebSocket] Notification received:', notification);
        console.log('   → Type:', notification.notificationType);
        console.log('   → Title:', notification.title);
        console.log('   → ID:', notification.id);
        console.log('   → Handlers available:', Array.from(this.messageHandlers.keys()));
        
        // Call registered handlers (check current state, not stale closure)
        if (this.messageHandlers.has('notification')) {
          const handlers = this.messageHandlers.get('notification');
          console.log('   → Calling', handlers.length, 'handler(s)');
          handlers.forEach(handler => {
            try {
              handler(notification);
            } catch (handlerError) {
              console.error('   → Handler error:', handlerError);
            }
          });
        } else {
          console.warn('   ⚠️ No handlers registered for type "notification"');
        }
        
        // Call specific callback
        if (onMessage) {
          onMessage(notification);
        }
      } catch (error) {
        console.error('Error parsing notification:', error);
      }
    });

    this.subscriptions.set(subscriptionPath, subscription);
    console.log('✅ [WebSocket] Subscribed to:', subscriptionPath);
  }

  /**
   * Register a message handler
   * @param {string} type - Handler type (e.g., 'notification')
   * @param {Function} handler - Handler function
   */
  onMessage(type, handler) {
    // CRITICAL FIX: Replace all handlers of this type instead of pushing
    // This prevents stale closure issues when the handler is re-registered
    console.log(`[WebSocket] Registering handler for type: ${type}`);
    this.messageHandlers.set(type, [handler]);

    // If a handler is registered after connection, ensure we are subscribed
    const subscriptionPath = `/user/queue/notifications`;
    if (this.isConnected && this.client && this.client.connected && !this.subscriptions.has(subscriptionPath) && this.currentUserId != null) {
      console.log('[WebSocket] Handler registered while connected. Ensuring subscription exists...');
      this.subscribe(this.currentUserId);
    }
  }

  /**
   * Clear all handlers for a specific type
   * @param {string} type - Handler type
   */
  clearHandlers(type) {
    if (this.messageHandlers.has(type)) {
      this.messageHandlers.delete(type);
      console.log(`[WebSocket] Cleared handlers for type: ${type}`);
    }
  }

  /**
   * Send a message to server
   * @param {string} destination - Destination path
   * @param {Object} body - Message body
   */
  send(destination, body) {
    if (!this.client || !this.client.connected) {
      console.error('WebSocket not connected');
      return;
    }

    this.client.publish({
      destination,
      body: JSON.stringify(body)
    });
  }

  /**
   * Mark notification as read
   * @param {number} notificationId - Notification ID
   */
  markAsRead(notificationId) {
    this.send('/app/notifications/mark-read', notificationId);
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    if (this.client) {
      try {
        this.client.deactivate();
      } catch (e) {
        console.error('[WebSocket] Error during disconnect:', e);
      }
    }
    this.isConnected = false;
    this.isConnecting = false;
    this.currentUserId = null;
    this.subscriptions.clear();
    this.messageHandlers.clear();
    console.log('WebSocket disconnected');
  }

  /**
   * Check if connected
   * @returns {boolean} Connection status
   */
  isConnectedStatus() {
    return this.isConnected && this.client && this.client.connected;
  }
}

// Export singleton instance
export default new WebSocketService();

