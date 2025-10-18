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
  ClipboardData, 
  Search, 
  Calendar, 
  Eye, 
  PencilSquare, 
  CheckCircle,
  XCircle,
  Clock,
  PersonFill,
  BookFill,
  ExclamationTriangle
} from 'react-bootstrap-icons';
import styles from './BorrowalsManagementPage.module.css';

const BorrowalsManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [borrowalToReturn, setBorrowalToReturn] = useState(null);
  const borrowalsPerPage = 10;

  // Mock borrowals data
  const mockBorrowals = [
    {
      id: 1,
      borrowalCode: "BRW-2024-001",
      reader: {
        id: 1,
        name: "John Smith",
        email: "john.smith@email.com",
        membershipType: "Premium"
      },
      book: {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        isbn: "978-0-7432-7356-5",
        coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=150&fit=crop"
      },
      borrowDate: "2024-01-10",
      dueDate: "2024-01-24",
      returnDate: null,
      status: "borrowed",
      renewalCount: 0,
      maxRenewals: 2,
      fineAmount: 0,
      notes: ""
    },
    {
      id: 2,
      borrowalCode: "BRW-2024-002",
      reader: {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        membershipType: "Standard"
      },
      book: {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        isbn: "978-0-06-112008-4",
        coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100&h=150&fit=crop"
      },
      borrowDate: "2024-01-05",
      dueDate: "2024-01-19",
      returnDate: null,
      status: "overdue",
      renewalCount: 1,
      maxRenewals: 2,
      fineAmount: 5.50,
      notes: "Reader contacted about overdue book"
    },
    {
      id: 3,
      borrowalCode: "BRW-2024-003",
      reader: {
        id: 3,
        name: "Michael Brown",
        email: "michael.brown@email.com",
        membershipType: "Student"
      },
      book: {
        id: 3,
        title: "1984",
        author: "George Orwell",
        isbn: "978-0-452-28423-4",
        coverImage: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=100&h=150&fit=crop"
      },
      borrowDate: "2024-01-08",
      dueDate: "2024-01-22",
      returnDate: "2024-01-20",
      status: "returned",
      renewalCount: 0,
      maxRenewals: 2,
      fineAmount: 0,
      notes: "Returned in excellent condition"
    },
    {
      id: 4,
      borrowalCode: "BRW-2024-004",
      reader: {
        id: 4,
        name: "Emily Davis",
        email: "emily.davis@email.com",
        membershipType: "Premium"
      },
      book: {
        id: 4,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        isbn: "978-0-14-143951-8",
        coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=150&fit=crop"
      },
      borrowDate: "2024-01-12",
      dueDate: "2024-01-26",
      returnDate: null,
      status: "borrowed",
      renewalCount: 1,
      maxRenewals: 3,
      fineAmount: 0,
      notes: ""
    },
    {
      id: 5,
      borrowalCode: "BRW-2024-005",
      reader: {
        id: 5,
        name: "David Wilson",
        email: "david.wilson@email.com",
        membershipType: "Standard"
      },
      book: {
        id: 5,
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        isbn: "978-0-316-76948-0",
        coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=150&fit=crop"
      },
      borrowDate: "2023-12-28",
      dueDate: "2024-01-11",
      returnDate: null,
      status: "overdue",
      renewalCount: 2,
      maxRenewals: 2,
      fineAmount: 12.75,
      notes: "Multiple renewal attempts, reader unresponsive"
    },
    {
      id: 6,
      borrowalCode: "BRW-2024-006",
      reader: {
        id: 6,
        name: "Lisa Anderson",
        email: "lisa.anderson@email.com",
        membershipType: "Premium"
      },
      book: {
        id: 6,
        title: "Harry Potter and the Sorcerer's Stone",
        author: "J.K. Rowling",
        isbn: "978-0-439-70818-8",
        coverImage: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=100&h=150&fit=crop"
      },
      borrowDate: "2024-01-15",
      dueDate: "2024-01-29",
      returnDate: null,
      status: "borrowed",
      renewalCount: 0,
      maxRenewals: 3,
      fineAmount: 0,
      notes: ""
    }
  ];

  const statuses = ['all', 'borrowed', 'overdue', 'returned'];
  const dateRanges = ['all', 'today', 'this-week', 'this-month', 'last-month'];

  // Filter borrowals based on search and filters
  const filteredBorrowals = mockBorrowals.filter(borrowal => {
    const matchesSearch = borrowal.borrowalCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         borrowal.reader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         borrowal.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         borrowal.book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || borrowal.status === selectedStatus;
    
    // Simple date range filtering (in real app, this would be more sophisticated)
    let matchesDateRange = true;
    if (selectedDateRange !== 'all') {
      const borrowDate = new Date(borrowal.borrowDate);
      const today = new Date();
      
      switch (selectedDateRange) {
        case 'today':
          matchesDateRange = borrowDate.toDateString() === today.toDateString();
          break;
        case 'this-week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDateRange = borrowDate >= weekAgo;
          break;
        case 'this-month':
          matchesDateRange = borrowDate.getMonth() === today.getMonth() && 
                            borrowDate.getFullYear() === today.getFullYear();
          break;
        case 'last-month':
          const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          matchesDateRange = borrowDate >= lastMonth && borrowDate < thisMonth;
          break;
        default:
          matchesDateRange = true;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  // Pagination
  const indexOfLastBorrowal = currentPage * borrowalsPerPage;
  const indexOfFirstBorrowal = indexOfLastBorrowal - borrowalsPerPage;
  const currentBorrowals = filteredBorrowals.slice(indexOfFirstBorrowal, indexOfLastBorrowal);
  const totalPages = Math.ceil(filteredBorrowals.length / borrowalsPerPage);

  const handleReturnClick = (borrowal) => {
    setBorrowalToReturn(borrowal);
    setShowReturnModal(true);
  };

  const handleReturnConfirm = () => {
    // Handle return logic here
    console.log('Processing return for:', borrowalToReturn);
    setShowReturnModal(false);
    setBorrowalToReturn(null);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'borrowed': return 'primary';
      case 'overdue': return 'danger';
      case 'returned': return 'success';
      default: return 'secondary';
    }
  };

  const getMembershipColor = (type) => {
    switch (type) {
      case 'Premium': return 'warning';
      case 'Standard': return 'info';
      case 'Student': return 'success';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysOverdue = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <Container fluid className={styles.borrowalsManagementPage}>
      {/* Page Header */}
      <Row className="mb-4">
        <Col>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>
                <ClipboardData className="me-3" />
                Borrowals Management
              </h1>
              <p className={styles.pageSubtitle}>
                Track and manage all book borrowing transactions
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
                  <BookFill />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>
                    {mockBorrowals.filter(b => b.status === 'borrowed').length}
                  </div>
                  <div className={styles.statLabel}>Active Borrowals</div>
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
                  <ExclamationTriangle />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>
                    {mockBorrowals.filter(b => b.status === 'overdue').length}
                  </div>
                  <div className={styles.statLabel}>Overdue Items</div>
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
                    {mockBorrowals.filter(b => b.status === 'returned').length}
                  </div>
                  <div className={styles.statLabel}>Returned Today</div>
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
                    ${mockBorrowals.reduce((sum, b) => sum + b.fineAmount, 0).toFixed(2)}
                  </div>
                  <div className={styles.statLabel}>Total Fines</div>
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
              placeholder="Search borrowals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </InputGroup>
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
        <Col lg={3} className="mb-3">
          <Form.Select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className={styles.filterSelect}
          >
            {dateRanges.map(range => (
              <option key={range} value={range}>
                {range === 'all' ? 'All Time' : 
                 range === 'today' ? 'Today' :
                 range === 'this-week' ? 'This Week' :
                 range === 'this-month' ? 'This Month' :
                 range === 'last-month' ? 'Last Month' : range}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col lg={2} className="mb-3">
          <div className={styles.resultsInfo}>
            {filteredBorrowals.length} borrowals
          </div>
        </Col>
      </Row>

      {/* Borrowals Table */}
      <Row>
        <Col>
          <Card className={styles.borrowalsCard}>
            <Card.Body className={styles.borrowalsCardBody}>
              <div className={styles.tableContainer}>
                <Table responsive hover className={styles.borrowalsTable}>
                  <thead>
                    <tr>
                      <th>Borrowal ID</th>
                      <th>Reader</th>
                      <th>Book</th>
                      <th>Dates</th>
                      <th>Status</th>
                      <th>Fine</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentBorrowals.map(borrowal => (
                      <tr key={borrowal.id} className={styles.borrowalRow}>
                        <td className={styles.idCell}>
                          <div className={styles.borrowalId}>
                            <strong>{borrowal.borrowalCode}</strong>
                          </div>
                        </td>
                        <td className={styles.readerCell}>
                          <div className={styles.readerInfo}>
                            <div className={styles.readerIcon}>
                              <PersonFill />
                            </div>
                            <div className={styles.readerDetails}>
                              <div className={styles.readerName}>{borrowal.reader.name}</div>
                              <Badge 
                                bg={getMembershipColor(borrowal.reader.membershipType)} 
                                className={styles.membershipBadge}
                              >
                                {borrowal.reader.membershipType}
                              </Badge>
                            </div>
                          </div>
                        </td>
                        <td className={styles.bookCell}>
                          <div className={styles.bookInfo}>
                            <img 
                              src={borrowal.book.coverImage} 
                              alt={borrowal.book.title}
                              className={styles.bookCover}
                            />
                            <div className={styles.bookDetails}>
                              <div className={styles.bookTitle}>{borrowal.book.title}</div>
                              <div className={styles.bookAuthor}>{borrowal.book.author}</div>
                            </div>
                          </div>
                        </td>
                        <td className={styles.datesCell}>
                          <div className={styles.datesInfo}>
                            <div className={styles.dateItem}>
                              <span className={styles.dateLabel}>Borrowed:</span>
                              <span>{formatDate(borrowal.borrowDate)}</span>
                            </div>
                            <div className={styles.dateItem}>
                              <span className={styles.dateLabel}>Due:</span>
                              <span className={borrowal.status === 'overdue' ? styles.overdue : ''}>
                                {formatDate(borrowal.dueDate)}
                              </span>
                            </div>
                            {borrowal.returnDate && (
                              <div className={styles.dateItem}>
                                <span className={styles.dateLabel}>Returned:</span>
                                <span>{formatDate(borrowal.returnDate)}</span>
                              </div>
                            )}
                            {borrowal.status === 'overdue' && (
                              <div className={styles.overdueInfo}>
                                {getDaysOverdue(borrowal.dueDate)} days overdue
                              </div>
                            )}
                          </div>
                        </td>
                        <td className={styles.statusCell}>
                          <Badge bg={getStatusVariant(borrowal.status)} className={styles.statusBadge}>
                            {borrowal.status.charAt(0).toUpperCase() + borrowal.status.slice(1)}
                          </Badge>
                          {borrowal.renewalCount > 0 && (
                            <div className={styles.renewalInfo}>
                              Renewed {borrowal.renewalCount}/{borrowal.maxRenewals}
                            </div>
                          )}
                        </td>
                        <td className={styles.fineCell}>
                          {borrowal.fineAmount > 0 ? (
                            <div className={styles.fineAmount}>
                              ${borrowal.fineAmount.toFixed(2)}
                            </div>
                          ) : (
                            <span className={styles.noFine}>$0.00</span>
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
                              title="Edit Borrowal"
                            >
                              <PencilSquare />
                            </Button>
                            {borrowal.status !== 'returned' && (
                              <Button
                                variant="outline-success"
                                size="sm"
                                className={styles.actionButton}
                                title="Mark as Returned"
                                onClick={() => handleReturnClick(borrowal)}
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

      {/* Return Confirmation Modal */}
      <Modal show={showReturnModal} onHide={() => setShowReturnModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Process Book Return</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {borrowalToReturn && (
            <div>
              <Alert variant="info">
                <strong>Processing return for:</strong>
              </Alert>
              <div className={styles.returnInfo}>
                <strong>Book:</strong> {borrowalToReturn.book.title}
                <br />
                <strong>Reader:</strong> {borrowalToReturn.reader.name}
                <br />
                <strong>Due Date:</strong> {formatDate(borrowalToReturn.dueDate)}
                <br />
                <strong>Status:</strong> {borrowalToReturn.status}
                {borrowalToReturn.fineAmount > 0 && (
                  <>
                    <br />
                    <strong>Outstanding Fine:</strong> ${borrowalToReturn.fineAmount.toFixed(2)}
                  </>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReturnModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleReturnConfirm}>
            Process Return
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BorrowalsManagementPage;
