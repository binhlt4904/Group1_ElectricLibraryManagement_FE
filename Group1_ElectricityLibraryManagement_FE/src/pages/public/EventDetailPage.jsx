import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserContext from '../../components/contexts/UserContext';
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
import { Spinner } from 'react-bootstrap';
import eventAPI from '../../api/event';
import eventRegistrationAPI from '../../api/eventRegistration';
import profileApi from '../../api/user/profile';
import styles from './EventDetailPage.module.css';

// Backend base URL for image display
const API_BASE_URL = 'http://localhost:8080';

// Helper function to construct full image URL
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop';
  if (imageUrl.startsWith('http')) return imageUrl; // Already a full URL
  return `${API_BASE_URL}${imageUrl}`; // Prepend base URL for relative paths
};

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext) || {};
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({
    name: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    specialRequests: ''
  });

  // Update registration form when user info changes
  useEffect(() => {
    if (user) {
      setRegistrationForm(prev => ({
        ...prev,
        name: user.fullName || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  // Prefill from profile when modal opens
  useEffect(() => {
    let mounted = true;
    if (showRegistrationModal) {
      (async () => {
        try {
          const profile = await profileApi.get();
          if (!mounted || !profile) return;
          setRegistrationForm(prev => ({
            ...prev,
            name: profile.fullName || prev.name || '',
            email: profile.email || prev.email || '',
            phone: profile.phone || prev.phone || ''
          }));
        } catch (e) {
          // ignore prefill error
        }
      })();
    }
    return () => { mounted = false; };
  }, [showRegistrationModal]);

  // Fetch event data from API
  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await eventAPI.getEventById(id);
      setEvent(response.data);
    } catch (err) {
      console.error('Error fetching event details:', err);
      setError('Failed to load event details. The event may not exist.');
    } finally {
      setIsLoading(false);
    }
  };

  // Mock event data for fallback
  const mockEvent = {
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

  const handleRegistration = async () => {
    if (isRegistered) {
      // Handle unregistration
      try {
        await eventRegistrationAPI.cancelRegistration(id);
        setIsRegistered(false);
        alert('Registration cancelled successfully');
      } catch (error) {
        console.error('Error cancelling registration:', error);
        alert('Failed to cancel registration');
      }
    } else {
      setShowRegistrationModal(true);
    }
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    try {
      const registrationData = {
        fullName: registrationForm.name,
        email: registrationForm.email,
        phone: registrationForm.phone,
        specialRequests: registrationForm.specialRequests
      };
      
      await eventRegistrationAPI.registerForEvent(id, registrationData);
      setIsRegistered(true);
      setShowRegistrationModal(false);
      setRegistrationForm({ name: '', email: '', phone: '', specialRequests: '' });
      alert('Successfully registered for event');
    } catch (error) {
      console.error('Error registering for event:', error);
      alert('Failed to register for event: ' + (error.response?.data?.message || error.message));
    }
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

  // Show loading state
  if (isLoading) {
    return (
      <Container fluid className={styles.eventDetailPage}>
        <Container className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading event details...</p>
        </Container>
      </Container>
    );
  }

  // Show error state
  if (error || !event) {
    return (
      <Container fluid className={styles.eventDetailPage}>
        <Container>
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
          <Alert variant="danger" className="mt-4">
            <ExclamationTriangle className="me-2" />
            {error || 'Event not found'}
          </Alert>
        </Container>
      </Container>
    );
  }

  // Use real event data or fallback to mock
  const eventData = event || mockEvent;
  const availabilityStatus = getAvailabilityStatus(
    eventData.registered || 0, 
    eventData.capacity || 1
  );
  const registrationPercentage = ((eventData.registered || 0) / (eventData.capacity || 1)) * 100;

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
                  src={getImageUrl(eventData.imageUrl || eventData.image)}
                  alt={eventData.title}
                  className={styles.eventImage}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop';
                  }}
                />
                <div className={styles.imageOverlay}>
                  {eventData.category && (
                    <Badge 
                      bg={getCategoryColor(eventData.category)} 
                      className={styles.categoryBadge}
                    >
                      {eventData.category}
                    </Badge>
                  )}
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
                  <h1 className={styles.eventTitle}>{eventData.title}</h1>
                  {eventData.capacity && (
                    <Badge 
                      bg={availabilityStatus.variant}
                      className={styles.availabilityBadge}
                    >
                      {availabilityStatus.text}
                    </Badge>
                  )}
                </div>

                {/* Event Details */}
                <div className={styles.eventMeta}>
                  <div className={styles.metaItem}>
                    <Calendar className={styles.metaIcon} />
                    <span>{formatDate(eventData.eventDate || eventData.date || eventData.createdDate)}</span>
                  </div>
                  {(eventData.startTime || eventData.endTime || eventData.time) && (
                    <div className={styles.metaItem}>
                      <Clock className={styles.metaIcon} />
                      <span>
                        {eventData.startTime && eventData.endTime
                          ? `${eventData.startTime} - ${eventData.endTime}`
                          : eventData.time || 'TBA'}
                      </span>
                    </div>
                  )}
                  {eventData.location && (
                    <div className={styles.metaItem}>
                      <GeoAlt className={styles.metaIcon} />
                      <span>{eventData.location}</span>
                    </div>
                  )}
                  {eventData.capacity && (
                    <div className={styles.metaItem}>
                      <People className={styles.metaIcon} />
                      <span>{eventData.registered || 0}/{eventData.capacity} registered</span>
                    </div>
                  )}
                </div>

                {/* Registration Progress */}
                {eventData.capacity && (
                  <div className={styles.registrationProgress}>
                    <div className={styles.progressHeader}>
                      <span className={styles.progressLabel}>Registration Progress</span>
                      <span className={styles.progressText}>
                        {eventData.registered || 0} of {eventData.capacity} spots filled
                      </span>
                    </div>
                    <ProgressBar 
                      now={registrationPercentage} 
                      variant={availabilityStatus.variant}
                      className={styles.progressBar}
                    />
                  </div>
                )}

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
                    {(eventData.fullDescription || eventData.description || '').split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                {/* Event Tags */}
                {eventData.tags && eventData.tags.length > 0 && (
                  <div className={styles.tagsSection}>
                    <h4 className={styles.tagsTitle}>Tags</h4>
                    <div className={styles.tags}>
                      {eventData.tags.map((tag, index) => (
                        <Badge key={index} bg="light" text="dark" className={styles.tag}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Agenda */}
                {eventData.agenda && eventData.agenda.length > 0 && (
                  <div className={styles.agendaSection}>
                    <h3 className={styles.sectionTitle}>Event Agenda</h3>
                    <div className={styles.agenda}>
                      {eventData.agenda.map((item, index) => (
                        <div key={index} className={styles.agendaItem}>
                          <div className={styles.agendaTime}>{item.time}</div>
                          <div className={styles.agendaActivity}>{item.activity}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                  {eventData.price && (
                    <div className={styles.infoItem}>
                      <strong>Price:</strong> {eventData.price}
                    </div>
                  )}
                  {eventData.ageGroup && (
                    <div className={styles.infoItem}>
                      <strong>Age Group:</strong> {eventData.ageGroup}
                    </div>
                  )}
                  {eventData.difficulty && (
                    <div className={styles.infoItem}>
                      <strong>Difficulty:</strong> {eventData.difficulty}
                    </div>
                  )}
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
            {(eventData.organizerFullName || eventData.organizer || eventData.createdByName) && (
              <Card className={styles.sidebarCard}>
                <Card.Body>
                  <h4 className={styles.sidebarTitle}>Event Organizer</h4>
                  <div className={styles.organizerInfo}>
                    <div className={styles.organizerHeader}>
                      <PersonFill className={styles.organizerIcon} />
                      <div>
                        <div className={styles.organizerName}>
                          {eventData.organizerFullName || eventData.organizer || eventData.createdByName}
                        </div>
                        {eventData.organizerTitle && (
                          <div className={styles.organizerTitle}>{eventData.organizerTitle}</div>
                        )}
                      </div>
                    </div>
                    {eventData.organizerEmail && (
                      <div className={styles.organizerContact}>
                        <div>Email: {eventData.organizerEmail}</div>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Requirements */}
            {eventData.requirements && eventData.requirements.length > 0 && (
              <Card className={styles.sidebarCard}>
                <Card.Body>
                  <h4 className={styles.sidebarTitle}>Requirements</h4>
                  <ul className={styles.requirementsList}>
                    {eventData.requirements.map((requirement, index) => (
                      <li key={index}>{requirement}</li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>

      {/* Registration Modal */}
      <Modal show={showRegistrationModal} onHide={() => setShowRegistrationModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Register for {eventData.title}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleRegistrationSubmit}>
          <Modal.Body>
            <Alert variant="info" className="mb-4">
              <strong>Note:</strong> Your Full Name and Email Address are pre-filled from your account information. You can edit them if needed.
            </Alert>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={registrationForm.name}
                    onChange={(e) => setRegistrationForm({...registrationForm, name: e.target.value})}
                    placeholder="Enter your full name"
                  />
                  <Form.Text className="text-muted">From your account profile</Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="email"
                    required
                    value={registrationForm.email}
                    onChange={(e) => setRegistrationForm({...registrationForm, email: e.target.value})}
                    placeholder="Enter your email address"
                  />
                  <Form.Text className="text-muted">From your account profile</Form.Text>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                value={registrationForm.phone}
                onChange={(e) => setRegistrationForm({...registrationForm, phone: e.target.value})}
                placeholder="Enter your phone number (optional)"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Special Requests or Questions</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={registrationForm.specialRequests}
                onChange={(e) => setRegistrationForm({...registrationForm, specialRequests: e.target.value})}
                placeholder="Tell us about any special requests, dietary restrictions, accessibility needs, or questions about the event..."
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
