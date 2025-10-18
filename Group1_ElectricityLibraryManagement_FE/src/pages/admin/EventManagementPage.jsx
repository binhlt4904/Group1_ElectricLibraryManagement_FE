import React, { useState } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Button, 
  Form, 
  InputGroup, 
  Badge, 
  Pagination,
  Modal,
  Alert
} from 'react-bootstrap';
import { 
  CalendarEvent, 
  Search, 
  Plus, 
  Eye, 
  PencilSquare, 
  Trash,
  Calendar,
  Clock,
  GeoAlt,
  People,
  PersonFill
} from 'react-bootstrap-icons';
import styles from './EventManagementPage.module.css';

const EventManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const eventsPerPage = 10;

  // Mock events data
  const mockEvents = [
    {
      id: 1,
      title: "Digital Literacy Workshop",
      description: "Learn essential digital skills including internet navigation, email, and online safety.",
      date: "2024-01-15",
      time: "10:00 AM - 12:00 PM",
      location: "Main Library - Computer Lab",
      category: "Workshop",
      capacity: 20,
      registered: 15,
      organizer: "Sarah Johnson",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop"
    },
    {
      id: 2,
      title: "Children's Story Time",
      description: "Interactive storytelling session for children ages 3-7 with songs and activities.",
      date: "2024-01-18",
      time: "2:00 PM - 3:00 PM",
      location: "Children's Section",
      category: "Children",
      capacity: 25,
      registered: 22,
      organizer: "Emily Chen",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    },
    {
      id: 3,
      title: "Book Club: Modern Fiction",
      description: "Monthly discussion of contemporary literature.",
      date: "2024-01-20",
      time: "6:00 PM - 7:30 PM",
      location: "Meeting Room A",
      category: "Book Club",
      capacity: 15,
      registered: 12,
      organizer: "Michael Rodriguez",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=100&fit=crop"
    },
    {
      id: 4,
      title: "Author Meet & Greet",
      description: "Meet bestselling author Jane Smith and get your books signed.",
      date: "2024-01-25",
      time: "4:00 PM - 6:00 PM",
      location: "Main Hall",
      category: "Author Event",
      capacity: 100,
      registered: 85,
      organizer: "Library Staff",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=100&fit=crop"
    },
    {
      id: 5,
      title: "Teen Gaming Tournament",
      description: "Competitive gaming tournament for teens aged 13-18.",
      date: "2024-01-28",
      time: "3:00 PM - 6:00 PM",
      location: "Teen Zone",
      category: "Gaming",
      capacity: 32,
      registered: 28,
      organizer: "Alex Thompson",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop"
    },
    {
      id: 6,
      title: "Senior Tech Help",
      description: "One-on-one technology assistance for seniors.",
      date: "2024-01-10",
      time: "10:00 AM - 12:00 PM",
      location: "Help Desk",
      category: "Workshop",
      capacity: 10,
      registered: 8,
      organizer: "David Kim",
      status: "completed",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop"
    }
  ];

  const categories = ['all', 'Workshop', 'Children', 'Book Club', 'Author Event', 'Gaming'];
  const statuses = ['all', 'upcoming', 'ongoing', 'completed', 'cancelled'];

  // Filter events
  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    console.log('Deleting event:', eventToDelete);
    setShowDeleteModal(false);
    setEventToDelete(null);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'upcoming': return 'primary';
      case 'ongoing': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAvailabilityPercentage = (registered, capacity) => {
    return Math.round((registered / capacity) * 100);
  };

  return (
    <Container fluid className={styles.eventManagementPage}>
      {/* Page Header */}
      <Row className="mb-4">
        <Col>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>
                <CalendarEvent className="me-3" />
                Event Management
              </h1>
              <p className={styles.pageSubtitle}>
                Create and manage library events and programs
              </p>
            </div>
            <div className={styles.headerActions}>
              <Button variant="primary" className={styles.addButton}>
                <Plus className="me-2" />
                Create Event
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className={styles.statCard}>
            <Card.Body>
              <div className={styles.statContent}>
                <div className={styles.statIcon} style={{ backgroundColor: 'var(--primary-blue)' }}>
                  <CalendarEvent />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>
                    {mockEvents.filter(e => e.status === 'upcoming').length}
                  </div>
                  <div className={styles.statLabel}>Upcoming Events</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className={styles.statCard}>
            <Card.Body>
              <div className={styles.statContent}>
                <div className={styles.statIcon} style={{ backgroundColor: 'var(--accent-green)' }}>
                  <People />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>
                    {mockEvents.reduce((sum, e) => sum + e.registered, 0)}
                  </div>
                  <div className={styles.statLabel}>Total Registrations</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className={styles.statCard}>
            <Card.Body>
              <div className={styles.statContent}>
                <div className={styles.statIcon} style={{ backgroundColor: 'var(--alert-red)' }}>
                  <Clock />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>
                    {mockEvents.filter(e => e.status === 'ongoing').length}
                  </div>
                  <div className={styles.statLabel}>Ongoing Events</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className={styles.statCard}>
            <Card.Body>
              <div className={styles.statContent}>
                <div className={styles.statIcon} style={{ backgroundColor: 'var(--medium-gray)' }}>
                  <PersonFill />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>
                    {Math.round(mockEvents.reduce((sum, e) => sum + (e.registered / e.capacity), 0) / mockEvents.length * 100)}%
                  </div>
                  <div className={styles.statLabel}>Avg. Attendance</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col lg={4} className="mb-3">
          <InputGroup>
            <InputGroup.Text>
              <Search />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </InputGroup>
        </Col>
        <Col lg={3} className="mb-3">
          <Form.Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.filterSelect}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col lg={3} className="mb-3">
          <Form.Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={styles.filterSelect}
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col lg={2} className="mb-3">
          <div className={styles.resultsInfo}>
            {filteredEvents.length} events
          </div>
        </Col>
      </Row>

      {/* Events Table */}
      <Row>
        <Col>
          <Card className={styles.eventsCard}>
            <Card.Body className={styles.eventsCardBody}>
              <div className={styles.tableContainer}>
                <Table responsive hover className={styles.eventsTable}>
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Date & Time</th>
                      <th>Location</th>
                      <th>Registration</th>
                      <th>Organizer</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEvents.map(event => (
                      <tr key={event.id} className={styles.eventRow}>
                        <td className={styles.eventCell}>
                          <div className={styles.eventInfo}>
                            <img 
                              src={event.image} 
                              alt={event.title}
                              className={styles.eventImage}
                            />
                            <div className={styles.eventDetails}>
                              <div className={styles.eventTitle}>{event.title}</div>
                              <Badge 
                                bg={getCategoryColor(event.category)} 
                                className={styles.categoryBadge}
                              >
                                {event.category}
                              </Badge>
                            </div>
                          </div>
                        </td>
                        <td className={styles.dateTimeCell}>
                          <div className={styles.dateTimeInfo}>
                            <div className={styles.dateItem}>
                              <Calendar className={styles.dateIcon} />
                              <span>{formatDate(event.date)}</span>
                            </div>
                            <div className={styles.timeItem}>
                              <Clock className={styles.timeIcon} />
                              <span>{event.time}</span>
                            </div>
                          </div>
                        </td>
                        <td className={styles.locationCell}>
                          <div className={styles.locationInfo}>
                            <GeoAlt className={styles.locationIcon} />
                            <span>{event.location}</span>
                          </div>
                        </td>
                        <td className={styles.registrationCell}>
                          <div className={styles.registrationInfo}>
                            <div className={styles.registrationCount}>
                              <People className={styles.registrationIcon} />
                              <span className={styles.registrationNumbers}>
                                {event.registered}/{event.capacity}
                              </span>
                            </div>
                            <div className={styles.registrationPercentage}>
                              {getAvailabilityPercentage(event.registered, event.capacity)}% full
                            </div>
                          </div>
                        </td>
                        <td className={styles.organizerCell}>
                          <div className={styles.organizerInfo}>
                            <PersonFill className={styles.organizerIcon} />
                            <span>{event.organizer}</span>
                          </div>
                        </td>
                        <td className={styles.statusCell}>
                          <Badge bg={getStatusVariant(event.status)} className={styles.statusBadge}>
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </Badge>
                        </td>
                        <td className={styles.actionsCell}>
                          <div className={styles.actionButtons}>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className={styles.actionButton}
                              title="View Details"
                            >
                              <Eye />
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              className={styles.actionButton}
                              title="Edit Event"
                            >
                              <PencilSquare />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className={styles.actionButton}
                              title="Delete Event"
                              onClick={() => handleDeleteClick(event)}
                            >
                              <Trash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Pagination */}
      {totalPages > 1 && (
        <Row>
          <Col>
            <div className={styles.paginationContainer}>
              <Pagination>
                <Pagination.First 
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                />
                
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                
                <Pagination.Next 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last 
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          </Col>
        </Row>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {eventToDelete && (
            <div>
              <Alert variant="warning">
                <strong>Warning:</strong> This action cannot be undone.
              </Alert>
              <p>Are you sure you want to delete the event <strong>{eventToDelete.title}</strong>?</p>
              <div className={styles.deleteEventInfo}>
                <strong>Event Details:</strong>
                <br />• Title: {eventToDelete.title}
                <br />• Date: {formatDate(eventToDelete.date)}
                <br />• Registrations: {eventToDelete.registered}/{eventToDelete.capacity}
                <br />• Status: {eventToDelete.status}
                <br /><br />
                <strong>Note:</strong> All registrations for this event will be cancelled and participants will be notified.
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete Event
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EventManagementPage;
