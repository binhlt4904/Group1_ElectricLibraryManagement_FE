// AddBookContentPage.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Row, Col, Form, Button, Alert, ProgressBar, InputGroup } from 'react-bootstrap';
import { FileEarmarkPdfFill, ArrowLeft, CloudUpload } from 'react-bootstrap-icons';
import styles from './AddBookContentPage.module.css';
import bookApi from '../../../api/book';

/**
 * AddBookContentPage
 * - Tạo bookContent gồm: chapter, title, content (PDF upload)
 * - Gửi multipart/form-data về BE để lưu vào DB
 * - Hỗ trợ onUploadProgress + validate file PDF
 *
 * Gợi ý route: /admin/books/:bookId/contents/add
 */

const MAX_SIZE_MB = 50; // đổi nếu BE cho phép lớn hơn

export default function AddBookContentPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState('');
  const [chapter, setChapter] = useState('');
  const [file, setFile] = useState(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const resetFeedback = () => {
    setError('');
    setSuccess('');
  };

  const handleFileChange = (e) => {
    resetFeedback();
    const f = e.target.files?.[0];
    if (!f) return;

    const isPdf = f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setFile(null);
      setError('Please choose file pdf (.pdf)');
      return;
    }

    const sizeMb = f.size / (1024 * 1024);
    if (sizeMb > MAX_SIZE_MB) {
      setFile(null);
      setError(`Size of file is overmax (${sizeMb.toFixed(1)} MB). Maximum ${MAX_SIZE_MB} MB`);
      return;
    }

    setFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetFeedback();

    if (!title.trim()) {
      setError('Title must be not empty');
      return;
    }
    if (!chapter || Number.isNaN(Number(chapter))) {
      setError('Chapter must be a valid number');
      return;
    }
    if (!file) {
      setError('Please select a PDF file to upload');
      return;
    }

    try {
      setSubmitting(true);
      setProgress(0);

      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('chapter', String(chapter));
      if (id) formData.append('bookId', id);
      formData.append('file', file); // đổi key theo BE nếu cần (vd: 'content')

      // 👉 Thay bằng layer API thực tế: bookContentApi.create(formData, { onUploadProgress })
      const response = await bookApi.createBookContent(formData, {
        onUploadProgress: (evt) => {
          if (!evt.total) return;
          const percent = Math.round((evt.loaded * 100) / evt.total);
          setProgress(percent);
        },
      });

      if (response?.status >= 200 && response?.status < 300) {
        setSuccess('Create book content successfully!');
        setTimeout(() => {
          navigate(bookId ? `/admin/books/${bookId}` : '/admin/books');
        }, 800);
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err?.message || 'Error while uploading';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.addBookContentPage}>
      <Row className="mb-3">
        <Col>
          <button className="btn btn-link text-decoration-none p-0" onClick={() => navigate(-1)}>
            <ArrowLeft className="me-2" /> Back
          </button>
        </Col>
      </Row>

      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Add Book Content</h1>
          <p className={styles.pageSubtitle}>bookContent includes chapter, title and file PDF (content)</p>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className={styles.alertMessage}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" className={styles.alertMessage}>
          {success}
        </Alert>
      )}

      <Card className={styles.formCard}>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group controlId="title" className={styles.formGroup}>
                  <Form.Label className={styles.formLabel}>Title *</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    placeholder="VD: Chapter 1 - Title..."
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={submitting}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="chapter" className={styles.formGroup}>
                  <Form.Label className={styles.formLabel}>Chapter *</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      min={1}
                      value={chapter}
                      onChange={(e) => setChapter(e.target.value)}
                      disabled={submitting}
                    />
                    <InputGroup.Text>#</InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group controlId="pdf" className={styles.formGroup}>
                  <Form.Label className={styles.formLabel}>File PDF (content) *</Form.Label>
                  <Form.Control
                    id="pdf"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    disabled={submitting}
                    className={styles.fileInput}
                  />
                  {file && (
                    <div className={styles.fileInfo}>
                      <FileEarmarkPdfFill /> {file.name} · {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </div>
                  )}
                </Form.Group>
              </Col>

              {submitting && (
                <Col md={12}>
                  <ProgressBar now={progress} label={`${progress}%`} animated striped className={styles.progressBar} />
                </Col>
              )}

              <Col md={12}>
                <div className={styles.actionButtons}>
                  <Button type="submit" className={styles.btnPrimary} disabled={submitting}>
                    <CloudUpload className="me-2" /> Save content
                  </Button>
                  <Button type="button" className={styles.btnSecondary} onClick={() => navigate(-1)} disabled={submitting}>
                    Cancel
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

// ------------------------------
// AddBookContentPage.module.css
/* AddBookContentPage Component Styles */



/*
Gợi ý API client (đặt ở src/api/bookContent.js):

import axios from 'axios';
const bookContentApi = {
  create(formData, config) {
    return axios.post('/api/admin/book-contents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      ...config,
    });
  },
};
export default bookContentApi;

// và gán tạm để demo nhanh:
// import bookContentApi from './api/bookContent';
// window.bookContentApi = bookContentApi;
*/
