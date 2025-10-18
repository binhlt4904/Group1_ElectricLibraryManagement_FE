import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, InputGroup, Pagination } from 'react-bootstrap';
import { Search, Calendar, BookFill, Clock, CheckCircleFill, ExclamationTriangleFill } from 'react-bootstrap-icons';
import styles from './BorrowHistoryPage.module.css';

const BorrowHistoryPage = () => {
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock data - replace with API call
  useEffect(() => {
    const mockHistory = [
      {
        id: 1,
        bookTitle: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        borrowDate: "2024-01-15",
        dueDate: "2024-02-15",
        returnDate: "2024-02-10",
        status: "returned",
        renewalCount: 1,
        fine: 0,
        coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=60&h=80&fit=crop"
      },
      {
        id: 2,
        bookTitle: "To Kill a Mockingbird",
        author: "Harper Lee",
        borrowDate: "2024-01-20",
        dueDate: "2024-02-20",
        returnDate: null,
        status: "borrowed",
        renewalCount: 0,
        fine: 0,
        coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=60&h=80&fit=crop"
      },
      {
        id: 3,
        bookTitle: "1984",
        author: "George Orwell",
        borrowDate: "2024-01-10",
        dueDate: "2024-02-10",
        returnDate: null,
        status: "overdue",
        renewalCount: 2,
        fine: 5.50,
        coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=80&fit=crop"
      },
      {
        id: 4,
        bookTitle: "Pride and Prejudice",
        author: "Jane Austen",
        borrowDate: "2023-12-15",
        dueDate: "2024-01-15",
        returnDate: "2024-01-12",
        status: "returned",
        renewalCount: 0,
        fine: 0,
        coverImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=60&h=80&fit=crop"
      },
      {
        id: 5,
        bookTitle: "The Catcher in the Rye",
        author: "J.D. Salinger",
        borrowDate: "2023-11-20",
        dueDate: "2023-12-20",
        returnDate: "2023-12-25",
        status: "returned_late",
        renewalCount: 1,
        fine: 2.00,
        coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=60&h=80&fit=crop"
      }
    ];
    setBorrowHistory(mockHistory);
    setFilteredHistory(mockHistory);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = borrowHistory;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredHistory(filtered);
    setCurrentPage(1);
  }, [borrowHistory, searchTerm, statusFilter]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'borrowed':
        return <Badge bg="primary" className={styles.statusBadge}>Currently Borrowed</Badge>;
      case 'returned':
        return <Badge bg="success" className={styles.statusBadge}>Returned</Badge>;
      case 'overdue':
        return <Badge bg="danger" className={styles.statusBadge}>Overdue</Badge>;
      case 'returned_late':
        return <Badge bg="warning" className={styles.statusBadge}>Returned Late</Badge>;
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

  const handleRenew = (bookId) => {
    console.log('Renew book:', bookId);
    // Handle renewal logic
  };

  const handleReturn = (bookId) => {
    console.log('Return book:', bookId);
    // Handle return logic
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  const stats = {
    total: borrowHistory.length,
    borrowed: borrowHistory.filter(item => item.status === 'borrowed').length,
    overdue: borrowHistory.filter(item => item.status === 'overdue').length,
    totalFines: borrowHistory.reduce((sum, item) => sum + item.fine, 0)
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
                <div className={styles.statNumber}>{stats.total}</div>
                <div className={styles.statLabel}>Total Books</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className={`custom-card ${styles.statCard}`}>
              <Card.Body className={styles.statCardBody}>
                <div className={styles.statNumber}>{stats.borrowed}</div>
                <div className={styles.statLabel}>Currently Borrowed</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className={`custom-card ${styles.statCard} ${stats.overdue > 0 ? styles.statCardDanger : ''}`}>
              <Card.Body className={styles.statCardBody}>
                <div className={styles.statNumber}>{stats.overdue}</div>
                <div className={styles.statLabel}>Overdue</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className={`custom-card ${styles.statCard} ${stats.totalFines > 0 ? styles.statCardWarning : ''}`}>
              <Card.Body className={styles.statCardBody}>
                <div className={styles.statNumber}>${stats.totalFines.toFixed(2)}</div>
                <div className={styles.statLabel}>Total Fines</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Row className="mb-4">
          <Col lg={6} className="mb-3">
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              size="lg"
            >
              <option value="all">All Status</option>
              <option value="borrowed">Currently Borrowed</option>
              <option value="returned">Returned</option>
              <option value="overdue">Overdue</option>
              <option value="returned_late">Returned Late</option>
            </Form.Select>
          </Col>
          <Col lg={3} className="mb-3">
            <div className={styles.resultsInfo}>
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredHistory.length)} of {filteredHistory.length} records
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
                    <th>Renewals</th>
                    <th>Fine</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map(item => (
                    <tr key={item.id} className={styles.historyRow}>
                      <td className={styles.bookCell}>
                        <div className={styles.bookInfo}>
                          <img
                            src={item.coverImage}
                            alt={item.bookTitle}
                            className={styles.bookCover}
                          />
                          <div className={styles.bookDetails}>
                            <div className={styles.bookTitle}>{item.bookTitle}</div>
                            <div className={styles.bookAuthor}>by {item.author}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.dateCell}>
                          <Calendar className={styles.dateIcon} />
                          {formatDate(item.borrowDate)}
                        </div>
                      </td>
                      <td>
                        <div className={styles.dateCell}>
                          <Calendar className={styles.dateIcon} />
                          {formatDate(item.dueDate)}
                          {item.status === 'borrowed' && (
                            <div className={styles.daysRemaining}>
                              {getDaysRemaining(item.dueDate) > 0 
                                ? `${getDaysRemaining(item.dueDate)} days left`
                                : `${Math.abs(getDaysRemaining(item.dueDate))} days overdue`
                              }
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        {item.returnDate ? (
                          <div className={styles.dateCell}>
                            <Calendar className={styles.dateIcon} />
                            {formatDate(item.returnDate)}
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
                      <td className={styles.renewalCell}>
                        {item.renewalCount}
                      </td>
                      <td className={styles.fineCell}>
                        {item.fine > 0 ? (
                          <span className={styles.fineAmount}>${item.fine.toFixed(2)}</span>
                        ) : (
                          <span className={styles.noFine}>$0.00</span>
                        )}
                      </td>
                      <td className={styles.actionsCell}>
                        {item.status === 'borrowed' && (
                          <div className={styles.actionButtons}>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleRenew(item.id)}
                              disabled={item.renewalCount >= 3}
                            >
                              Renew
                            </Button>
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
    </div>
  );
};

export default BorrowHistoryPage;
