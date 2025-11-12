import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.subscriptions = new Map();
    this.reconnectDelay = 5000;
    
    // Create the client instance once and reuse it
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.log('[WebSocket]', str);
      },
    });
  }

  connect(token, onConnect, onError, onDisconnectCallback) {
    if (this.client.active) {
      console.log('[WebSocket] Client is already active.');
      if (onConnect) onConnect();
      return;
    }

    console.log('[WebSocket] Configuring and activating client...');
    
    // Configure headers and callbacks before activating
    this.client.configure({
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      onConnect: (frame) => {
        console.log('[WebSocket] ✅ Connected successfully:', frame);
        this.isConnected = true;
        
        // Call the provider's onConnect callback FIRST
        // The provider will then call subscribe() to register subscriptions
        if (onConnect) onConnect();
        
        // DO NOT call resubscribeAll() here - it causes duplicate subscriptions
        // The provider will handle subscription management
      },
      onStompError: (frame) => {
        console.error('[WebSocket] ❌ STOMP error:', frame.headers['message']);
        this.isConnected = false;
        if (onError) onError(frame);
      },
      onWebSocketClose: () => {
        console.log('[WebSocket] 🔌 Connection closed.');
        this.isConnected = false;
        if (onDisconnectCallback) onDisconnectCallback();
      }
    });

    this.client.activate();
  }

  subscribe(destination, callback) {
    // Check if already subscribed to avoid duplicates
    if (this.subscriptions.has(destination) && this.subscriptions.get(destination).stompSubscription) {
      console.log(`[WebSocket] Already subscribed to: ${destination}`);
      return;
    }

    // Store subscription details so we can re-apply them on reconnect
    this.subscriptions.set(destination, { callback });

    if (!this.client.active) {
      console.log('[WebSocket] Client not active. Subscription will be applied upon connection.');
      return;
    }
    
    console.log(`[WebSocket] 📡 Subscribing to: ${destination}`);
    const subscription = this.client.subscribe(destination, (message) => {
      try {
        const notificationData = typeof message.body === 'string'
          ? JSON.parse(message.body)
          : message.body;
        
        if (notificationData) {
          console.log('[WebSocket] Message received and passed to callback');
          callback(notificationData);
        } else {
          console.warn('[WebSocket] Received an empty or invalid message body.');
        }
      } catch (e) {
        console.error('[WebSocket] Could not parse or process message:', e, 'Raw body:', message.body);
      }
    });
    
    // Store the actual subscription object to allow for unsubscribing if needed
    this.subscriptions.get(destination).stompSubscription = subscription;
    console.log(`[WebSocket] ✅ Successfully subscribed to: ${destination}`);
  }

  resubscribeAll() {
    console.log('[WebSocket] Re-subscribing to all channels after reconnect...');
    this.subscriptions.forEach((sub, destination) => {
      // Unsubscribe old if exists
      if (sub.stompSubscription) {
        console.log(`[WebSocket] Unsubscribing old subscription for ${destination}`);
        sub.stompSubscription.unsubscribe();
        sub.stompSubscription = null;
      }
      console.log(`[WebSocket] Re-subscribing to ${destination}`);
      this.subscribe(destination, sub.callback);
    });
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
    // This method is no longer needed as subscriptions are managed directly
    // The handler registration logic needs to be re-evaluated based on new subscription model
  }

  /**
   * Clear all handlers for a specific type
   * @param {string} type - Handler type
   */
  clearHandlers(type) {
    // This method is no longer needed as handlers are not managed in this way
  }

  /**
   * Send a message to server
   * @param {string} destination - Destination path
   * @param {Object} body - Message body
   */
  send(destination, body) {
    if (!this.client || !this.client.active) {
      console.error('WebSocket not connected, cannot send message.');
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
    // Unsubscribe all before deactivating
    this.subscriptions.forEach((sub, destination) => {
      if (sub.stompSubscription) {
        console.log(`[WebSocket] Unsubscribing from ${destination}`);
        sub.stompSubscription.unsubscribe();
      }
    });
    this.subscriptions.clear(); // Clear map after unsubscribe

    if (this.client && this.client.active) {
      console.log('[WebSocket] Deactivating client.');
      this.client.deactivate();
    }
    this.isConnected = false;
  }

  /**
   * Check if connected
   * @returns {boolean} Connection status
   */
  isConnectedStatus() {
    return this.isConnected && this.client && this.client.active;
  }
}

// Export singleton instance
export default new WebSocketService();

