import { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';
import {
  BookFill, People, ClipboardData, ExclamationTriangleFill,
  CashCoin, Plus, Download, ClipboardData as Clipboard
} from 'react-bootstrap-icons';
import styles from './DashboardPage.module.css';
import dashboardApi from '../../api/admin/dashboard';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({
    statistics: null,
    recentActivities: [],
    popularBooks: [],
    trends: []
  });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [err, setErr] = useState("");

  const toNumber = (v, def = 0) => {
    if (typeof v === 'number') return v;
    if (typeof v === 'string' && v.trim() && !Number.isNaN(Number(v))) return Number(v);
    return def;
  };
  const formatTime = (ts) =>
    new Date(ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const monthLabel = (m) =>
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Math.max(0, Math.min(11, (m ?? 1) - 1))];
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    (async () => {
      try {
        const [
          revRes, booksRes, readersRes, currentRes, overdueRes,
          popularRes, activitiesRes, trendsRes
        ] = await Promise.all([
          dashboardApi.getTotalRevenue(),
          dashboardApi.getTotalBooks(),
          dashboardApi.getTotalReaders(),
          dashboardApi.getCurrentBorrowals(),
          dashboardApi.getOverdueItems(),
          dashboardApi.getPopularBooks(),
          dashboardApi.getRecentActivities(),
          dashboardApi.getBorrowingTrendsCurrentYear()
        ]);

        const stats = {
          totalRevenue: toNumber(revRes?.data?.totalRevenue, 0),
          totalBooks: toNumber(booksRes?.data?.totalBooks, 0),
          activeReaders: toNumber(readersRes?.data?.activeReaders, 0),
          currentBorrowals: toNumber(currentRes?.data?.currentBorrowals, 0),
          overdueItems: toNumber(overdueRes?.data?.overdueItems, 0),
        };

        const popularBooks = Array.isArray(popularRes?.data)
          ? popularRes.data.map((b, i) => ({
            id: b.bookId ?? i,
            title: b.bookName ?? 'Unknown title',
            author: b.authorName ?? 'Unknown author',
            borrowCount: toNumber(b.borrowCount, 0),
          }))
          : [];

        const recentActivities = Array.isArray(activitiesRes?.data)
          ? activitiesRes.data.map((a, i) => ({
            id: a.id ?? i,
            title: a.title ?? '',
            description: a.description ?? '',
            user: a.fromUser ?? 'System',
            timestamp: a.createdDate ?? new Date().toISOString(),
          }))
          : [];

        const trends = Array.isArray(trendsRes?.data)
          ? trendsRes.data.map(t => ({
            month: toNumber(t.month, 0),         // 1..12
            borrowCount: toNumber(t.borrowCount, 0),
          }))
          : [];

        setDashboardData({ statistics: stats, recentActivities, popularBooks, trends });
      } catch (e) {
        setErr(e?.response?.data?.message || e?.message || "Load dashboard failed");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ===== Export Excel handler =====
  const handleExport = async () => {
    try {
      setExporting(true);

      // ví dụ có thể truyền year: currentYear nếu BE cần
      const res = await dashboardApi.exportReportExcel({ year: currentYear });

      // Lấy tên file từ Content-Disposition (nếu BE trả)
      const dispo = res?.headers?.['content-disposition'] || res?.headers?.get?.('content-disposition');
      let filename = `dashboard_report_${currentYear}.xlsx`;
      if (dispo) {
        const match = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i.exec(dispo);
        if (match && match[1]) {
          filename = decodeURIComponent(match[1].replace(/['"]/g, ''));
        }
      }

      // Tạo blob & tải
      const mime = res?.headers?.['content-type'] ||
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const blob = new Blob([res.data], { type: mime });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || "Export report failed");
    } finally {
      setExporting(false);
    }
  };

  const getActivityIcon = (typeOrTitle) => {
    const t = (typeOrTitle || '').toString().toUpperCase();
    if (t.includes('BORROW')) return <BookFill className={styles.activityIcon} style={{ color: 'var(--primary-blue)' }} />;
    if (t.includes('RETURN')) return <BookFill className={styles.activityIcon} style={{ color: 'var(--accent-green)' }} />;
    if (t.includes('PAY')) return <CashCoin className={styles.activityIcon} style={{ color: '#ffc107' }} />;
    if (t.includes('ACCOUNT') || t.includes('USER')) return <People className={styles.activityIcon} style={{ color: 'var(--primary-blue)' }} />;
    if (t.includes('BOOK')) return <Plus className={styles.activityIcon} style={{ color: 'var(--accent-green)' }} />;
    return <Clipboard className={styles.activityIcon} />;
  };

  const StatCard = ({ title, value, icon: Icon, color, prefix = '', suffix = '' }) => (
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
        </div>
      </Card.Body>
    </Card>
  );

  if (loading) return <div className="p-4">Loading…</div>;
  if (err) return <div className="p-4 text-danger">{err}</div>;
  if (!dashboardData.statistics) return <div className="p-4">No data</div>;

  const { statistics } = dashboardData;

  // Chart data normalize + scale
  const monthly = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, borrowCount: 0 }));
  (dashboardData.trends || []).forEach(t => {
    const m = Number(t.month);
    const c = Number(t.borrowCount) || 0;
    if (m >= 1 && m <= 12) monthly[m - 1].borrowCount += c;
  });
  const maxBorrow = Math.max(0, ...monthly.map(x => x.borrowCount));

  return (
    <div className={styles.dashboardPage}>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>Dashboard</h1>
              <p className={styles.pageSubtitle}>Welcome back! Here's what's happening at your library today.</p>
            </div>
            <div className={styles.headerActions}>
              <Button variant="outline-primary" className="me-2" onClick={handleExport} disabled={exporting}>
                {exporting ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Exporting…
                  </>
                ) : (
                  <>
                    <Download className="me-1" />
                    Export Report
                  </>
                )}
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Row 2: 4 stat cards */}
      <Row xs={1} sm={2} md={3} lg={5} className="g-3 mb-4">
        <Col><StatCard title="Total Books" value={statistics.totalBooks} icon={BookFill} color="var(--primary-blue)"/></Col>
        <Col><StatCard title="Active Readers" value={statistics.activeReaders} icon={People} color="var(--accent-green)"/></Col>
        <Col><StatCard title="Current Borrowals" value={statistics.currentBorrowals} icon={BookFill} color="#6f42c1"/></Col>
        <Col><StatCard title="Overdue Items" value={statistics.overdueItems} icon={ExclamationTriangleFill} color="var(--alert-red)"/></Col>
        <Col><StatCard title="Total Revenue" value={statistics.totalRevenue} icon={CashCoin} color="#ffc107" suffix="$" /></Col>
      </Row>


      <Row>
        {/* Trends */}
        <Col lg={8} className="mb-4">
          <Card className={`custom-card ${styles.chartCard}`}>
            <Card.Header className={styles.cardHeader}>
              <h4 className={styles.cardTitle}>Borrowing Trends ({currentYear})</h4>
            </Card.Header>
            <Card.Body className={styles.chartBody}>
              <div className={styles.chartPlaceholder}>
                <div className={styles.chartBars}>
                  {monthly.map((p, index) => {
                    const heightPct = maxBorrow > 0 ? Math.round((p.borrowCount / maxBorrow) * 100) : 0;
                    return (
                      <div
                        key={index}
                        className={styles.chartBar}
                        title={`${monthLabel(p.month)}: ${p.borrowCount}`}
                        style={{ height: `${heightPct}%` }}
                      />
                    );
                  })}
                </div>
                <div className={styles.chartLabels}>
                  {monthly.map(m => <span key={m.month}>{monthLabel(m.month)}</span>)}
                </div>
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

      <Row>
        {/* Recent Activities */}
        <Col lg={12} className="mb-4">
          <Card className={`custom-card ${styles.activitiesCard}`}>
            <Card.Header className={styles.cardHeader}>
              <h4 className={styles.cardTitle}>Recent Activities</h4>
            </Card.Header>
            <Card.Body className={styles.activitiesBody}>
              <div className={styles.activitiesList}>
                {dashboardData.recentActivities.map(a => (
                  <div key={a.id} className={styles.activityItem}>
                    <div className={styles.activityIconContainer}>
                      {getActivityIcon(a.title)}
                    </div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityDescription}>{a.description}</div>
                      <div className={styles.activityMeta}>
                        <span className={styles.activityUser}>{a.user}</span>
                        <span className={styles.activityTime}>{formatTime(a.timestamp)}</span>
                      </div>
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



