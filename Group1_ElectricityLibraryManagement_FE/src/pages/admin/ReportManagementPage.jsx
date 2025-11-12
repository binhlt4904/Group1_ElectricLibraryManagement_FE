import React, { useEffect, useState } from 'react';
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
  Pagination,
  Modal,
  Alert
} from 'react-bootstrap';
import {
  ExclamationTriangle,
  Search,
  Eye,
  PencilSquare,
  CheckCircle,
  XCircle,
  PersonFill,
  BookFill,
  Clock,
  Flag
} from 'react-bootstrap-icons';
import styles from './ReportManagementPage.module.css';
import { useContext } from 'react';
import UserContext from '../../components/contexts/UserContext';
import reportApi from '../../api/admin/reportApi';
const ReportManagementPage = () => {

  const { user } = useContext(UserContext)
  const [reports, setReports] = useState([]);
  const [reportStatistics, setReportStatistics] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [reportType, setReportType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [resolvedNote, setResolvedNote] = useState(null);
  const [reportToResolve, setReportToProcess] = useState(null);
  const [showProcessModal, setShowProcessModal] = useState(false);

  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolvedReport, setResolvedReport] = useState(null);
  // const [borrowalToReturn, setBorrowalToReturn] = useState(null);
  const pageSize = 4;


  const types = ['', 'Content Issue', 'Access Issue', 'Other Issue'];
  const statuses = ['', 'PENDING', 'PROCESSING', 'RESOLVED'];

  const fetchReports = async () => {
    try {
      const params = {
        search: searchTerm || '',
        status: selectedStatus || '',
        reportType: reportType || '',
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        page: currentPage - 1,
        size: pageSize
      };
      console.log("Call api fetch borrowals: ", params);
      console.log("User in Context", user)
      const response = await reportApi.getReportByCriteria(params);
      setReports(response.data.content || []);
      console.log("Content of borrowals: ", response.data.content);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch borrow records:', error);
      setReports([]);
      setTotalPages(1);
    }
  };

  const fetchStatistics = async () => {
    try {
      const params = {
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
      }
      const response = await reportApi.getReportsByStatistic(params);
      setReportStatistics(response.data || []);
      console.log("Content of statistics: ", response.data);
    } catch (error) {
      console.error('Failed to fetch borrow records in statics:', error);
    }
  }

  useEffect(() => {
    fetchReports();
  }, [searchTerm, selectedStatus, reportType, fromDate, toDate, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, reportType, fromDate, toDate]);

  useEffect(() => {
    fetchStatistics();
  }, [fromDate, toDate]);

  useEffect(() => {
    // Chỉ kết nối khi user là staff
    if (!user || user.role !== '[ROLE_STAFF]') return;

    const eventSource = new EventSource(`http://localhost:8080/api/reports/stream`, {
      withCredentials: true
    });

    eventSource.addEventListener("new-report", (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📡 New report received:", data);

        // Gợi ý: Hiển thị thông báo nhẹ
        const msg = `New report from ${data.reporterName}: ${data.description}`;
        alert(msg); // bạn có thể thay bằng Toast hoặc Notification

        // Gọi lại API để load danh sách mới
        fetchReports();
      } catch (e) {
        console.error("Error parsing SSE event:", e);
      }
    });

    eventSource.onerror = (err) => {
      console.error("SSE connection error:", err);
      eventSource.close();
    };

    // cleanup khi component unmount
    return () => {
      console.log("Closing SSE connection");
      eventSource.close();
    };
  }, [user]);

  const handleProcessClick = (report) => {
    setReportToProcess(report);
    setShowProcessModal(true);
  };

  const handleResolveClick = (report) => {
    setResolvedReport(report);
    setShowResolveModal(true);
  };

  const handleResolveConfirm = async (id, resolvedNote) => {
    setShowResolveModal(false);
    try {
      const response = await reportApi.updateReport(id, resolvedNote);
      setResolvedNote('');
      fetchReports();
    } catch (error) {
      console.error('Failed to resolve report:', error);
    }

  };


  const handleProcessConfirm = async (id) => {
    setShowProcessModal(false);
    try {
      const response = await reportApi.assignReport(id);
      fetchReports();
    } catch (error) {
      console.error('Failed to resolve report:', error);
    }

  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'PENDING': return 'primary';
      case 'PROCESSING': return 'warning';
      case 'RESOLVED': return 'success';
      default: return 'secondary';
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      'Content Issue': 'info',
      'Access Issue': 'danger',
      'Other Issue': 'warning'
    };
    return colors[type] || 'secondary';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysAgo = (dateString) => {
    const reportDate = new Date(dateString);
    const today = new Date();
    const diffTime = today - reportDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Container fluid className={styles.reportManagementPage}>
      {/* Page Header */}
      <Row className="mb-4">
        <Col>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>
                <ExclamationTriangle className="me-3" />
                Report Management
              </h1>
              <p className={styles.pageSubtitle}>
                View and manage user-submitted reports and issues
              </p>
            </div>
          </div>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <Card className={`${styles.statCard} h-100`}>
            <Card.Body>
              <div className={styles.statContent}>
                <div className={styles.statIcon} style={{ backgroundColor: 'var(--primary-blue)' }}>
                  <ExclamationTriangle />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>
                    {reportStatistics.filter(r => r.status === 'PENDING').length}
                  </div>
                  <div className={styles.statLabel}>Pending Reports</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        {/* <Col md={3} className="mb-3">
          <Card className={styles.statCard}>
            <Card.Body>
              <div className={styles.statContent}>
                <div className={styles.statIcon} style={{ backgroundColor: 'var(--alert-red)' }}>
                  <Flag />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>
                    {mockReports.filter(r => r.priority === 'urgent').length}
                  </div>
                  <div className={styles.statLabel}>Urgent Priority</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col> */}
        <Col md={4} className="mb-3 ">
          <Card className={`${styles.statCard} h-100`}>
            <Card.Body>
              <div className={styles.statContent}>
                <div className={styles.statIcon} style={{ backgroundColor: 'var(--accent-green)' }}>
                  <CheckCircle />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>
                    {reportStatistics.filter(r => r.status === 'RESOLVED').length}
                  </div>
                  <div className={styles.statLabel}>Resolved Today</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className={`${styles.statCard} h-100`}>
            <Card.Body>
              <div className={styles.statContent}>
                <div className={styles.statIcon} style={{ backgroundColor: 'var(--medium-gray)' }}>
                  <Clock />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>
                    {reportStatistics.length}
                  </div>
                  <div className={styles.statLabel}>Total of Report</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col lg={3} className="mb-3">
          <InputGroup>
            <InputGroup.Text>
              <Search />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </InputGroup>
        </Col>
        <Col lg={2} className="mb-3">
          <Form.Select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className={styles.filterSelect}
          >
            {types.map(type => (
              <option key={type} value={type}>
                {type === '' ? 'All Report Types' : type}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col lg={2} className="mb-3">
          <Form.Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={styles.filterSelect}
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === '' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col lg={2}>
          <Form.Control
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className={styles.filterSelect}
          />
        </Col>
        <Col lg={2}>
          <Form.Control
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className={styles.filterSelect}
          />
        </Col>

        <Col lg={3} className="mb-3">
          <div className={styles.resultsInfo}>
            {reports.length} reports
          </div>
        </Col>
      </Row>

      {/* Reports Table */}
      <Row>
        <Col>
          <Card className={styles.reportsCard}>
            <Card.Body className={styles.reportsCardBody}>
              <div className={styles.tableContainer}>
                <Table responsive hover className={styles.reportsTable}>
                  <thead>
                    <tr>
                      <th>Report</th>
                      <th>Submitted By</th>
                      <th>Resource</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Assigned To</th>
                      {user && user.role === 'LIBRARIAN' ?
                        (<th>Actions</th>) : null}

                    </tr>
                  </thead>
                  <tbody>
                    {reports.map(report => (
                      <tr key={report.id} className={styles.reportRow}>
                        <td className={styles.reportCell}>
                          <div className={styles.reportInfo}>
                            <div className={styles.reportTitle}>{report.description}</div>
                            <Badge
                              bg={getTypeColor(report.reportType)}
                              className={styles.typeBadge}
                            >
                              {report.reportType}
                            </Badge>
                          </div>
                        </td>
                        <td className={styles.submitterCell}>
                          <div className={styles.submitterInfo}>
                            <PersonFill className={styles.submitterIcon} />
                            <div className={styles.submitterDetails}>
                              <div className={styles.submitterName}>{report.reporterName}</div>
                              <div className={styles.submitterEmail}>{report.reporterEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td className={styles.resourceCell}>
                          {report.bookTitle ? (
                            <div className={styles.resourceInfo}>
                              <BookFill className={styles.resourceIcon} />
                              <div className={styles.resourceDetails}>
                                <div className={styles.resourceTitle}>{report.bookTitle}</div>
                                <div className={styles.resourceAuthor}>{report.authorName}</div>
                              </div>
                            </div>
                          ) : (
                            <span className={styles.noResource}>General Issue</span>
                          )}
                        </td>
                        <td className={styles.dateCell}>
                          <div className={styles.dateInfo}>
                            <div className={styles.dateValue}>{formatDate(report.createdAt)}</div>
                            <div className={styles.daysAgo}>{getDaysAgo(report.createdAt)} days ago</div>
                          </div>
                        </td>
                        <td className={styles.statusCell}>
                          <Badge bg={getStatusVariant(report.status)} className={styles.statusBadge}>
                            {
                              report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </Badge>
                        </td>
                        <td className={styles.assignedCell}>
                          {report.staffName ? (
                            <span className={styles.staffName}>{report.staffName}</span>
                          ) : (
                            <span className={styles.unassigned}>Unassigned</span>
                          )}
                        </td>
                        {user && user.role === 'LIBRARIAN' ? (
                          <td className={styles.actionsCell}>
                            <div className={styles.actionButtons}>
                              {/* <Button
                                variant="outline-primary"
                                size="sm"
                                className={styles.actionButton}
                                title="View Details"
                              >
                                <Eye />
                              </Button> */}
                              {report.status === 'PROCESSING' && (
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  className={styles.actionButton}
                                  title="Update Report"
                                  onClick={() => handleResolveClick(report)}
                                >
                                  <PencilSquare />
                                </Button>
                              )}
                              {report.status === 'PENDING' && (
                                <Button
                                  variant="outline-success"
                                  size="sm"
                                  className={styles.actionButton}
                                  title="Mark as processing"
                                  onClick={() => handleProcessClick(report)}
                                >
                                  <CheckCircle />
                                </Button>
                              )}
                            </div>
                          </td>) : null
                        }
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Pagination */}
      {totalPages > 1 && (
        <Row>
          <Col>
            <div className={styles.paginationContainer}>
              <Pagination>
                <Pagination.First
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          </Col>
        </Row>
      )}

      {/* Process Confirmation Modal */}
      <Modal show={showProcessModal} onHide={() => setShowProcessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Process to Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reportToResolve && (
            <div>
              <Alert variant="success">
                <strong>Mark report to process:</strong>
              </Alert>
              <div className={styles.resolveInfo}>
                <strong>Report:</strong> {reportToResolve.description}
                <br />
                <strong>Type:</strong> {reportToResolve.reportType}
                <br />
                <strong>Submitted by:</strong> {reportToResolve.reporterName} - {reportToResolve.reporterEmail}
                <br />
                <strong>Current Status:</strong> {reportToResolve.status}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProcessModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={() => handleProcessConfirm(reportToResolve.id)}>
            Confirm to process
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm as resolved */}
      <Modal show={showResolveModal} onHide={() => setShowResolveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Brief note about report</Form.Label>
              <Form.Control
                type="text"
                placeholder="Note about report"
                value={resolvedNote}
                onChange={(e) => setResolvedNote(e.target.value)}
                autoFocus
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResolveModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleResolveConfirm(resolvedReport.id, resolvedNote)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ReportManagementPage;
