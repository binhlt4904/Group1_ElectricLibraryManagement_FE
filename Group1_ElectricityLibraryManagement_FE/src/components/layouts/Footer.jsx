import React from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { EnvelopeAt, Facebook, Instagram, Youtube, Twitter } from 'react-bootstrap-icons';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            {/* Newsletter Section */}
            <div className={styles.newsletterSection}>
                <Container>
                    <Row className="align-items-center">
                        <Col md={6}>
                            <div className={styles.newsletterContent}>
                                <EnvelopeAt className={styles.newsletterIcon} />
                                <div>
                                    <h3 className={styles.newsletterTitle}>eNewsletter Signup</h3>
                                    <p className={styles.newsletterText}>Sign up to get the best of the Library in your inbox.</p>
                                </div>
                            </div>
                        </Col>
                        <Col md={6}>
                            <Form className={styles.newsletterForm}>
                                <InputGroup>
                                    <Form.Control
                                        type="email"
                                        placeholder="Your Email"
                                        className={styles.emailInput}
                                    />
                                    <Button variant="dark" className={styles.submitButton}>
                                        →
                                    </Button>
                                </InputGroup>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Main Footer Content */}
            <div className={styles.mainFooter}>
                <Container>
                    <Row>
                        <Col md={3}>
                            <h4 className={styles.footerHeading}>Books & More</h4>
                            <ul className={styles.footerList}>
                                <li><a href="#" className={styles.footerLink}>Books, eBooks & Audiobooks</a></li>
                                <li><a href="#" className={styles.footerLink}>Movies, Music & More</a></li>
                                <li><a href="#" className={styles.footerLink}>Blogs</a></li>
                                <li><a href="#" className={styles.footerLink}>Podcasts</a></li>
                            </ul>
                        </Col>
                        <Col md={3}>
                            <h4 className={styles.footerHeading}>Events & Classes</h4>
                            <ul className={styles.footerList}>
                                <li><a href="#" className={styles.footerLink}>Calendar</a></li>
                                <li><a href="#" className={styles.footerLink}>Exhibitions</a></li>
                                <li><a href="#" className={styles.footerLink}>Workshops</a></li>
                                <li><a href="#" className={styles.footerLink}>Book Clubs</a></li>
                            </ul>
                        </Col>
                        <Col md={3}>
                            <h4 className={styles.footerHeading}>Research</h4>
                            <ul className={styles.footerList}>
                                <li><a href="#" className={styles.footerLink}>Digital Archives</a></li>
                                <li><a href="#" className={styles.footerLink}>Databases</a></li>
                                <li><a href="#" className={styles.footerLink}>Research Help</a></li>
                                <li><a href="#" className={styles.footerLink}>Citation Tools</a></li>
                            </ul>
                        </Col>
                        <Col md={3}>
                            <h4 className={styles.footerHeading}>Services</h4>
                            <ul className={styles.footerList}>
                                <li><a href="#" className={styles.footerLink}>Get a Library Card</a></li>
                                <li><a href="#" className={styles.footerLink}>Find a Location</a></li>
                                <li><a href="#" className={styles.footerLink}>Meeting Rooms</a></li>
                                <li><a href="#" className={styles.footerLink}>Tech Support</a></li>
                            </ul>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Bottom Footer */}
            <div className={styles.bottomFooter}>
                <Container>
                    <Row className="align-items-center">
                        <Col md={6}>
                            <p className={styles.copyright}>
                                &copy; {new Date().getFullYear()} Electricity Library. All rights reserved.
                            </p>
                        </Col>
                        <Col md={6}>
                            <div className={styles.socialLinks}>
                                <a href="#" className={styles.socialLink}><Facebook /></a>
                                <a href="#" className={styles.socialLink}><Instagram /></a>
                                <a href="#" className={styles.socialLink}><Youtube /></a>
                                <a href="#" className={styles.socialLink}><Twitter /></a>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </footer>
    );
};

export default Footer;
