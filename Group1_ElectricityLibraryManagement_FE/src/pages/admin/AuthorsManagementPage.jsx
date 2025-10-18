import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Table, Badge, Form, InputGroup, Pagination, Modal, Alert } from 'react-bootstrap';
import { 
  Plus, Search, Eye, Pencil, Trash, Download, PersonFill, 
  ExclamationTriangleFill, BookFill, Calendar 
} from 'react-bootstrap-icons';
import styles from './AuthorsManagementPage.module.css';

const AuthorsManagementPage = () => {
  const [authors, setAuthors] = useState([]);
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [authorToDelete, setAuthorToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Mock authors data
  useEffect(() => {
    const mockAuthors = [
      {
        id: 1,
        name: 'F. Scott Fitzgerald',
        birthDate: '1896-09-24',
        deathDate: '1940-12-21',
        nationality: 'American',
        biography: 'American novelist and short story writer, widely regarded as one of the greatest American writers of the 20th century.',
        booksCount: 4,
        totalBorrows: 1250,
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
        addedDate: '2024-01-15',
        status: 'active'
      },
      {
        id: 2,
        name: 'Harper Lee',
        birthDate: '1926-04-28',
        deathDate: '2016-02-19',
        nationality: 'American',
        biography: 'American novelist best known for her 1960 novel To Kill a Mockingbird.',
        booksCount: 2,
        totalBorrows: 980,
        photo: 'https://images.unsplash.com/photo-1494790108755-2616c6d4e6e8?w=60&h=60&fit=crop&crop=face',
        addedDate: '2024-01-10',
        status: 'active'
      },
      {
        id: 3,
        name: 'George Orwell',
        birthDate: '1903-06-25',
        deathDate: '1950-01-21',
        nationality: 'British',
        biography: 'English novelist, essayist, journalist and critic, best known for his novels Animal Farm and Nineteen Eighty-Four.',
        booksCount: 6,
        totalBorrows: 1580,
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
        addedDate: '2024-01-08',
        status: 'active'
      },
      {
        id: 4,
        name: 'Jane Austen',
        birthDate: '1775-12-16',
        deathDate: '1817-07-18',
        nationality: 'British',
        biography: 'English novelist known primarily for her six major novels, which interpret, critique and comment upon the British landed gentry.',
        booksCount: 6,
        totalBorrows: 1420,
        photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face',
        addedDate: '2024-01-05',
        status: 'active'
      },
      {
        id: 5,
        name: 'J.D. Salinger',
        birthDate: '1919-01-01',
        deathDate: '2010-01-27',
        nationality: 'American',
        biography: 'American writer known for his widely read novel The Catcher in the Rye.',
        booksCount: 3,
        totalBorrows: 750,
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face',
        addedDate: '2023-12-20',
        status: 'inactive'
      }
    ];
    setAuthors(mockAuthors);
    setFilteredAuthors(mockAuthors);
  }, []);

  // Search logic
  useEffect(() => {
    let filtered = authors;

    if (searchTerm) {
      filtered = filtered.filter(author =>
        author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        author.nationality.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAuthors(filtered);
    setCurrentPage(1);
  }, [authors, searchTerm]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge bg="success">Active</Badge>;
      case 'inactive':
        return <Badge bg="secondary">Inactive</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const calculateAge = (birthDate, deathDate) => {
    const birth = new Date(birthDate);
    const death = deathDate ? new Date(deathDate) : new Date();
    const age = Math.floor((death - birth) / (365.25 * 24 * 60 * 60 * 1000));
    return deathDate ? `${age} (deceased)` : `${age} years old`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleView = (authorId) => {
    console.log('View author:', authorId);
  };

  const handleEdit = (authorId) => {
    console.log('Edit author:', authorId);
  };

  const handleDelete = (author) => {
    setAuthorToDelete(author);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setAuthors(prev => prev.filter(author => author.id !== authorToDelete.id));
    setShowDeleteModal(false);
    setAuthorToDelete(null);
    showAlertMessage(`Author "${authorToDelete.name}" has been deleted successfully.`);
  };

  const handleAddNew = () => {
    console.log('Add new author');
  };

  const handleExport = () => {
    console.log('Export authors data');
    showAlertMessage('Authors data exported successfully!');
  };

  const showAlertMessage = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAuthors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAuthors.length / itemsPerPage);

  return (
    <div className={styles.authorsManagementPage}>
      {/* Page Header */}
      <Row className="mb-4">
        <Col>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>
                <PersonFill className="me-3" />
                Authors Management
              </h1>
              <p className={styles.pageSubtitle}>
                Manage author profiles, biographies, and their published works
              </p>
            </div>
            <div className={styles.headerActions}>
              <Button variant="outline-primary" onClick={handleExport} className="me-2">
                <Download className="me-1" />
                Export
              </Button>
              <Button variant="primary" onClick={handleAddNew}>
                <Plus className="me-1" />
                Add New Author
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

      {/* Search */}
      <Row className="mb-4">
        <Col lg={6} className="mb-3">
          <InputGroup size="lg">
            <Form.Control
              type="text"
              placeholder="Search by author name or nationality..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <Button variant="primary">
              <Search />
            </Button>
          </InputGroup>
        </Col>
        <Col lg={6} className="mb-3">
          <div className={styles.resultsInfo}>
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredAuthors.length)} of {filteredAuthors.length} authors
          </div>
        </Col>
      </Row>

      {/* Authors Table */}
      <Card className={`custom-card ${styles.authorsCard}`}>
        <Card.Body className={styles.authorsCardBody}>
          <div className={styles.tableContainer}>
            <Table responsive className={styles.authorsTable}>
              <thead>
                <tr>
                  <th>Author</th>
                  <th>Birth/Death</th>
                  <th>Nationality</th>
                  <th>Books</th>
                  <th>Total Borrows</th>
                  <th>Status</th>
                  <th>Added Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(author => (
                  <tr key={author.id} className={styles.authorRow}>
                    <td className={styles.authorCell}>
                      <div className={styles.authorInfo}>
                        <img
                          src={author.photo}
                          alt={author.name}
                          className={styles.authorPhoto}
                        />
                        <div className={styles.authorDetails}>
                          <div className={styles.authorName}>{author.name}</div>
                          <div className={styles.authorAge}>
                            {calculateAge(author.birthDate, author.deathDate)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={styles.datesCell}>
                      <div className={styles.dateInfo}>
                        <div className={styles.birthDate}>
                          <Calendar className={styles.dateIcon} />
                          Born: {formatDate(author.birthDate)}
                        </div>
                        {author.deathDate && (
                          <div className={styles.deathDate}>
                            Died: {formatDate(author.deathDate)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className={styles.nationalityCell}>
                      <Badge bg="info" className={styles.nationalityBadge}>
                        {author.nationality}
                      </Badge>
                    </td>
                    <td className={styles.booksCell}>
                      <div className={styles.booksCount}>
                        <BookFill className={styles.booksIcon} />
                        <span className={styles.booksNumber}>{author.booksCount}</span>
                      </div>
                    </td>
                    <td className={styles.borrowsCell}>
                      <span className={styles.borrowsNumber}>
                        {author.totalBorrows.toLocaleString()}
                      </span>
                    </td>
                    <td className={styles.statusCell}>
                      {getStatusBadge(author.status)}
                    </td>
                    <td className={styles.dateCell}>
                      {formatDate(author.addedDate)}
                    </td>
                    <td className={styles.actionsCell}>
                      <div className={styles.actionButtons}>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleView(author.id)}
                          className={styles.actionButton}
                        >
                          <Eye />
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleEdit(author.id)}
                          className={styles.actionButton}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(author)}
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
          {authorToDelete && (
            <div>
              <p>Are you sure you want to delete this author?</p>
              <div className={styles.deleteAuthorInfo}>
                <strong>Name:</strong> {authorToDelete.name}<br />
                <strong>Nationality:</strong> {authorToDelete.nationality}<br />
                <strong>Books:</strong> {authorToDelete.booksCount} books in collection
              </div>
              <p className="text-danger mt-3">
                <small>This action cannot be undone and will affect all associated books.</small>
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete Author
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AuthorsManagementPage;
