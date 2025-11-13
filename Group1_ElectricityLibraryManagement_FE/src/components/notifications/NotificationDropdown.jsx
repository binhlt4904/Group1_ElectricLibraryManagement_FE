import React, { useContext } from 'react';
import { Button, ListGroup, Spinner } from 'react-bootstrap';
import { CheckAll, Bell } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../contexts/NotificationContext';
import NotificationItem from './NotificationItem';
import styles from './NotificationDropdown.module.css';

const NotificationDropdown = ({ onClose }) => {
  const { notifications, loading, markAllAsRead, unreadCount } = useContext(NotificationContext);
  const navigate = useNavigate();

  const recentNotifications = notifications.slice(0, 5);

  const handleViewAll = () => {
    navigate('/user/notifications');
    if (onClose) onClose();
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  return (
    <div className={styles.dropdownContainer}>
      {/* Header */}
      <div className={styles.header}>
        <h6 className={styles.title}>Notifications</h6>
        {unreadCount > 0 && (
          <Button
            variant="link"
            size="sm"
            onClick={handleMarkAllAsRead}
            className={styles.markAllButton}
          >
            <CheckAll size={16} className="me-1" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notification List */}
      <div className={styles.notificationList}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <Spinner animation="border" size="sm" />
            <p className={styles.loadingText}>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className={styles.emptyState}>
            <Bell size={48} className={styles.emptyIcon} />
            <p className={styles.emptyText}>No notifications</p>
            <p className={styles.emptySubtext}>You're all caught up!</p>
          </div>
        ) : (
          <ListGroup variant="flush">
            {recentNotifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={onClose}
              />
            ))}
          </ListGroup>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 5 && (
        <div className={styles.footer}>
          <Button
            variant="link"
            size="sm"
            onClick={handleViewAll}
            className={styles.viewAllButton}
          >
            View all notifications
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
