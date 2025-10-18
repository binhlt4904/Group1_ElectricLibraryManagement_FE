import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, ButtonGroup, Alert } from 'react-bootstrap';
import { 
  Bell, BellFill, BookFill, CalendarEvent, ExclamationTriangleFill, 
  InfoCircleFill, CheckCircleFill, Trash, Check, X, Filter 
} from 'react-bootstrap-icons';
import styles from './NotificationsPage.module.css';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Mock notifications data
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: 'due_soon',
        title: 'Book Due Tomorrow',
        message: '"The Great Gatsby" is due tomorrow. Please return or renew to avoid late fees.',
        timestamp: '2024-01-20T10:30:00Z',
        isRead: false,
        priority: 'high'
      },
      {
        id: 2,
        type: 'hold_ready',
        title: 'Hold Ready for Pickup',
        message: '"To Kill a Mockingbird" is now available for pickup at the Main Branch.',
        timestamp: '2024-01-20T09:15:00Z',
        isRead: false,
        priority: 'medium'
      },
      {
        id: 3,
        type: 'overdue',
        title: 'Overdue Book',
        message: '"1984" is overdue. Please return immediately to avoid additional fees.',
        timestamp: '2024-01-19T14:20:00Z',
        isRead: true,
        priority: 'high'
      },
      {
        id: 4,
        type: 'new_arrival',
        title: 'New Books Available',
        message: 'New fiction titles have arrived! Check out the latest additions to our collection.',
        timestamp: '2024-01-19T08:00:00Z',
        isRead: true,
        priority: 'low'
      },
      {
        id: 5,
        type: 'event',
        title: 'Upcoming Event',
        message: 'Book Club meeting this Friday at 6 PM. Join us for a discussion of "Pride and Prejudice".',
        timestamp: '2024-01-18T16:45:00Z',
        isRead: false,
        priority: 'medium'
      },
      {
        id: 6,
        type: 'fine',
        title: 'Outstanding Fine',
        message: 'You have an outstanding fine of $5.50. Please pay to continue borrowing.',
        timestamp: '2024-01-18T11:30:00Z',
        isRead: true,
        priority: 'high'
      },
      {
        id: 7,
        type: 'renewal',
        title: 'Book Renewed Successfully',
        message: '"The Catcher in the Rye" has been renewed. New due date: February 15, 2024.',
        timestamp: '2024-01-17T13:20:00Z',
        isRead: true,
        priority: 'low'
      }
    ];
    setNotifications(mockNotifications);
    setFilteredNotifications(mockNotifications);
  }, []);

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
        filtered = notifications.filter(n => n.priority === 'high');
        break;
      case 'due_soon':
        filtered = notifications.filter(n => n.type === 'due_soon');
        break;
      case 'holds':
        filtered = notifications.filter(n => n.type === 'hold_ready');
        break;
      case 'events':
        filtered = notifications.filter(n => n.type === 'event');
        break;
      default:
        filtered = notifications;
    }
    
    setFilteredNotifications(filtered);
  }, [notifications, filter]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'due_soon':
        return <BookFill className={styles.iconDueSoon} />;
      case 'hold_ready':
        return <CheckCircleFill className={styles.iconHoldReady} />;
      case 'overdue':
        return <ExclamationTriangleFill className={styles.iconOverdue} />;
      case 'new_arrival':
        return <InfoCircleFill className={styles.iconNewArrival} />;
      case 'event':
        return <CalendarEvent className={styles.iconEvent} />;
      case 'fine':
        return <ExclamationTriangleFill className={styles.iconFine} />;
      case 'renewal':
        return <CheckCircleFill className={styles.iconRenewal} />;
      default:
        return <Bell className={styles.iconDefault} />;
    }
  };

  const getPriorityBadge = (priority) => {
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

  const handleMarkAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
    showAlertMessage('Notification marked as read');
  };

  const handleMarkAsUnread = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: false } : n)
    );
    showAlertMessage('Notification marked as unread');
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    showAlertMessage('Notification deleted');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showAlertMessage('All notifications marked as read');
  };

  const handleClearAll = () => {
    setNotifications([]);
    showAlertMessage('All notifications cleared');
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
                    Unread ({unreadCount})
                  </Button>
                  <Button
                    variant={filter === 'read' ? 'primary' : 'outline-primary'}
                    onClick={() => setFilter('read')}
                    size="sm"
                  >
                    Read ({notifications.length - unreadCount})
                  </Button>
                  <Button
                    variant={filter === 'high_priority' ? 'primary' : 'outline-primary'}
                    onClick={() => setFilter('high_priority')}
                    size="sm"
                  >
                    High Priority
                  </Button>
                  <Button
                    variant={filter === 'due_soon' ? 'primary' : 'outline-primary'}
                    onClick={() => setFilter('due_soon')}
                    size="sm"
                  >
                    Due Soon
                  </Button>
                  <Button
                    variant={filter === 'holds' ? 'primary' : 'outline-primary'}
                    onClick={() => setFilter('holds')}
                    size="sm"
                  >
                    Holds
                  </Button>
                  <Button
                    variant={filter === 'events' ? 'primary' : 'outline-primary'}
                    onClick={() => setFilter('events')}
                    size="sm"
                  >
                    Events
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
                    className={`custom-card ${styles.notificationCard} ${!notification.isRead ? styles.unread : ''}`}
                  >
                    <Card.Body className={styles.notificationBody}>
                      <div className={styles.notificationContent}>
                        <div className={styles.notificationIcon}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className={styles.notificationDetails}>
                          <div className={styles.notificationHeader}>
                            <h5 className={styles.notificationTitle}>
                              {notification.title}
                              {!notification.isRead && <div className={styles.unreadDot}></div>}
                            </h5>
                            <div className={styles.notificationMeta}>
                              {getPriorityBadge(notification.priority)}
                              <span className={styles.timestamp}>
                                {formatTimestamp(notification.timestamp)}
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
                            onClick={() => handleMarkAsUnread(notification.id)}
                            className={styles.actionButton}
                          >
                            Mark Unread
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
