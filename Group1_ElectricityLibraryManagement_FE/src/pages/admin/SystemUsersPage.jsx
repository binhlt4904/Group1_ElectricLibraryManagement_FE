import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Table, Badge, Form, InputGroup, Pagination, Modal, Alert } from 'react-bootstrap';
import { 
  Plus, Search, Eye, Pencil, Trash, Download, Gear, 
  ExclamationTriangleFill, PersonFill, Shield, ShieldCheck,
  Envelope, Calendar, Clock
} from 'react-bootstrap-icons';
import styles from './SystemUsersPage.module.css';

const SystemUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Mock system users data
  useEffect(() => {
    const mockUsers = [
      {
        id: 1,
        username: 'admin',
        firstName: 'System',
        lastName: 'Administrator',
        email: 'admin@library.com',
        role: 'Super Admin',
        status: 'active',
        lastLogin: '2024-01-20T14:30:00Z',
        createdDate: '2023-01-15T10:00:00Z',
        permissions: ['all'],
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face'
      },
      {
        id: 2,
        username: 'librarian1',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@library.com',
        role: 'Librarian',
        status: 'active',
        lastLogin: '2024-01-20T13:15:00Z',
        createdDate: '2023-03-20T09:30:00Z',
        permissions: ['books', 'authors', 'borrowals', 'readers'],
        photo: 'https://images.unsplash.com/photo-1494790108755-2616c6d4e6e8?w=60&h=60&fit=crop&crop=face'
      },
      {
        id: 3,
        username: 'librarian2',
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael.brown@library.com',
        role: 'Librarian',
        status: 'active',
        lastLogin: '2024-01-19T16:45:00Z',
        createdDate: '2023-05-10T11:15:00Z',
        permissions: ['books', 'authors', 'borrowals', 'readers'],
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face'
      },
      {
        id: 4,
        username: 'assistant1',
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'emily.davis@library.com',
        role: 'Assistant',
        status: 'active',
        lastLogin: '2024-01-20T12:00:00Z',
        createdDate: '2023-08-15T14:20:00Z',
        permissions: ['borrowals', 'readers'],
        photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face'
      },
      {
        id: 5,
        username: 'manager1',
        firstName: 'David',
        lastName: 'Wilson',
        email: 'david.wilson@library.com',
        role: 'Manager',
        status: 'inactive',
        lastLogin: '2024-01-10T09:30:00Z',
        createdDate: '2023-02-01T08:00:00Z',
        permissions: ['books', 'authors', 'borrowals', 'readers', 'reports'],
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face'
      }
    ];
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Super Admin':
        return <Badge bg="danger"><Shield className="me-1" />Super Admin</Badge>;
      case 'Manager':
        return <Badge bg="primary"><ShieldCheck className="me-1" />Manager</Badge>;
      case 'Librarian':
        return <Badge bg="success"><PersonFill className="me-1" />Librarian</Badge>;
      case 'Assistant':
        return <Badge bg="info"><PersonFill className="me-1" />Assistant</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge bg="success">Active</Badge>;
      case 'inactive':
        return <Badge bg="secondary">Inactive</Badge>;
      case 'suspended':
        return <Badge bg="warning">Suspended</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPermissionCount = (permissions) => {
    if (permissions.includes('all')) return 'All Permissions';
    return `${permissions.length} Permission${permissions.length !== 1 ? 's' : ''}`;
  };

  const handleView = (userId) => {
    console.log('View user:', userId);
  };

  const handleEdit = (userId) => {
    console.log('Edit user:', userId);
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setUsers(prev => prev.filter(user => user.id !== userToDelete.id));
    setShowDeleteModal(false);
    setUserToDelete(null);
    showAlertMessage(`User "${userToDelete.firstName} ${userToDelete.lastName}" has been deleted successfully.`);
  };

  const handleAddNew = () => {
    console.log('Add new user');
  };

  const handleExport = () => {
    console.log('Export users data');
    showAlertMessage('System users data exported successfully!');
  };

  const showAlertMessage = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const roles = [...new Set(users.map(user => user.role))];

  return (
    <div className={styles.systemUsersPage}>
      {/* Page Header */}
      <Row className="mb-4">
        <Col>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>
                <Gear className="me-3" />
                System Users
              </h1>
              <p className={styles.pageSubtitle}>
                Manage admin users, roles, and system permissions
              </p>
            </div>
            <div className={styles.headerActions}>
              <Button variant="outline-primary" onClick={handleExport} className="me-2">
                <Download className="me-1" />
                Export
              </Button>
              <Button variant="primary" onClick={handleAddNew}>
                <Plus className="me-1" />
                Add New User
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
              placeholder="Search by name, email, or username..."
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
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            size="lg"
          >
            <option value="all">All Roles</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
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
            <option value="suspended">Suspended</option>
          </Form.Select>
        </Col>
        <Col lg={4} className="mb-3">
          <div className={styles.resultsInfo}>
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} users
          </div>
        </Col>
      </Row>

      {/* Users Table */}
      <Card className={`custom-card ${styles.usersCard}`}>
        <Card.Body className={styles.usersCardBody}>
          <div className={styles.tableContainer}>
            <Table responsive className={styles.usersTable}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Contact</th>
                  <th>Role</th>
                  <th>Permissions</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(user => (
                  <tr key={user.id} className={styles.userRow}>
                    <td className={styles.userCell}>
                      <div className={styles.userInfo}>
                        <img
                          src={user.photo}
                          alt={`${user.firstName} ${user.lastName}`}
                          className={styles.userPhoto}
                        />
                        <div className={styles.userDetails}>
                          <div className={styles.userName}>
                            {user.firstName} {user.lastName}
                          </div>
                          <div className={styles.username}>
                            @{user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={styles.contactCell}>
                      <div className={styles.contactInfo}>
                        <div className={styles.contactItem}>
                          <Envelope className={styles.contactIcon} />
                          <span className={styles.contactText}>{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className={styles.roleCell}>
                      {getRoleBadge(user.role)}
                    </td>
                    <td className={styles.permissionsCell}>
                      <span className={styles.permissionsText}>
                        {getPermissionCount(user.permissions)}
                      </span>
                    </td>
                    <td className={styles.statusCell}>
                      {getStatusBadge(user.status)}
                    </td>
                    <td className={styles.lastLoginCell}>
                      <div className={styles.lastLoginInfo}>
                        <Clock className={styles.timeIcon} />
                        <span className={styles.lastLoginText}>
                          {formatDateTime(user.lastLogin)}
                        </span>
                      </div>
                    </td>
                    <td className={styles.dateCell}>
                      <div className={styles.createdInfo}>
                        <Calendar className={styles.dateIcon} />
                        <span className={styles.createdText}>
                          {formatDate(user.createdDate)}
                        </span>
                      </div>
                    </td>
                    <td className={styles.actionsCell}>
                      <div className={styles.actionButtons}>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleView(user.id)}
                          className={styles.actionButton}
                        >
                          <Eye />
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleEdit(user.id)}
                          className={styles.actionButton}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(user)}
                          className={styles.actionButton}
                          disabled={user.role === 'Super Admin'}
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
          {userToDelete && (
            <div>
              <p>Are you sure you want to delete this system user?</p>
              <div className={styles.deleteUserInfo}>
                <strong>Name:</strong> {userToDelete.firstName} {userToDelete.lastName}<br />
                <strong>Username:</strong> @{userToDelete.username}<br />
                <strong>Email:</strong> {userToDelete.email}<br />
                <strong>Role:</strong> {userToDelete.role}
              </div>
              <p className="text-danger mt-3">
                <small>This action cannot be undone and will revoke all system access.</small>
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SystemUsersPage;
