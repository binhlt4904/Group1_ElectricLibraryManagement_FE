import React from 'react';
import { Navbar, Nav, Container, Form, Button, InputGroup } from 'react-bootstrap';
import { Search, PersonFill } from 'react-bootstrap-icons';
import styles from './Header.module.css';

const Header = ({ onNavigate, myListCount }) => {
    return (
        <>
            {/* Top tier */}
            <Navbar bg="white" className={`${styles.topTier} border-bottom`}>
                <Container>
                    <Navbar.Brand onClick={() => onNavigate('home')} className={styles.logo}>
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
                        <Nav.Link href="#join" className={styles.topNavLink}>Join</Nav.Link>
                        <Nav.Link href="#login" className={styles.topNavLink}>Login</Nav.Link>
                        <Nav.Link href="#contact" className={styles.topNavLink}>Contact</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>

            {/* Bottom tier */}
            <Navbar bg="white" className={styles.bottomTier}>
                <Container>
                    <Nav className="justify-content-center w-100">
                        <Nav.Link href="#books" className={styles.navLink}>Books & More</Nav.Link>
                        <Nav.Link href="#events" className={styles.navLink}>Events & Classes</Nav.Link>
                        <Nav.Link href="#research" className={styles.navLink}>Research</Nav.Link>
                        <Nav.Link onClick={() => onNavigate('myList')} className={styles.navLink}>
                            My List {myListCount > 0 && <span className={styles.badge}>{myListCount}</span>}
                        </Nav.Link>
                    </Nav>

                    <div className={styles.searchSection}>
                        <InputGroup className={styles.searchGroup}>
                            <Form.Control
                                placeholder="Search books, authors, topics..."
                                className={styles.searchInput}
                            />
                            <Button variant="primary" className={styles.searchButton}>
                                <Search />
                            </Button>
                        </InputGroup>
                    </div>
                </Container>
            </Navbar>
        </>
    );
};

export default Header;
