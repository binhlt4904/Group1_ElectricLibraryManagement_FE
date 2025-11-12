import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, InputGroup, Pagination, Modal } from 'react-bootstrap';
import { Search, Calendar, BookFill, Clock, CheckCircleFill, ExclamationTriangleFill } from 'react-bootstrap-icons';
import styles from './BorrowHistoryPage.module.css';
import borrowReaderHistory from '../../api/user/borrowReaderHistory';
import { useContext } from 'react';
import UserContext from '../../components/contexts/UserContext';
const BorrowHistoryPage = () => {

  const { user } = useContext(UserContext)
  const [borrowals, setBorrowals] = useState([]);
  const [borrowalStatistics, setBorrowalStatistics] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 4;
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
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
      const response = await borrowReaderHistory.getBorrowalBySpecReaderAndCriteria(params);
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
      const response = await borrowReaderHistory.getBorrowalStatisticBySpecReader(params);
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
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, fromDate, toDate]);

  useEffect(() => {
    fetchStatistics();
  }, [fromDate, toDate]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Borrowed':
        return <Badge bg="primary" className={styles.statusBadge}>Currently Borrowed</Badge>;
      case 'Returned':
        return <Badge bg="success" className={styles.statusBadge}>Returned</Badge>;
      case 'Overdue':
        return <Badge bg="danger" className={styles.statusBadge}>Overdue</Badge>;
      // case 'returned_late':
      //   return <Badge bg="warning" className={styles.statusBadge}>Returned Late</Badge>;
      default:
        return <Badge bg="secondary" className={styles.statusBadge}>Unknown</Badge>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'borrowed':
        return <BookFill className={styles.statusIcon} />;
      case 'returned':
        return <CheckCircleFill className={styles.statusIcon} />;
      case 'overdue':
        return <ExclamationTriangleFill className={styles.statusIcon} />;
      case 'returned_late':
        return <Clock className={styles.statusIcon} />;
      default:
        return <BookFill className={styles.statusIcon} />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // const handleRenew = (bookId) => {
  //   console.log('Renew book:', bookId);
  //   // Handle renewal logic
  // };

  const handleReturn = async (borrowalId) => {
    try {
      const response = await borrowReaderHistory.returnBook(borrowalId);

      if (response.data.success) {
        const data = response.data.data;
        setIsSuccess(true);
        setModalMessage(
          `Book "${data.bookTitle}" returned successfully!\n` +
          `Fine: $${data.fine.toFixed(2)}\n` +
          `Allowed Date: ${data.allowedDate}\n` +
          `Return Date: ${data.returnedDate}`
        );
        fetchBorrowals();
      } else {
        // Backend trả về success=false
        setIsSuccess(false);
        setModalMessage(response.data.message || "Failed to return the book.");
      }
    } catch (error) {
      // Nếu backend trả về lỗi HTTP 400 hoặc 500
      console.error("Return book error:", error);

      let errorMsg = "An unexpected error occurred.";
      if (error.response) {
        // Nếu backend gửi message trong body
        errorMsg =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Không có phản hồi từ server
        errorMsg = "No response from server. Please check your connection.";
      }

      setIsSuccess(false);
      setModalMessage(`${errorMsg}`);
    } finally {
      setShowReturnModal(true);
    }
  };


  return (
    <div className={styles.borrowHistoryPage}>
      <Container>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <h1 className={styles.pageTitle}>Borrow History</h1>
            <p className={styles.pageSubtitle}>
              Track your reading journey and manage your borrowed books
            </p>
          </Col>
        </Row>

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={3} className="mb-3">
            <Card className={`custom-card ${styles.statCard}`}>
              <Card.Body className={styles.statCardBody}>
                <div className={styles.statNumber}>{borrowalStatistics.length}</div>
                <div className={styles.statLabel}>Total Books</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className={`custom-card ${styles.statCard}`}>
              <Card.Body className={styles.statCardBody}>
                <div className={styles.statNumber}>{borrowalStatistics.filter(stat => stat.status === 'Borrowed').length}</div>
                <div className={styles.statLabel}>Currently Borrowed</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className={`custom-card ${styles.statCard} ${borrowalStatistics.filter(stat => stat.status === 'Overdue').length > 0 ? styles.statCardDanger : ''}`}>
              <Card.Body className={styles.statCardBody}>
                <div className={styles.statNumber}>{borrowalStatistics.filter(stat => stat.status === 'Overdue').length}</div>
                <div className={styles.statLabel}>Overdue</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className={`custom-card ${styles.statCard} ${borrowalStatistics.reduce((sum, b) => sum + b.fine, 0).toFixed(2) > 0 ? styles.statCardWarning : ''}`}>
              <Card.Body className={styles.statCardBody}>
                <div className={styles.statNumber}>${borrowalStatistics.reduce((sum, b) => sum + b.fine, 0).toFixed(2)}</div>
                <div className={styles.statLabel}>Total Fines</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Row className="mb-4">
          <Col lg={4} className="mb-3">
            <InputGroup size="lg">
              <Form.Control
                type="text"
                placeholder="Search books by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              <Button variant="primary">
                <Search />
              </Button>
            </InputGroup>
          </Col>
          <Col lg={3} className="mb-3">
            <Form.Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              size="lg"
            >
              <option value="">All Status</option>
              <option value="Borrowed">Currently Borrowed</option>
              <option value="Returned">Returned</option>
              <option value="Overdue">Overdue</option>
              {/* <option value="returned_late">Returned Late</option> */}
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
          <Col lg={3} className="mb-3">
            <div className={styles.resultsInfo}>
              Showing {borrowals.length} of {borrowalStatistics.length} records
            </div>
          </Col>
        </Row>

        {/* History Table */}
        <Card className={`custom-card ${styles.historyCard}`}>
          <Card.Body className={styles.historyCardBody}>
            <div className={styles.tableContainer}>
              <Table responsive className={styles.historyTable}>
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Borrow Date</th>
                    <th>Due Date</th>
                    <th>Return Date</th>
                    <th>Status</th>
                    <th>Fine</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {borrowals.map(item => (
                    <tr key={item.id} className={styles.historyRow}>
                      <td className={styles.bookCell}>
                        <div className={styles.bookInfo}>
                          {/* <img
                            src={item.coverImage}
                            alt={item.bookTitle}
                            className={styles.bookCover}
                          /> */}
                          <div className={styles.bookDetails}>
                            <div className={styles.bookTitle}>{item.bookTitle}</div>
                            <div className={styles.bookAuthor}>by {item.authorName}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.dateCell}>
                          <Calendar className={styles.dateIcon} />
                          {formatDate(item.borrowedDate)}
                        </div>
                      </td>
                      <td>
                        <div className={styles.dateCell}>
                          <Calendar className={styles.dateIcon} />
                          {formatDate(item.allowedDate)}
                          {item.status === 'Borrowed' && (
                            <div className={styles.daysRemaining}>
                              {getDaysRemaining(item.allowedDate) > 0
                                ? `${getDaysRemaining(item.allowedDate)} days left`
                                : `${Math.abs(getDaysRemaining(item.allowedDate))} days overdue`
                              }
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        {item.returnedDate ? (
                          <div className={styles.dateCell}>
                            <Calendar className={styles.dateIcon} />
                            {formatDate(item.returnedDate)}
                          </div>
                        ) : (
                          <span className={styles.notReturned}>Not returned</span>
                        )}
                      </td>
                      <td>
                        <div className={styles.statusCell}>
                          {getStatusIcon(item.status)}
                          {getStatusBadge(item.status)}
                        </div>
                      </td>
                      {/* <td className={styles.renewalCell}>
                        {item.renewalCount}
                      </td> */}
                      <td className={styles.fineCell}>
                        {item.fine > 0 ? (
                          <span className={styles.fineAmount}>${item.fine.toFixed(2)}</span>
                        ) : (
                          <span className={styles.noFine}>$0.00</span>
                        )}
                      </td>
                      <td className={styles.actionsCell}>
                        {item.status === 'Borrowed' && (
                          <div className={styles.actionButtons}>
                            {/* <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleRenew(item.id)}
                              disabled={item.renewalCount >= 3}
                            >
                              Renew
                            </Button> */}
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => handleReturn(item.id)}
                              className="ms-1"
                            >
                              Return
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.paginationContainer}>
                <Pagination>
                  <Pagination.First
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  />
                  <Pagination.Prev
                    onClick={() => setCurrentPage(currentPage - 1)}
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
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                  <Pagination.Last
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>

      <Modal show={showReturnModal} onHide={() => setShowReturnModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isSuccess ? 'Return Successful' : 'Return Failed'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ whiteSpace: 'pre-line' }}>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant={isSuccess ? 'success' : 'danger'}
            onClick={() => setShowReturnModal(false)}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BorrowHistoryPage;
