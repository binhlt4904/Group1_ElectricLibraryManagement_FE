import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Table, Badge, Form, InputGroup, Pagination, Modal, Alert } from 'react-bootstrap';
import {
  Plus, Search, Eye, Pencil, Trash, BookFill, ExclamationTriangleFill
} from 'react-bootstrap-icons';
import styles from './BooksManagementPage.module.css';
import bookApi from '../../../api/book';
import authorApi from '../../../api/author';
import categoryApi from '../../../api/category';
import publisherApi from '../../../api/publisher';
import { useNavigate } from 'react-router-dom';

const BooksManagementPage = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoriesList, setCategoriesList] = useState([]);
  const [authorsList, setAuthorsList] = useState([]);
  const [publisherList, setPublisherList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [editingId, setEditingId] = useState(null);      // id của book đang sửa inline
  const [editForm, setEditForm] = useState({});
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

      if (searchTerm.trim() === '' && categoryFilter === 'all' && statusFilter === 'all') {
        const uniqueCategories = [...new Set(data.content.map((book) => book.category))];
        setCategories(uniqueCategories);
      }

      setBooks(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.findAll();
      console.log(response.data)
      setCategoriesList(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await authorApi.findAll();
      setAuthorsList(response.data);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  const fetchPublishers = async () => {
    try {
      const response = await publisherApi.findAll();
      console.log(response.data)
      setPublisherList(response.data);
    } catch (error) {
      console.error('Error fetching publishers:', error);
    }
  };


  // 🔹 Initial fetch
  useEffect(() => {
    fetchCategories();
    fetchAuthors();
    fetchPublishers();
  }, []);


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
  const handleEdit = (bookId) => {
    const bk = books.find(b => b.id === bookId);
    console.log(bk)
    setEditingId(bookId);
    setEditForm({
      title: bk.title ?? '',
      author: bk.author ?? '',
      category: bk.category ?? '',
      isDeleted: bk.isDeleted,
      publisher: bk.publisher ?? '',
      publishedDate: bk.publishedDate ?? '',
      description: bk.description ?? '',
    });
  };

  const handleChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveEdit = async (bookId) => {
    try {
      const payload = {
        title: editForm.title?.trim(),
        author: editForm.author?.trim(),
        category: editForm.category,
        isDeleted: !!editForm.isDeleted,
        publisher: editForm.publisher?.trim(),
        publishedDate: editForm.publishedDate,
        description: editForm.description?.trim(),
      };
      console.log(payload)

      await bookApi.update(bookId, payload);

      setBooks(prev =>
        prev.map(b =>
          b.id === bookId ? { ...b, ...payload } : b
        )
      );

      setEditingId(null);
      setEditForm({});
      showAlertMessage(`Book "${payload.title}" has been updated successfully.`);
    } catch (err) {
      console.error('Update failed:', err);
      showAlertMessage('Update failed. Please try again.');
    }
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


  console.log(books)

  return (
    <div className={styles.booksManagementPage}>
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

      <Card className={`custom-card ${styles.booksCard}`}>
        <Card.Body className={styles.booksCardBody}>
          <div className={styles.tableContainer}>
            <Table responsive className={styles.booksTable}>
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Added Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => {
                  const isEditing = editingId === book.id;
                  return (
                    <tr key={book.id} className={styles.bookRow}>
                      <td className={styles.bookCell}>
                        <div className={styles.bookInfo}>
                          <img
                            src={`http://localhost:8080${book.image}`}
                            alt={book.title}
                            className={styles.bookCover}
                          />
                          <div className={styles.bookDetails}>
                            {!isEditing ? (
                              <>
                                <div className={styles.bookTitle}>{book.title}</div>
                                <div className={styles.bookPublisher}>
                                  {book.publisher} ({book.publishedDate})
                                </div>
                              </>
                            ) : (
                              <div className="d-flex flex-column gap-2">
                                <Form.Control
                                  size="sm"
                                  value={editForm.title}
                                  onChange={(e) => handleChange('title', e.target.value)}
                                  placeholder="Title"
                                />
                                <InputGroup size="sm">
                                  <Form.Select
                                    value={editForm.publisher}
                                    onChange={(e) => handleChange('publisher', e.target.value)}
                                  >
                                    {publisherList.map((p) => (
                                      <option key={p.id} value={p.companyName}>{p.companyName}</option>
                                    ))}
                                  </Form.Select>

                                  <Form.Control
                                    style={{ maxWidth: 130 }}
                                    value={editForm.publishedDate}
                                    onChange={(e) => handleChange('publishedDate', e.target.value)}
                                    placeholder="Year"
                                  />
                                </InputGroup>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        {!isEditing ? (
                          book.author
                        ) : (
                          <Form.Select
                            size="sm"
                            value={editForm.author}
                            onChange={(e) => handleChange('author', e.target.value)}
                          >
                            {authorsList.map((a) => (
                              <option key={a.id} value={a.fullName}>{a.fullName}</option>
                            ))}
                          </Form.Select>
                        )}
                      </td>

                      <td>
                        {!isEditing ? (
                          <Badge bg="info">{book.category}</Badge>
                        ) : (
                          <Form.Select
                            size="sm"
                            value={editForm.category}
                            onChange={(e) => handleChange('category', e.target.value)}
                          >
                            <option value="">Select category</option>
                            {categoriesList.map((c) => (
                              <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                          </Form.Select>
                        )}
                      </td>
                      <td style={{ minWidth: "250px" }}>
                        {!isEditing ? (
                          <span className={styles.bookDesc}>
                            {book.description?.length > 50
                              ? book.description.slice(0, 50) + "..."
                              : book.description || "—"}
                          </span>
                        ) : (
                          <Form.Control
                            as="textarea"
                            rows={2}
                            size="sm"
                            value={editForm.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            placeholder="Enter description"
                          />
                        )}
                      </td>
                      <td>
                        {!isEditing ? (
                          getStatusBadge(book.isDeleted)
                        ) : (
                          <Form.Check
                            type="switch"
                            id={`status-${book.id}`}
                            label={editForm.isDeleted ? 'Inactive' : 'Active'}
                            checked={!editForm.isDeleted}
                            onChange={(e) => handleChange('isDeleted', !e.target.checked)}
                          />
                        )}
                      </td>
                      <td>{formatDate(book.importedDate)}</td>
                      {/* Actions */}
                      <td>
                        <div className={styles.actionButtons}>
                          {!isEditing ? (
                            <>
                              <Button variant="outline-primary" size="sm" onClick={() => handleView(book.id)}>
                                <Eye />
                              </Button>
                              <Button variant="outline-secondary" size="sm" onClick={() => handleEdit(book.id)}>
                                <Pencil />
                              </Button>

                            </>
                          ) : (
                            <>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => handleSaveEdit(book.id)}
                              >
                                Save
                              </Button>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                className="ms-2"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
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


    </div>
  );
};

export default BooksManagementPage;
