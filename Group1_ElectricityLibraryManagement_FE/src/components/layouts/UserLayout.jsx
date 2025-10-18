import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Container, Nav, Navbar, Offcanvas, Button, Dropdown, Badge 
} from 'react-bootstrap';
import {
  List, X, PersonCircle, ClockHistory, CreditCard, Wallet, Bell,
  BoxArrowRight, House, BookFill
} from 'react-bootstrap-icons';
import styles from './UserLayout.module.css';

const UserLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Mock user data - in real app this would come from context/redux
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    membershipType: 'Premium',
    avatar: null
  };

  const navigationItems = [
    {
      path: '/user/profile',
      icon: PersonCircle,
      label: 'My Profile',
      badge: null
    },
    {
      path: '/user/borrow-history',
      icon: ClockHistory,
      label: 'Borrow History',
      badge: '3'
    },
    {
      path: '/user/library-card',
      icon: CreditCard,
      label: 'Library Card',
      badge: null
    },
    {
      path: '/user/wallet',
      icon: Wallet,
      label: 'My Wallet',
      badge: null
    },
    {
      path: '/user/notifications',
      icon: Bell,
      label: 'Notifications',
      badge: '5'
    }
  ];

  const handleCloseSidebar = () => setShowSidebar(false);
  const handleShowSidebar = () => setShowSidebar(true);

  const handleLogout = () => {
    // In real app, this would clear auth state
    navigate('/');
  };

  const isActivePage = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const SidebarContent = () => (
    <div className={styles.sidebarContent}>
      {/* User Info Section */}
      <div className={styles.sidebarHeader}>
        <div className={styles.userSection}>
          <div className={styles.userAvatar}>
            <PersonCircle size={48} />
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user.name}</div>
            <div className={styles.userEmail}>{user.email}</div>
            <Badge bg="primary" className={styles.membershipBadge}>
              {user.membershipType}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <Nav className={`${styles.sidebarNav} flex-column`}>
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = isActivePage(item.path);
          
          return (
            <Nav.Link
              key={item.path}
              href={item.path}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
                handleCloseSidebar();
              }}
            >
              <div className={styles.navItemContent}>
                <div className={styles.navItemLeft}>
                  <IconComponent className={styles.navIcon} />
                  <span className={styles.navLabel}>{item.label}</span>
                </div>
                {item.badge && (
                  <Badge bg="danger" className={styles.navBadge}>
                    {item.badge}
                  </Badge>
                )}
              </div>
            </Nav.Link>
          );
        })}
      </Nav>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <Button 
          variant="outline-primary" 
          size="sm" 
          className={styles.quickActionBtn}
          onClick={() => navigate('/')}
        >
          <House className="me-2" />
          Home
        </Button>
        <Button 
          variant="outline-primary" 
          size="sm" 
          className={styles.quickActionBtn}
          onClick={() => navigate('/books')}
        >
          <BookFill className="me-2" />
          Browse Books
        </Button>
        <Button 
          variant="outline-danger" 
          size="sm" 
          className={styles.quickActionBtn}
          onClick={handleLogout}
        >
          <BoxArrowRight className="me-2" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className={styles.userLayout}>
      {/* Mobile Header */}
      <Navbar bg="white" className={`${styles.mobileHeader} d-lg-none`}>
        <Container fluid>
          <Button
            variant="outline-primary"
            onClick={handleShowSidebar}
            className={styles.sidebarToggle}
          >
            <List />
          </Button>
          <Navbar.Brand className={styles.mobileTitle}>
            My Account
          </Navbar.Brand>
          <div className={styles.mobileUserInfo}>
            <PersonCircle size={32} />
          </div>
        </Container>
      </Navbar>

      <div className={styles.layoutContainer}>
        {/* Desktop Sidebar */}
        <div className={`${styles.sidebar} d-none d-lg-block`}>
          <SidebarContent />
        </div>

        {/* Mobile Sidebar */}
        <Offcanvas 
          show={showSidebar} 
          onHide={handleCloseSidebar} 
          placement="start"
          className={styles.mobileSidebar}
        >
          <Offcanvas.Header closeButton className={styles.offcanvasHeader}>
            <Offcanvas.Title>My Account</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className={styles.offcanvasBody}>
            <SidebarContent />
          </Offcanvas.Body>
        </Offcanvas>

        {/* Main Content */}
        <div className={styles.mainContent}>
          <Container fluid className={styles.contentContainer}>
            <Outlet />
          </Container>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
