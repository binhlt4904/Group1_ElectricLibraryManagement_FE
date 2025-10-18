import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Badge, 
  Alert, 
  Form, 
  Modal,
  ProgressBar 
} from 'react-bootstrap';
import { 
  Calendar, 
  Clock, 
  GeoAlt, 
  People, 
  PersonFill, 
  ArrowLeft,
  Share,
  Heart,
  HeartFill,
  CheckCircle,
  ExclamationTriangle
} from 'react-bootstrap-icons';
import styles from './EventDetailPage.module.css';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  // Mock event data - in real app, this would be fetched based on ID
  const event = {
    id: parseInt(id) || 1,
    title: "Digital Literacy Workshop",
    description: "Join us for a comprehensive digital literacy workshop designed to help you navigate the modern digital world with confidence. This hands-on session will cover essential skills including internet navigation, email management, online safety, and basic computer troubleshooting.",
    fullDescription: `This workshop is perfect for beginners who want to improve their digital skills or anyone looking to refresh their knowledge of modern technology. Our experienced instructors will guide you through practical exercises and provide personalized assistance.

What you'll learn:
• Basic computer navigation and file management
• Internet browsing and search techniques
• Email setup and management
• Online safety and privacy protection
• Social media basics
• Digital banking and online shopping safety
• Troubleshooting common computer issues

What to bring:
• Your own laptop or tablet (if you have one)
• A notebook for taking notes
• Any specific questions you'd like addressed

Prerequisites: None - this workshop is designed for complete beginners.

Refreshments will be provided during the break.`,
    date: "2024-01-15",
    time: "10:00 AM - 12:00 PM",
    location: "Main Library - Computer Lab",
    address: "123 Library Street, Downtown",
    category: "Workshop",
    capacity: 20,
    registered: 15,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
    organizer: "Sarah Johnson",
    organizerTitle: "Digital Services Librarian",
    organizerEmail: "sarah.johnson@library.org",
    organizerPhone: "(555) 123-4567",
    status: "upcoming",
    price: "Free",
    ageGroup: "Adults (18+)",
    difficulty: "Beginner",
    tags: ["Technology", "Education", "Free", "Beginner-Friendly"],
    requirements: [
      "No prior experience required",
      "Bring your own device if possible",
      "Comfortable seating provided"
    ],
    agenda: [
      { time: "10:00 AM", activity: "Welcome & Introductions" },
      { time: "10:15 AM", activity: "Computer Basics & Navigation" },
      { time: "10:45 AM", activity: "Internet Browsing & Search" },
      { time: "11:15 AM", activity: "Break" },
      { time: "11:30 AM", activity: "Email & Online Safety" },
      { time: "12:00 PM", activity: "Q&A & Wrap-up" }
    ]
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Workshop': 'primary',
      'Children': 'success',
      'Book Club': 'info',
      'Author Event': 'warning',
      'Gaming': 'danger'
    };
    return colors[category] || 'secondary';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getAvailabilityStatus = (registered, capacity) => {
    const percentage = (registered / capacity) * 100;
    if (percentage >= 100) return { text: 'Full', variant: 'danger', canRegister: false };
    if (percentage >= 90) return { text: 'Almost Full', variant: 'warning', canRegister: true };
    if (percentage >= 70) return { text: 'Filling Up', variant: 'warning', canRegister: true };
    return { text: 'Available', variant: 'success', canRegister: true };
  };

  const handleRegistration = () => {
    if (isRegistered) {
      // Handle unregistration
      setIsRegistered(false);
    } else {
      setShowRegistrationModal(true);
    }
  };

  const handleRegistrationSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
    setIsRegistered(true);
    setShowRegistrationModal(false);
    setRegistrationForm({ name: '', email: '', phone: '', specialRequests: '' });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const availabilityStatus = getAvailabilityStatus(event.registered, event.capacity);
  const registrationPercentage = (event.registered / event.capacity) * 100;

  return (
    <Container fluid className={styles.eventDetailPage}>
      <Container>
        {/* Back Button */}
        <Row className="mb-3">
          <Col>
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate('/events')}
              className={styles.backButton}
            >
              <ArrowLeft className="me-2" />
              Back to Events
            </Button>
          </Col>
        </Row>

        <Row>
          {/* Main Content */}
          <Col lg={8} className="mb-4">
            <Card className={styles.mainCard}>
              {/* Event Image */}
              <div className={styles.imageContainer}>
                <Card.Img 
                  variant="top" 
                  src={event.image} 
                  alt={event.title}
                  className={styles.eventImage}
                />
                <div className={styles.imageOverlay}>
                  <Badge 
                    bg={getCategoryColor(event.category)} 
                    className={styles.categoryBadge}
                  >
                    {event.category}
                  </Badge>
                  <div className={styles.imageActions}>
                    <Button
                      variant="light"
                      size="sm"
                      onClick={() => setIsFavorited(!isFavorited)}
                      className={styles.favoriteButton}
                    >
                      {isFavorited ? <HeartFill /> : <Heart />}
                    </Button>
                    <Button
                      variant="light"
                      size="sm"
                      onClick={handleShare}
                      className={styles.shareButton}
                    >
                      <Share />
                    </Button>
                  </div>
                </div>
              </div>

              <Card.Body className={styles.mainCardBody}>
                {/* Event Header */}
                <div className={styles.eventHeader}>
                  <h1 className={styles.eventTitle}>{event.title}</h1>
                  <Badge 
                    bg={availabilityStatus.variant}
                    className={styles.availabilityBadge}
                  >
                    {availabilityStatus.text}
                  </Badge>
                </div>

                {/* Event Details */}
                <div className={styles.eventMeta}>
                  <div className={styles.metaItem}>
                    <Calendar className={styles.metaIcon} />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Clock className={styles.metaIcon} />
                    <span>{event.time}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <GeoAlt className={styles.metaIcon} />
                    <span>{event.location}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <People className={styles.metaIcon} />
                    <span>{event.registered}/{event.capacity} registered</span>
                  </div>
                </div>

                {/* Registration Progress */}
                <div className={styles.registrationProgress}>
                  <div className={styles.progressHeader}>
                    <span className={styles.progressLabel}>Registration Progress</span>
                    <span className={styles.progressText}>
                      {event.registered} of {event.capacity} spots filled
                    </span>
                  </div>
                  <ProgressBar 
                    now={registrationPercentage} 
                    variant={availabilityStatus.variant}
                    className={styles.progressBar}
                  />
                </div>

                {/* Registration Status */}
                {isRegistered && (
                  <Alert variant="success" className={styles.registrationAlert}>
                    <CheckCircle className="me-2" />
                    You are registered for this event! Check your email for confirmation details.
                  </Alert>
                )}

                {/* Description */}
                <div className={styles.description}>
                  <h3 className={styles.sectionTitle}>About This Event</h3>
                  <div className={styles.descriptionText}>
                    {event.fullDescription.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                {/* Event Tags */}
                <div className={styles.tagsSection}>
                  <h4 className={styles.tagsTitle}>Tags</h4>
                  <div className={styles.tags}>
                    {event.tags.map((tag, index) => (
                      <Badge key={index} bg="light" text="dark" className={styles.tag}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Agenda */}
                <div className={styles.agendaSection}>
                  <h3 className={styles.sectionTitle}>Event Agenda</h3>
                  <div className={styles.agenda}>
                    {event.agenda.map((item, index) => (
                      <div key={index} className={styles.agendaItem}>
                        <div className={styles.agendaTime}>{item.time}</div>
                        <div className={styles.agendaActivity}>{item.activity}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            {/* Registration Card */}
            <Card className={styles.sidebarCard}>
              <Card.Body>
                <h4 className={styles.sidebarTitle}>Event Registration</h4>
                
                <div className={styles.eventInfo}>
                  <div className={styles.infoItem}>
                    <strong>Price:</strong> {event.price}
                  </div>
                  <div className={styles.infoItem}>
                    <strong>Age Group:</strong> {event.ageGroup}
                  </div>
                  <div className={styles.infoItem}>
                    <strong>Difficulty:</strong> {event.difficulty}
                  </div>
                </div>

                <div className={styles.registrationActions}>
                  <Button
                    variant={isRegistered ? "outline-danger" : "primary"}
                    size="lg"
                    onClick={handleRegistration}
                    disabled={!availabilityStatus.canRegister && !isRegistered}
                    className={styles.registrationButton}
                  >
                    {isRegistered ? 'Cancel Registration' : 
                     !availabilityStatus.canRegister ? 'Event Full' : 'Register Now'}
                  </Button>
                </div>

                {!availabilityStatus.canRegister && !isRegistered && (
                  <Alert variant="warning" className={styles.fullAlert}>
                    <ExclamationTriangle className="me-2" />
                    This event is currently full. You can join the waitlist.
                  </Alert>
                )}
              </Card.Body>
            </Card>

            {/* Organizer Info */}
            <Card className={styles.sidebarCard}>
              <Card.Body>
                <h4 className={styles.sidebarTitle}>Event Organizer</h4>
                <div className={styles.organizerInfo}>
                  <div className={styles.organizerHeader}>
                    <PersonFill className={styles.organizerIcon} />
                    <div>
                      <div className={styles.organizerName}>{event.organizer}</div>
                      <div className={styles.organizerTitle}>{event.organizerTitle}</div>
                    </div>
                  </div>
                  <div className={styles.organizerContact}>
                    <div>Email: {event.organizerEmail}</div>
                    <div>Phone: {event.organizerPhone}</div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Requirements */}
            <Card className={styles.sidebarCard}>
              <Card.Body>
                <h4 className={styles.sidebarTitle}>Requirements</h4>
                <ul className={styles.requirementsList}>
                  {event.requirements.map((requirement, index) => (
                    <li key={index}>{requirement}</li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Registration Modal */}
      <Modal show={showRegistrationModal} onHide={() => setShowRegistrationModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Register for {event.title}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleRegistrationSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={registrationForm.name}
                    onChange={(e) => setRegistrationForm({...registrationForm, name: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address *</Form.Label>
                  <Form.Control
                    type="email"
                    required
                    value={registrationForm.email}
                    onChange={(e) => setRegistrationForm({...registrationForm, email: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                value={registrationForm.phone}
                onChange={(e) => setRegistrationForm({...registrationForm, phone: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Special Requests or Questions</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={registrationForm.specialRequests}
                onChange={(e) => setRegistrationForm({...registrationForm, specialRequests: e.target.value})}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRegistrationModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Complete Registration
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default EventDetailPage;
