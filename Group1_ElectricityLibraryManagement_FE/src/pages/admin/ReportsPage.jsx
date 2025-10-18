import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Table, Badge } from 'react-bootstrap';
import { 
  BarChart, Download, Calendar, BookFill, People, 
  CashCoin, GraphUp, FileEarmarkText
} from 'react-bootstrap-icons';
import styles from './ReportsPage.module.css';

const ReportsPage = () => {
  const [reportType, setReportType] = useState('borrowing-stats');
  const [dateRange, setDateRange] = useState('last-30-days');
  const [reportData, setReportData] = useState({});

  useEffect(() => {
    // Mock report data
    const mockData = {
      'borrowing-stats': {
        title: 'Borrowing Statistics',
        summary: {
          totalBorrows: 1245,
          activeBorrows: 856,
          returnedBooks: 389,
          overdueBooks: 45
        },
        chartData: [
          { month: 'Jan', borrows: 120, returns: 115 },
          { month: 'Feb', borrows: 98, returns: 102 },
          { month: 'Mar', borrows: 145, returns: 138 },
          { month: 'Apr', borrows: 132, returns: 140 },
          { month: 'May', borrows: 156, returns: 149 },
          { month: 'Jun', borrows: 178, returns: 165 }
        ]
      },
      'popular-books': {
        title: 'Popular Books Report',
        books: [
          { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', borrows: 45, category: 'Fiction' },
          { title: '1984', author: 'George Orwell', borrows: 42, category: 'Dystopian Fiction' },
          { title: 'To Kill a Mockingbird', author: 'Harper Lee', borrows: 38, category: 'Fiction' },
          { title: 'Pride and Prejudice', author: 'Jane Austen', borrows: 35, category: 'Romance' },
          { title: 'The Catcher in the Rye', author: 'J.D. Salinger', borrows: 32, category: 'Fiction' }
        ]
      },
      'overdue-report': {
        title: 'Overdue Books Report',
        overdueBooks: [
          { 
            title: 'The Silent Patient', 
            borrower: 'John Smith', 
            dueDate: '2024-01-10', 
            daysOverdue: 10,
            fine: 5.00
          },
          { 
            title: 'Educated', 
            borrower: 'Sarah Johnson', 
            dueDate: '2024-01-12', 
            daysOverdue: 8,
            fine: 4.00
          },
          { 
            title: 'Becoming', 
            borrower: 'Mike Brown', 
            dueDate: '2024-01-15', 
            daysOverdue: 5,
            fine: 2.50
          }
        ]
      },
      'financial-report': {
        title: 'Financial Report',
        summary: {
          totalRevenue: 2850.75,
          finesCollected: 450.25,
          membershipFees: 2400.50,
          pendingFines: 125.75
        },
        monthlyRevenue: [
          { month: 'Jan', revenue: 420.50 },
          { month: 'Feb', revenue: 385.25 },
          { month: 'Mar', revenue: 510.75 },
          { month: 'Apr', revenue: 465.00 },
          { month: 'May', revenue: 520.25 },
          { month: 'Jun', revenue: 549.00 }
        ]
      }
    };
    setReportData(mockData);
  }, []);

  const handleExportReport = () => {
    console.log(`Exporting ${reportType} report for ${dateRange}`);
    // Export logic here
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderBorrowingStats = () => {
    const data = reportData['borrowing-stats'];
    if (!data) return null;

    return (
      <div>
        {/* Summary Cards */}
        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Card className={`custom-card ${styles.summaryCard}`}>
              <Card.Body className={styles.summaryCardBody}>
                <div className={styles.summaryIcon} style={{ backgroundColor: '#0d6efd20', color: '#0d6efd' }}>
                  <BookFill />
                </div>
                <div className={styles.summaryInfo}>
                  <div className={styles.summaryValue}>{data.summary.totalBorrows}</div>
                  <div className={styles.summaryLabel}>Total Borrows</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className={`custom-card ${styles.summaryCard}`}>
              <Card.Body className={styles.summaryCardBody}>
                <div className={styles.summaryIcon} style={{ backgroundColor: '#19875420', color: '#198754' }}>
                  <GraphUp />
                </div>
                <div className={styles.summaryInfo}>
                  <div className={styles.summaryValue}>{data.summary.activeBorrows}</div>
                  <div className={styles.summaryLabel}>Active Borrows</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className={`custom-card ${styles.summaryCard}`}>
              <Card.Body className={styles.summaryCardBody}>
                <div className={styles.summaryIcon} style={{ backgroundColor: '#ffc10720', color: '#ffc107' }}>
                  <BookFill />
                </div>
                <div className={styles.summaryInfo}>
                  <div className={styles.summaryValue}>{data.summary.returnedBooks}</div>
                  <div className={styles.summaryLabel}>Returned Books</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className={`custom-card ${styles.summaryCard}`}>
              <Card.Body className={styles.summaryCardBody}>
                <div className={styles.summaryIcon} style={{ backgroundColor: '#dc354520', color: '#dc3545' }}>
                  <Calendar />
                </div>
                <div className={styles.summaryInfo}>
                  <div className={styles.summaryValue}>{data.summary.overdueBooks}</div>
                  <div className={styles.summaryLabel}>Overdue Books</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Chart */}
        <Card className={`custom-card ${styles.chartCard}`}>
          <Card.Header className={styles.cardHeader}>
            <h5 className={styles.cardTitle}>Borrowing Trends</h5>
          </Card.Header>
          <Card.Body className={styles.chartBody}>
            <div className={styles.chartPlaceholder}>
              <div className={styles.chartBars}>
                {data.chartData.map((item, index) => (
                  <div key={index} className={styles.chartBarGroup}>
                    <div className={styles.chartBar} style={{ height: `${(item.borrows / 200) * 100}%`, backgroundColor: '#0d6efd' }}></div>
                    <div className={styles.chartBar} style={{ height: `${(item.returns / 200) * 100}%`, backgroundColor: '#198754' }}></div>
                    <div className={styles.chartLabel}>{item.month}</div>
                  </div>
                ))}
              </div>
              <div className={styles.chartLegend}>
                <div className={styles.legendItem}>
                  <div className={styles.legendColor} style={{ backgroundColor: '#0d6efd' }}></div>
                  <span>Borrows</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendColor} style={{ backgroundColor: '#198754' }}></div>
                  <span>Returns</span>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  };

  const renderPopularBooks = () => {
    const data = reportData['popular-books'];
    if (!data) return null;

    return (
      <Card className={`custom-card ${styles.tableCard}`}>
        <Card.Header className={styles.cardHeader}>
          <h5 className={styles.cardTitle}>Most Popular Books</h5>
        </Card.Header>
        <Card.Body className={styles.tableCardBody}>
          <Table responsive className={styles.reportTable}>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Book Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Total Borrows</th>
              </tr>
            </thead>
            <tbody>
              {data.books.map((book, index) => (
                <tr key={index}>
                  <td>
                    <div className={styles.rankBadge}>#{index + 1}</div>
                  </td>
                  <td className={styles.bookTitle}>{book.title}</td>
                  <td>{book.author}</td>
                  <td>
                    <Badge bg="info">{book.category}</Badge>
                  </td>
                  <td>
                    <span className={styles.borrowCount}>{book.borrows}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  };

  const renderOverdueReport = () => {
    const data = reportData['overdue-report'];
    if (!data) return null;

    return (
      <Card className={`custom-card ${styles.tableCard}`}>
        <Card.Header className={styles.cardHeader}>
          <h5 className={styles.cardTitle}>Overdue Books</h5>
        </Card.Header>
        <Card.Body className={styles.tableCardBody}>
          <Table responsive className={styles.reportTable}>
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Borrower</th>
                <th>Due Date</th>
                <th>Days Overdue</th>
                <th>Fine Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.overdueBooks.map((book, index) => (
                <tr key={index}>
                  <td className={styles.bookTitle}>{book.title}</td>
                  <td>{book.borrower}</td>
                  <td>{formatDate(book.dueDate)}</td>
                  <td>
                    <Badge bg="danger">{book.daysOverdue} days</Badge>
                  </td>
                  <td>
                    <span className={styles.fineAmount}>{formatCurrency(book.fine)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  };

  const renderFinancialReport = () => {
    const data = reportData['financial-report'];
    if (!data) return null;

    return (
      <div>
        {/* Financial Summary */}
        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Card className={`custom-card ${styles.summaryCard}`}>
              <Card.Body className={styles.summaryCardBody}>
                <div className={styles.summaryIcon} style={{ backgroundColor: '#19875420', color: '#198754' }}>
                  <CashCoin />
                </div>
                <div className={styles.summaryInfo}>
                  <div className={styles.summaryValue}>{formatCurrency(data.summary.totalRevenue)}</div>
                  <div className={styles.summaryLabel}>Total Revenue</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className={`custom-card ${styles.summaryCard}`}>
              <Card.Body className={styles.summaryCardBody}>
                <div className={styles.summaryIcon} style={{ backgroundColor: '#0d6efd20', color: '#0d6efd' }}>
                  <CashCoin />
                </div>
                <div className={styles.summaryInfo}>
                  <div className={styles.summaryValue}>{formatCurrency(data.summary.finesCollected)}</div>
                  <div className={styles.summaryLabel}>Fines Collected</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className={`custom-card ${styles.summaryCard}`}>
              <Card.Body className={styles.summaryCardBody}>
                <div className={styles.summaryIcon} style={{ backgroundColor: '#6f42c120', color: '#6f42c1' }}>
                  <People />
                </div>
                <div className={styles.summaryInfo}>
                  <div className={styles.summaryValue}>{formatCurrency(data.summary.membershipFees)}</div>
                  <div className={styles.summaryLabel}>Membership Fees</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className={`custom-card ${styles.summaryCard}`}>
              <Card.Body className={styles.summaryCardBody}>
                <div className={styles.summaryIcon} style={{ backgroundColor: '#ffc10720', color: '#ffc107' }}>
                  <Calendar />
                </div>
                <div className={styles.summaryInfo}>
                  <div className={styles.summaryValue}>{formatCurrency(data.summary.pendingFines)}</div>
                  <div className={styles.summaryLabel}>Pending Fines</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  const renderReportContent = () => {
    switch (reportType) {
      case 'borrowing-stats':
        return renderBorrowingStats();
      case 'popular-books':
        return renderPopularBooks();
      case 'overdue-report':
        return renderOverdueReport();
      case 'financial-report':
        return renderFinancialReport();
      default:
        return <div>Select a report type to view data.</div>;
    }
  };

  return (
    <div className={styles.reportsPage}>
      {/* Page Header */}
      <Row className="mb-4">
        <Col>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>
                <BarChart className="me-3" />
                Reports & Analytics
              </h1>
              <p className={styles.pageSubtitle}>
                Generate and view comprehensive library reports and statistics
              </p>
            </div>
            <div className={styles.headerActions}>
              <Button variant="primary" onClick={handleExportReport}>
                <Download className="me-1" />
                Export Report
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Report Controls */}
      <Row className="mb-4">
        <Col lg={4} className="mb-3">
          <Form.Group>
            <Form.Label className={styles.controlLabel}>Report Type</Form.Label>
            <Form.Select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              size="lg"
            >
              <option value="borrowing-stats">Borrowing Statistics</option>
              <option value="popular-books">Popular Books</option>
              <option value="overdue-report">Overdue Books</option>
              <option value="financial-report">Financial Report</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col lg={4} className="mb-3">
          <Form.Group>
            <Form.Label className={styles.controlLabel}>Date Range</Form.Label>
            <Form.Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              size="lg"
            >
              <option value="last-7-days">Last 7 Days</option>
              <option value="last-30-days">Last 30 Days</option>
              <option value="last-3-months">Last 3 Months</option>
              <option value="last-6-months">Last 6 Months</option>
              <option value="last-year">Last Year</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col lg={4} className="mb-3">
          <Form.Group>
            <Form.Label className={styles.controlLabel}>Export Format</Form.Label>
            <Form.Select size="lg">
              <option value="pdf">PDF Report</option>
              <option value="excel">Excel Spreadsheet</option>
              <option value="csv">CSV Data</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* Report Content */}
      <div className={styles.reportContent}>
        {renderReportContent()}
      </div>
    </div>
  );
};

export default ReportsPage;
