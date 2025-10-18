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
  Building, 
  Search, 
  Plus, 
  Eye, 
  PencilSquare, 
  Trash, 
  GeoAlt,
  Telephone,
  Envelope,
  Globe,
  BookFill,
  Calendar
} from 'react-bootstrap-icons';
import styles from './PublishersManagementPage.module.css';

const PublishersManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [publisherToDelete, setPublisherToDelete] = useState(null);
  const publishersPerPage = 10;

  // Mock publishers data
  const mockPublishers = [
    {
      id: 1,
      name: "Penguin Random House",
      country: "United States",
      city: "New York",
      address: "1745 Broadway, New York, NY 10019",
      phone: "+1 (212) 782-9000",
      email: "info@penguinrandomhouse.com",
      website: "www.penguinrandomhouse.com",
      foundedYear: 1927,
      totalBooks: 1250,
      activeBooks: 1180,
      status: "active",
      description: "One of the world's largest English-language publishers, formed by the merger of Penguin and Random House.",
      specialties: ["Fiction", "Non-fiction", "Children's Books", "Academic"]
    },
    {
      id: 2,
      name: "HarperCollins Publishers",
      country: "United States",
      city: "New York",
      address: "195 Broadway, New York, NY 10007",
      phone: "+1 (212) 207-7000",
      email: "contact@harpercollins.com",
      website: "www.harpercollins.com",
      foundedYear: 1989,
      totalBooks: 890,
      activeBooks: 825,
      status: "active",
      description: "A major English-language publisher headquartered in New York City.",
      specialties: ["Literary Fiction", "Biography", "History", "Religion"]
    },
    {
      id: 3,
      name: "Macmillan Publishers",
      country: "United Kingdom",
      city: "London",
      address: "The Smithson, 6 Briset Street, London EC1M 5NR",
      phone: "+44 20 7833 4000",
      email: "info@macmillan.com",
      website: "www.macmillan.com",
      foundedYear: 1843,
      totalBooks: 650,
      activeBooks: 598,
      status: "active",
      description: "A British publishing company founded in London by Daniel and Alexander Macmillan.",
      specialties: ["Academic", "Science", "Technology", "Medical"]
    },
    {
      id: 4,
      name: "Scholastic Corporation",
      country: "United States",
      city: "New York",
      address: "557 Broadway, New York, NY 10012",
      phone: "+1 (212) 343-6100",
      email: "info@scholastic.com",
      website: "www.scholastic.com",
      foundedYear: 1920,
      totalBooks: 1100,
      activeBooks: 1050,
      status: "active",
      description: "American multinational publishing, education and media company.",
      specialties: ["Children's Books", "Educational", "Young Adult", "Reference"]
    },
    {
      id: 5,
      name: "Oxford University Press",
      country: "United Kingdom",
      city: "Oxford",
      address: "Great Clarendon Street, Oxford OX2 6DP",
      phone: "+44 1865 556767",
      email: "enquiry@oup.com",
      website: "www.oup.com",
      foundedYear: 1586,
      totalBooks: 2100,
      activeBooks: 1980,
      status: "active",
      description: "The largest university press in the world and the second oldest after Cambridge University Press.",
      specialties: ["Academic", "Reference", "Dictionaries", "Journals"]
    },
    {
      id: 6,
      name: "Vintage Books",
      country: "United States",
      city: "New York",
      address: "1745 Broadway, New York, NY 10019",
      phone: "+1 (212) 751-2600",
      email: "info@vintage-books.com",
      website: "www.vintage-books.com",
      foundedYear: 1954,
      totalBooks: 420,
      activeBooks: 385,
      status: "active",
      description: "American publishing imprint owned by Random House.",
      specialties: ["Literary Fiction", "Classics", "Contemporary Fiction", "Essays"]
    },
    {
      id: 7,
      name: "Bloomsbury Publishing",
      country: "United Kingdom",
      city: "London",
      address: "50 Bedford Square, London WC1B 3DP",
      phone: "+44 20 7631 5600",
      email: "contact@bloomsbury.com",
      website: "www.bloomsbury.com",
      foundedYear: 1986,
      totalBooks: 380,
      activeBooks: 350,
      status: "active",
      description: "British worldwide publishing house of fiction and non-fiction.",
      specialties: ["Fiction", "Non-fiction", "Children's Books", "Academic"]
    },
    {
      id: 8,
      name: "Wiley Publishing",
      country: "United States",
      city: "Hoboken",
      address: "111 River Street, Hoboken, NJ 07030",
      phone: "+1 (201) 748-6000",
      email: "info@wiley.com",
      website: "www.wiley.com",
      foundedYear: 1807,
      totalBooks: 750,
      activeBooks: 680,
      status: "active",
      description: "American multinational publishing company specializing in academic publishing.",
      specialties: ["Academic", "Professional", "Technical", "Scientific"]
    },
    {
      id: 9,
      name: "Thames & Hudson",
      country: "United Kingdom",
      city: "London",
      address: "181A High Holborn, London WC1V 7QX",
      phone: "+44 20 7845 5000",
      email: "mail@thameshudson.co.uk",
      website: "www.thamesandhudson.com",
      foundedYear: 1949,
      totalBooks: 290,
      activeBooks: 265,
      status: "active",
      description: "British publisher of illustrated books on art, architecture, design, and visual culture.",
      specialties: ["Art", "Architecture", "Design", "Photography"]
    },
    {
      id: 10,
      name: "Chronicle Books",
      country: "United States",
      city: "San Francisco",
      address: "680 Second Street, San Francisco, CA 94107",
      phone: "+1 (415) 537-4200",
      email: "frontdesk@chroniclebooks.com",
      website: "www.chroniclebooks.com",
      foundedYear: 1967,
      totalBooks: 320,
      activeBooks: 295,
      status: "inactive",
      description: "American publisher of books, stationery, and gifts.",
      specialties: ["Art", "Design", "Food", "Pop Culture"]
    }
  ];

  const countries = ['all', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France'];
  const statuses = ['all', 'active', 'inactive'];

  // Filter publishers based on search and filters
  const filteredPublishers = mockPublishers.filter(publisher => {
    const matchesSearch = publisher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         publisher.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         publisher.specialties.some(specialty => 
                           specialty.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesCountry = selectedCountry === 'all' || publisher.country === selectedCountry;
    const matchesStatus = selectedStatus === 'all' || publisher.status === selectedStatus;
    
    return matchesSearch && matchesCountry && matchesStatus;
  });

  // Pagination
  const indexOfLastPublisher = currentPage * publishersPerPage;
  const indexOfFirstPublisher = indexOfLastPublisher - publishersPerPage;
  const currentPublishers = filteredPublishers.slice(indexOfFirstPublisher, indexOfLastPublisher);
  const totalPages = Math.ceil(filteredPublishers.length / publishersPerPage);

  const handleDeleteClick = (publisher) => {
    setPublisherToDelete(publisher);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    // Handle delete logic here
    console.log('Deleting publisher:', publisherToDelete);
    setShowDeleteModal(false);
    setPublisherToDelete(null);
  };

  const getStatusVariant = (status) => {
    return status === 'active' ? 'success' : 'secondary';
  };

  return (
    <Container fluid className={styles.publishersManagementPage}>
      {/* Page Header */}
      <Row className="mb-4">
        <Col>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>
                <Building className="me-3" />
                Publishers Management
              </h1>
              <p className={styles.pageSubtitle}>
                Manage publishing houses and their information
              </p>
            </div>
            <div className={styles.headerActions}>
              <Button variant="primary" className={styles.addButton}>
                <Plus className="me-2" />
                Add Publisher
              </Button>
            </div>
          </div>
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
              placeholder="Search publishers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </InputGroup>
        </Col>
        <Col lg={3} className="mb-3">
          <Form.Select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className={styles.filterSelect}
          >
            {countries.map(country => (
              <option key={country} value={country}>
                {country === 'all' ? 'All Countries' : country}
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
            {filteredPublishers.length} publishers
          </div>
        </Col>
      </Row>

      {/* Publishers Table */}
      <Row>
        <Col>
          <Card className={styles.publishersCard}>
            <Card.Body className={styles.publishersCardBody}>
              <div className={styles.tableContainer}>
                <Table responsive hover className={styles.publishersTable}>
                  <thead>
                    <tr>
                      <th>Publisher</th>
                      <th>Location</th>
                      <th>Contact</th>
                      <th>Books</th>
                      <th>Founded</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPublishers.map(publisher => (
                      <tr key={publisher.id} className={styles.publisherRow}>
                        <td className={styles.publisherCell}>
                          <div className={styles.publisherInfo}>
                            <div className={styles.publisherIcon}>
                              <Building />
                            </div>
                            <div className={styles.publisherDetails}>
                              <div className={styles.publisherName}>{publisher.name}</div>
                              <div className={styles.publisherSpecialties}>
                                {publisher.specialties.slice(0, 2).map((specialty, index) => (
                                  <Badge key={index} bg="light" text="dark" className={styles.specialtyBadge}>
                                    {specialty}
                                  </Badge>
                                ))}
                                {publisher.specialties.length > 2 && (
                                  <Badge bg="light" text="dark" className={styles.specialtyBadge}>
                                    +{publisher.specialties.length - 2} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className={styles.locationCell}>
                          <div className={styles.locationInfo}>
                            <div className={styles.locationItem}>
                              <GeoAlt className={styles.locationIcon} />
                              <span>{publisher.city}, {publisher.country}</span>
                            </div>
                          </div>
                        </td>
                        <td className={styles.contactCell}>
                          <div className={styles.contactInfo}>
                            <div className={styles.contactItem}>
                              <Envelope className={styles.contactIcon} />
                              <span className={styles.contactText}>{publisher.email}</span>
                            </div>
                            <div className={styles.contactItem}>
                              <Telephone className={styles.contactIcon} />
                              <span className={styles.contactText}>{publisher.phone}</span>
                            </div>
                            <div className={styles.contactItem}>
                              <Globe className={styles.contactIcon} />
                              <span className={styles.contactText}>{publisher.website}</span>
                            </div>
                          </div>
                        </td>
                        <td className={styles.booksCell}>
                          <div className={styles.booksInfo}>
                            <div className={styles.booksCount}>
                              <BookFill className={styles.booksIcon} />
                              <span className={styles.totalBooks}>{publisher.totalBooks}</span>
                            </div>
                            <div className={styles.activeBooks}>
                              {publisher.activeBooks} active
                            </div>
                          </div>
                        </td>
                        <td className={styles.foundedCell}>
                          <div className={styles.foundedInfo}>
                            <Calendar className={styles.foundedIcon} />
                            <span>{publisher.foundedYear}</span>
                          </div>
                        </td>
                        <td className={styles.statusCell}>
                          <Badge bg={getStatusVariant(publisher.status)} className={styles.statusBadge}>
                            {publisher.status.charAt(0).toUpperCase() + publisher.status.slice(1)}
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
                              title="Edit Publisher"
                            >
                              <PencilSquare />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className={styles.actionButton}
                              title="Delete Publisher"
                              onClick={() => handleDeleteClick(publisher)}
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
          <Modal.Title>Delete Publisher</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {publisherToDelete && (
            <div>
              <Alert variant="warning">
                <strong>Warning:</strong> This action cannot be undone.
              </Alert>
              <p>Are you sure you want to delete the publisher <strong>{publisherToDelete.name}</strong>?</p>
              <div className={styles.deletePublisherInfo}>
                <strong>Publisher Details:</strong>
                <br />• Name: {publisherToDelete.name}
                <br />• Location: {publisherToDelete.city}, {publisherToDelete.country}
                <br />• Total Books: {publisherToDelete.totalBooks}
                <br />• Status: {publisherToDelete.status}
                <br /><br />
                <strong>Note:</strong> All books associated with this publisher will need to be reassigned to another publisher or marked as independent publications.
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete Publisher
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PublishersManagementPage;
