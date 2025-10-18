import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { ArrowRight, GeoAlt, Send } from 'react-bootstrap-icons';
import styles from './HomePage.module.css';

const HomePage = () => {
    return (
        <div className={styles.homePage}>
            {/* Hero Banner */}
            <section className={styles.heroSection}>
                <Container>
                    <Row className="align-items-center min-vh-75">
                        <Col lg={6}>
                            <h1 className={styles.heroTitle}>
                                Discover Your Next Great Read
                            </h1>
                            <p className={styles.heroSubtitle}>
                                Explore thousands of books, digital resources, and community programs at your fingertips. 
                                Join our vibrant community of readers and learners.
                            </p>
                            <div className={styles.heroButtons}>
                                <Button as={Link} to="/books" className="btn-accent-cta me-3">
                                    Discover Now <ArrowRight className="ms-2" />
                                </Button>
                                <Button className="btn-primary-outline">
                                    <GeoAlt className="me-2" />
                                    Find a Branch
                                </Button>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className={styles.heroImage}>
                                <img 
                                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=center" 
                                    alt="Library interior with books and reading spaces"
                                    className="img-fluid rounded"
                                />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* What's Happening Section */}
            <section className={styles.whatsHappeningSection}>
                <Container>
                    <Row>
                        <Col lg={12} className="text-center mb-5">
                            <h2 className={styles.sectionTitle}>What's Happening</h2>
                            <p className={styles.sectionSubtitle}>
                                Stay up to date with our latest programs, events, and new arrivals
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4} className="mb-4">
                            <Card className="custom-card h-100">
                                <Card.Img 
                                    variant="top" 
                                    src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop&crop=center"
                                    alt="New Books"
                                />
                                <Card.Body>
                                    <Card.Title>New Books This Month</Card.Title>
                                    <Card.Text>
                                        Discover the latest additions to our collection, featuring bestsellers, 
                                        award winners, and hidden gems across all genres.
                                    </Card.Text>
                                    <Button variant="primary" size="sm">View Collection</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4} className="mb-4">
                            <Card className="custom-card h-100">
                                <Card.Img 
                                    variant="top" 
                                    src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=250&fit=crop&crop=center"
                                    alt="Community Events"
                                />
                                <Card.Body>
                                    <Card.Title>Community Events</Card.Title>
                                    <Card.Text>
                                        Join our book clubs, author readings, workshops, and family-friendly 
                                        activities happening throughout the month.
                                    </Card.Text>
                                    <Button variant="primary" size="sm">See Events</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4} className="mb-4">
                            <Card className="custom-card h-100">
                                <Card.Img 
                                    variant="top" 
                                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop&crop=center"
                                    alt="Digital Resources"
                                />
                                <Card.Body>
                                    <Card.Title>Digital Resources</Card.Title>
                                    <Card.Text>
                                        Access our extensive digital collection including eBooks, audiobooks, 
                                        databases, and online learning platforms.
                                    </Card.Text>
                                    <Button as={Link} to="/books?category=digital" variant="primary" size="sm">Explore Digital</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Visit Our Branches Section */}
            <section className={styles.branchesSection}>
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6}>
                            <h2 className={styles.sectionTitle}>Visit Our Branches</h2>
                            <p className={styles.sectionText}>
                                With multiple locations throughout the city, we're here to serve your community. 
                                Each branch offers unique programs, specialized collections, and welcoming spaces 
                                for reading, studying, and connecting with others.
                            </p>
                            <ul className={styles.branchFeatures}>
                                <li>Extended hours and weekend availability</li>
                                <li>Free WiFi and computer access</li>
                                <li>Study rooms and quiet spaces</li>
                                <li>Children's programs and teen zones</li>
                            </ul>
                            <Button className="btn-primary-outline mt-3">
                                <GeoAlt className="me-2" />
                                Find Your Nearest Branch
                            </Button>
                        </Col>
                        <Col lg={6}>
                            <div className={styles.branchImage}>
                                <img 
                                    src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&h=400&fit=crop&crop=center" 
                                    alt="Modern library branch exterior"
                                    className="img-fluid rounded"
                                />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Stay in Touch Section */}
            <section className={styles.newsletterSection}>
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={8} className="text-center">
                            <h2 className={styles.sectionTitle}>Stay in Touch</h2>
                            <p className={styles.sectionText}>
                                Get the latest news, event announcements, and book recommendations 
                                delivered straight to your inbox.
                            </p>
                            <Form className={styles.newsletterForm}>
                                <InputGroup className="mb-3">
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email address"
                                        size="lg"
                                    />
                                    <Button className="btn-primary-solid" size="lg">
                                        <Send className="me-2" />
                                        Subscribe
                                    </Button>
                                </InputGroup>
                            </Form>
                            <small className={styles.privacyText}>
                                We respect your privacy. Unsubscribe at any time.
                            </small>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default HomePage;
