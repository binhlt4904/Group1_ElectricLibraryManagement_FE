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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showDeposit, setShowDeposit] = useState(false);
  const { user } = useContext(UserContext);
  console.log(user?.accountId)
  const userId = user?.accountId;

  useEffect(() => {

    const fetchWalletData = async () => {
      if (!userId) return;
      const res = await walletApi.getWalletByUserId(userId);
      console.log(res.data);
      setWallet(res.data);
    }
    fetchWalletData();
  }, [userId]);

  const fetchTransactions = async () => {
    if (!userId) return;
    try {
      const params = {
        page: currentPage - 1, 
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



  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'INCREASE':
        return <CheckCircleFill className={styles.iconPayment} />;
      case 'DECREASE':
        return <ExclamationTriangleFill className={styles.iconFine} />;
      case 'IN PROGRESS':
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

  const handleAddFunds = () => {
    setShowDeposit(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTransactions();
  };

  return (
    <div className={styles.walletPage}>
      <Container>
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
                              {(transaction.status === "DONE") && (transaction.type === "DECREASE" ? '-' : '+')}${Math.abs(transaction.amount).toFixed(2)}
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
      />
      
    </div>
  );
};

export default WalletPage;
