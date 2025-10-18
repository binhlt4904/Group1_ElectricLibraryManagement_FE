import React, { useState } from 'react';
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
  FileEarmark, 
  Search, 
  Plus, 
  Eye, 
  Download, 
  PencilSquare, 
  Trash,
  Upload,
  PersonFill,
  Calendar,
  FileText,
  Shield
} from 'react-bootstrap-icons';
import styles from './DocumentManagementPage.module.css';

const DocumentManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAccessLevel, setSelectedAccessLevel] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const documentsPerPage = 10;

  // Mock documents data
  const mockDocuments = [
    {
      id: 1,
      title: "Library Policies and Procedures Manual",
      category: "Policies",
      description: "Comprehensive guide to library policies, procedures, and best practices.",
      fileName: "library-policies-2024.pdf",
      fileSize: "2.4 MB",
      uploadedBy: {
        id: 1,
        name: "Sarah Johnson",
        role: "Library Director"
      },
      uploadDate: "2024-01-15",
      accessLevel: "staff-only",
      status: "active",
      downloadCount: 45,
      version: "v2.1"
    },
    {
      id: 2,
      title: "Emergency Procedures Handbook",
      category: "Procedures",
      description: "Step-by-step emergency procedures for various scenarios.",
      fileName: "emergency-procedures.pdf",
      fileSize: "1.8 MB",
      uploadedBy: {
        id: 2,
        name: "Michael Rodriguez",
        role: "Safety Coordinator"
      },
      uploadDate: "2024-01-12",
      accessLevel: "staff-only",
      status: "active",
      downloadCount: 23,
      version: "v1.3"
    },
    {
      id: 3,
      title: "New Employee Orientation Checklist",
      category: "Training Materials",
      description: "Checklist for new employee onboarding and orientation process.",
      fileName: "orientation-checklist.docx",
      fileSize: "156 KB",
      uploadedBy: {
        id: 3,
        name: "Emily Chen",
        role: "HR Manager"
      },
      uploadDate: "2024-01-10",
      accessLevel: "admin-only",
      status: "active",
      downloadCount: 12,
      version: "v1.0"
    },
    {
      id: 4,
      title: "Library Card Application Form",
      category: "Forms",
      description: "Standard application form for new library card registration.",
      fileName: "library-card-application.pdf",
      fileSize: "245 KB",
      uploadedBy: {
        id: 4,
        name: "David Kim",
        role: "Circulation Manager"
      },
      uploadDate: "2024-01-08",
      accessLevel: "public",
      status: "active",
      downloadCount: 156,
      version: "v3.2"
    },
    {
      id: 5,
      title: "Monthly Usage Report Template",
      category: "Reports",
      description: "Template for generating monthly library usage and statistics reports.",
      fileName: "monthly-report-template.xlsx",
      fileSize: "89 KB",
      uploadedBy: {
        id: 5,
        name: "Lisa Anderson",
        role: "Data Analyst"
      },
      uploadDate: "2024-01-05",
      accessLevel: "staff-only",
      status: "active",
      downloadCount: 34,
      version: "v2.0"
    },
    {
      id: 6,
      title: "IT Security Guidelines",
      category: "Policies",
      description: "Information technology security policies and guidelines for staff.",
      fileName: "it-security-guidelines.pdf",
      fileSize: "1.2 MB",
      uploadedBy: {
        id: 6,
        name: "Alex Thompson",
        role: "IT Manager"
      },
      uploadDate: "2024-01-03",
      accessLevel: "staff-only",
      status: "archived",
      downloadCount: 67,
      version: "v1.5"
    }
  ];

  const categories = ['all', 'Policies', 'Procedures', 'Forms', 'Reports', 'Training Materials'];
  const accessLevels = ['all', 'public', 'staff-only', 'admin-only'];

  // Filter documents
  const filteredDocuments = mockDocuments.filter(document => {
    const matchesSearch = document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.uploadedBy.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || document.category === selectedCategory;
    const matchesAccessLevel = selectedAccessLevel === 'all' || document.accessLevel === selectedAccessLevel;
    
    return matchesSearch && matchesCategory && matchesAccessLevel;
  });

  // Pagination
  const indexOfLastDocument = currentPage * documentsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
  const currentDocuments = filteredDocuments.slice(indexOfFirstDocument, indexOfLastDocument);
  const totalPages = Math.ceil(filteredDocuments.length / documentsPerPage);

  const handleDeleteClick = (document) => {
    setDocumentToDelete(document);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    console.log('Deleting document:', documentToDelete);
    setShowDeleteModal(false);
    setDocumentToDelete(null);
  };

  const handleUploadClick = () => {
    setShowUploadModal(true);
  };

  const handleUploadConfirm = () => {
    console.log('Uploading new document');
    setShowUploadModal(false);
  };

  const getAccessLevelVariant = (accessLevel) => {
    switch (accessLevel) {
      case 'public': return 'success';
      case 'staff-only': return 'warning';
      case 'admin-only': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'archived': return 'secondary';
      case 'draft': return 'warning';
      default: return 'secondary';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Policies': 'primary',
      'Procedures': 'info',
      'Forms': 'success',
      'Reports': 'warning',
      'Training Materials': 'danger'
    };
    return colors[category] || 'secondary';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf': return <FileText style={{ color: '#dc3545' }} />;
      case 'doc':
      case 'docx': return <FileText style={{ color: '#0d6efd' }} />;
      case 'xls':
      case 'xlsx': return <FileText style={{ color: '#198754' }} />;
      default: return <FileEarmark />;
    }
  };

  return (
    <Container fluid className={styles.documentManagementPage}>
      {/* Page Header */}
      <Row className="mb-4">
        <Col>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>
                <FileEarmark className="me-3" />
                Document Management
              </h1>
              <p className={styles.pageSubtitle}>
                Manage internal documents, forms, and resources
              </p>
            </div>
            <div className={styles.headerActions}>
              <Button variant="primary" className={styles.uploadButton} onClick={handleUploadClick}>
                <Upload className="me-2" />
                Upload Document
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
                  <FileEarmark />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>
                    {mockDocuments.filter(d => d.status === 'active').length}
                  </div>
                  <div className={styles.statLabel}>Active Documents</div>
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
                  <Download />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>
                    {mockDocuments.reduce((sum, d) => sum + d.downloadCount, 0)}
                  </div>
                  <div className={styles.statLabel}>Total Downloads</div>
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
                  <Shield />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>
                    {mockDocuments.filter(d => d.accessLevel === 'admin-only').length}
                  </div>
                  <div className={styles.statLabel}>Admin Only</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className={styles.statCard}>
            <Card.Body>
              <div className={styles.statContent}>
                <div className={styles.statIcon} style={{ backgroundColor: 'var(--medium-gray)' }}>
                  <Calendar />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>
                    {mockDocuments.filter(d => {
                      const uploadDate = new Date(d.uploadDate);
                      const thisMonth = new Date();
                      return uploadDate.getMonth() === thisMonth.getMonth() && 
                             uploadDate.getFullYear() === thisMonth.getFullYear();
                    }).length}
                  </div>
                  <div className={styles.statLabel}>This Month</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col lg={4} className="mb-3">
          <InputGroup>
            <InputGroup.Text>
              <Search />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </InputGroup>
        </Col>
        <Col lg={3} className="mb-3">
          <Form.Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.filterSelect}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col lg={3} className="mb-3">
          <Form.Select
            value={selectedAccessLevel}
            onChange={(e) => setSelectedAccessLevel(e.target.value)}
            className={styles.filterSelect}
          >
            {accessLevels.map(level => (
              <option key={level} value={level}>
                {level === 'all' ? 'All Access Levels' : 
                 level === 'staff-only' ? 'Staff Only' :
                 level === 'admin-only' ? 'Admin Only' :
                 level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col lg={2} className="mb-3">
          <div className={styles.resultsInfo}>
            {filteredDocuments.length} documents
          </div>
        </Col>
      </Row>

      {/* Documents Table */}
      <Row>
        <Col>
          <Card className={styles.documentsCard}>
            <Card.Body className={styles.documentsCardBody}>
              <div className={styles.tableContainer}>
                <Table responsive hover className={styles.documentsTable}>
                  <thead>
                    <tr>
                      <th>Document</th>
                      <th>File Info</th>
                      <th>Uploaded By</th>
                      <th>Upload Date</th>
                      <th>Access Level</th>
                      <th>Downloads</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentDocuments.map(document => (
                      <tr key={document.id} className={styles.documentRow}>
                        <td className={styles.documentCell}>
                          <div className={styles.documentInfo}>
                            <div className={styles.fileIcon}>
                              {getFileIcon(document.fileName)}
                            </div>
                            <div className={styles.documentDetails}>
                              <div className={styles.documentTitle}>{document.title}</div>
                              <Badge 
                                bg={getCategoryColor(document.category)} 
                                className={styles.categoryBadge}
                              >
                                {document.category}
                              </Badge>
                            </div>
                          </div>
                        </td>
                        <td className={styles.fileInfoCell}>
                          <div className={styles.fileInfo}>
                            <div className={styles.fileName}>{document.fileName}</div>
                            <div className={styles.fileDetails}>
                              <span className={styles.fileSize}>{document.fileSize}</span>
                              <span className={styles.fileVersion}>{document.version}</span>
                            </div>
                          </div>
                        </td>
                        <td className={styles.uploaderCell}>
                          <div className={styles.uploaderInfo}>
                            <PersonFill className={styles.uploaderIcon} />
                            <div className={styles.uploaderDetails}>
                              <div className={styles.uploaderName}>{document.uploadedBy.name}</div>
                              <div className={styles.uploaderRole}>{document.uploadedBy.role}</div>
                            </div>
                          </div>
                        </td>
                        <td className={styles.dateCell}>
                          <div className={styles.dateInfo}>
                            <Calendar className={styles.dateIcon} />
                            <span>{formatDate(document.uploadDate)}</span>
                          </div>
                        </td>
                        <td className={styles.accessCell}>
                          <Badge bg={getAccessLevelVariant(document.accessLevel)} className={styles.accessBadge}>
                            {document.accessLevel === 'staff-only' ? 'Staff Only' :
                             document.accessLevel === 'admin-only' ? 'Admin Only' :
                             document.accessLevel.charAt(0).toUpperCase() + document.accessLevel.slice(1)}
                          </Badge>
                        </td>
                        <td className={styles.downloadsCell}>
                          <div className={styles.downloadsInfo}>
                            <Download className={styles.downloadsIcon} />
                            <span className={styles.downloadsCount}>{document.downloadCount}</span>
                          </div>
                        </td>
                        <td className={styles.statusCell}>
                          <Badge bg={getStatusVariant(document.status)} className={styles.statusBadge}>
                            {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                          </Badge>
                        </td>
                        <td className={styles.actionsCell}>
                          <div className={styles.actionButtons}>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className={styles.actionButton}
                              title="View Document"
                            >
                              <Eye />
                            </Button>
                            <Button
                              variant="outline-success"
                              size="sm"
                              className={styles.actionButton}
                              title="Download"
                            >
                              <Download />
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              className={styles.actionButton}
                              title="Edit Document"
                            >
                              <PencilSquare />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className={styles.actionButton}
                              title="Delete Document"
                              onClick={() => handleDeleteClick(document)}
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

      {/* Upload Modal */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Upload New Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Document Title</Form.Label>
                  <Form.Control type="text" placeholder="Enter document title" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select>
                    <option>Select category</option>
                    {categories.slice(1).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Enter document description" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Access Level</Form.Label>
              <Form.Select>
                <option>Select access level</option>
                {accessLevels.slice(1).map(level => (
                  <option key={level} value={level}>
                    {level === 'staff-only' ? 'Staff Only' :
                     level === 'admin-only' ? 'Admin Only' :
                     level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>File</Form.Label>
              <Form.Control type="file" />
              <Form.Text className="text-muted">
                Supported formats: PDF, DOC, DOCX, XLS, XLSX. Maximum file size: 10MB.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUploadConfirm}>
            Upload Document
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {documentToDelete && (
            <div>
              <Alert variant="warning">
                <strong>Warning:</strong> This action cannot be undone.
              </Alert>
              <p>Are you sure you want to delete the document <strong>{documentToDelete.title}</strong>?</p>
              <div className={styles.deleteDocumentInfo}>
                <strong>Document Details:</strong>
                <br />• Title: {documentToDelete.title}
                <br />• File: {documentToDelete.fileName}
                <br />• Category: {documentToDelete.category}
                <br />• Access Level: {documentToDelete.accessLevel}
                <br />• Downloads: {documentToDelete.downloadCount}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete Document
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DocumentManagementPage;
