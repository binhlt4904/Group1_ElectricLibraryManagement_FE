import React from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { Download, X } from 'react-bootstrap-icons';
import PDFViewer from './PDFViewer';
import styles from './DocumentViewer.module.css';

/**
 * DocumentViewer Modal Component
 * Displays documents (PDF, Office files) in a modal
 * 
 * @param {boolean} show - Whether to show the modal
 * @param {function} onHide - Callback when modal should close
 * @param {object} document - Document object with properties:
 *   - id: Document ID
 *   - title: Document title
 *   - fileUrl: URL to the document file
 *   - fileType: File type (pdf, docx, xlsx, pptx, etc.)
 *   - fileName: File name (optional)
 */
const DocumentViewer = ({ show, onHide, document }) => {
  if (!document) {
    return null;
  }

  const { title, fileUrl, fileType, fileName } = document;

  // Determine if file is PDF
  const isPDF = fileType?.toLowerCase() === 'pdf' || fileUrl?.toLowerCase().endsWith('.pdf');

  // Determine if file is Office document
  const isOfficeDoc = ['docx', 'xlsx', 'pptx', 'doc', 'xls', 'ppt'].includes(
    fileType?.toLowerCase()
  ) || /\.(docx|xlsx|pptx|doc|xls|ppt)$/i.test(fileUrl);

  // Handle download
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || title || 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get Google Docs Viewer URL for Office documents
  const getGoogleDocsViewerUrl = (url) => {
    return `https://docs.google.com/gvfs?url=${encodeURIComponent(url)}`;
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      fullscreen="lg-down"
      centered
      className={styles.documentModal}
    >
      {/* Modal Header */}
      <Modal.Header className={styles.modalHeader}>
        <Modal.Title className={styles.modalTitle}>{title}</Modal.Title>
        <div className={styles.headerActions}>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={handleDownload}
            className={styles.downloadButton}
            title="Download document"
          >
            <Download size={18} className="me-2" />
            Download
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={onHide}
            className={styles.closeButton}
            title="Close"
          >
            <X size={18} />
          </Button>
        </div>
      </Modal.Header>

      {/* Modal Body */}
      <Modal.Body className={styles.modalBody}>
        {isPDF ? (
          // PDF Viewer
          <PDFViewer fileUrl={fileUrl} fileName={fileName || title} />
        ) : isOfficeDoc ? (
          // Office Document Viewer (using Google Docs Viewer)
          <div className={styles.officeDocumentContainer}>
            <iframe
              src={getGoogleDocsViewerUrl(fileUrl)}
              className={styles.officeDocumentFrame}
              title={title}
            />
          </div>
        ) : (
          // Unsupported file type
          <Alert variant="warning" className={styles.unsupportedAlert}>
            <h5>Unsupported File Type</h5>
            <p>
              This file type is not supported for preview. Please download the file to view it.
            </p>
            <Button
              variant="primary"
              onClick={handleDownload}
              className={styles.downloadButtonAlert}
            >
              <Download size={18} className="me-2" />
              Download File
            </Button>
          </Alert>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default DocumentViewer;

