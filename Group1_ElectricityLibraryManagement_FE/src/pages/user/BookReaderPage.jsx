import React, { use, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import styles from "./BookReaderPage.module.css"; // ✅ thêm dòng này
import bookApi from "../../api/book";
import { ArrowLeft, ChevronLeft, ChevronRight } from "react-bootstrap-icons";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const BookReaderPage = () => {
  const { chapter, bookId } = useParams();
  const [fileUrl, setFileUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [content, setContent] = useState({});


  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const response = await bookApi.getBookContentByBookIdAndChapter(bookId, chapter);
        console.log(response)
        setContent(response.data);
        setFileUrl("http://localhost:8080" + response.data.content); // Giả sử API trả về URL của file PDF
      } catch (error) {
        console.error("Error fetching PDF:", error);
      }
    };
    fetchPDF();
  }, [chapter, bookId]);

  const onDocumentLoadSuccess = ({ numPages }) => setNumPages(numPages);
  const goPrev = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const goNext = () => setPageNumber((prev) => Math.min(prev + 1, numPages));

  return (
    <div
      className={styles.testPDFPage}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Link to={-1} className={styles.backBtn}>
        <ArrowLeft /> <span>Quay lại</span>
      </Link>
      <h1 className={styles.testPDFTitle}>Chapter {chapter} - {content.title}</h1>

      <div className={styles.testPDFContainer}>
        <div className={styles.pdfViewer}>
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<p className="loading">⏳ Đang tải tài liệu...</p>}
          >
            <Page
              pageNumber={pageNumber}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              className={styles.pdfPage}
              width={window.innerWidth > 768 ? 800 : window.innerWidth * 0.9}
            />
          </Document>
        </div>

        {numPages && (
          <div className={styles.pdfControls}>
            <button onClick={goPrev} disabled={pageNumber <= 1} className={styles.pdfButton}>
              ← Trang trước
            </button>
            <span className={styles.pageInfo}>
              Trang {pageNumber} / {numPages}
            </span>
            <button onClick={goNext} disabled={pageNumber >= numPages} className={styles.pdfButton}>
              Trang sau →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookReaderPage;
