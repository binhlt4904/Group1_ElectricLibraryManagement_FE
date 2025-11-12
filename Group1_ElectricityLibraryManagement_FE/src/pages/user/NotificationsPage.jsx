import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Badge, ButtonGroup, Alert, Spinner, ListGroup } from 'react-bootstrap';
import {
  Bell, BellFill, BookFill, CalendarEvent, ExclamationTriangleFill,
  Trash, Check, Filter
} from 'react-bootstrap-icons';
import styles from './NotificationsPage.module.css';
import { NotificationContext } from '../../components/contexts/NotificationContext';
import NotificationItem from '../../components/notifications/NotificationItem';
import UserContext from '../../components/contexts/UserContext';

const NotificationsPage = () => {
  const { user } = useContext(UserContext);
  const {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useContext(NotificationContext);

  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

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
  }, [notifications, filter]);

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

  const getTypeBadge = (type) => {
    switch (type) {
      case 'NEW_BOOK':
        return <Badge bg="primary" className={styles.typeBadge}>New Book</Badge>;
      case 'NEW_EVENT':
        return <Badge bg="success" className={styles.typeBadge}>Event</Badge>;
      case 'REMINDER':
        return <Badge bg="warning" className={styles.typeBadge}>Reminder</Badge>;
      case 'OVERDUE':
        return <Badge bg="danger" className={styles.typeBadge}>Overdue</Badge>;
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
    await markAsRead(id);
  };

  const handleDelete = async (id) => {
    await deleteNotification(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };


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
              </div>
            </div>
          </Col>
        </Row>

        {loading && (
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
              <Card className={`custom-card ${styles.notificationsList}`}>
                <ListGroup variant="flush">
                  {filteredNotifications.map(notification => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
                </ListGroup>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NotificationsPage;
