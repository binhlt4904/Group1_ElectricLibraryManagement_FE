import React, { useState, useEffect } from 'react';
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
  Modal,
  Alert,
  Spinner
} from 'react-bootstrap';
import { 
  CreditCard, 
  Search, 
  Plus, 
  Eye, 
  CheckCircle,
  XCircle,
  Clock,
  PersonFill
} from 'react-bootstrap-icons';
import AsyncSelect from 'react-select/async';
import libraryCardAPI from '../../api/libraryCard';
import accountManagementApi from '../../api/admin/accountManagementApi';
import styles from './LibraryCardManagementPage.module.css';

const LibraryCardManagementPage = () => {
  const [cards, setCards] = useState([]);
  const [readers, setReaders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  
  // Create form
  const [createForm, setCreateForm] = useState({
    readerId: '',
    validityYears: 1
  });
  const [selectedReader, setSelectedReader] = useState(null);

  useEffect(() => {
    fetchCards();
    fetchReadersWithoutCards();
  }, []);

  const fetchCards = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await libraryCardAPI.getAllCards({ page: 0, size: 100 });
      setCards(response.data || []);
    } catch (err) {
      console.error('Error fetching cards:', err);
      setError('Failed to load library cards');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReadersWithoutCards = async () => {
    try {
      const response = await accountManagementApi.findReaders({ page: 0, size: 100 });
      const allReaders = response.data.content || [];
      
      // Filter readers who don't have cards
      const readersWithoutCards = allReaders.filter(reader => {
        return !cards.some(card => card.readerId === reader.id);
      });
      
      setReaders(readersWithoutCards);
    } catch (err) {
      console.error('Error fetching readers:', err);
    }
  };

  // Load options for AsyncSelect
  const loadReaderOptions = async (inputValue) => {
    try {
      const response = await accountManagementApi.searchReaders(inputValue, 0, 20);
      const readers = response.data.content || [];
      
      return readers.map(reader => ({
        value: reader.id || reader.accountId,
        label: `${reader.fullName} (${reader.readerCode})`,
        reader: reader
      }));
    } catch (error) {
      console.error('Error loading readers:', error);
      return [];
    }
  };

  const handleCreateCard = async () => {
    if (!createForm.readerId) {
      setError('Please select a reader');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await libraryCardAPI.createCard(createForm);
      
      if (response.data.success) {
        setSuccess(response.data.message);
        setShowCreateModal(false);
        setCreateForm({ readerId: '', validityYears: 1 });
        setSelectedReader(null);
        await fetchCards();
        await fetchReadersWithoutCards();
        setTimeout(() => setSuccess(null), 5000);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Error creating card:', err);
      setError(err.response?.data?.message || 'Failed to create library card');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (cardId, newStatus) => {
    try {
      setIsLoading(true);
      const response = await libraryCardAPI.updateCardStatus(cardId, newStatus);
      
      if (response.data.success) {
        setSuccess('Card status updated successfully');
        await fetchCards();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update card status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (card) => {
    setSelectedCard(card);
    setShowDetailsModal(true);
  };

  // Filter cards
  const filteredCards = cards.filter(card => {
    const matchesSearch = 
      card.cardNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.readerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.readerCode?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || card.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE': return 'success';
      case 'EXPIRED': return 'danger';
      case 'SUSPENDED': return 'warning';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Container fluid className={styles.libraryCardManagementPage}>
      {/* Error/Success Alerts */}
      {error && (
        <Alert variant="danger" className="mb-4" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" className="mb-4" onClose={() => setSuccess(null)} dismissible>
          {success}
        </Alert>
      )}

      {/* Page Header */}
      <Row className="mb-4">
        <Col>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>
                <CreditCard className="me-3" />
                Library Card Management
              </h1>
              <p className={styles.pageSubtitle}>
                Manage library cards, create new cards, and update card status
              </p>
            </div>
            <div className={styles.headerActions}>
              <Button 
                variant="primary" 
                className={styles.addButton}
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="me-2" />
                Create Library Card
              </Button>
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
                  <CreditCard />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>{cards.length}</div>
                  <div className={styles.statLabel}>Total Cards</div>
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
                    {cards.filter(c => c.status === 'ACTIVE').length}
                  </div>
                  <div className={styles.statLabel}>Active Cards</div>
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
                  <XCircle />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>
                    {cards.filter(c => c.isExpired).length}
                  </div>
                  <div className={styles.statLabel}>Expired Cards</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className={styles.statCard}>
            <Card.Body>
              <div className={styles.statContent}>
                <div className={styles.statIcon} style={{ backgroundColor: 'var(--warning-yellow)' }}>
                  <Clock />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>
                    {cards.filter(c => c.daysUntilExpiry !== null && c.daysUntilExpiry <= 30 && c.daysUntilExpiry > 0).length}
                  </div>
                  <div className={styles.statLabel}>Expiring Soon</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <Search />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by card number, reader name, or reader code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="EXPIRED">Expired</option>
            <option value="SUSPENDED">Suspended</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Cards Table */}
      <Card className={styles.tableCard}>
        <Card.Body>
          {isLoading && !cards.length ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading library cards...</p>
            </div>
          ) : (
            <Table responsive hover className={styles.cardsTable}>
              <thead>
                <tr>
                  <th>Card Number</th>
                  <th>Reader Name</th>
                  <th>Reader Code</th>
                  <th>Issue Date</th>
                  <th>Expiry Date</th>
                  <th>Days Remaining</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCards.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      No library cards found
                    </td>
                  </tr>
                ) : (
                  filteredCards.map((card) => {
                    const daysRemaining = getDaysUntilExpiry(card.expiryDate);
                    const isExpiringSoon = daysRemaining !== null && daysRemaining <= 30 && daysRemaining > 0;
                    
                    return (
                      <tr key={card.id}>
                        <td>
                          <strong>{card.cardNumber}</strong>
                        </td>
                        <td>
                          <PersonFill className="me-2" />
                          {card.readerName || 'N/A'}
                        </td>
                        <td>{card.readerCode || 'N/A'}</td>
                        <td>{formatDate(card.issueDate)}</td>
                        <td>
                          {formatDate(card.expiryDate)}
                          {isExpiringSoon && (
                            <Badge bg="warning" className="ms-2">Expiring Soon</Badge>
                          )}
                        </td>
                        <td>
                          {daysRemaining !== null ? (
                            <span className={daysRemaining < 0 ? 'text-danger' : isExpiringSoon ? 'text-warning' : ''}>
                              {daysRemaining < 0 ? 'Expired' : `${daysRemaining} days`}
                            </span>
                          ) : 'N/A'}
                        </td>
                        <td>
                          <Badge bg={getStatusVariant(card.status)}>
                            {card.status || 'N/A'}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleViewDetails(card)}
                          >
                            <Eye />
                          </Button>
                          {card.status === 'ACTIVE' && (
                            <Button
                              variant="outline-warning"
                              size="sm"
                              onClick={() => handleUpdateStatus(card.id, 'SUSPENDED')}
                            >
                              Suspend
                            </Button>
                          )}
                          {card.status === 'SUSPENDED' && (
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => handleUpdateStatus(card.id, 'ACTIVE')}
                            >
                              Activate
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Create Card Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Library Card</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select Reader *</Form.Label>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadReaderOptions}
                value={selectedReader}
                onChange={(option) => {
                  setSelectedReader(option);
                  setCreateForm({ ...createForm, readerId: option?.value || '' });
                }}
                placeholder="Search by name or reader code..."
                isClearable
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '38px',
                    borderColor: '#dee2e6'
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 9999
                  })
                }}
              />
              <Form.Text className="text-muted">
                Type to search readers by name or reader code
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Validity Period (Years) *</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="5"
                value={createForm.validityYears}
                onChange={(e) => setCreateForm({ ...createForm, validityYears: parseInt(e.target.value) })}
                required
              />
              <Form.Text className="text-muted">
                Card will be valid for {createForm.validityYears} year(s) from today
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleCreateCard}
            disabled={isLoading || !createForm.readerId}
          >
            {isLoading ? 'Creating...' : 'Create Library Card'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Card Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Library Card Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCard && (
            <div>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Card Number:</strong>
                    <div>{selectedCard.cardNumber}</div>
                  </div>
                  <div className="mb-3">
                    <strong>Reader Name:</strong>
                    <div>{selectedCard.readerName || 'N/A'}</div>
                  </div>
                  <div className="mb-3">
                    <strong>Reader Code:</strong>
                    <div>{selectedCard.readerCode || 'N/A'}</div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Issue Date:</strong>
                    <div>{formatDate(selectedCard.issueDate)}</div>
                  </div>
                  <div className="mb-3">
                    <strong>Expiry Date:</strong>
                    <div>{formatDate(selectedCard.expiryDate)}</div>
                  </div>
                  <div className="mb-3">
                    <strong>Status:</strong>
                    <div>
                      <Badge bg={getStatusVariant(selectedCard.status)}>
                        {selectedCard.status}
                      </Badge>
                    </div>
                  </div>
                </Col>
              </Row>
              {selectedCard.daysUntilExpiry !== null && (
                <Alert variant={selectedCard.daysUntilExpiry < 0 ? 'danger' : selectedCard.daysUntilExpiry <= 30 ? 'warning' : 'info'}>
                  {selectedCard.daysUntilExpiry < 0 
                    ? `This card expired ${Math.abs(selectedCard.daysUntilExpiry)} days ago`
                    : selectedCard.daysUntilExpiry <= 30
                    ? `This card will expire in ${selectedCard.daysUntilExpiry} days`
                    : `This card is valid for ${selectedCard.daysUntilExpiry} more days`
                  }
                </Alert>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LibraryCardManagementPage;
