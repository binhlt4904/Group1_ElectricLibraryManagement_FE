import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Table, Badge, Form, InputGroup, Pagination, Modal, Alert } from 'react-bootstrap';
import { 
  Plus, Search, Eye, Pencil, Trash, Download, People, 
  ExclamationTriangleFill, BookFill, CashCoin, Calendar,
  PersonCheck, PersonX, Envelope, Telephone
} from 'react-bootstrap-icons';
import styles from './ReadersManagementPage.module.css';

const ReadersManagementPage = () => {
  const [readers, setReaders] = useState([]);
  const [filteredReaders, setFilteredReaders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [membershipFilter, setMembershipFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [readerToDelete, setReaderToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Mock readers data
  useEffect(() => {
    const mockReaders = [
      {
        id: 1,
        memberId: 'LIB001234',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@email.com',
        phone: '+1 (555) 123-4567',
        membershipType: 'Premium',
        status: 'active',
        joinDate: '2023-06-15',
        expiryDate: '2024-06-15',
        currentBorrows: 3,
        totalBorrows: 45,
        fines: 0,
        address: '123 Main St, City, State 12345',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face'
      },
      {
        id: 2,
        memberId: 'LIB001235',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 234-5678',
        membershipType: 'Standard',
        status: 'active',
        joinDate: '2023-08-20',
        expiryDate: '2024-08-20',
        currentBorrows: 2,
        totalBorrows: 28,
        fines: 5.50,
        address: '456 Oak Ave, City, State 12345',
        photo: 'https://images.unsplash.com/photo-1494790108755-2616c6d4e6e8?w=60&h=60&fit=crop&crop=face'
      },
      {
        id: 3,
        memberId: 'LIB001236',
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael.brown@email.com',
        phone: '+1 (555) 345-6789',
        membershipType: 'Student',
        status: 'active',
        joinDate: '2023-09-10',
        expiryDate: '2024-09-10',
        currentBorrows: 5,
        totalBorrows: 67,
        fines: 0,
        address: '789 Pine St, City, State 12345',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face'
      },
      {
        id: 4,
        memberId: 'LIB001237',
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'emily.davis@email.com',
        phone: '+1 (555) 456-7890',
        membershipType: 'Premium',
        status: 'suspended',
        joinDate: '2023-03-05',
        expiryDate: '2024-03-05',
        currentBorrows: 0,
        totalBorrows: 89,
        fines: 25.00,
        address: '321 Elm St, City, State 12345',
        photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face'
      },
      {
        id: 5,
        memberId: 'LIB001238',
        firstName: 'David',
        lastName: 'Wilson',
        email: 'david.wilson@email.com',
        phone: '+1 (555) 567-8901',
        membershipType: 'Standard',
        status: 'expired',
        joinDate: '2022-11-15',
        expiryDate: '2023-11-15',
        currentBorrows: 1,
        totalBorrows: 34,
        fines: 12.75,
        address: '654 Maple Dr, City, State 12345',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face'
      }
    ];
    setReaders(mockReaders);
    setFilteredReaders(mockReaders);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = readers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(reader =>
        reader.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reader.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reader.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reader.memberId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(reader => reader.status === statusFilter);
    }

    // Membership filter
    if (membershipFilter !== 'all') {
      filtered = filtered.filter(reader => reader.membershipType === membershipFilter);
    }

    setFilteredReaders(filtered);
    setCurrentPage(1);
  }, [readers, searchTerm, statusFilter, membershipFilter]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge bg="success"><PersonCheck className="me-1" />Active</Badge>;
      case 'suspended':
        return <Badge bg="warning"><PersonX className="me-1" />Suspended</Badge>;
      case 'expired':
        return <Badge bg="danger"><Calendar className="me-1" />Expired</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const getMembershipBadge = (type) => {
    switch (type) {
      case 'Premium':
        return <Badge bg="primary">Premium</Badge>;
      case 'Standard':
        return <Badge bg="info">Standard</Badge>;
      case 'Student':
        return <Badge bg="success">Student</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpiringSoon = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const handleView = (readerId) => {
    console.log('View reader:', readerId);
  };

  const handleEdit = (readerId) => {
    console.log('Edit reader:', readerId);
  };

  const handleDelete = (reader) => {
    setReaderToDelete(reader);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setReaders(prev => prev.filter(reader => reader.id !== readerToDelete.id));
    setShowDeleteModal(false);
    setReaderToDelete(null);
    showAlertMessage(`Reader "${readerToDelete.firstName} ${readerToDelete.lastName}" has been deleted successfully.`);
  };

  const handleAddNew = () => {
    console.log('Add new reader');
  };

  const handleExport = () => {
    console.log('Export readers data');
    showAlertMessage('Readers data exported successfully!');
  };

  const showAlertMessage = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReaders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReaders.length / itemsPerPage);

  return (
    <div className={styles.readersManagementPage}>
      {/* Page Header */}
      <Row className="mb-4">
        <Col>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>
                <People className="me-3" />
                Readers Management
              </h1>
              <p className={styles.pageSubtitle}>
                Manage library members, memberships, and account status
              </p>
            </div>
            <div className={styles.headerActions}>
              <Button variant="outline-primary" onClick={handleExport} className="me-2">
                <Download className="me-1" />
                Export
              </Button>
              <Button variant="primary" onClick={handleAddNew}>
                <Plus className="me-1" />
                Add New Reader
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
              placeholder="Search by name, email, or member ID..."
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            size="lg"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="expired">Expired</option>
          </Form.Select>
        </Col>
        <Col lg={2} className="mb-3">
          <Form.Select
            value={membershipFilter}
            onChange={(e) => setMembershipFilter(e.target.value)}
            size="lg"
          >
            <option value="all">All Memberships</option>
            <option value="Premium">Premium</option>
            <option value="Standard">Standard</option>
            <option value="Student">Student</option>
          </Form.Select>
        </Col>
        <Col lg={4} className="mb-3">
          <div className={styles.resultsInfo}>
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredReaders.length)} of {filteredReaders.length} readers
          </div>
        </Col>
      </Row>

      {/* Readers Table */}
      <Card className={`custom-card ${styles.readersCard}`}>
        <Card.Body className={styles.readersCardBody}>
          <div className={styles.tableContainer}>
            <Table responsive className={styles.readersTable}>
              <thead>
                <tr>
                  <th>Reader</th>
                  <th>Contact</th>
                  <th>Membership</th>
                  <th>Status</th>
                  <th>Borrows</th>
                  <th>Fines</th>
                  <th>Expiry Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(reader => (
                  <tr key={reader.id} className={styles.readerRow}>
                    <td className={styles.readerCell}>
                      <div className={styles.readerInfo}>
                        <img
                          src={reader.photo}
                          alt={`${reader.firstName} ${reader.lastName}`}
                          className={styles.readerPhoto}
                        />
                        <div className={styles.readerDetails}>
                          <div className={styles.readerName}>
                            {reader.firstName} {reader.lastName}
                          </div>
                          <div className={styles.memberId}>
                            ID: {reader.memberId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={styles.contactCell}>
                      <div className={styles.contactInfo}>
                        <div className={styles.contactItem}>
                          <Envelope className={styles.contactIcon} />
                          <span className={styles.contactText}>{reader.email}</span>
                        </div>
                        <div className={styles.contactItem}>
                          <Telephone className={styles.contactIcon} />
                          <span className={styles.contactText}>{reader.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className={styles.membershipCell}>
                      {getMembershipBadge(reader.membershipType)}
                    </td>
                    <td className={styles.statusCell}>
                      {getStatusBadge(reader.status)}
                    </td>
                    <td className={styles.borrowsCell}>
                      <div className={styles.borrowsInfo}>
                        <div className={styles.currentBorrows}>
                          <BookFill className={styles.borrowsIcon} />
                          <span className={styles.borrowsNumber}>{reader.currentBorrows}</span>
                          <span className={styles.borrowsLabel}>current</span>
                        </div>
                        <div className={styles.totalBorrows}>
                          {reader.totalBorrows} total
                        </div>
                      </div>
                    </td>
                    <td className={styles.finesCell}>
                      {reader.fines > 0 ? (
                        <div className={styles.finesAmount}>
                          <CashCoin className={styles.finesIcon} />
                          <span className={styles.finesNumber}>${reader.fines.toFixed(2)}</span>
                        </div>
                      ) : (
                        <Badge bg="success">No Fines</Badge>
                      )}
                    </td>
                    <td className={styles.expiryCell}>
                      <div className={styles.expiryInfo}>
                        <span className={styles.expiryDate}>
                          {formatDate(reader.expiryDate)}
                        </span>
                        {isExpiringSoon(reader.expiryDate) && (
                          <Badge bg="warning" className={styles.expiryWarning}>
                            Expiring Soon
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className={styles.actionsCell}>
                      <div className={styles.actionButtons}>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleView(reader.id)}
                          className={styles.actionButton}
                        >
                          <Eye />
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleEdit(reader.id)}
                          className={styles.actionButton}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(reader)}
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
          {readerToDelete && (
            <div>
              <p>Are you sure you want to delete this reader?</p>
              <div className={styles.deleteReaderInfo}>
                <strong>Name:</strong> {readerToDelete.firstName} {readerToDelete.lastName}<br />
                <strong>Member ID:</strong> {readerToDelete.memberId}<br />
                <strong>Email:</strong> {readerToDelete.email}<br />
                <strong>Current Borrows:</strong> {readerToDelete.currentBorrows} books
              </div>
              <p className="text-danger mt-3">
                <small>This action cannot be undone and will affect all borrowing history.</small>
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete Reader
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReadersManagementPage;
