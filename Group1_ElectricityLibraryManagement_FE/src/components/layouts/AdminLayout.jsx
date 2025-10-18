import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Container, Row, Col, Nav, Navbar, Offcanvas, Button, Dropdown, Badge 
} from 'react-bootstrap';
import {
  List, X, House, BookFill, PersonFill, Building, People,
  ClipboardData, CalendarEvent, BarChart, ExclamationTriangle, FileEarmark,
  Gear, BoxArrowRight, Bell, PersonCircle
} from 'react-bootstrap-icons';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const adminUser = {
    name: 'Admin User',
    email: 'admin@electricitylibrary.org',
    role: 'System Administrator',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
  };

  const navigationItems = [
    {
      path: '/admin/dashboard',
      icon: House,
      label: 'Dashboard',
      badge: null
    },
    {
      path: '/admin/books',
      icon: BookFill,
      label: 'Books Management',
      badge: null
    },
    {
      path: '/admin/authors',
      icon: PersonFill,
      label: 'Authors Management',
      badge: null
    },
    {
      path: '/admin/publishers',
      icon: Building,
      label: 'Publishers Management',
      badge: null
    },
    {
      path: '/admin/readers',
      icon: People,
      label: 'Readers Management',
      badge: '1,234'
    },
    {
      path: '/admin/borrowals',
      icon: ClipboardData,
      label: 'Borrowals Management',
      badge: '45'
    },
    {
      path: '/admin/events',
      icon: CalendarEvent,
      label: 'Events Management',
      badge: null
    },
    {
      path: '/admin/reports',
      icon: BarChart,
      label: 'Reports',
      badge: null
    },
    {
      path: '/admin/user-reports',
      icon: ExclamationTriangle,
      label: 'User Reports',
      badge: '3'
    },
    {
      path: '/admin/documents',
      icon: FileEarmark,
      label: 'Documents',
      badge: null
    },
    {
      path: '/admin/system-users',
      icon: Gear,
      label: 'System Users',
      badge: null
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setShowSidebar(false);
  };

  const handleLogout = () => {
    console.log('Admin logout');
    navigate('/login');
  };

  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const SidebarContent = () => (
    <div className={styles.sidebarContent}>
      {/* Logo Section */}
      <div className={styles.sidebarHeader}>
        <div className={styles.logoSection}>
          <div className={styles.logoGrid}>
            {[...Array(25)].map((_, i) => (
              <div key={i} className={styles.logoPixel}></div>
            ))}
          </div>
          <div className={styles.logoText}>
            <div className={styles.logoTitle}>ELECTRICITY</div>
            <div className={styles.logoSubtitle}>LIBRARY ADMIN</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <Nav className={`flex-column ${styles.sidebarNav}`}>
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = isActiveRoute(item.path);
          
          return (
            <Nav.Link
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <div className={styles.navItemContent}>
                <div className={styles.navItemLeft}>
                  <IconComponent className={styles.navIcon} />
                  <span className={styles.navLabel}>{item.label}</span>
                </div>
                {item.badge && (
                  <Badge bg="primary" className={styles.navBadge}>
                    {item.badge}
                  </Badge>
                )}
              </div>
            </Nav.Link>
          );
        })}
      </Nav>
    </div>
  );

  return (
    <div className={styles.adminLayout}>
      {/* Top Navigation Bar */}
      <Navbar bg="white" className={styles.topNavbar} fixed="top">
        <Container fluid>
          <div className={styles.topNavLeft}>
            <Button
              variant="outline-secondary"
              className={styles.sidebarToggle}
              onClick={() => setShowSidebar(true)}
            >
              <List />
            </Button>
            <Navbar.Brand className={styles.pageTitle}>
              Admin Panel
            </Navbar.Brand>
          </div>

          <div className={styles.topNavRight}>
            {/* Notifications */}
            <Button variant="outline-secondary" className={styles.notificationBtn}>
              <Bell />
              <Badge bg="danger" className={styles.notificationBadge}>3</Badge>
            </Button>

            {/* Admin User Dropdown */}
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                className={styles.userDropdown}
                id="admin-user-dropdown"
              >
                <img
                  src={adminUser.avatar}
                  alt="Admin"
                  className={styles.userAvatar}
                />
                <div className={styles.userInfo}>
                  <div className={styles.userName}>{adminUser.name}</div>
                  <div className={styles.userRole}>{adminUser.role}</div>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className={styles.userMenu}>
                <Dropdown.Item className={styles.userMenuItem}>
                  <PersonCircle className="me-2" />
                  Profile Settings
                </Dropdown.Item>
                <Dropdown.Item className={styles.userMenuItem}>
                  <Gear className="me-2" />
                  System Settings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item 
                  className={`${styles.userMenuItem} ${styles.logoutItem}`}
                  onClick={handleLogout}
                >
                  <BoxArrowRight className="me-2" />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Container>
      </Navbar>

      {/* Desktop Sidebar */}
      <div className={`${styles.sidebar} d-none d-lg-block`}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Offcanvas
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        placement="start"
        className={styles.mobileSidebar}
      >
        <Offcanvas.Header closeButton className={styles.offcanvasHeader}>
          <Offcanvas.Title>Admin Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className={styles.offcanvasBody}>
          <SidebarContent />
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        <Container fluid className={styles.contentContainer}>
          <Outlet />
        </Container>
      </div>
    </div>
  );
};

export default AdminLayout;
