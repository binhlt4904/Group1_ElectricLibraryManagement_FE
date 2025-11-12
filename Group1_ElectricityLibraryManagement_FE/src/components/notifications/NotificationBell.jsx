import React, { useContext, useState, useEffect } from 'react';
import { Badge, Dropdown } from 'react-bootstrap';
import { Bell, BellFill } from 'react-bootstrap-icons';
import NotificationContext from '../contexts/NotificationContext';
import NotificationDropdown from './NotificationDropdown';
import styles from './NotificationBell.module.css';

const NotificationBell = () => {
  const { unreadCount } = useContext(NotificationContext);
  const [show, setShow] = useState(false);
  const [shake, setShake] = useState(false);

  // Debug: Log when unreadCount changes
  useEffect(() => {
    console.log('🔔 [NotificationBell] unreadCount changed:', unreadCount);
    console.log('🔔 [NotificationBell] Component will re-render');
  }, [unreadCount]);

  // Trigger shake animation when unread count increases
  useEffect(() => {
    if (unreadCount > 0) {
      console.log('🔔 [NotificationBell] Triggering shake animation');
      setShake(true);
      const timer = setTimeout(() => setShake(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  return (
    <Dropdown show={show} onToggle={setShow} align="end" className={styles.notificationBellContainer}>
      <Dropdown.Toggle
        as="button"
        className={styles.notificationButton}
        id="notification-dropdown"
      >
        <div className={`${styles.bellContainer} ${shake ? styles.shake : ''}`}>
          {unreadCount > 0 ? (
            <BellFill size={20} className={styles.bellIcon} />
          ) : (
            <Bell size={20} className={styles.bellIcon} />
          )}
          {unreadCount > 0 && (
            <Badge bg="danger" className={styles.badge}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </div>
      </Dropdown.Toggle>

      <Dropdown.Menu className={styles.dropdownMenu}>
        <NotificationDropdown onClose={() => setShow(false)} />
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationBell;
