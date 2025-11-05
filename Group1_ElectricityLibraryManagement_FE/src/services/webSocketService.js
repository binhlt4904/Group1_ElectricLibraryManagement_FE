import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.subscriptions = new Map();
    this.messageHandlers = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
  }

  /**
   * Connect to WebSocket server
   * @param {number} userId - User ID for subscription
   * @param {Function} onConnect - Callback when connected
   * @param {Function} onError - Callback on error
   */
  connect(userId, onConnect, onError) {
    if (this.isConnected) {
      console.log('WebSocket already connected');
      return;
    }

    const socket = new SockJS('http://localhost:8080/ws/notifications');
    
    this.client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        login: 'user',
        passcode: 'password'
      },
      debug: (str) => {
        console.log('[WebSocket]', str);
      },
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame) => {
        console.log('WebSocket connected:', frame);
        this.isConnected = true;
        this.reconnectAttempts = 0;
        
        // Subscribe to user-specific notifications
        this.subscribe(userId, onConnect);
        
        if (onConnect) {
          onConnect();
        }
      },
      onStompError: (frame) => {
        console.error('WebSocket error:', frame);
        this.isConnected = false;
        
        if (onError) {
          onError(frame);
        }
      },
      onWebSocketError: (error) => {
        console.error('WebSocket connection error:', error);
        this.isConnected = false;
        
        if (onError) {
          onError(error);
        }
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
    if (!this.client || !this.client.connected) {
      console.error('WebSocket not connected');
      return;
    }

    const subscriptionPath = `/user/${userId}/queue/notifications`;
    
    // Avoid duplicate subscriptions
    if (this.subscriptions.has(subscriptionPath)) {
      console.log('Already subscribed to:', subscriptionPath);
      return;
    }

    const subscription = this.client.subscribe(subscriptionPath, (message) => {
      try {
        const notification = JSON.parse(message.body);
        console.log('Notification received:', notification);
        
        // Call registered handlers
        if (this.messageHandlers.has('notification')) {
          this.messageHandlers.get('notification').forEach(handler => {
            handler(notification);
          });
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
    console.log('Subscribed to:', subscriptionPath);
  }

  /**
   * Register a message handler
   * @param {string} type - Handler type (e.g., 'notification')
   * @param {Function} handler - Handler function
   */
  onMessage(type, handler) {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    this.messageHandlers.get(type).push(handler);
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
    this.send('/app/notifications/mark-read', {
      notificationId
    });
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    if (this.client && this.client.connected) {
      this.client.deactivate();
      this.isConnected = false;
      this.subscriptions.clear();
      this.messageHandlers.clear();
      console.log('WebSocket disconnected');
    }
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

