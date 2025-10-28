import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Table, Badge, Form, InputGroup, Pagination, Modal, Alert } from 'react-bootstrap';
import {
  Plus, Search, Eye, Pencil, Trash, BookFill, ExclamationTriangleFill
} from 'react-bootstrap-icons';
import styles from './BooksManagementPage.module.css';
import bookApi from '../../../api/book';
import { useNavigate } from 'react-router-dom';

const BooksManagementPage = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();

  // 🔹 Fetch books from backend (with pagination + filters)
  const fetchBooks = async () => {
    try {
      const params = {
        page: currentPage - 1, // backend dùng page = 0-based
        size: itemsPerPage,
      };

      if (searchTerm.trim() !== '') params.search = searchTerm.trim();
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (statusFilter !== 'all') params.status = statusFilter;

      console.log(params)

      const response = await bookApi.findAllAdmin(params);
      const data = response.data;
      console.log(data)

      setBooks(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  // 🔹 Fetch when page or filters change
  useEffect(() => {
    console.log("aaa")
    fetchBooks();
  }, [currentPage, categoryFilter, statusFilter]);

  // 🔹 Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBooks();
  };

  const getStatusBadge = (status) => {
    switch (String(status)) {
      case 'false':
        return <Badge bg="success">Active</Badge>;
      case 'true':
        return <Badge bg="secondary">Inactive</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const handleView = (bookId) => navigate(`/admin/books/${bookId}`);
  const handleEdit = (bookId) => console.log('Edit book:', bookId);

  const handleDelete = (book) => {
    setBookToDelete(book);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Gọi API xóa ở đây nếu cần
    setBooks((prev) => prev.filter((b) => b.id !== bookToDelete.id));
    setShowDeleteModal(false);
    setBookToDelete(null);
    showAlertMessage(`Book "${bookToDelete.title}" has been deleted successfully.`);
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
      day: 'numeric',
    });
  };

  // 🔹 Categories dynamic (nếu backend không trả riêng)
  const categories = [...new Set(books.map((book) => book.category))];

  console.log(books)

  return (
    <div className={styles.booksManagementPage}>
      {/* Header */}
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
              <Button variant="primary" onClick={() => navigate('/admin/books/add')}>
                <Plus className="me-1" /> Add New Book
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {showAlert && <Alert variant="success" className={styles.alert}>{alertMessage}</Alert>}

      {/* 🔹 Filters */}
      <Row className="mb-4">
        <Col lg={4} className="mb-3">
          <Form onSubmit={handleSearch}>
            <InputGroup size="lg">
              <Form.Control
                type="text"
                placeholder="Search by title, author"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              <Button type="submit" variant="primary">
                <Search />
              </Button>
            </InputGroup>
          </Form>
        </Col>
        <Col lg={2} className="mb-3">
          <Form.Select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            size="lg"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Form.Select>
        </Col>
        <Col lg={2} className="mb-3">
          <Form.Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            size="lg"
          >
            <option value="all">All Status</option>
            <option value="false">Active</option>
            <option value="true">Inactive</option>
          </Form.Select>
        </Col>
        <Col lg={4} className="mb-3">
          <div className={styles.resultsInfo}>
            Showing {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, totalElements)} of {totalElements} books
          </div>
        </Col>
      </Row>

      {/* 🔹 Table */}
      <Card className={`custom-card ${styles.booksCard}`}>
        <Card.Body className={styles.booksCardBody}>
          <div className={styles.tableContainer}>
            <Table responsive className={styles.booksTable}>
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Added Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id} className={styles.bookRow}>
                    <td className={styles.bookCell}>
                      <div className={styles.bookInfo}>
                        <img
                          src={`http://localhost:8080${book.image}`}
                          alt={book.title}
                          className={styles.bookCover}
                        />
                        <div className={styles.bookDetails}>
                          <div className={styles.bookTitle}>{book.title}</div>
                          <div className={styles.bookPublisher}>
                            {book.publisher} ({book.publishedDate})
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{book.author}</td>
                    <td><Badge bg="info">{book.category}</Badge></td>
                    <td>{getStatusBadge(book.isDeleted)}</td>
                    <td>{formatDate(book.importedDate)}</td>
                    <td>
                      <div className={styles.actionButtons}>
                        <Button variant="outline-primary" size="sm" onClick={() => handleView(book.id)}>
                          <Eye />
                        </Button>
                        <Button variant="outline-secondary" size="sm" onClick={() => handleEdit(book.id)}>
                          <Pencil />
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(book)}>
                          <Trash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* 🔹 Pagination */}
          {totalPages > 1 && (
            <div className={styles.paginationContainer}>
              <Pagination>
                <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} />
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <ExclamationTriangleFill className="me-2 text-danger" /> Confirm Delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bookToDelete && (
            <>
              <p>Are you sure you want to delete this book?</p>
              <div><strong>Title:</strong> {bookToDelete.title}</div>
              <div><strong>Author:</strong> {bookToDelete.author}</div>
              <p className="text-danger mt-3"><small>This action cannot be undone.</small></p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete Book</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BooksManagementPage;
