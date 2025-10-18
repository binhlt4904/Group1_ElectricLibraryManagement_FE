import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Form, Button, InputGroup, Dropdown } from 'react-bootstrap';
import { Search, PersonFill, BoxArrowRight, PersonCircle, CreditCard, ClockHistory, Wallet, Bell } from 'react-bootstrap-icons';
import styles from './Header.module.css';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    // Mock user authentication state - in real app this would come from context/redux
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'reader' // 'reader' or 'admin'
    });

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/books?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUser(null);
        navigate('/');
    };

    const isActivePage = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <>
            {/* Top tier */}
            <Navbar bg="white" className={`${styles.topTier} border-bottom`}>
                <Container>
                    <Navbar.Brand as={Link} to="/" className={styles.logo}>
                        <div className={styles.logoGrid}>
                            <div className={`${styles.logoPixel} ${styles.blue}`}></div>
                            <div className={`${styles.logoPixel} ${styles.green}`}></div>
                            <div className={`${styles.logoPixel} ${styles.blue}`}></div>
                            <div className={`${styles.logoPixel} ${styles.pink}`}></div>
                            <div className={`${styles.logoPixel} ${styles.green}`}></div>
                            <div className={`${styles.logoPixel} ${styles.blue}`}></div>
                            <div className={`${styles.logoPixel} ${styles.pink}`}></div>
                            <div className={`${styles.logoPixel} ${styles.green}`}></div>
                            <div className={`${styles.logoPixel} ${styles.pink}`}></div>
                            <div className={`${styles.logoPixel} ${styles.green}`}></div>
                            <div className={`${styles.logoPixel} ${styles.blue}`}></div>
                            <div className={`${styles.logoPixel} ${styles.pink}`}></div>
                            <div className={`${styles.logoPixel} ${styles.blue}`}></div>
                            <div className={`${styles.logoPixel} ${styles.pink}`}></div>
                            <div className={`${styles.logoPixel} ${styles.green}`}></div>
                            <div className={`${styles.logoPixel} ${styles.blue}`}></div>
                        </div>
                        <div className={styles.logoText}>
                            <div className={styles.logoTitle}>ELECTRICITY LIBRARY</div>
                            <div className={styles.logoSubtitle}>Digital Knowledge Hub</div>
                        </div>
                    </Navbar.Brand>

                    <Nav className="ms-auto">
                        {!isLoggedIn ? (
                            <>
                                <Nav.Link as={Link} to="/register" className={styles.topNavLink}>Join</Nav.Link>
                                <Nav.Link as={Link} to="/login" className={styles.topNavLink}>Login</Nav.Link>
                                <Nav.Link href="#contact" className={styles.topNavLink}>Contact</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/notifications" className={styles.topNavLink}>
                                    <Bell className="me-1" />
                                    <span className={styles.notificationBadge}>3</span>
                                </Nav.Link>
                                <Dropdown align="end">
                                    <Dropdown.Toggle variant="link" className={styles.userDropdown} id="user-dropdown">
                                        <PersonCircle size={24} className="me-2" />
                                        {user.name}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className={styles.userDropdownMenu}>
                                        <Dropdown.Header>
                                            <div className={styles.userInfo}>
                                                <strong>{user.name}</strong>
                                                <small className="text-muted d-block">{user.email}</small>
                                            </div>
                                        </Dropdown.Header>
                                        <Dropdown.Divider />
                                        <Dropdown.Item as={Link} to="/user/profile">
                                            <PersonCircle className="me-2" />
                                            My Profile
                                        </Dropdown.Item>
                                        <Dropdown.Item as={Link} to="/user/borrow-history">
                                            <ClockHistory className="me-2" />
                                            Borrowing History
                                        </Dropdown.Item>
                                        <Dropdown.Item as={Link} to="/user/library-card">
                                            <CreditCard className="me-2" />
                                            Library Card
                                        </Dropdown.Item>
                                        <Dropdown.Item as={Link} to="/user/wallet">
                                            <Wallet className="me-2" />
                                            My Wallet
                                        </Dropdown.Item>
                                        {user.role === 'admin' && (
                                            <>
                                                <Dropdown.Divider />
                                                <Dropdown.Item as={Link} to="/admin">
                                                    <PersonFill className="me-2" />
                                                    Admin Panel
                                                </Dropdown.Item>
                                            </>
                                        )}
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={handleLogout}>
                                            <BoxArrowRight className="me-2" />
                                            Logout
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </>
                        )}
                    </Nav>
                </Container>
            </Navbar>

            {/* Bottom tier */}
            <Navbar bg="white" className={styles.bottomTier}>
                <Container>
                    <Nav className="justify-content-center w-100">
                        <Nav.Link
                            as={Link}
                            to="/books"
                            className={`${styles.navLink} ${isActivePage('/books') ? styles.active : ''}`}
                        >
                            Books & More
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/events"
                            className={`${styles.navLink} ${isActivePage('/events') ? styles.active : ''}`}
                        >
                            Events & Classes
                        </Nav.Link>
                        <Nav.Link
                            href="#research"
                            className={styles.navLink}
                        >
                            Research
                        </Nav.Link>
                        {isLoggedIn && (
                            <Nav.Link
                                as={Link}
                                to="/user/profile"
                                className={`${styles.navLink} ${isActivePage('/user') ? styles.active : ''}`}
                            >
                                My Account
                            </Nav.Link>
                        )}
                    </Nav>

                    <div className={styles.searchSection}>
                        <Form onSubmit={handleSearch}>
                            <InputGroup className={styles.searchGroup}>
                                <Form.Control
                                    type="text"
                                    placeholder="Search books, authors, topics..."
                                    className={styles.searchInput}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Button
                                    variant="primary"
                                    className={styles.searchButton}
                                    type="submit"
                                >
                                    <Search />
                                </Button>
                            </InputGroup>
                        </Form>
                    </div>
                </Container>
            </Navbar>
        </>
    );
};

export default Header;
