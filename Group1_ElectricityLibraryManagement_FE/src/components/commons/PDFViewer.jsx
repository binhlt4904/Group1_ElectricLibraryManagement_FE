import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button, Spinner, Alert } from 'react-bootstrap';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ArrowClockwise } from 'react-bootstrap-icons';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import styles from './PDFViewer.module.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

/**
 * PDFViewer Component
 * Displays PDF files with page navigation and zoom controls
 * 
 * @param {string} fileUrl - URL of the PDF file to display (required)
 * @param {string} fileName - Name of the PDF file (optional)
 */
const PDFViewer = ({ fileUrl, fileName = 'Document' }) => {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Handle PDF load success
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setCurrentPage(1);
    setIsLoading(false);
    setError(null);
  };

  // Handle PDF load error
  const onDocumentLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setError('Failed to load PDF. Please try again.');
    setIsLoading(false);
  };

  // Navigate to previous page
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  // Navigate to next page
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, numPages || prev));
  };

  // Zoom in
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 2));
  };

  // Zoom out
  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  // Reset zoom
  const handleResetZoom = () => {
    setScale(1);
  };

  // Handle page input change
  const handlePageInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= (numPages || 1)) {
      setCurrentPage(value);
    }
  };

  return (
    <div className={styles.pdfViewerContainer}>
      {/* Header with file name */}
      <div className={styles.pdfHeader}>
        <h5 className={styles.fileName}>{fileName}</h5>
      </div>

      {/* Error state */}
      {error && (
        <Alert variant="danger" className={styles.errorAlert}>
          {error}
        </Alert>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className={styles.loadingContainer}>
          <Spinner animation="border" role="status" className={styles.spinner}>
            <span className="visually-hidden">Loading PDF...</span>
          </Spinner>
          <p className={styles.loadingText}>Loading PDF...</p>
        </div>
      )}

      {/* PDF Document */}
      {!error && (
        <div className={styles.documentWrapper}>
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<div className={styles.loadingPlaceholder}>Loading...</div>}
          >
            <Page
              pageNumber={currentPage}
              scale={scale}
              className={styles.page}
            />
          </Document>
        </div>
      )}

      {/* Navigation and Zoom Controls */}
      {!error && numPages && (
        <div className={styles.controlsContainer}>
          {/* Page Navigation */}
          <div className={styles.navigationControls}>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={styles.navButton}
              title="Previous page"
            >
              <ChevronLeft size={18} />
            </Button>

            <div className={styles.pageCounter}>
              <input
                type="number"
                min="1"
                max={numPages}
                value={currentPage}
                onChange={handlePageInputChange}
                className={styles.pageInput}
              />
              <span className={styles.pageTotal}>/ {numPages}</span>
            </div>

            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === numPages}
              className={styles.navButton}
              title="Next page"
            >
              <ChevronRight size={18} />
            </Button>
          </div>

          {/* Zoom Controls */}
          <div className={styles.zoomControls}>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
              className={styles.zoomButton}
              title="Zoom out"
            >
              <ZoomOut size={18} />
            </Button>

            <span className={styles.zoomLevel}>{Math.round(scale * 100)}%</span>

            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleZoomIn}
              disabled={scale >= 2}
              className={styles.zoomButton}
              title="Zoom in"
            >
              <ZoomIn size={18} />
            </Button>

            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleResetZoom}
              className={styles.zoomButton}
              title="Reset zoom"
            >
              <ArrowClockwise size={18} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;

