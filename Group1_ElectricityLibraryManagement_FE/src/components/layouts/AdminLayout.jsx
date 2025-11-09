import React, { useEffect, useState, useContext, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Container, Nav, Navbar, Offcanvas, Button, Dropdown, Badge
} from 'react-bootstrap';
import {
  List, House, BookFill, PersonFill, Building, People, Tags,
  ClipboardData, CalendarEvent, ExclamationTriangle, FileEarmark,
  Gear, BoxArrowRight, PersonCircle, CreditCard
} from 'react-bootstrap-icons';
import styles from './AdminLayout.module.css';
import UserContext from '../contexts/UserContext';
import NotificationBell from '../commons/NotificationBell';

const ALL_ITEMS = {
  dashboard:      { path: '/admin/dashboard',     icon: House,           label: 'Dashboard' },
  categories:     { path: '/admin/categories',    icon: Tags,            label: 'Category Management' },
  books:          { path: '/admin/books',         icon: BookFill,        label: 'Books Management' },
  authors:        { path: '/admin/authors',       icon: PersonFill,      label: 'Authors Management' },
  publishers:     { path: '/admin/publishers',    icon: Building,        label: 'Publishers Management' },
  readers:        { path: '/admin/readers',       icon: People,          label: 'Readers Management' },
  staff:          { path: '/admin/system-users',  icon: People,          label: 'Staff Management' },
  borrowals:      { path: '/admin/borrowals',     icon: ClipboardData,   label: 'Borrowals Management' },
  events:         { path: '/admin/events',        icon: CalendarEvent,   label: 'Events Management' },
  libraryCards:   { path: '/admin/library-cards', icon: CreditCard,      label: 'Library Cards' },
  userReports:    { path: '/admin/user-reports',  icon: ExclamationTriangle, label: 'User Reports' },
  documents:      { path: '/admin/documents',     icon: FileEarmark,     label: 'Documents' },
};

// Role -> danh sách key của ALL_ITEMS hiển thị
const VISIBLE_BY_ROLE = {
  ADMIN: [
    'dashboard', 'staff', 'readers', 'libraryCards',
    
  ],
  LIBRARIAN: [
    // “các phần còn lại” + Dashboard
    'dashboard',
    'categories', 'books', 'authors', 'publishers',
    'borrowals', 'events', 'documents', 'userReports',
    // Librarian KHÔNG có: staff, readers, libraryCards (theo mô tả của bạn)
  ],
};

const PANEL_TITLE_BY_ROLE = {
  ADMIN: 'Admin Panel',
  LIBRARIAN: 'Librarian Panel',
};
const MENU_TITLE_BY_ROLE = {
  ADMIN: 'Admin Menu',
  LIBRARIAN: 'Librarian Menu',
};

const AdminLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, setUserContext } = useContext(UserContext);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  const role = user?.role || 'GUEST';
  console.log(role)

  const navigationItems = useMemo(() => {
    const keys = VISIBLE_BY_ROLE[role] || [];
    return keys.map(k => ALL_ITEMS[k]);
  }, [role]);

  const handleNavigation = (path) => {
    navigate(path);
    setShowSidebar(false);
  };

  const handleLogout = async () => {
    try {
      await auth.logout?.();
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('accessToken');
    setUserContext(null);
    navigate('/');
  };

  const isActiveRoute = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

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
            <div className={styles.logoSubtitle}>
              {role === 'ADMIN' ? 'ADMIN' : 'LIBRARIAN'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <Nav className={`flex-column ${styles.sidebarNav}`}>
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          const active = isActiveRoute(item.path);
          return (
            <Nav.Link
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`${styles.navItem} ${active ? styles.active : ''}`}
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

  const panelTitle = PANEL_TITLE_BY_ROLE[role] || 'Admin Panel';
  const menuTitle  = MENU_TITLE_BY_ROLE[role]  || 'Admin Menu';

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
              {panelTitle}
            </Navbar.Brand>
          </div>

          <div className={styles.topNavRight}>
            <NotificationBell variant="outline-secondary" size="md" />
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                className={styles.userDropdown}
                id="admin-user-dropdown"
              >
                <div className={styles.userInfo}>
                  <div className={styles.userName}>{user?.username || 'Loading...'}</div>
                  <div className={styles.userRole}>{user?.role || ''}</div>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className={styles.userMenu}>
                
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

      {/* Mobile Sidebar */}
      <Offcanvas
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        placement="start"
        className={styles.mobileSidebar}
      >
        <Offcanvas.Header closeButton className={styles.offcanvasHeader}>
          <Offcanvas.Title>{menuTitle}</Offcanvas.Title>
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
