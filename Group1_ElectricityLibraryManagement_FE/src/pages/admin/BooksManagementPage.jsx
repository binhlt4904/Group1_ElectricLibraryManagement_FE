import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Table, Badge, Form, InputGroup, Pagination, Modal, Alert } from 'react-bootstrap';
import { 
  Plus, Search, Filter, Eye, Pencil, Trash, Download, 
  BookFill, ExclamationTriangleFill 
} from 'react-bootstrap-icons';
import styles from './BooksManagementPage.module.css';

const BooksManagementPage = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Mock books data
  useEffect(() => {
    const mockBooks = [
      {
        id: 1,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '978-0-7432-7356-5',
        publisher: 'Scribner',
        category: 'Fiction',
        publicationYear: 1925,
        totalCopies: 5,
        availableCopies: 2,
        status: 'active',
        addedDate: '2024-01-15',
        coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=60&h=80&fit=crop'
      },
      {
        id: 2,
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '978-0-06-112008-4',
        publisher: 'J.B. Lippincott & Co.',
        category: 'Fiction',
        publicationYear: 1960,
        totalCopies: 8,
        availableCopies: 3,
        status: 'active',
        addedDate: '2024-01-10',
        coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=60&h=80&fit=crop'
      },
      {
        id: 3,
        title: '1984',
        author: 'George Orwell',
        isbn: '978-0-452-28423-4',
        publisher: 'Secker & Warburg',
        category: 'Dystopian Fiction',
        publicationYear: 1949,
        totalCopies: 6,
        availableCopies: 0,
        status: 'active',
        addedDate: '2024-01-08',
        coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=80&fit=crop'
      },
      {
        id: 4,
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        isbn: '978-0-14-143951-8',
        publisher: 'T. Egerton',
        category: 'Romance',
        publicationYear: 1813,
        totalCopies: 4,
        availableCopies: 4,
        status: 'active',
        addedDate: '2024-01-05',
        coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=60&h=80&fit=crop'
      },
      {
        id: 5,
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        isbn: '978-0-316-76948-0',
        publisher: 'Little, Brown and Company',
        category: 'Fiction',
        publicationYear: 1951,
        totalCopies: 3,
        availableCopies: 1,
        status: 'inactive',
        addedDate: '2023-12-20',
        coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=60&h=80&fit=crop'
      }
    ];
    setBooks(mockBooks);
    setFilteredBooks(mockBooks);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = books;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn.includes(searchTerm)
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(book => book.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(book => book.status === statusFilter);
    }

    setFilteredBooks(filtered);
    setCurrentPage(1);
  }, [books, searchTerm, categoryFilter, statusFilter]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge bg="success">Active</Badge>;
      case 'inactive':
        return <Badge bg="secondary">Inactive</Badge>;
      case 'maintenance':
        return <Badge bg="warning">Maintenance</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const getAvailabilityBadge = (available, total) => {
    if (available === 0) {
      return <Badge bg="danger">Out of Stock</Badge>;
    } else if (available <= total * 0.2) {
      return <Badge bg="warning">Low Stock</Badge>;
    } else {
      return <Badge bg="success">Available</Badge>;
    }
  };

  const handleView = (bookId) => {
    console.log('View book:', bookId);
    // Navigate to book details
  };

  const handleEdit = (bookId) => {
    console.log('Edit book:', bookId);
    // Navigate to edit form
  };

  const handleDelete = (book) => {
    setBookToDelete(book);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setBooks(prev => prev.filter(book => book.id !== bookToDelete.id));
    setShowDeleteModal(false);
    setBookToDelete(null);
    showAlertMessage(`Book "${bookToDelete.title}" has been deleted successfully.`);
  };

  const handleAddNew = () => {
    console.log('Add new book');
    // Navigate to add form
  };

  const handleExport = () => {
    console.log('Export books data');
    showAlertMessage('Books data exported successfully!');
  };

  const showAlertMessage = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  const categories = [...new Set(books.map(book => book.category))];

  return (
    <div className={styles.booksManagementPage}>
      {/* Page Header */}
      <Row className="mb-4">
        <Col>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>
                <BookFill className="me-3" />
                Books Management
              </h1>
              <p className={styles.pageSubtitle}>
                Manage your library's book collection, inventory, and availability
              </p>
            </div>
            <div className={styles.headerActions}>
              <Button variant="outline-primary" onClick={handleExport} className="me-2">
                <Download className="me-1" />
                Export
              </Button>
              <Button variant="primary" onClick={handleAddNew}>
                <Plus className="me-1" />
                Add New Book
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {showAlert && (
        <Alert variant="success" className={styles.alert}>
          {alertMessage}
        </Alert>
      )}

      {/* Filters */}
      <Row className="mb-4">
        <Col lg={4} className="mb-3">
          <InputGroup size="lg">
            <Form.Control
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <Button variant="primary">
              <Search />
            </Button>
          </InputGroup>
        </Col>
        <Col lg={2} className="mb-3">
          <Form.Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            size="lg"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Form.Select>
        </Col>
        <Col lg={2} className="mb-3">
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            size="lg"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
          </Form.Select>
        </Col>
        <Col lg={4} className="mb-3">
          <div className={styles.resultsInfo}>
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredBooks.length)} of {filteredBooks.length} books
          </div>
        </Col>
      </Row>

      {/* Books Table */}
      <Card className={`custom-card ${styles.booksCard}`}>
        <Card.Body className={styles.booksCardBody}>
          <div className={styles.tableContainer}>
            <Table responsive className={styles.booksTable}>
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Author</th>
                  <th>ISBN</th>
                  <th>Category</th>
                  <th>Copies</th>
                  <th>Availability</th>
                  <th>Status</th>
                  <th>Added Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(book => (
                  <tr key={book.id} className={styles.bookRow}>
                    <td className={styles.bookCell}>
                      <div className={styles.bookInfo}>
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className={styles.bookCover}
                        />
                        <div className={styles.bookDetails}>
                          <div className={styles.bookTitle}>{book.title}</div>
                          <div className={styles.bookPublisher}>{book.publisher} ({book.publicationYear})</div>
                        </div>
                      </div>
                    </td>
                    <td className={styles.authorCell}>
                      {book.author}
                    </td>
                    <td className={styles.isbnCell}>
                      <code className={styles.isbnCode}>{book.isbn}</code>
                    </td>
                    <td className={styles.categoryCell}>
                      <Badge bg="info" className={styles.categoryBadge}>
                        {book.category}
                      </Badge>
                    </td>
                    <td className={styles.copiesCell}>
                      <div className={styles.copiesInfo}>
                        <span className={styles.availableCopies}>{book.availableCopies}</span>
                        <span className={styles.copiesSeparator}>/</span>
                        <span className={styles.totalCopies}>{book.totalCopies}</span>
                      </div>
                    </td>
                    <td className={styles.availabilityCell}>
                      {getAvailabilityBadge(book.availableCopies, book.totalCopies)}
                    </td>
                    <td className={styles.statusCell}>
                      {getStatusBadge(book.status)}
                    </td>
                    <td className={styles.dateCell}>
                      {formatDate(book.addedDate)}
                    </td>
                    <td className={styles.actionsCell}>
                      <div className={styles.actionButtons}>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleView(book.id)}
                          className={styles.actionButton}
                        >
                          <Eye />
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleEdit(book.id)}
                          className={styles.actionButton}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(book)}
                          className={styles.actionButton}
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

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <ExclamationTriangleFill className="me-2 text-danger" />
            Confirm Delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bookToDelete && (
            <div>
              <p>Are you sure you want to delete this book?</p>
              <div className={styles.deleteBookInfo}>
                <strong>Title:</strong> {bookToDelete.title}<br />
                <strong>Author:</strong> {bookToDelete.author}<br />
                <strong>ISBN:</strong> {bookToDelete.isbn}
              </div>
              <p className="text-danger mt-3">
                <small>This action cannot be undone.</small>
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete Book
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BooksManagementPage;
