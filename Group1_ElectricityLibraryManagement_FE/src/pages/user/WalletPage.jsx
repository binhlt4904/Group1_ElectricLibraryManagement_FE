import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Form, InputGroup, Modal, Alert } from 'react-bootstrap';
import { 
  Wallet, CreditCard, Plus, Receipt, Filter, Calendar, 
  ExclamationTriangleFill, CheckCircleFill, CashCoin, Search 
} from 'react-bootstrap-icons';
import styles from './WalletPage.module.css';

const WalletPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Mock data
  const walletData = {
    balance: 25.50,
    outstandingFines: 12.75,
    totalPaid: 156.25,
    paymentMethods: [
      { id: 1, type: 'credit', last4: '4532', brand: 'Visa', isDefault: true },
      { id: 2, type: 'debit', last4: '8901', brand: 'Mastercard', isDefault: false }
    ]
  };

  const outstandingFines = [
    {
      id: 1,
      bookTitle: '1984',
      type: 'overdue',
      amount: 5.50,
      dueDate: '2024-01-15',
      daysOverdue: 5
    },
    {
      id: 2,
      bookTitle: 'The Catcher in the Rye',
      type: 'damage',
      amount: 7.25,
      reportDate: '2024-01-18',
      description: 'Water damage to pages 45-50'
    }
  ];

  useEffect(() => {
    const mockTransactions = [
      {
        id: 1,
        date: '2024-01-20',
        type: 'payment',
        description: 'Fine payment - The Great Gatsby',
        amount: -3.50,
        status: 'completed',
        method: 'Credit Card (*4532)'
      },
      {
        id: 2,
        date: '2024-01-18',
        type: 'fine',
        description: 'Late return fine - 1984',
        amount: 5.50,
        status: 'pending',
        method: null
      },
      {
        id: 3,
        date: '2024-01-15',
        type: 'payment',
        description: 'Account credit added',
        amount: -25.00,
        status: 'completed',
        method: 'Debit Card (*8901)'
      },
      {
        id: 4,
        date: '2024-01-10',
        type: 'fine',
        description: 'Damage fee - The Catcher in the Rye',
        amount: 7.25,
        status: 'pending',
        method: null
      },
      {
        id: 5,
        date: '2024-01-08',
        type: 'payment',
        description: 'Fine payment - Pride and Prejudice',
        amount: -2.00,
        status: 'completed',
        method: 'Credit Card (*4532)'
      }
    ];
    setTransactions(mockTransactions);
    setFilteredTransactions(mockTransactions);
  }, []);

  // Filter transactions
  useEffect(() => {
    let filtered = transactions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, filterType]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'payment':
        return <CheckCircleFill className={styles.iconPayment} />;
      case 'fine':
        return <ExclamationTriangleFill className={styles.iconFine} />;
      case 'refund':
        return <CashCoin className={styles.iconRefund} />;
      default:
        return <Receipt className={styles.iconDefault} />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge bg="success">Completed</Badge>;
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'failed':
        return <Badge bg="danger">Failed</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const handlePayFines = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = () => {
    setShowPaymentModal(false);
    setAlertMessage('Payment processed successfully!');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
    // Here you would typically process the payment
  };

  const handleAddFunds = () => {
    setAlertMessage('Add funds functionality would be implemented here');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <div className={styles.walletPage}>
      <Container>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <h1 className={styles.pageTitle}>
              <Wallet className="me-3" />
              My Wallet
            </h1>
            <p className={styles.pageSubtitle}>
              Manage your library account balance, fines, and payment methods
            </p>
          </Col>
        </Row>

        {showAlert && (
          <Alert variant="success" className={styles.alert}>
            {alertMessage}
          </Alert>
        )}

        {/* Balance Cards */}
        <Row className="mb-4">
          <Col md={4} className="mb-3">
            <Card className={`custom-card ${styles.balanceCard} ${styles.balancePositive}`}>
              <Card.Body className={styles.balanceCardBody}>
                <div className={styles.balanceIcon}>
                  <Wallet />
                </div>
                <div className={styles.balanceInfo}>
                  <div className={styles.balanceLabel}>Account Balance</div>
                  <div className={styles.balanceAmount}>${walletData.balance.toFixed(2)}</div>
                </div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleAddFunds}
                  className={styles.balanceAction}
                >
                  <Plus className="me-1" />
                  Add Funds
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className={`custom-card ${styles.balanceCard} ${styles.balanceNegative}`}>
              <Card.Body className={styles.balanceCardBody}>
                <div className={styles.balanceIcon}>
                  <ExclamationTriangleFill />
                </div>
                <div className={styles.balanceInfo}>
                  <div className={styles.balanceLabel}>Outstanding Fines</div>
                  <div className={styles.balanceAmount}>${walletData.outstandingFines.toFixed(2)}</div>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handlePayFines}
                  disabled={walletData.outstandingFines === 0}
                  className={styles.balanceAction}
                >
                  Pay Now
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className={`custom-card ${styles.balanceCard}`}>
              <Card.Body className={styles.balanceCardBody}>
                <div className={styles.balanceIcon}>
                  <Receipt />
                </div>
                <div className={styles.balanceInfo}>
                  <div className={styles.balanceLabel}>Total Paid</div>
                  <div className={styles.balanceAmount}>${walletData.totalPaid.toFixed(2)}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Outstanding Fines */}
        {outstandingFines.length > 0 && (
          <Row className="mb-4">
            <Col>
              <Card className={`custom-card ${styles.finesCard}`}>
                <Card.Header className={styles.finesHeader}>
                  <h4 className={styles.finesTitle}>
                    <ExclamationTriangleFill className="me-2" />
                    Outstanding Fines
                  </h4>
                  <Button variant="danger" onClick={handlePayFines}>
                    Pay All Fines
                  </Button>
                </Card.Header>
                <Card.Body className={styles.finesBody}>
                  {outstandingFines.map(fine => (
                    <div key={fine.id} className={styles.fineItem}>
                      <div className={styles.fineDetails}>
                        <h6 className={styles.fineBook}>{fine.bookTitle}</h6>
                        <div className={styles.fineInfo}>
                          <Badge bg={fine.type === 'overdue' ? 'warning' : 'danger'} className="me-2">
                            {fine.type === 'overdue' ? 'Overdue' : 'Damage Fee'}
                          </Badge>
                          {fine.type === 'overdue' ? (
                            <span className={styles.fineDescription}>
                              {fine.daysOverdue} days overdue (Due: {formatDate(fine.dueDate)})
                            </span>
                          ) : (
                            <span className={styles.fineDescription}>
                              {fine.description}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={styles.fineAmount}>${fine.amount.toFixed(2)}</div>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Transaction History */}
        <Row className="mb-4">
          <Col>
            <Card className={`custom-card ${styles.transactionsCard}`}>
              <Card.Header className={styles.transactionsHeader}>
                <h4 className={styles.transactionsTitle}>Transaction History</h4>
                <div className={styles.transactionFilters}>
                  <InputGroup className={styles.searchGroup}>
                    <Form.Control
                      type="text"
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={styles.searchInput}
                    />
                    <Button variant="outline-secondary">
                      <Search />
                    </Button>
                  </InputGroup>
                  <Form.Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="all">All Types</option>
                    <option value="payment">Payments</option>
                    <option value="fine">Fines</option>
                    <option value="refund">Refunds</option>
                  </Form.Select>
                </div>
              </Card.Header>
              <Card.Body className={styles.transactionsBody}>
                <div className={styles.tableContainer}>
                  <Table responsive className={styles.transactionsTable}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Method</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map(transaction => (
                        <tr key={transaction.id} className={styles.transactionRow}>
                          <td className={styles.dateCell}>
                            <Calendar className={styles.dateIcon} />
                            {formatDate(transaction.date)}
                          </td>
                          <td className={styles.descriptionCell}>
                            <div className={styles.transactionInfo}>
                              {getTransactionIcon(transaction.type)}
                              <span className={styles.transactionDescription}>
                                {transaction.description}
                              </span>
                            </div>
                          </td>
                          <td className={styles.amountCell}>
                            <span className={`${styles.amount} ${transaction.amount < 0 ? styles.credit : styles.debit}`}>
                              {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                            </span>
                          </td>
                          <td className={styles.statusCell}>
                            {getStatusBadge(transaction.status)}
                          </td>
                          <td className={styles.methodCell}>
                            {transaction.method || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Payment Methods */}
        <Row>
          <Col>
            <Card className={`custom-card ${styles.paymentMethodsCard}`}>
              <Card.Header className={styles.paymentMethodsHeader}>
                <h4 className={styles.paymentMethodsTitle}>
                  <CreditCard className="me-2" />
                  Payment Methods
                </h4>
                <Button variant="outline-primary">
                  <Plus className="me-1" />
                  Add Method
                </Button>
              </Card.Header>
              <Card.Body className={styles.paymentMethodsBody}>
                {walletData.paymentMethods.map(method => (
                  <div key={method.id} className={styles.paymentMethod}>
                    <div className={styles.methodIcon}>
                      <CreditCard />
                    </div>
                    <div className={styles.methodDetails}>
                      <div className={styles.methodInfo}>
                        <span className={styles.methodBrand}>{method.brand}</span>
                        <span className={styles.methodNumber}>**** **** **** {method.last4}</span>
                        {method.isDefault && (
                          <Badge bg="primary" className={styles.defaultBadge}>Default</Badge>
                        )}
                      </div>
                      <div className={styles.methodType}>
                        {method.type === 'credit' ? 'Credit Card' : 'Debit Card'}
                      </div>
                    </div>
                    <div className={styles.methodActions}>
                      <Button variant="outline-secondary" size="sm">Edit</Button>
                      <Button variant="outline-danger" size="sm" className="ms-2">Remove</Button>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Payment Modal */}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Pay Outstanding Fines</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.paymentSummary}>
            <h5>Payment Summary</h5>
            <div className={styles.summaryItem}>
              <span>Outstanding Fines:</span>
              <span>${walletData.outstandingFines.toFixed(2)}</span>
            </div>
            <div className={styles.summaryItem}>
              <span>Processing Fee:</span>
              <span>$0.00</span>
            </div>
            <hr />
            <div className={`${styles.summaryItem} ${styles.total}`}>
              <span><strong>Total:</strong></span>
              <span><strong>${walletData.outstandingFines.toFixed(2)}</strong></span>
            </div>
          </div>
          <Form.Group className="mt-3">
            <Form.Label>Payment Method</Form.Label>
            <Form.Select>
              {walletData.paymentMethods.map(method => (
                <option key={method.id} value={method.id}>
                  {method.brand} **** {method.last4} {method.isDefault ? '(Default)' : ''}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePaymentSubmit}>
            Pay ${walletData.outstandingFines.toFixed(2)}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default WalletPage;
