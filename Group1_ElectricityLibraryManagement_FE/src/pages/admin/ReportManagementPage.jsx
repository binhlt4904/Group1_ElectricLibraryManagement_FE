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
  ExclamationTriangle, 
  Search, 
  Eye, 
  PencilSquare, 
  CheckCircle,
  XCircle,
  PersonFill,
  BookFill,
  Clock,
  Flag
} from 'react-bootstrap-icons';
import styles from './ReportManagementPage.module.css';

const ReportManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [reportToResolve, setReportToResolve] = useState(null);
  const reportsPerPage = 10;

  // Mock reports data
  const mockReports = [
    {
      id: 1,
      type: "Damaged Book",
      title: "Pages torn in The Great Gatsby",
      description: "Several pages are torn and some text is illegible. Book needs repair or replacement.",
      submittedBy: {
        id: 1,
        name: "John Smith",
        email: "john.smith@email.com"
      },
      book: {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        isbn: "978-0-7432-7356-5"
      },
      submittedDate: "2024-01-15",
      status: "new",
      priority: "medium",
      assignedTo: null,
      notes: ""
    },
    {
      id: 2,
      type: "Missing Book",
      title: "Book not found on shelf",
      description: "Book shows as available in system but cannot be located on shelf. May be misplaced.",
      submittedBy: {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com"
      },
      book: {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        isbn: "978-0-06-112008-4"
      },
      submittedDate: "2024-01-14",
      status: "in-progress",
      priority: "high",
      assignedTo: "Library Staff",
      notes: "Checking storage areas and recent returns"
    },
    {
      id: 3,
      type: "System Error",
      title: "Cannot renew book online",
      description: "System shows error when trying to renew book. Renewal limit not reached.",
      submittedBy: {
        id: 3,
        name: "Michael Brown",
        email: "michael.brown@email.com"
      },
      book: {
        id: 3,
        title: "1984",
        author: "George Orwell",
        isbn: "978-0-452-28423-4"
      },
      submittedDate: "2024-01-13",
      status: "resolved",
      priority: "low",
      assignedTo: "IT Support",
      notes: "Fixed database constraint issue. User can now renew normally."
    },
    {
      id: 4,
      type: "Content Issue",
      title: "Inappropriate content in children's section",
      description: "Book contains content not suitable for children's section. Should be moved to adult section.",
      submittedBy: {
        id: 4,
        name: "Emily Davis",
        email: "emily.davis@email.com"
      },
      book: {
        id: 4,
        title: "Controversial Novel",
        author: "Author Name",
        isbn: "978-0-123-45678-9"
      },
      submittedDate: "2024-01-12",
      status: "new",
      priority: "urgent",
      assignedTo: null,
      notes: ""
    },
    {
      id: 5,
      type: "Access Issue",
      title: "Cannot access digital resource",
      description: "Digital book link is broken. Returns 404 error when clicked.",
      submittedBy: {
        id: 5,
        name: "David Wilson",
        email: "david.wilson@email.com"
      },
      book: {
        id: 5,
        title: "Digital Resource Guide",
        author: "Various Authors",
        isbn: "978-0-987-65432-1"
      },
      submittedDate: "2024-01-11",
      status: "in-progress",
      priority: "medium",
      assignedTo: "Digital Resources Team",
      notes: "Contacting publisher for updated link"
    },
    {
      id: 6,
      type: "Facility Issue",
      title: "Reading area lighting insufficient",
      description: "Lighting in reading area is too dim. Difficult to read comfortably.",
      submittedBy: {
        id: 6,
        name: "Lisa Anderson",
        email: "lisa.anderson@email.com"
      },
      book: null,
      submittedDate: "2024-01-10",
      status: "closed",
      priority: "low",
      assignedTo: "Facilities Team",
      notes: "Additional lighting installed. Issue resolved."
    }
  ];

  const types = ['all', 'Damaged Book', 'Missing Book', 'System Error', 'Content Issue', 'Access Issue', 'Facility Issue'];
  const statuses = ['all', 'new', 'in-progress', 'resolved', 'closed'];
  const priorities = ['all', 'low', 'medium', 'high', 'urgent'];

  // Filter reports
  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.submittedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (report.book && report.book.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || report.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || report.priority === selectedPriority;
    
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  // Pagination
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  const handleResolveClick = (report) => {
    setReportToResolve(report);
    setShowResolveModal(true);
  };

  const handleResolveConfirm = () => {
    console.log('Resolving report:', reportToResolve);
    setShowResolveModal(false);
    setReportToResolve(null);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'new': return 'primary';
      case 'in-progress': return 'warning';
      case 'resolved': return 'success';
      case 'closed': return 'secondary';
      default: return 'secondary';
    }
  };

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'urgent': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      'Damaged Book': 'danger',
      'Missing Book': 'warning',
      'System Error': 'primary',
      'Content Issue': 'info',
      'Access Issue': 'secondary',
      'Facility Issue': 'success'
    };
    return colors[type] || 'secondary';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysAgo = (dateString) => {
    const reportDate = new Date(dateString);
    const today = new Date();
    const diffTime = today - reportDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Container fluid className={styles.reportManagementPage}>
      {/* Page Header */}
      <Row className="mb-4">
        <Col>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>
                <ExclamationTriangle className="me-3" />
                Report Management
              </h1>
              <p className={styles.pageSubtitle}>
                View and manage user-submitted reports and issues
              </p>
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
                  <ExclamationTriangle />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>
                    {mockReports.filter(r => r.status === 'new').length}
                  </div>
                  <div className={styles.statLabel}>New Reports</div>
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
                  <Flag />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>
                    {mockReports.filter(r => r.priority === 'urgent').length}
                  </div>
                  <div className={styles.statLabel}>Urgent Priority</div>
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
                  <CheckCircle />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>
                    {mockReports.filter(r => r.status === 'resolved').length}
                  </div>
                  <div className={styles.statLabel}>Resolved Today</div>
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
                  <Clock />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>
                    {Math.round(mockReports.reduce((sum, r) => sum + getDaysAgo(r.submittedDate), 0) / mockReports.length)}
                  </div>
                  <div className={styles.statLabel}>Avg. Age (Days)</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col lg={3} className="mb-3">
          <InputGroup>
            <InputGroup.Text>
              <Search />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </InputGroup>
        </Col>
        <Col lg={2} className="mb-3">
          <Form.Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className={styles.filterSelect}
          >
            {types.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col lg={2} className="mb-3">
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
          <Form.Select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className={styles.filterSelect}
          >
            {priorities.map(priority => (
              <option key={priority} value={priority}>
                {priority === 'all' ? 'All Priority' : priority.charAt(0).toUpperCase() + priority.slice(1)}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col lg={3} className="mb-3">
          <div className={styles.resultsInfo}>
            {filteredReports.length} reports
          </div>
        </Col>
      </Row>

      {/* Reports Table */}
      <Row>
        <Col>
          <Card className={styles.reportsCard}>
            <Card.Body className={styles.reportsCardBody}>
              <div className={styles.tableContainer}>
                <Table responsive hover className={styles.reportsTable}>
                  <thead>
                    <tr>
                      <th>Report</th>
                      <th>Submitted By</th>
                      <th>Resource</th>
                      <th>Date</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Assigned To</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentReports.map(report => (
                      <tr key={report.id} className={styles.reportRow}>
                        <td className={styles.reportCell}>
                          <div className={styles.reportInfo}>
                            <div className={styles.reportTitle}>{report.title}</div>
                            <Badge 
                              bg={getTypeColor(report.type)} 
                              className={styles.typeBadge}
                            >
                              {report.type}
                            </Badge>
                          </div>
                        </td>
                        <td className={styles.submitterCell}>
                          <div className={styles.submitterInfo}>
                            <PersonFill className={styles.submitterIcon} />
                            <div className={styles.submitterDetails}>
                              <div className={styles.submitterName}>{report.submittedBy.name}</div>
                              <div className={styles.submitterEmail}>{report.submittedBy.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className={styles.resourceCell}>
                          {report.book ? (
                            <div className={styles.resourceInfo}>
                              <BookFill className={styles.resourceIcon} />
                              <div className={styles.resourceDetails}>
                                <div className={styles.resourceTitle}>{report.book.title}</div>
                                <div className={styles.resourceAuthor}>{report.book.author}</div>
                              </div>
                            </div>
                          ) : (
                            <span className={styles.noResource}>General Issue</span>
                          )}
                        </td>
                        <td className={styles.dateCell}>
                          <div className={styles.dateInfo}>
                            <div className={styles.dateValue}>{formatDate(report.submittedDate)}</div>
                            <div className={styles.daysAgo}>{getDaysAgo(report.submittedDate)} days ago</div>
                          </div>
                        </td>
                        <td className={styles.priorityCell}>
                          <Badge bg={getPriorityVariant(report.priority)} className={styles.priorityBadge}>
                            {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)}
                          </Badge>
                        </td>
                        <td className={styles.statusCell}>
                          <Badge bg={getStatusVariant(report.status)} className={styles.statusBadge}>
                            {report.status === 'in-progress' ? 'In Progress' : 
                             report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </Badge>
                        </td>
                        <td className={styles.assignedCell}>
                          {report.assignedTo ? (
                            <span className={styles.assignedTo}>{report.assignedTo}</span>
                          ) : (
                            <span className={styles.unassigned}>Unassigned</span>
                          )}
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
                              title="Edit Report"
                            >
                              <PencilSquare />
                            </Button>
                            {report.status !== 'resolved' && report.status !== 'closed' && (
                              <Button
                                variant="outline-success"
                                size="sm"
                                className={styles.actionButton}
                                title="Mark as Resolved"
                                onClick={() => handleResolveClick(report)}
                              >
                                <CheckCircle />
                              </Button>
                            )}
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

      {/* Resolve Confirmation Modal */}
      <Modal show={showResolveModal} onHide={() => setShowResolveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Resolve Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reportToResolve && (
            <div>
              <Alert variant="success">
                <strong>Mark report as resolved:</strong>
              </Alert>
              <div className={styles.resolveInfo}>
                <strong>Report:</strong> {reportToResolve.title}
                <br />
                <strong>Type:</strong> {reportToResolve.type}
                <br />
                <strong>Submitted by:</strong> {reportToResolve.submittedBy.name}
                <br />
                <strong>Priority:</strong> {reportToResolve.priority}
                <br />
                <strong>Current Status:</strong> {reportToResolve.status}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResolveModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleResolveConfirm}>
            Mark as Resolved
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ReportManagementPage;
