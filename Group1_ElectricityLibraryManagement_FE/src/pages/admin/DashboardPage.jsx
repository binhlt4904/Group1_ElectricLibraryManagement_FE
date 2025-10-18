import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Table, Badge, ProgressBar } from 'react-bootstrap';
import { 
  BookFill, People, ClipboardData, ExclamationTriangleFill, 
  CashCoin, GraphUp, GraphDown, Plus, Eye, Download 
} from 'react-bootstrap-icons';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({});

  useEffect(() => {
    // Mock dashboard data - replace with API call
    const mockData = {
      statistics: {
        totalBooks: 15420,
        totalBooksChange: 5.2,
        activeReaders: 1234,
        activeReadersChange: -2.1,
        currentBorrowals: 856,
        currentBorrowalsChange: 8.7,
        overdueItems: 45,
        overdueItemsChange: -12.3,
        monthlyRevenue: 2850.75,
        monthlyRevenueChange: 15.8
      },
      recentActivities: [
        {
          id: 1,
          type: 'book_added',
          description: 'New book "The Silent Patient" added to collection',
          timestamp: '2024-01-20T14:30:00Z',
          user: 'Admin User'
        },
        {
          id: 2,
          type: 'member_registered',
          description: 'New member John Smith registered',
          timestamp: '2024-01-20T13:15:00Z',
          user: 'System'
        },
        {
          id: 3,
          type: 'book_returned',
          description: 'Book "1984" returned by Jane Doe',
          timestamp: '2024-01-20T12:45:00Z',
          user: 'Jane Doe'
        },
        {
          id: 4,
          type: 'fine_paid',
          description: 'Fine of $5.50 paid by Mike Johnson',
          timestamp: '2024-01-20T11:20:00Z',
          user: 'Mike Johnson'
        },
        {
          id: 5,
          type: 'book_borrowed',
          description: 'Book "To Kill a Mockingbird" borrowed by Sarah Wilson',
          timestamp: '2024-01-20T10:30:00Z',
          user: 'Sarah Wilson'
        }
      ],
      popularBooks: [
        { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', borrowCount: 45 },
        { id: 2, title: '1984', author: 'George Orwell', borrowCount: 42 },
        { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', borrowCount: 38 },
        { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', borrowCount: 35 },
        { id: 5, title: 'The Catcher in the Rye', author: 'J.D. Salinger', borrowCount: 32 }
      ],
      systemHealth: {
        serverStatus: 'healthy',
        databaseStatus: 'healthy',
        backupStatus: 'completed',
        lastBackup: '2024-01-20T02:00:00Z'
      }
    };
    setDashboardData(mockData);
  }, []);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'book_added':
        return <Plus className={styles.activityIcon} style={{ color: 'var(--accent-green)' }} />;
      case 'member_registered':
        return <People className={styles.activityIcon} style={{ color: 'var(--primary-blue)' }} />;
      case 'book_returned':
        return <BookFill className={styles.activityIcon} style={{ color: 'var(--accent-green)' }} />;
      case 'fine_paid':
        return <CashCoin className={styles.activityIcon} style={{ color: '#ffc107' }} />;
      case 'book_borrowed':
        return <BookFill className={styles.activityIcon} style={{ color: 'var(--primary-blue)' }} />;
      default:
        return <ClipboardData className={styles.activityIcon} />;
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, color, prefix = '', suffix = '' }) => (
    <Card className={`custom-card ${styles.statCard}`}>
      <Card.Body className={styles.statCardBody}>
        <div className={styles.statIcon} style={{ backgroundColor: `${color}20`, color }}>
          <Icon />
        </div>
        <div className={styles.statInfo}>
          <div className={styles.statValue}>
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </div>
          <div className={styles.statTitle}>{title}</div>
          <div className={styles.statChange}>
            {change > 0 ? (
              <GraphUp className={styles.changeIcon} style={{ color: 'var(--accent-green)' }} />
            ) : (
              <GraphDown className={styles.changeIcon} style={{ color: 'var(--alert-red)' }} />
            )}
            <span style={{ color: change > 0 ? 'var(--accent-green)' : 'var(--alert-red)' }}>
              {Math.abs(change)}%
            </span>
            <span className={styles.changeLabel}>vs last month</span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  if (!dashboardData.statistics) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.dashboardPage}>
      {/* Page Header */}
      <Row className="mb-4">
        <Col>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>Dashboard</h1>
              <p className={styles.pageSubtitle}>
                Welcome back! Here's what's happening at your library today.
              </p>
            </div>
            <div className={styles.headerActions}>
              <Button variant="outline-primary" className="me-2">
                <Download className="me-1" />
                Export Report
              </Button>
              <Button variant="primary">
                <Plus className="me-1" />
                Quick Add Book
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col lg={2} md={4} sm={6} className="mb-3">
          <StatCard
            title="Total Books"
            value={dashboardData.statistics.totalBooks}
            change={dashboardData.statistics.totalBooksChange}
            icon={BookFill}
            color="var(--primary-blue)"
          />
        </Col>
        <Col lg={2} md={4} sm={6} className="mb-3">
          <StatCard
            title="Active Readers"
            value={dashboardData.statistics.activeReaders}
            change={dashboardData.statistics.activeReadersChange}
            icon={People}
            color="var(--accent-green)"
          />
        </Col>
        <Col lg={2} md={4} sm={6} className="mb-3">
          <StatCard
            title="Current Borrowals"
            value={dashboardData.statistics.currentBorrowals}
            change={dashboardData.statistics.currentBorrowalsChange}
            icon={ClipboardData}
            color="#6f42c1"
          />
        </Col>
        <Col lg={2} md={4} sm={6} className="mb-3">
          <StatCard
            title="Overdue Items"
            value={dashboardData.statistics.overdueItems}
            change={dashboardData.statistics.overdueItemsChange}
            icon={ExclamationTriangleFill}
            color="var(--alert-red)"
          />
        </Col>
        <Col lg={4} md={8} sm={12} className="mb-3">
          <StatCard
            title="Monthly Revenue"
            value={dashboardData.statistics.monthlyRevenue}
            change={dashboardData.statistics.monthlyRevenueChange}
            icon={CashCoin}
            color="#ffc107"
            prefix="$"
          />
        </Col>
      </Row>

      <Row>
        {/* Charts Section */}
        <Col lg={8} className="mb-4">
          <Card className={`custom-card ${styles.chartCard}`}>
            <Card.Header className={styles.cardHeader}>
              <h4 className={styles.cardTitle}>Borrowing Trends</h4>
              <div className={styles.chartControls}>
                <Button variant="outline-secondary" size="sm" className="me-2">7 Days</Button>
                <Button variant="primary" size="sm" className="me-2">30 Days</Button>
                <Button variant="outline-secondary" size="sm">90 Days</Button>
              </div>
            </Card.Header>
            <Card.Body className={styles.chartBody}>
              {/* Placeholder for chart - would normally use Chart.js or similar */}
              <div className={styles.chartPlaceholder}>
                <div className={styles.chartBars}>
                  {[65, 45, 78, 52, 89, 67, 43, 76, 58, 82, 71, 49, 85, 63].map((height, index) => (
                    <div
                      key={index}
                      className={styles.chartBar}
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
                <div className={styles.chartLabels}>
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* System Health */}
        <Col lg={4} className="mb-4">
          <Card className={`custom-card ${styles.healthCard}`}>
            <Card.Header className={styles.cardHeader}>
              <h4 className={styles.cardTitle}>System Health</h4>
            </Card.Header>
            <Card.Body className={styles.healthBody}>
              <div className={styles.healthItem}>
                <div className={styles.healthLabel}>Server Status</div>
                <Badge bg="success" className={styles.healthBadge}>Healthy</Badge>
              </div>
              <div className={styles.healthItem}>
                <div className={styles.healthLabel}>Database</div>
                <Badge bg="success" className={styles.healthBadge}>Connected</Badge>
              </div>
              <div className={styles.healthItem}>
                <div className={styles.healthLabel}>Last Backup</div>
                <div className={styles.healthValue}>
                  {formatTimestamp(dashboardData.systemHealth.lastBackup)}
                </div>
              </div>
              <div className={styles.healthItem}>
                <div className={styles.healthLabel}>Storage Usage</div>
                <div className={styles.progressContainer}>
                  <ProgressBar now={68} className={styles.healthProgress} />
                  <span className={styles.progressLabel}>68%</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Recent Activities */}
        <Col lg={8} className="mb-4">
          <Card className={`custom-card ${styles.activitiesCard}`}>
            <Card.Header className={styles.cardHeader}>
              <h4 className={styles.cardTitle}>Recent Activities</h4>
              <Button variant="outline-primary" size="sm">
                <Eye className="me-1" />
                View All
              </Button>
            </Card.Header>
            <Card.Body className={styles.activitiesBody}>
              <div className={styles.activitiesList}>
                {dashboardData.recentActivities.map(activity => (
                  <div key={activity.id} className={styles.activityItem}>
                    <div className={styles.activityIconContainer}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityDescription}>
                        {activity.description}
                      </div>
                      <div className={styles.activityMeta}>
                        <span className={styles.activityUser}>{activity.user}</span>
                        <span className={styles.activityTime}>
                          {formatTimestamp(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Popular Books */}
        <Col lg={4} className="mb-4">
          <Card className={`custom-card ${styles.popularCard}`}>
            <Card.Header className={styles.cardHeader}>
              <h4 className={styles.cardTitle}>Popular Books</h4>
            </Card.Header>
            <Card.Body className={styles.popularBody}>
              <div className={styles.popularList}>
                {dashboardData.popularBooks.map((book, index) => (
                  <div key={book.id} className={styles.popularItem}>
                    <div className={styles.popularRank}>#{index + 1}</div>
                    <div className={styles.popularInfo}>
                      <div className={styles.popularTitle}>{book.title}</div>
                      <div className={styles.popularAuthor}>{book.author}</div>
                    </div>
                    <div className={styles.popularCount}>
                      <Badge bg="primary">{book.borrowCount}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
