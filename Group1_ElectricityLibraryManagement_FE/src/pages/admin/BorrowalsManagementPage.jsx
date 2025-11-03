import React, { useEffect, useState } from 'react';
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
import borrowalApi from '../../api/admin/borrowalApi';
import { useContext } from 'react';
import UserContext from '../../components/contexts/UserContext';
const BorrowalsManagementPage = () => {
  const { user } = useContext(UserContext)
  const [borrowals, setBorrowals] = useState([]);
  const [borrowalStatistics, setBorrowalStatistics] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [borrowalToReturn, setBorrowalToReturn] = useState(null);
  const pageSize = 4;

  // fetch borrowals from API
  const fetchBorrowals = async () => {
    try {
      const params = {
        search: searchTerm || '',
        status: selectedStatus || '',
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        page: currentPage - 1,
        size: pageSize
      };
      console.log("Call api fetch borrowals: ", params);
      console.log("User in Context", user)
      const response = await borrowalApi.getBorrowalByCriteria(params);
      setBorrowals(response.data.content || []);
      console.log("Content of borrowals: ", response.data.content);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch borrow records:', error);
      setBorrowals([]);
      setTotalPages(1);
    }
  };

  const fetchStatistics = async () => {
    try {
        const params = {
          fromDate: fromDate || undefined,
          toDate: toDate || undefined,
        }
        const response = await borrowalApi.getBorrowalStatistic(params);
        setBorrowalStatistics(response.data || []);
        console.log("Content of statistics: ", response.data);
    } catch (error) {
      console.error('Failed to fetch borrow records in statics:', error);
    }
  }

  useEffect(() => {  
    fetchBorrowals();
  }, [searchTerm, selectedStatus, fromDate, toDate, currentPage]);

  useEffect(() => {  
    fetchStatistics();
  }, [fromDate, toDate]);

  const statuses = ['', 'Borrowed', 'Overdue', 'Returned'];
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Borrowed': return 'primary';
      case 'Overdue': return 'danger';
      case 'Returned': return 'success';
      default: return 'secondary';
    }
  };

  const handleReturnClick = async (borrowal) => {

    setBorrowalToReturn(borrowal);
    setShowReturnModal(true);
  };

  const handleReturnConfirm = () => {
    // Handle return logic here
    console.log('Processing return for:', borrowalToReturn);
    setShowReturnModal(false);
    setBorrowalToReturn(null);
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
          <Card className={`${styles.statCard} h-100`}>
            <Card.Body>
              <div className={styles.statContent}>
                <div className={styles.statIcon} style={{ backgroundColor: 'var(--primary-blue)' }}>
                  <BookFill />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>
                    {borrowalStatistics.filter(b => b.status === 'Borrowed').length}
                  </div>
                  <div className={styles.statLabel}>Active Borrowals</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className={`${styles.statCard} h-100`}>
            <Card.Body>
              <div className={styles.statContent}>
                <div className={styles.statIcon} style={{ backgroundColor: 'var(--alert-red)' }}>
                  <ExclamationTriangle />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>
                    {borrowalStatistics.filter(b => b.status === 'Overdue').length}
                  </div>
                  <div className={styles.statLabel}>Overdue Items</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className={`${styles.statCard} h-100`}>
            <Card.Body>
              <div className={styles.statContent}>
                <div className={styles.statIcon} style={{ backgroundColor: 'var(--accent-green)' }}>
                  <CheckCircle />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>
                    {borrowalStatistics.filter(b => b.status === 'Returned').length}
                  </div>
                  <div className={styles.statLabel}>Returned Items</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className={`${styles.statCard} h-100`}>
            <Card.Body>
              <div className={styles.statContent}>
                <div className={styles.statIcon} style={{ backgroundColor: 'var(--medium-gray)' }}>
                  <Clock />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>
                    ${borrowalStatistics.reduce((sum, b) => sum + b.fine, 0).toFixed(2)}
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
              onChange={(e) => setSearchTerm(e.target.value)} // CONSIDER CHANGE INTO BLUR
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
                {status === '' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col lg={2}>
          <Form.Control
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className={styles.filterSelect}
          />
        </Col>
        <Col lg={2}>
          <Form.Control
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className={styles.filterSelect}
          />
        </Col>
        <Col lg={2} className="mb-3">
          <div className={styles.resultsInfo}>
            {borrowals.length} borrowals
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
                      {/* <th>Actions</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {borrowals.map(borrowal => (
                      <tr key={borrowal.id} className={styles.borrowalRow}>
                        <td className={styles.idCell}>
                          <div className={styles.borrowalId}>
                            <strong>{borrowal.id}</strong>
                          </div>
                        </td>
                        <td className={styles.readerCell}>
                          <div className={styles.readerInfo}>
                            <div className={styles.readerIcon}>
                              <PersonFill />
                            </div>
                            <div className={styles.readerDetails}>
                              <div className={styles.readerName}>{borrowal.readerName}</div>
                            </div>
                          </div>
                        </td>
                        <td className={styles.bookCell}>
                          <div className={styles.bookInfo}>
                            {/* <img
                              src={borrowal.book.coverImage}
                              alt={borrowal.book.title}
                              className={styles.bookCover}
                            /> */}
                            <div className={styles.bookDetails}>
                              <div className={styles.bookTitle}>{borrowal.bookTitle}</div>
                              <div className={styles.bookAuthor}>{borrowal.authorName}</div>
                            </div>
                          </div>
                        </td>
                        <td className={styles.datesCell}>
                          <div className={styles.datesInfo}>
                            <div className={styles.dateItem}>
                              <span className={styles.dateLabel}>Borrowed:</span>
                              <span>{formatDate(borrowal.borrowedDate)}</span>
                            </div>
                            <div className={styles.dateItem}>
                              <span className={styles.dateLabel}>Due:</span>
                              <span className={borrowal.status === 'overdue' ? styles.overdue : ''}>
                                {formatDate(borrowal.allowedDate)}
                              </span>
                            </div>
                            {borrowal.returnDate && (
                              <div className={styles.dateItem}>
                                <span className={styles.dateLabel}>Returned:</span>
                                <span>{formatDate(borrowal.returnDate)}</span>
                              </div>
                            )}
                            {/* {borrowal.status === 'overdue' && (
                              <div className={styles.overdueInfo}>
                                {getDaysOverdue(borrowal.dueDate)} days overdue
                              </div>
                            )} */}
                          </div>
                        </td>
                        <td className={styles.statusCell}>
                          <Badge bg={getStatusVariant(borrowal.status)} className={styles.statusBadge}>
                            {borrowal.status.charAt(0).toUpperCase() + borrowal.status.slice(1)}
                          </Badge>
                          {/* {borrowal.renewalCount > 0 && (
                            <div className={styles.renewalInfo}>
                              Renewed {borrowal.renewalCount}/{borrowal.maxRenewals}
                            </div>
                          )} */}
                        </td>
                        <td className={styles.fineCell}>
                          {borrowal.fine > 0 ? (
                            <div className={styles.fineAmount}>
                              ${borrowal.fine.toFixed(2)}
                            </div>
                          ) : (
                            <span className={styles.noFine}>$0.00</span>
                          )}
                        </td>
                        {/* <td className={styles.actionsCell}>
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
                            {borrowal.status !== 'Returned' && (
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
                        </td> */}
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
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                />
                <Pagination.Prev
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                />
                <Pagination.Last
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
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
                <strong>Book:</strong> {borrowalToReturn.bookTitle}
                <br />
                <strong>Reader:</strong> {borrowalToReturn.readerName}
                <br />
                <strong>Due Date:</strong> {formatDate(borrowalToReturn.allowedDate)}
                <br />
                <strong>Status:</strong> {borrowalToReturn.status}
                {borrowalToReturn.fine > 0 && (
                  <>
                    <br />
                    <strong>Outstanding Fine:</strong> ${borrowalToReturn.fine.toFixed(2)}
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
