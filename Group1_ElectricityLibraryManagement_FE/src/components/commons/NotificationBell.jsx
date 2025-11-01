import React, { useState, useRef, useEffect } from 'react';
import { Bell, BellFill } from 'react-bootstrap-icons';
import { Badge, Button } from 'react-bootstrap';
import useNotificationStore from '../../stores/notificationStore';
import NotificationDropdown from './NotificationDropdown';
import styles from './NotificationBell.module.css';

/**
 * NotificationBell Component
 * Displays a bell icon with unread notification count badge
 * Shows dropdown with recent notifications on click
 */
const NotificationBell = ({ variant = 'outline-secondary', size = 'md' }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Get notification state from Zustand store
  const { unreadCount, notifications } = useNotificationStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showDropdown]);

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleCloseDropdown = () => {
    setShowDropdown(false);
  };

  // Determine bell icon based on unread count
  const BellIcon = unreadCount > 0 ? BellFill : Bell;

  return (
    <div className={styles.notificationBellContainer}>
      <Button
        ref={buttonRef}
        variant={variant}
        size={size === 'sm' ? 'sm' : undefined}
        className={`${styles.bellButton} ${unreadCount > 0 ? styles.hasNotifications : ''}`}
        onClick={handleBellClick}
        aria-label={`Notifications (${unreadCount} unread)`}
        aria-expanded={showDropdown}
        aria-haspopup="true"
      >
        <BellIcon className={styles.bellIcon} />
        {unreadCount > 0 && (
          <Badge
            bg="danger"
            className={styles.badge}
            aria-label={`${unreadCount} unread notifications`}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className={styles.dropdownContainer}
          role="menu"
        >
          <NotificationDropdown
            notifications={notifications}
            onClose={handleCloseDropdown}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

