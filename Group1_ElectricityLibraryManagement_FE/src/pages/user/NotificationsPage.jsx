import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Badge, ButtonGroup, Alert, Spinner } from 'react-bootstrap';
import {
  Bell, BellFill, BookFill, CalendarEvent, ExclamationTriangleFill,
  Trash, Check, Filter
} from 'react-bootstrap-icons';
import styles from './NotificationsPage.module.css';
import useNotificationStore, { notificationTypeConfig } from '../../stores/notificationStore';
import UserContext from '../../components/contexts/UserContext';

const NotificationsPage = () => {
  const { user } = useContext(UserContext);
  const {
    notifications,
    isLoading,
    error,
    fetchNotifications,
    markAsReadAPI,
    markAllAsReadAPI,
    deleteNotificationAPI,
    deleteAllNotificationsAPI,
    connectWebSocket,
    disconnectWebSocket,
    getNotificationConfig
  } = useNotificationStore();

  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);

  // Fetch notifications on mount and connect WebSocket
  useEffect(() => {
    if (user?.id) {
      // Fetch initial notifications
      fetchNotifications(user.id, page, pageSize).catch(err => {
        console.error('Failed to fetch notifications:', err);
      });

      // Connect to WebSocket for real-time updates
      connectWebSocket(user.id);

      // Cleanup on unmount
      return () => {
        disconnectWebSocket();
      };
    }
  }, [user?.id, fetchNotifications, connectWebSocket, disconnectWebSocket, page, pageSize]);

  // Filter notifications
  useEffect(() => {
    let filtered = notifications;

    switch (filter) {
      case 'unread':
        filtered = notifications.filter(n => !n.isRead);
        break;
      case 'read':
        filtered = notifications.filter(n => n.isRead);
        break;
      case 'high_priority':
        filtered = notifications.filter(n => {
          const config = getNotificationConfig(n.notificationType);
          return config.priority === 'high';
        });
        break;
      case 'NEW_BOOK':
      case 'NEW_EVENT':
      case 'REMINDER':
      case 'OVERDUE':
        filtered = notifications.filter(n => n.notificationType === filter);
        break;
      default:
        filtered = notifications;
    }

    setFilteredNotifications(filtered);
  }, [notifications, filter, getNotificationConfig]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'NEW_BOOK':
        return <BookFill className={styles.iconDueSoon} />;
      case 'NEW_EVENT':
        return <CalendarEvent className={styles.iconEvent} />;
      case 'REMINDER':
        return <ExclamationTriangleFill className={styles.iconOverdue} />;
      case 'OVERDUE':
        return <ExclamationTriangleFill className={styles.iconFine} />;
      default:
        return <Bell className={styles.iconDefault} />;
    }
  };

  const getPriorityBadge = (type) => {
    const config = getNotificationConfig(type);
    const priority = config.priority;

    switch (priority) {
      case 'high':
        return <Badge bg="danger" className={styles.priorityBadge}>High</Badge>;
      case 'medium':
        return <Badge bg="warning" className={styles.priorityBadge}>Medium</Badge>;
      case 'low':
        return <Badge bg="info" className={styles.priorityBadge}>Low</Badge>;
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsReadAPI(id);
      showAlertMessage('Notification marked as read');
    } catch (error) {
      showAlertMessage('Failed to mark notification as read');
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotificationAPI(id);
      showAlertMessage('Notification deleted');
    } catch (error) {
      showAlertMessage('Failed to delete notification');
      console.error('Error:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      if (user?.id) {
        await markAllAsReadAPI(user.id);
        showAlertMessage('All notifications marked as read');
      }
    } catch (error) {
      showAlertMessage('Failed to mark all notifications as read');
      console.error('Error:', error);
    }
  };

  const handleClearAll = async () => {
    try {
      if (user?.id) {
        await deleteAllNotificationsAPI(user.id);
        showAlertMessage('All notifications have been cleared');
      }
    } catch (error) {
      showAlertMessage('Failed to clear notifications');
      console.error('Error:', error);
    }
  };

  const showAlertMessage = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className={styles.notificationsPage}>
      <Container>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className={styles.pageHeader}>
              <div>
                <h1 className={styles.pageTitle}>
                  <BellFill className="me-3" />
                  Notifications
                  {unreadCount > 0 && (
                    <Badge bg="danger" className={styles.unreadBadge}>
                      {unreadCount}
                    </Badge>
                  )}
                </h1>
                <p className={styles.pageSubtitle}>
                  Stay updated with your library activities and important announcements
                </p>
              </div>
              <div className={styles.headerActions}>
                <Button
                  variant="outline-primary"
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0}
                  className="me-2"
                >
                  <Check className="me-1" />
                  Mark All Read
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={handleClearAll}
                  disabled={notifications.length === 0}
                >
                  <Trash className="me-1" />
                  Clear All
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {showAlert && (
          <Alert variant="success" className={styles.alert}>
            {alertMessage}
          </Alert>
        )}

        {isLoading && (
          <Alert variant="info" className={styles.alert}>
            <Spinner animation="border" size="sm" className="me-2" />
            Loading notifications...
          </Alert>
        )}

        {/* Filters */}
        <Row className="mb-4">
          <Col>
            <Card className={`custom-card ${styles.filtersCard}`}>
              <Card.Body className={styles.filtersBody}>
                <div className={styles.filtersHeader}>
                  <Filter className="me-2" />
                  <span className={styles.filtersTitle}>Filter Notifications</span>
                </div>
                <ButtonGroup className={styles.filterButtons}>
                  <Button
                    variant={filter === 'all' ? 'primary' : 'outline-primary'}
                    onClick={() => setFilter('all')}
                    size="sm"
                  >
                    All ({notifications.length})
                  </Button>
                  <Button
                    variant={filter === 'unread' ? 'primary' : 'outline-primary'}
                    onClick={() => setFilter('unread')}
                    size="sm"
                  >
                    Unread ({notifications.filter(n => !n.isRead).length})
                  </Button>
                  <Button
                    variant={filter === 'read' ? 'primary' : 'outline-primary'}
                    onClick={() => setFilter('read')}
                    size="sm"
                  >
                    Read ({notifications.filter(n => n.isRead).length})
                  </Button>
                  <Button
                    variant={filter === 'high_priority' ? 'primary' : 'outline-primary'}
                    onClick={() => setFilter('high_priority')}
                    size="sm"
                  >
                    High Priority
                  </Button>
                  <Button
                    variant={filter === 'NEW_BOOK' ? 'primary' : 'outline-primary'}
                    onClick={() => setFilter('NEW_BOOK')}
                    size="sm"
                  >
                    New Books
                  </Button>
                  <Button
                    variant={filter === 'NEW_EVENT' ? 'primary' : 'outline-primary'}
                    onClick={() => setFilter('NEW_EVENT')}
                    size="sm"
                  >
                    Events
                  </Button>
                  <Button
                    variant={filter === 'REMINDER' ? 'primary' : 'outline-primary'}
                    onClick={() => setFilter('REMINDER')}
                    size="sm"
                  >
                    Reminders
                  </Button>
                  <Button
                    variant={filter === 'OVERDUE' ? 'primary' : 'outline-primary'}
                    onClick={() => setFilter('OVERDUE')}
                    size="sm"
                  >
                    Overdue
                  </Button>
                </ButtonGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Notifications List */}
        <Row>
          <Col>
            {filteredNotifications.length === 0 ? (
              <Card className={`custom-card ${styles.emptyState}`}>
                <Card.Body className={styles.emptyStateBody}>
                  <Bell size={48} className={styles.emptyIcon} />
                  <h4 className={styles.emptyTitle}>No Notifications</h4>
                  <p className={styles.emptyMessage}>
                    {filter === 'all' 
                      ? "You don't have any notifications at the moment."
                      : `No notifications match the selected filter: ${filter.replace('_', ' ')}.`
                    }
                  </p>
                </Card.Body>
              </Card>
            ) : (
              <div className={styles.notificationsList}>
                {filteredNotifications.map(notification => (
                  <Card
                    key={notification.id}
                    className={`custom-card ${styles.notificationCard} ${notification.isRead ? '' : styles.unread}`}
                  >
                    <Card.Body className={styles.notificationBody}>
                      <div className={styles.notificationContent}>
                        <div className={styles.notificationIcon}>
                          {getNotificationIcon(notification.notificationType)}
                        </div>
                        <div className={styles.notificationDetails}>
                          <div className={styles.notificationHeader}>
                            <h5 className={styles.notificationTitle}>
                              {notification.title}
                              {!notification.isRead && <div className={styles.unreadDot}></div>}
                            </h5>
                            <div className={styles.notificationMeta}>
                              {getPriorityBadge(notification.notificationType)}
                              <span className={styles.timestamp}>
                                {formatTimestamp(notification.createdAt)}
                              </span>
                            </div>
                          </div>
                          <p className={styles.notificationMessage}>
                            {notification.message}
                          </p>
                        </div>
                      </div>
                      <div className={styles.notificationActions}>
                        {notification.isRead ? (
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            disabled
                            className={styles.actionButton}
                          >
                            Read
                          </Button>
                        ) : (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className={styles.actionButton}
                          >
                            <Check className="me-1" />
                            Mark Read
                          </Button>
                        )}
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(notification.id)}
                          className={styles.actionButton}
                        >
                          <Trash />
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NotificationsPage;
