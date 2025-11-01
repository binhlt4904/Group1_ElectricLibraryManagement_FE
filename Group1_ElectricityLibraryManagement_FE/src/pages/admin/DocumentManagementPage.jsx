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
  Pagination,
  Modal,
  Alert,
  Spinner
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
import DocumentViewer from '../../components/commons/DocumentViewer';
import documentAPI from '../../api/document';
import categoryAPI from '../../api/category';
import styles from './DocumentManagementPage.module.css';

const DocumentManagementPage = () => {
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAccessLevel, setSelectedAccessLevel] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewerModal, setShowViewerModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('');
  const [uploadAccessLevel, setUploadAccessLevel] = useState('public');
  const documentsPerPage = 10;
  const accessLevels = ['all', 'public', 'staff-only', 'admin-only'];

  // Fetch documents and categories on component mount
  useEffect(() => {
    fetchCategories();
    fetchDocuments();
  }, []);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.findAll();
      console.log('Category API Response:', response);
      const categoryList = response.data || [];
      console.log('Category List:', categoryList);

      // Extract category names from response
      const categoryNames = categoryList.map(cat => cat.name || cat);
      console.log('Mapped Category Names:', categoryNames);

      // Add 'all' option at the beginning
      const finalCategories = ['all', ...categoryNames];
      console.log('Final Categories:', finalCategories);

      setCategories(finalCategories);

      // Set default upload category to first real category
      if (categoryList.length > 0) {
        const defaultCategory = categoryList[0].name || categoryList[0];
        console.log('Setting default upload category to:', defaultCategory);
        setUploadCategory(defaultCategory);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Fallback to empty array if API fails
      setCategories(['all']);
    }
  };

  // Fetch documents from API
  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await documentAPI.getAllDocuments({
        page: 0,
        size: 100
      });
      setDocuments(response.data.content || response.data || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete document
  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;

    try {
      setIsLoading(true);
      await documentAPI.deleteDocument(documentToDelete.id);
      setShowDeleteModal(false);
      setDocumentToDelete(null);
      await fetchDocuments();
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Failed to delete document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle upload document
  const handleUploadDocument = async () => {
    if (!uploadFile || !uploadTitle) {
      setError('Please select a file and enter a title');
      return;
    }

    try {
      setIsLoading(true);

      // Upload file first
      const uploadResponse = await documentAPI.uploadDocument(uploadFile);
      const filePath = uploadResponse.data.filePath || uploadResponse.data;

      // Create document with metadata
      await documentAPI.createDocument({
        title: uploadTitle,
        description: uploadTitle,
        categoryName: uploadCategory,
        accessLevel: uploadAccessLevel,
        filePath: filePath,
        fileName: uploadFile.name
      });

      setShowUploadModal(false);
      setUploadFile(null);
      setUploadTitle('');
      // Reset to first category from fetched list
      if (categories.length > 1) {
        setUploadCategory(categories[1]); // categories[0] is 'all'
      }
      setUploadAccessLevel('public');
      await fetchDocuments();
    } catch (err) {
      console.error('Error uploading document:', err);
      setError('Failed to upload document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter documents
  const filteredDocuments = documents.filter(document => {
    const matchesSearch = document.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.fileName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || document.categoryName === selectedCategory;
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

  const handleUploadClick = () => {
    setShowUploadModal(true);
  };

  const handleViewDocument = (document) => {
    // Convert file path to HTTP URL
    // If filePath is a local path like "uploads/documents/uuid_filename.pdf"
    // Convert it to "http://localhost:8080/uploads/documents/uuid_filename.pdf"
    let fileUrl = document.filePath;
    if (fileUrl && !fileUrl.startsWith('http')) {
      fileUrl = `http://localhost:8080/${fileUrl}`;
    }

    // Create document object with necessary properties for DocumentViewer
    const viewerDocument = {
      id: document.id,
      title: document.title,
      fileUrl: fileUrl,
      fileType: document.fileName?.split('.').pop() || 'pdf',
      fileName: document.fileName
    };
    console.log('Document Viewer - File URL:', fileUrl);
    setSelectedDocument(viewerDocument);
    setShowViewerModal(true);
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

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" className="mb-4" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

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
                    {documents.length}
                  </div>
                  <div className={styles.statLabel}>Total Documents</div>
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
                    {documents.filter(d => d.accessLevel === 'public').length}
                  </div>
                  <div className={styles.statLabel}>Public Documents</div>
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
                    {documents.filter(d => d.accessLevel === 'admin-only').length}
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
                    {documents.filter(d => {
                      const uploadDate = new Date(d.createdAt || d.uploadDate);
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
                                bg={getCategoryColor(document.category || '')} 
                                className={styles.categoryBadge}
                              >
                                {document.category || 'Uncategorized'}
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
                              <div className={styles.uploaderName}>{document.uploadedBy?.name}</div>
                              <div className={styles.uploaderRole}>{document.uploadedBy?.role}</div>
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
                          <Badge bg={getStatusVariant(document.status || '')} className={styles.statusBadge}>
                            {document.status ? document.status.charAt(0).toUpperCase() + document.status.slice(1) : 'No Status'}
                          </Badge>
                        </td>
                        <td className={styles.actionsCell}>
                          <div className={styles.actionButtons}>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className={styles.actionButton}
                              title="View Document"
                              onClick={() => handleViewDocument(document)}
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
                  <Form.Control
                    type="text"
                    placeholder="Enter document title"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                  >
                    {categories.slice(1).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Access Level</Form.Label>
              <Form.Select
                value={uploadAccessLevel}
                onChange={(e) => setUploadAccessLevel(e.target.value)}
              >
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
              <Form.Control
                type="file"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              />
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
          <Button
            variant="primary"
            onClick={handleUploadDocument}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Uploading...
              </>
            ) : (
              'Upload Document'
            )}
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
          <Button
            variant="danger"
            onClick={handleDeleteDocument}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              'Delete Document'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Document Viewer Modal */}
      <DocumentViewer
        show={showViewerModal}
        onHide={() => setShowViewerModal(false)}
        document={selectedDocument}
      />
    </Container>
  );
};

export default DocumentManagementPage;
