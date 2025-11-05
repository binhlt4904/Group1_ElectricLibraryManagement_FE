import React, { useState, useEffect, useContext, use } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Form, InputGroup, Modal, Alert, Pagination } from 'react-bootstrap';
import {
  Wallet, CreditCard, Plus, Receipt, Filter, Calendar,
  ExclamationTriangleFill, CheckCircleFill, CashCoin, Search
} from 'react-bootstrap-icons';
import styles from './WalletPage.module.css';
import DepositQrModal from '../../components/commons/wallet/DepositQrModal';
import UserContext from '../../components/contexts/UserContext';
import walletApi from '../../api/wallet';

const WalletPage = () => {
  const [wallet, setWallet] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showDeposit, setShowDeposit] = useState(false);
  const { user } = useContext(UserContext);
  console.log(user?.accountId)
  const userId = user?.accountId;


  // Mock data
  useEffect(() => {

    const fetchWalletData = async () => {
      if (!userId) return;
      const res = await walletApi.getWalletByUserId(userId);
      console.log("aaaaa")
      console.log(res.data);
      setWallet(res.data);
    }
    fetchWalletData();
  }, [userId]);

  const fetchTransactions = async () => {
    if (!userId) return;
    try {
      const params = {
        page: currentPage - 1, // backend dùng page = 0-based
        size: itemsPerPage,
        userId: userId
      };
      if (searchTerm.trim() !== '') params.search = searchTerm.trim();
      if (filterType !== 'all') params.type = filterType;
      const res = await walletApi.getAllTransactionsByUserId(userId, params);
      console.log(res)
      setTransactions(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }

  };

  useEffect(() => {
  fetchTransactions();
}, [userId, currentPage, searchTerm, filterType]);


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


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'IN PROGRESS':
        return <CheckCircleFill className={styles.iconPayment} />;
      case 'DECREASE':
        return <ExclamationTriangleFill className={styles.iconFine} />;
      case 'INCREASE':
        return <CashCoin className={styles.iconRefund} />;
      default:
        return <Receipt className={styles.iconDefault} />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DONE':
        return <Badge bg="success">Completed</Badge>;
      case 'PENDING':
        return <Badge bg="warning">Pending</Badge>;
      case 'CANCELLED':
        return <Badge bg="danger">Cancelled</Badge>;
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
    setShowDeposit(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("aaa")
    setCurrentPage(1);
    fetchTransactions();
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
          <Col md={6} className="mb-3">
            <Card className={`custom-card ${styles.balanceCard} ${styles.balancePositive}`}>
              <Card.Body className={styles.balanceCardBody}>
                <div className={styles.balanceIcon}>
                  <Wallet />
                </div>
                <div className={styles.balanceInfo}>
                  <div className={styles.balanceLabel}>Account Balance</div>
                  <div className={styles.balanceAmount}> ${wallet?.balance ? wallet.balance.toFixed(2) : "0.00"}</div>
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

          <Col md={6} className="mb-3">
            <Card className={`custom-card ${styles.balanceCard}`}>
              <Card.Body className={styles.balanceCardBody}>
                <div className={styles.balanceIcon}>
                  <Receipt />
                </div>
                <div className={styles.balanceInfo}>
                  <div className={styles.balanceLabel}>Total Paid</div>
                  <div className={styles.balanceAmount}> ${wallet?.totalPaid ? wallet.totalPaid.toFixed(2) : "0.00"}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        

        {/* Transaction History */}
        <Row className="mb-4">
          <Col>
            <Card className={`custom-card ${styles.transactionsCard}`}>
              <Card.Header className={styles.transactionsHeader}>
                <h4 className={styles.transactionsTitle}>Transaction History</h4>
                <Col>
                  <p className={styles.resultsInfo}>
                    Showing {(currentPage - 1) * itemsPerPage + 1}-
                    {Math.min(currentPage * itemsPerPage, totalElements)} of {totalElements} transactions
                  </p>
                </Col>
                <div className={styles.transactionFilters}>
                  <Form onSubmit={handleSearch}>
                  <InputGroup className={styles.searchGroup}>
                    <Form.Control
                      type="text"
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={styles.searchInput}
                    />
                    <Button type='submit' variant="outline-secondary">
                      <Search />
                    </Button>
                  </InputGroup>
                  </Form>
                  <Form.Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="all">All Types</option>
                    <option value="IN PROGRESS">In Progress</option>
                    <option value="DECREASE">Fines</option>
                    <option value="INCREASE">Recharges</option>
                  </Form.Select>
                </div>
              </Card.Header>
              <Card.Body className={styles.transactionsBody}>
                <div className={styles.tableContainer}>
                  <Table responsive className={styles.transactionsTable}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Transaction Code</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map(transaction => (
                        <tr key={transaction.id} className={styles.transactionRow}>
                          <td className={styles.dateCell}>
                            <Calendar className={styles.dateIcon} />
                            {formatDate(transaction.createdDate)}
                          </td>
                          <td className={styles.descriptionCell}>
                            <div className={styles.transactionInfo}>
                              {getTransactionIcon(transaction.type)}
                              <span className={styles.transactionDescription}>
                                {transaction.transactionCode}
                              </span>
                            </div>
                          </td>
                          <td className={styles.amountCell}>
                            <span className={`${styles.amount} ${transaction.type === "INCREASE" ? styles.credit : styles.debit}`}>
                              {transaction.type === "DECREASE" ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                            </span>
                          </td>
                          <td className={styles.statusCell}>
                            {getStatusBadge(transaction.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
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
            </Card>
          </Col>
        </Row>

      </Container>

      <DepositQrModal
        show={showDeposit}
        onHide={() => setShowDeposit(false)}
        userId={user?.accountId}
      // Bạn có thể override thông tin ngân hàng ở đây nếu cần:
      // bankCode="TPB"
      // accountNumber="06159974001"
      // accountName="Le Tien Binh"
      />
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
