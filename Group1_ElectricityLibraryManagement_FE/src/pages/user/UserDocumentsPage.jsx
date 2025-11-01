import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
  Badge,
  Spinner,
  Alert
} from 'react-bootstrap';
import {
  FileEarmark,
  Search,
  Eye,
  Download,
  FileText
} from 'react-bootstrap-icons';
import DocumentViewer from '../../components/commons/DocumentViewer';
import documentAPI from '../../api/document';
import categoryAPI from '../../api/category';
import styles from './UserDocumentsPage.module.css';

const UserDocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showViewerModal, setShowViewerModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = 12;

  // Fetch public documents and categories on component mount
  useEffect(() => {
    fetchCategories();
    fetchPublicDocuments();
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
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Fallback to empty array if API fails
      setCategories(['all']);
    }
  };

  // Fetch public documents from API
  const fetchPublicDocuments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await documentAPI.getPublicDocuments({
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

  // Filter documents
  const filteredDocuments = documents.filter(document => {
    const matchesSearch = document.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.fileName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || document.categoryName === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const indexOfLastDocument = currentPage * documentsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
  const currentDocuments = filteredDocuments.slice(indexOfFirstDocument, indexOfLastDocument);
  const totalPages = Math.ceil(filteredDocuments.length / documentsPerPage);

  const handleViewDocument = (document) => {
    const viewerDocument = {
      id: document.id,
      title: document.title,
      fileUrl: document.filePath || `https://example.com/documents/${document.fileName}`,
      fileType: document.fileName?.split('.').pop() || 'pdf',
      fileName: document.fileName
    };
    setSelectedDocument(viewerDocument);
    setShowViewerModal(true);
  };

  const handleDownloadDocument = (document) => {
    const link = document.createElement('a');
    link.href = document.filePath || `https://example.com/documents/${document.fileName}`;
    link.download = document.fileName || 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  return (
    <Container fluid className={styles.userDocumentsPage}>
      {/* Page Header */}
      <Row className="mb-4">
        <Col>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>
                <FileEarmark className="me-3" />
                Research Documents
              </h1>
              <p className={styles.pageSubtitle}>
                Browse and download public research documents and resources
              </p>
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

      {/* Filters */}
      <Row className="mb-4">
        <Col lg={6} className="mb-3">
          <InputGroup>
            <InputGroup.Text>
              <Search />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search documents by title, description, or filename..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </InputGroup>
        </Col>
        <Col lg={6} className="mb-3">
          <Form.Select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Documents Grid */}
      {isLoading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <Alert variant="info">
          No documents found. Try adjusting your search or filters.
        </Alert>
      ) : (
        <>
          <Row className="mb-4">
            {currentDocuments.map(document => (
              <Col lg={4} md={6} sm={12} key={document.id} className="mb-4">
                <Card className={styles.documentCard}>
                  <Card.Body>
                    <div className={styles.documentIcon}>
                      <FileText size={32} />
                    </div>
                    <Card.Title className={styles.documentTitle}>
                      {document.title}
                    </Card.Title>
                    <Card.Text className={styles.documentDescription}>
                      {document.description || 'No description available'}
                    </Card.Text>
                    <div className={styles.documentMeta}>
                      <Badge bg={getCategoryColor(document.categoryName)}>
                        {document.categoryName}
                      </Badge>
                      <span className={styles.documentDate}>
                        {formatDate(document.createdAt || document.uploadDate)}
                      </span>
                    </div>
                    <div className={styles.documentActions}>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleViewDocument(document)}
                        className={styles.actionButton}
                      >
                        <Eye size={16} className="me-2" />
                        View
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleDownloadDocument(document)}
                        className={styles.actionButton}
                      >
                        <Download size={16} className="me-2" />
                        Download
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {totalPages > 1 && (
            <Row className="mt-4">
              <Col className="d-flex justify-content-center">
                <div className={styles.pagination}>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className={styles.pageInfo}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </Col>
            </Row>
          )}
        </>
      )}

      {/* Document Viewer Modal */}
      <DocumentViewer
        show={showViewerModal}
        onHide={() => setShowViewerModal(false)}
        document={selectedDocument}
      />
    </Container>
  );
};

export default UserDocumentsPage;

