import React, { useContext } from 'react';
import { ListGroup } from 'react-bootstrap';
import { Book, CalendarEvent, ExclamationTriangle, InfoCircle, Trash } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import NotificationContext from '../contexts/NotificationContext';
import styles from './NotificationItem.module.css';

const NotificationItem = ({ notification, onClick }) => {
  const { markAsRead, deleteNotification } = useContext(NotificationContext);
  const navigate = useNavigate();

  const getIcon = (type) => {
    switch (type) {
      case 'NEW_BOOK':
        return <Book size={20} />;
      case 'NEW_EVENT':
        return <CalendarEvent size={20} />;
      case 'OVERDUE':
        return <ExclamationTriangle size={20} />;
      case 'REMINDER':
        return <InfoCircle size={20} />;
      default:
        return <InfoCircle size={20} />;
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'NEW_BOOK':
        return '#0d6efd';
      case 'NEW_EVENT':
        return '#198754';
      case 'OVERDUE':
        return '#dc3545';
      case 'REMINDER':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const handleClick = () => {
    // Mark as read if unread
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    // Navigate based on notification type
    if (notification.relatedBookId) {
      navigate(`/books/${notification.relatedBookId}`);
    } else if (notification.relatedEventId) {
      navigate(`/events/${notification.relatedEventId}`);
    } else if (notification.relatedBorrowRecordId) {
      navigate('/borrow-history');
    }
    
    // Close dropdown if callback provided
    if (onClick) onClick();
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteNotification(notification.id);
  };

  return (
    <div
      onClick={handleClick}
      className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : ''} list-group-item`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <div className={styles.iconContainer} style={{ color: getIconColor(notification.notificationType) }}>
        {getIcon(notification.notificationType)}
      </div>
      <div className={styles.content}>
        <div className={styles.title}>{notification.title}</div>
        <div className={styles.description}>{notification.description}</div>
        <div className={styles.time}>{formatTime(notification.createdDate)}</div>
      </div>
      <div className={styles.actions}>
        {!notification.isRead && <div className={styles.unreadDot} />}
        <button
          className={styles.deleteButton}
          onClick={handleDelete}
          title="Delete notification"
        >
          <Trash size={14} />
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;
