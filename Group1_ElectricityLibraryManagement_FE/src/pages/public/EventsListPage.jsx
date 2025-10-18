import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge, Pagination } from 'react-bootstrap';
import { 
  Calendar, 
  Search, 
  Filter, 
  Clock, 
  GeoAlt, 
  People, 
  ChevronRight,
  CalendarEvent,
  PersonFill
} from 'react-bootstrap-icons';
import styles from './EventsListPage.module.css';

const EventsListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;

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
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
      organizer: "Sarah Johnson",
      status: "upcoming"
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
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
      organizer: "Emily Chen",
      status: "upcoming"
    },
    {
      id: 3,
      title: "Book Club: Modern Fiction",
      description: "Monthly discussion of contemporary literature. This month: 'The Seven Husbands of Evelyn Hugo'",
      date: "2024-01-20",
      time: "6:00 PM - 7:30 PM",
      location: "Meeting Room A",
      category: "Book Club",
      capacity: 15,
      registered: 12,
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop",
      organizer: "Michael Rodriguez",
      status: "upcoming"
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
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop",
      organizer: "Library Staff",
      status: "upcoming"
    },
    {
      id: 5,
      title: "Teen Gaming Tournament",
      description: "Competitive gaming tournament for teens aged 13-18. Prizes for winners!",
      date: "2024-01-28",
      time: "3:00 PM - 6:00 PM",
      location: "Teen Zone",
      category: "Gaming",
      capacity: 32,
      registered: 28,
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=250&fit=crop",
      organizer: "Alex Thompson",
      status: "upcoming"
    },
    {
      id: 6,
      title: "Senior Tech Help",
      description: "One-on-one technology assistance for seniors. Bring your devices!",
      date: "2024-02-02",
      time: "10:00 AM - 12:00 PM",
      location: "Help Desk",
      category: "Workshop",
      capacity: 10,
      registered: 8,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
      organizer: "David Kim",
      status: "upcoming"
    }
  ];

  const categories = ['all', 'Workshop', 'Children', 'Book Club', 'Author Event', 'Gaming'];
  const months = ['all', 'January', 'February', 'March', 'April', 'May', 'June'];

  // Filter events based on search and filters
  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesMonth = selectedMonth === 'all' || 
                        new Date(event.date).toLocaleString('default', { month: 'long' }) === selectedMonth;
    
    return matchesSearch && matchesCategory && matchesMonth;
  });

  // Pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

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
    if (percentage >= 90) return { text: 'Almost Full', variant: 'danger' };
    if (percentage >= 70) return { text: 'Filling Up', variant: 'warning' };
    return { text: 'Available', variant: 'success' };
  };

  return (
    <Container fluid className={styles.eventsListPage}>
      {/* Page Header */}
      <Container>
        <Row className="mb-4">
          <Col>
            <div className={styles.pageHeader}>
              <div>
                <h1 className={styles.pageTitle}>
                  <CalendarEvent className="me-3" />
                  Library Events
                </h1>
                <p className={styles.pageSubtitle}>
                  Discover workshops, book clubs, author events, and more happening at our library
                </p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Search and Filters */}
        <Row className="mb-4">
          <Col lg={6} className="mb-3">
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
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className={styles.filterSelect}
            >
              {months.map(month => (
                <option key={month} value={month}>
                  {month === 'all' ? 'All Months' : month}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        {/* Results Info */}
        <Row className="mb-4">
          <Col>
            <div className={styles.resultsInfo}>
              <span>Showing {currentEvents.length} of {filteredEvents.length} events</span>
            </div>
          </Col>
        </Row>

        {/* Events Grid */}
        <Row>
          {currentEvents.map(event => (
            <Col key={event.id} lg={6} className="mb-4">
              <Card className={styles.eventCard}>
                <div className={styles.eventImageContainer}>
                  <Card.Img 
                    variant="top" 
                    src={event.image} 
                    alt={event.title}
                    className={styles.eventImage}
                  />
                  <Badge 
                    bg={getCategoryColor(event.category)} 
                    className={styles.categoryBadge}
                  >
                    {event.category}
                  </Badge>
                </div>
                <Card.Body className={styles.eventCardBody}>
                  <div className={styles.eventHeader}>
                    <Card.Title className={styles.eventTitle}>
                      {event.title}
                    </Card.Title>
                    <Badge 
                      bg={getAvailabilityStatus(event.registered, event.capacity).variant}
                      className={styles.availabilityBadge}
                    >
                      {getAvailabilityStatus(event.registered, event.capacity).text}
                    </Badge>
                  </div>
                  
                  <Card.Text className={styles.eventDescription}>
                    {event.description}
                  </Card.Text>

                  <div className={styles.eventDetails}>
                    <div className={styles.eventDetail}>
                      <Calendar className={styles.detailIcon} />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className={styles.eventDetail}>
                      <Clock className={styles.detailIcon} />
                      <span>{event.time}</span>
                    </div>
                    <div className={styles.eventDetail}>
                      <GeoAlt className={styles.detailIcon} />
                      <span>{event.location}</span>
                    </div>
                    <div className={styles.eventDetail}>
                      <People className={styles.detailIcon} />
                      <span>{event.registered}/{event.capacity} registered</span>
                    </div>
                    <div className={styles.eventDetail}>
                      <PersonFill className={styles.detailIcon} />
                      <span>Organized by {event.organizer}</span>
                    </div>
                  </div>

                  <div className={styles.eventActions}>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      className={styles.actionButton}
                    >
                      View Details
                      <ChevronRight className="ms-1" />
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm"
                      className={styles.actionButton}
                      disabled={event.registered >= event.capacity}
                    >
                      {event.registered >= event.capacity ? 'Full' : 'Register'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
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
      </Container>
    </Container>
  );
};

export default EventsListPage;
