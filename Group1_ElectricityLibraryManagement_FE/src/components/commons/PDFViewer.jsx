import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button, Spinner, Alert } from 'react-bootstrap';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ArrowClockwise, Download } from 'react-bootstrap-icons';
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
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [navigationTab, setNavigationTab] = useState('pages');  // 'pages' or 'headings'
  const [headings, setHeadings] = useState([]);  // Store extracted headings

  // Extract headings from PDF (simulated - based on page structure)
  const extractHeadings = ({ numPages }) => {
    // Create sample headings for demonstration
    // In a real scenario, you would parse PDF structure for actual headings
    const sampleHeadings = [];

    // Add some sample headings based on page count
    if (numPages >= 1) sampleHeadings.push({ title: 'Introduction', page: 1, level: 1 });
    if (numPages >= 2) sampleHeadings.push({ title: 'Chapter 1: Overview', page: 2, level: 1 });
    if (numPages >= 3) sampleHeadings.push({ title: 'Section 1.1: Details', page: 3, level: 2 });
    if (numPages >= 4) sampleHeadings.push({ title: 'Chapter 2: Content', page: 4, level: 1 });
    if (numPages >= 5) sampleHeadings.push({ title: 'Section 2.1: Information', page: 5, level: 2 });
    if (numPages >= 6) sampleHeadings.push({ title: 'Conclusion', page: Math.ceil(numPages / 2), level: 1 });

    setHeadings(sampleHeadings);
  };

  // Handle PDF load success
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setCurrentPage(1);
    setIsLoading(false);
    setError(null);
    extractHeadings({ numPages });
  };

  // Handle PDF load error
  const onDocumentLoadError = (error) => {
    console.error('Error loading PDF:', error);
    console.error('PDF URL:', fileUrl);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    setError('Failed to load PDF. The file may be corrupted or inaccessible. Please try downloading it instead.');
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

  // Handle download PDF
  const handleDownloadPDF = () => {
    try {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName || 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log('PDF downloaded:', fileName);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError('Failed to download PDF. Please try again.');
    }
  };

  return (
    <div className={styles.pdfViewerContainer}>
      {/* Header with file name and download button */}
      <div className={styles.pdfHeader}>
        <h5 className={styles.fileName}>{fileName}</h5>
        <div className={styles.headerControls}>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setShowThumbnails(!showThumbnails)}
            title={showThumbnails ? 'Hide thumbnails' : 'Show thumbnails'}
            className={styles.thumbnailToggle}
          >
            {showThumbnails ? '✕ Hide' : '☰ Show'} Pages
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={handleDownloadPDF}
            title="Download PDF"
            className={styles.downloadButton}
          >
            <Download size={18} className="me-2" />
            Download
          </Button>
        </div>
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

      {/* Main Content Area with Thumbnails */}
      {!error && (
        <div className={styles.mainContentArea}>
          {/* Thumbnails Navigation Pane */}
          {showThumbnails && numPages && (
            <div className={styles.thumbnailsPane}>
              <div className={styles.thumbnailsHeader}>
                <div className={styles.navigationTabs}>
                  <button
                    className={`${styles.navTab} ${navigationTab === 'pages' ? styles.activeTab : ''}`}
                    onClick={() => setNavigationTab('pages')}
                    title="View pages"
                  >
                    📄 Pages
                  </button>
                  <button
                    className={`${styles.navTab} ${navigationTab === 'headings' ? styles.activeTab : ''}`}
                    onClick={() => setNavigationTab('headings')}
                    title="View headings"
                  >
                    📑 Headings
                  </button>
                </div>
                {navigationTab === 'pages' && (
                  <span className={styles.pageCount}>{numPages}</span>
                )}
              </div>
              <div className={styles.thumbnailsList}>
                {navigationTab === 'pages' ? (
                  // Pages view
                  Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
                    <div
                      key={pageNum}
                      className={`${styles.thumbnail} ${currentPage === pageNum ? styles.activeThumbnail : ''}`}
                      onClick={() => setCurrentPage(pageNum)}
                      title={`Go to page ${pageNum}`}
                    >
                      <Document
                        file={fileUrl}
                        onLoadError={() => {}}
                      >
                        <Page
                          pageNumber={pageNum}
                          scale={0.5}
                          className={styles.thumbnailPage}
                        />
                      </Document>
                      <span className={styles.pageNumber}>{pageNum}</span>
                    </div>
                  ))
                ) : (
                  // Headings view
                  headings.length > 0 ? (
                    headings.map((heading, index) => (
                      <div
                        key={index}
                        className={`${styles.headingItem} ${currentPage === heading.page ? styles.activeHeading : ''}`}
                        onClick={() => setCurrentPage(heading.page)}
                        title={`Go to: ${heading.title}`}
                        style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
                      >
                        <span className={styles.headingLevel}>
                          {'▸'.repeat(heading.level)}
                        </span>
                        <span className={styles.headingText}>{heading.title}</span>
                        <span className={styles.headingPage}>{heading.page}</span>
                      </div>
                    ))
                  ) : (
                    <div className={styles.noHeadings}>
                      No headings found in this document
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* PDF Document */}
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

