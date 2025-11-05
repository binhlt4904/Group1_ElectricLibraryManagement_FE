import React, { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { X, ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import styles from "./BookReaderModal.module.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function BookReaderModal({ show, onClose, title, fileUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (show) setPageNumber(1);
  }, [show]);

  useEffect(() => {
    if (!show) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [show]);

  const width = useMemo(() => {
    if (!viewerRef.current) return Math.min(900, window.innerWidth * 0.85);
    const w = viewerRef.current.clientWidth;
    return Math.min(900, Math.max(320, Math.floor(w * 0.95)));
  }, [viewerRef.current, show, window.innerWidth]);

  const onLoadSuccess = ({ numPages }) => setNumPages(numPages);
  const goPrev = () => setPageNumber((p) => Math.max(1, p - 1));
  const goNext = () => setPageNumber((p) => Math.min(numPages ?? p, p + 1));

  if (!show) return null;

  return (
    <div className={styles.overlay} onClick={onClose} onContextMenu={(e) => e.preventDefault()}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>{title || "Reader"}</div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className={styles.body}>
          <div ref={viewerRef} className={styles.viewerWrap}>
            {fileUrl ? (
              <Document
                file={fileUrl}
                onLoadSuccess={onLoadSuccess}
                loading={<p>⏳ Loading...</p>}
                error={<p>Cannot load file pdf.</p>}
              >
                <Page
                  pageNumber={pageNumber}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  width={width}
                />
              </Document>
            ) : (
              <p>There is none PDF.</p>
            )}
          </div>

          {numPages ? (
            <div className={styles.controls}>
              <button onClick={goPrev} disabled={pageNumber <= 1} className={`btn btn-outline-secondary btn-sm ${styles.iconBtn}`}>
                <ChevronLeft /> Prev page
              </button>
              <span className={styles.pageInfo}>
                Page {pageNumber} / {numPages}
              </span>
              <button onClick={goNext} disabled={pageNumber >= numPages} className={`btn btn-outline-secondary btn-sm ${styles.iconBtn}`}>
                Next page <ChevronRight />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
