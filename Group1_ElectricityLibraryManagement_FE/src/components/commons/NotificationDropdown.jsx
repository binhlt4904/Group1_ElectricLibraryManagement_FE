import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button, Badge, Spinner } from 'react-bootstrap';
import {
  BookFill,
  CalendarEvent,
  Clock,
  ExclamationTriangle,
  ChevronRight,
  Bell
} from 'react-bootstrap-icons';
import { NotificationContext } from '../contexts/NotificationContext';
import styles from './NotificationDropdown.module.css';

/**
 * NotificationDropdown Component
 * Displays recent notifications in a dropdown menu
 */
const NotificationDropdown = ({ onClose }) => {
  const { notifications = [], loading, markAsRead } = useContext(NotificationContext);

  // Get recent notifications (limit to 5)
  const recentNotifications = notifications.slice(0, 5);

  /**
   * Get icon component based on notification type
   */
  const getNotificationIcon = (type) => {
    const iconProps = {
      size: 20,
      className: styles.notificationIcon
    };

    switch (type) {
      case 'NEW_BOOK':
        return <BookFill {...iconProps} />;
      case 'NEW_EVENT':
        return <CalendarEvent {...iconProps} />;
      case 'REMINDER':
        return <Clock {...iconProps} />;
      case 'OVERDUE':
        return <ExclamationTriangle {...iconProps} />;
      default:
        return <Bell {...iconProps} />;
    }
  };

  /**
   * Format timestamp to relative time
   */
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';

    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  /**
   * Handle mark as read
   */
  const handleMarkAsRead = (e, notificationId) => {
    e.preventDefault();
    e.stopPropagation();
    markAsRead(notificationId);
  };

  /**
   * Get badge variant based on type
   */
  const getTypeBadge = (type) => {
    switch (type) {
      case 'OVERDUE':
        return <Badge bg="danger" className={styles.priorityBadge}>Urgent</Badge>;
      case 'REMINDER':
        return <Badge bg="warning" className={styles.priorityBadge}>Reminder</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className={styles.notificationDropdown}>
      {/* Header */}
      <div className={styles.dropdownHeader}>
        <h6 className={styles.headerTitle}>Notifications</h6>
        {recentNotifications.length > 0 && (
          <Link
            to="/user/notifications"
            className={styles.viewAllLink}
            onClick={onClose}
          >
            View All
            <ChevronRight size={16} className="ms-1" />
          </Link>
        )}
      </div>

      {/* Notifications List */}
      <div className={styles.notificationsList}>
        {loading ? (
          <div className={styles.loadingState}>
            <Spinner animation="border" size="sm" />
            <p className={styles.loadingText}>Loading notifications...</p>
          </div>
        ) : recentNotifications.length === 0 ? (
          <div className={styles.emptyState}>
            <Bell size={32} className={styles.emptyIcon} />
            <p className={styles.emptyText}>No notifications yet</p>
          </div>
        ) : (
          recentNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`${styles.notificationItem} ${
                !notification.isRead ? styles.unread : ''
              }`}
            >
              <div className={styles.notificationContent}>
                <div className={styles.iconWrapper}>
                  {getNotificationIcon(notification.notificationType)}
                </div>

                <div className={styles.textContent}>
                  <div className={styles.titleRow}>
                    <h6 className={styles.notificationTitle}>
                      {notification.title}
                    </h6>
                    {getTypeBadge(notification.notificationType)}
                  </div>
                  <p className={styles.notificationMessage}>
                    {notification.description}
                  </p>
                  <span className={styles.timestamp}>
                    {formatTime(notification.createdDate)}
                  </span>
                </div>
              </div>

              {!notification.isRead && (
                <button
                  className={styles.markReadBtn}
                  onClick={(e) => handleMarkAsRead(e, notification.id)}
                  aria-label="Mark as read"
                  title="Mark as read"
                >
                  <span className={styles.unreadDot}></span>
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {recentNotifications.length > 0 && (
        <div className={styles.dropdownFooter}>
          <Link
            to="/user/notifications"
            className={styles.viewAllButton}
            onClick={onClose}
          >
            View All Notifications
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

