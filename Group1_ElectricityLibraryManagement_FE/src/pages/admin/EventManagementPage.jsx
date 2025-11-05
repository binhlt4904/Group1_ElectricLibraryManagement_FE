import React, { useState, useEffect } from 'react';
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
import eventAPI from '../../api/event';
import notificationAPI from '../../api/notification';
import styles from './EventManagementPage.module.css';

// Backend base URL for image display
const API_BASE_URL = 'http://localhost:8080';

// Helper function to construct full image URL
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&h=100&fit=crop';
  if (imageUrl.startsWith('http')) return imageUrl; // Already a full URL
  return `${API_BASE_URL}${imageUrl}`; // Prepend base URL for relative paths
};

const EventManagementPage = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingEvent, setViewingEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    location: '',
    category: '',
    capacity: '',
    status: 'upcoming',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [statistics, setStatistics] = useState({
    upcomingEvents: 0,
    totalRegistrations: 0,
    ongoingEvents: 0,
    avgAttendance: 0
  });

  // Fetch events and statistics from API
  useEffect(() => {
    fetchEvents();
    fetchStatistics();
  }, [currentPage, pageSize]); // Re-fetch when page or page size changes

  const fetchStatistics = async () => {
    try {
      const response = await eventAPI.getEventStatistics();
      if (response.data && response.data.data) {
        setStatistics(response.data.data);
        console.log('📊 Event statistics loaded:', response.data.data);
      }
    } catch (error) {
      console.error('Error fetching event statistics:', error);
      // Keep default values if fetch fails
    }
  };

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Use 0-based page index for backend (currentPage - 1)
      const response = await eventAPI.getPublicEvents({
        page: currentPage - 1,
        size: pageSize
      });

      // Handle paginated response
      if (response.data.content) {
        setEvents(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } else {
        // Fallback for non-paginated response
        setEvents(response.data || []);
        setTotalPages(1);
        setTotalElements(response.data?.length || 0);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Mock events data for fallback
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

  // Filter events (frontend filtering for display)
  const filteredEvents = (events.length > 0 ? events : mockEvents).filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizerFullName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Use filtered events for display (backend pagination is already applied)
  const currentEvents = filteredEvents;

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;

    try {
      setIsLoading(true);
      await eventAPI.deleteEvent(eventToDelete.id);
      setShowDeleteModal(false);
      setEventToDelete(null);
      await fetchEvents();
      await fetchStatistics(); // Refresh statistics after deleting event
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.description) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate event date (must be in the future)
    if (newEvent.eventDate) {
      const selectedDate = new Date(newEvent.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison

      if (selectedDate < today) {
        setError('Event date must be in the future. Please select a valid date.');
        return;
      }
    }

    // Validate time (end time must be after start time)
    if (newEvent.startTime && newEvent.endTime) {
      if (newEvent.endTime <= newEvent.startTime) {
        setError('End time must be after start time. Please adjust the times.');
        return;
      }
    }

    try {
      setIsLoading(true);

      // Use FormData for multipart/form-data submission
      const formData = new FormData();
      formData.append('title', newEvent.title);
      formData.append('description', newEvent.description);
      
      // Append optional fields only if they have values
      if (newEvent.eventDate) formData.append('eventDate', newEvent.eventDate);
      if (newEvent.startTime) formData.append('startTime', newEvent.startTime);
      if (newEvent.endTime) formData.append('endTime', newEvent.endTime);
      if (newEvent.location) formData.append('location', newEvent.location);
      if (newEvent.category) formData.append('category', newEvent.category);
      if (newEvent.capacity) formData.append('capacity', parseInt(newEvent.capacity));
      if (newEvent.status) formData.append('status', newEvent.status);
      
      // Append image file if selected
      if (newEvent.image) {
        formData.append('image', newEvent.image);
      }

      const response = await eventAPI.createEvent(formData);
      
      // Send notification to all users about the new event
      try {
        // Handle both response structures: response.data.data.id or response.data.id
        const eventId = response.data?.data?.id || response.data?.id;
        
        console.log('=== CREATE EVENT DEBUG ===');
        console.log('Response structure:', response.data);
        console.log('Extracted event ID:', eventId);
        
        if (eventId) {
          await notificationAPI.sendNewEventNotification(eventId, newEvent.title);
          console.log('✅ Event notification sent successfully for event ID:', eventId);
        } else {
          console.warn('⚠️ Event created but ID not found in response:', response.data);
        }
      } catch (notifError) {
        console.error('❌ Failed to send event notification:', notifError);
        console.error('Error details:', notifError.response?.data);
        // Don't fail the event creation if notification fails
      }
      
      setShowCreateModal(false);
      setNewEvent({
        title: '',
        description: '',
        eventDate: '',
        startTime: '',
        endTime: '',
        location: '',
        category: '',
        capacity: '',
        status: 'upcoming',
        image: null
      });
      setImagePreview(null);
      await fetchEvents();
      await fetchStatistics(); // Refresh statistics after creating event
    } catch (err) {
      console.error('Error creating event:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);

      // Display more specific error message from backend if available
      const errorMessage = err.response?.data?.message ||
                          err.response?.data?.error ||
                          'Failed to create event. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      
      setNewEvent({ ...newEvent, image: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleViewClick = (event) => {
    setViewingEvent(event);
    setShowViewModal(true);
  };

  const handleEditClick = (event) => {
    setEditingEvent({
      ...event,
      eventDate: event.eventDate || '',
      startTime: event.startTime || '',
      endTime: event.endTime || '',
      location: event.location || '',
      category: event.category || '',
      capacity: event.capacity || '',
      status: event.status || 'upcoming',
      image: null // Will be set if user uploads new image
    });
    // Set preview to existing image if available
    if (event.imageUrl || event.image) {
      setEditImagePreview(getImageUrl(event.imageUrl || event.image));
    } else {
      setEditImagePreview(null);
    }
    setShowEditModal(true);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setEditingEvent({ ...editingEvent, image: file });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent || !editingEvent.title || !editingEvent.description) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate event date (must be in the future)
    if (editingEvent.eventDate) {
      const selectedDate = new Date(editingEvent.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison

      if (selectedDate < today) {
        setError('Event date must be in the future. Please select a valid date.');
        return;
      }
    }

    // Validate time (end time must be after start time)
    if (editingEvent.startTime && editingEvent.endTime) {
      if (editingEvent.endTime <= editingEvent.startTime) {
        setError('End time must be after start time. Please adjust the times.');
        return;
      }
    }

    try {
      setIsLoading(true);
      setError(null);

      // Create FormData for multipart/form-data submission
      const formData = new FormData();
      formData.append('title', editingEvent.title);
      formData.append('description', editingEvent.description);

      // Add optional fields if they have values
      if (editingEvent.eventDate) {
        formData.append('eventDate', editingEvent.eventDate);
      }
      if (editingEvent.startTime) {
        formData.append('startTime', editingEvent.startTime);
      }
      if (editingEvent.endTime) {
        formData.append('endTime', editingEvent.endTime);
      }
      if (editingEvent.location) {
        formData.append('location', editingEvent.location);
      }
      if (editingEvent.category) {
        formData.append('category', editingEvent.category);
      }
      if (editingEvent.capacity) {
        formData.append('capacity', editingEvent.capacity);
      }
      if (editingEvent.status) {
        formData.append('status', editingEvent.status);
      }

      // Add image file if a new one was selected
      if (editingEvent.image) {
        formData.append('image', editingEvent.image);
      }

      const response = await eventAPI.updateEvent(editingEvent.id, formData);

      // Send notification to all users about the event update
      try {
        // Handle both response structures and fallback to editingEvent.id
        const eventId = response.data?.data?.id || response.data?.id || editingEvent.id;
        
        console.log('=== UPDATE EVENT DEBUG ===');
        console.log('Response structure:', response.data);
        console.log('Extracted event ID:', eventId);
        
        if (eventId) {
          await notificationAPI.sendNewEventNotification(eventId, editingEvent.title);
          console.log('✅ Event update notification sent successfully for event ID:', eventId);
        }
      } catch (notifError) {
        console.error('❌ Failed to send event update notification:', notifError);
        console.error('Error details:', notifError.response?.data);
        // Don't fail the update if notification fails
      }

      setShowEditModal(false);
      setEditingEvent(null);
      setEditImagePreview(null);
      await fetchEvents();
      await fetchStatistics(); // Refresh statistics after updating event
    } catch (err) {
      console.error('Error updating event:', err);
      console.error('Error response:', err.response?.data);

      const errorMessage = err.response?.data?.message ||
                          err.response?.data?.error ||
                          'Failed to update event. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getAvailabilityPercentage = (registered, capacity) => {
    if (!capacity || capacity === 0 || !registered) return 0;
    return Math.round((registered / capacity) * 100);
  };

  return (
    <Container fluid className={styles.eventManagementPage}>
      {/* Error Alert */}
      {error && (
        <Alert variant="danger" className="mb-4" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

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
              <Button 
                variant="primary" 
                className={styles.addButton}
                onClick={() => setShowCreateModal(true)}
              >
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
                    {statistics.upcomingEvents}
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
                    {statistics.totalRegistrations}
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
                    {statistics.ongoingEvents}
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
                    {statistics.avgAttendance}%
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
                              src={getImageUrl(event.imageUrl || event.image)}
                              alt={event.title}
                              className={styles.eventImage}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&h=100&fit=crop';
                              }}
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
                              <span>{formatDate(event.eventDate || event.date)}</span>
                            </div>
                            <div className={styles.timeItem}>
                              <Clock className={styles.timeIcon} />
                              <span>
                                {event.startTime && event.endTime
                                  ? `${event.startTime} - ${event.endTime}`
                                  : event.time || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className={styles.locationCell}>
                          <div className={styles.locationInfo}>
                            <GeoAlt className={styles.locationIcon} />
                            <span>{event.location || 'N/A'}</span>
                          </div>
                        </td>
                        <td className={styles.registrationCell}>
                          <div className={styles.registrationInfo}>
                            <div className={styles.registrationCount}>
                              <People className={styles.registrationIcon} />
                              <span className={styles.registrationNumbers}>
                                {event.registered || 0}/{event.capacity || 0}
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
                            <span>{event.organizerFullName || event.organizer || event.createdByName || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className={styles.statusCell}>
                          <Badge bg={getStatusVariant(event.status)} className={styles.statusBadge}>
                            {event.status ? event.status.charAt(0).toUpperCase() + event.status.slice(1) : 'N/A'}
                          </Badge>
                        </td>
                        <td className={styles.actionsCell}>
                          <div className={styles.actionButtons}>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className={styles.actionButton}
                              title="View Details"
                              onClick={() => handleViewClick(event)}
                            >
                              <Eye />
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              className={styles.actionButton}
                              title="Edit Event"
                              onClick={() => handleEditClick(event)}
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

      {/* Pagination Controls */}
      {totalElements > 0 && (
        <Row className="mt-4">
          <Col md={12}>
            <Card>
              <Card.Body>
                <Row className="align-items-center">
                  {/* Page Size Selector */}
                  <Col md={3}>
                    <Form.Group className="d-flex align-items-center">
                      <Form.Label className="mb-0 me-2" style={{ whiteSpace: 'nowrap' }}>
                        Items per page:
                      </Form.Label>
                      <Form.Select
                        value={pageSize}
                        onChange={(e) => {
                          setPageSize(Number(e.target.value));
                          setCurrentPage(1); // Reset to first page when changing page size
                        }}
                        style={{ width: 'auto' }}
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* Pagination Info */}
                  <Col md={6} className="text-center">
                    <div className="d-flex flex-column align-items-center">
                      <Pagination className="mb-2">
                        <Pagination.First
                          onClick={() => setCurrentPage(1)}
                          disabled={currentPage === 1}
                        />
                        <Pagination.Prev
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        />

                        {/* Show limited page numbers */}
                        {(() => {
                          const maxPagesToShow = 5;
                          let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
                          let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

                          if (endPage - startPage < maxPagesToShow - 1) {
                            startPage = Math.max(1, endPage - maxPagesToShow + 1);
                          }

                          const pages = [];

                          if (startPage > 1) {
                            pages.push(
                              <Pagination.Item key={1} onClick={() => setCurrentPage(1)}>
                                1
                              </Pagination.Item>
                            );
                            if (startPage > 2) {
                              pages.push(<Pagination.Ellipsis key="ellipsis-start" disabled />);
                            }
                          }

                          for (let i = startPage; i <= endPage; i++) {
                            pages.push(
                              <Pagination.Item
                                key={i}
                                active={i === currentPage}
                                onClick={() => setCurrentPage(i)}
                              >
                                {i}
                              </Pagination.Item>
                            );
                          }

                          if (endPage < totalPages) {
                            if (endPage < totalPages - 1) {
                              pages.push(<Pagination.Ellipsis key="ellipsis-end" disabled />);
                            }
                            pages.push(
                              <Pagination.Item key={totalPages} onClick={() => setCurrentPage(totalPages)}>
                                {totalPages}
                              </Pagination.Item>
                            );
                          }

                          return pages;
                        })()}

                        <Pagination.Next
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        />
                        <Pagination.Last
                          onClick={() => setCurrentPage(totalPages)}
                          disabled={currentPage === totalPages}
                        />
                      </Pagination>
                      <small className="text-muted">
                        Page {currentPage} of {totalPages}
                      </small>
                    </div>
                  </Col>

                  {/* Items Count Display */}
                  <Col md={3} className="text-end">
                    <small className="text-muted">
                      Showing {Math.min((currentPage - 1) * pageSize + 1, totalElements)} - {Math.min(currentPage * pageSize, totalElements)} of {totalElements} events
                    </small>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* View Event Details Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Event Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewingEvent && (
            <div className={styles.viewEventContainer}>
              {/* Event Image */}
              {(viewingEvent.imageUrl || viewingEvent.image) && (
                <div className="mb-4">
                  <img
                    src={getImageUrl(viewingEvent.imageUrl || viewingEvent.image)}
                    alt={viewingEvent.title}
                    style={{
                      width: '100%',
                      maxHeight: '300px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop';
                    }}
                  />
                </div>
              )}

              {/* Event Title and Status */}
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h4>{viewingEvent.title}</h4>
                <Badge bg={getStatusVariant(viewingEvent.status)} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                  {viewingEvent.status ? viewingEvent.status.charAt(0).toUpperCase() + viewingEvent.status.slice(1) : 'N/A'}
                </Badge>
              </div>

              {/* Event Description */}
              <div className="mb-4">
                <h6 className="text-muted mb-2">Description</h6>
                <p>{viewingEvent.description || 'No description provided'}</p>
              </div>

              {/* Event Details Grid */}
              <Row className="mb-3">
                <Col md={6}>
                  <div className="mb-3">
                    <h6 className="text-muted mb-2">
                      <Calendar className="me-2" />
                      Event Date
                    </h6>
                    <p className="mb-0">{formatDate(viewingEvent.eventDate || viewingEvent.date)}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <h6 className="text-muted mb-2">
                      <Clock className="me-2" />
                      Time
                    </h6>
                    <p className="mb-0">
                      {viewingEvent.startTime && viewingEvent.endTime
                        ? `${viewingEvent.startTime} - ${viewingEvent.endTime}`
                        : viewingEvent.time || 'N/A'}
                    </p>
                  </div>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <div className="mb-3">
                    <h6 className="text-muted mb-2">
                      <GeoAlt className="me-2" />
                      Location
                    </h6>
                    <p className="mb-0">{viewingEvent.location || 'N/A'}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <h6 className="text-muted mb-2">Category</h6>
                    <Badge bg={getCategoryColor(viewingEvent.category)} style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}>
                      {viewingEvent.category || 'N/A'}
                    </Badge>
                  </div>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <div className="mb-3">
                    <h6 className="text-muted mb-2">
                      <People className="me-2" />
                      Capacity
                    </h6>
                    <p className="mb-0">{viewingEvent.capacity || 'N/A'}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <h6 className="text-muted mb-2">
                      <People className="me-2" />
                      Registered
                    </h6>
                    <p className="mb-0">
                      {viewingEvent.registered || 0} / {viewingEvent.capacity || 0}
                      <span className="text-muted ms-2">
                        ({getAvailabilityPercentage(viewingEvent.registered, viewingEvent.capacity)}% full)
                      </span>
                    </p>
                  </div>
                </Col>
              </Row>

              {/* Organizer Information */}
              <div className="mb-3">
                <h6 className="text-muted mb-2">
                  <PersonFill className="me-2" />
                  Organizer
                </h6>
                <p className="mb-0">
                  <strong>Name:</strong> {viewingEvent.organizerFullName || viewingEvent.organizer || viewingEvent.createdByName || 'Unknown'}
                </p>
                {viewingEvent.organizerEmail && (
                  <p className="mb-0">
                    <strong>Email:</strong> {viewingEvent.organizerEmail}
                  </p>
                )}
              </div>

              {/* Created/Updated Dates */}
              <div className="mt-4 pt-3 border-top">
                <Row>
                  <Col md={6}>
                    <small className="text-muted">
                      <strong>Created:</strong> {formatDate(viewingEvent.createdDate)}
                    </small>
                  </Col>
                  <Col md={6}>
                    <small className="text-muted">
                      <strong>Last Updated:</strong> {formatDate(viewingEvent.updatedDate)}
                    </small>
                  </Col>
                </Row>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowViewModal(false);
              handleEditClick(viewingEvent);
            }}
          >
            Edit Event
          </Button>
        </Modal.Footer>
      </Modal>

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

      {/* Create Event Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Title *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter event title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter event description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={newEvent.eventDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
                  />
                  <Form.Text className="text-muted">
                    Event date must be in the future
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter event location"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                  >
                    <option value="">Select category</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Children">Children</option>
                    <option value="Book Club">Book Club</option>
                    <option value="Author Event">Author Event</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Capacity</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    placeholder="Enter maximum capacity"
                    value={newEvent.capacity}
                    onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={newEvent.status}
                    onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Banner Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <Form.Text className="text-muted">
                    Upload an event banner image (max 5MB, JPG/PNG/GIF)
                  </Form.Text>
                  {imagePreview && (
                    <div className="mt-3">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateEvent} disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Event'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Event Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingEvent && (
            <Form>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Event Title *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter event title"
                      value={editingEvent.title}
                      onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Description *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter event description"
                      value={editingEvent.description}
                      onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Event Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={editingEvent.eventDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setEditingEvent({ ...editingEvent, eventDate: e.target.value })}
                    />
                    <Form.Text className="text-muted">
                      Event date must be in the future
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={editingEvent.startTime}
                      onChange={(e) => setEditingEvent({ ...editingEvent, startTime: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>End Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={editingEvent.endTime}
                      onChange={(e) => setEditingEvent({ ...editingEvent, endTime: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter event location"
                      value={editingEvent.location}
                      onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      value={editingEvent.category}
                      onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                    >
                      <option value="">Select category</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Children">Children</option>
                      <option value="Book Club">Book Club</option>
                      <option value="Author Event">Author Event</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Capacity</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      placeholder="Enter maximum capacity"
                      value={editingEvent.capacity}
                      onChange={(e) => setEditingEvent({ ...editingEvent, capacity: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={editingEvent.status}
                      onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value })}
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Event Banner Image</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageChange}
                    />
                    <Form.Text className="text-muted">
                      Upload a new event banner image to replace the existing one (max 5MB, JPG/PNG/GIF)
                    </Form.Text>
                    {editImagePreview && (
                      <div className="mt-3">
                        <img
                          src={editImagePreview}
                          alt="Preview"
                          style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateEvent} disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Event'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EventManagementPage;
