import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import {
  Container, Row, Col, Card, Button, ProgressBar, Offcanvas, ListGroup
} from 'react-bootstrap';
import {
  ArrowLeft, ChevronLeft, ChevronRight, List, Gear, Bookmark, BookmarkFill,
  ZoomIn, ZoomOut, Sun, Moon
} from 'react-bootstrap-icons';
import styles from './BookReaderPage.module.css';
import bookApi from '../../api/book';

const BookReaderPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [bookContents, setBookContents] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState('light');
  const [showSettings, setShowSettings] = useState(false);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const bookRes = await bookApi.findBookUserById(bookId);
        const contentRes = await bookApi.getBookContentUserById(bookId);
        setBook(bookRes.data);
        setBookContents(contentRes.data);
      } catch (error) {
        console.error('Error fetching book data:', error);
      }
    };
    fetchData();
  }, [bookId]);
  console.log(bookContents)
  console.log(bookContents.find((ch) => { ch.chapter == currentChapter }))
  const currentChapterData = bookContents.find((ch) => ch.chapter == currentChapter);
  console.log(currentChapterData)
  const isFirst = currentChapter === 1;
  const isLast = currentChapter === bookContents.length;

  const handlePrev = () => !isFirst && setCurrentChapter(c => c - 1);
  const handleNext = () => !isLast && setCurrentChapter(c => c + 1);
  const toggleBookmark = () => {
    setBookmarks(prev =>
      prev.includes(currentChapter)
        ? prev.filter(ch => ch !== currentChapter)
        : [...prev, currentChapter]
    );
  };

  if (!book) return <div className="text-center mt-5">Loading book...</div>;

  const progress = (currentChapter / bookContents.length) * 100;

  return (
    <div className={`${styles.bookReaderPage} ${theme === 'dark' ? styles.darkTheme : styles.lightTheme}`}>
      {/* Header */}
      <div className={styles.readerHeader}>
        <Container fluid>
          <Row className="align-items-center">
            <Col xs={2}>
              <Button variant="outline-secondary" onClick={() => navigate('/borrow-history')}>
                <ArrowLeft />
              </Button>
            </Col>
            <Col xs={8}>
              <h5 className={styles.bookTitle}>{book.title}</h5>
              <p className={styles.bookAuthor}>by {book.author}</p>
            </Col>
            <Col xs={2} className="text-end">
              <Button variant="outline-secondary" onClick={() => setShowTableOfContents(true)}>
                <List />
              </Button>
              <Button variant="outline-secondary" onClick={() => setShowSettings(true)}>
                <Gear />
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Progress */}
      <div className={styles.progressContainer}>
        <ProgressBar now={progress} className={styles.readingProgress} />
        <div className={styles.progressText}>
          Chapter {currentChapter} of {bookContents.length} • {Math.round(progress)}%
        </div>
      </div>

      {/* Content */}
      <Container fluid className={styles.readerContent}>
        <Row className="justify-content-center">
          <Col lg={8} xl={6}>
            <Card className={styles.contentCard}>
              <Card.Body style={{ fontSize: `${fontSize}px` }}>
                {currentChapterData ? (
                  <>
                    <div className={styles.chapterHeader}>
                      <div>
                        <span>Chapter {currentChapter}</span>
                        <h3>{currentChapterData.title}</h3>
                      </div>
                      <Button variant="outline-primary" onClick={toggleBookmark}>
                        {bookmarks.includes(currentChapter) ? <BookmarkFill /> : <Bookmark />}
                      </Button>
                    </div>

                    <div
                      className={styles.chapterContent}
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(currentChapterData.content)
                      }}
                    />
                  </>
                ) : (
                  <p>No content for this chapter.</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Footer Navigation */}
      <div className={styles.readerFooter}>
        <Container fluid>
          <Row className="align-items-center">
            <Col xs={4}>
              <Button variant="outline-primary" disabled={isFirst} onClick={handlePrev}>
                <ChevronLeft className="me-2" /> Previous
              </Button>
            </Col>
            <Col xs={4} className="text-center">
              {currentChapter} / {bookContents.length}
            </Col>
            <Col xs={4} className="text-end">
              <Button variant="outline-primary" disabled={isLast} onClick={handleNext}>
                Next <ChevronRight className="ms-2" />
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Table of Contents */}
      <Offcanvas show={showTableOfContents} onHide={() => setShowTableOfContents(false)} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Table of Contents</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ListGroup variant="flush">
            {bookContents.map(ch => (
              <ListGroup.Item
                key={ch.id}
                action
                active={ch.chapter === currentChapter}
                onClick={() => {
                  setCurrentChapter(ch.chapter);
                  setShowTableOfContents(false);
                }}
              >
                <div>Chapter {ch.chapter}: {ch.title}</div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Settings */}
      <Offcanvas show={showSettings} onHide={() => setShowSettings(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Reading Settings</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className={styles.settingsSection}>
            <h6>Font Size</h6>
            <Button onClick={() => setFontSize(f => Math.max(12, f - 2))}><ZoomOut /></Button>
            <span className="mx-2">{fontSize}px</span>
            <Button onClick={() => setFontSize(f => Math.min(24, f + 2))}><ZoomIn /></Button>
          </div>
          <div className={styles.settingsSection}>
            <h6>Theme</h6>
            <Button variant={theme === 'light' ? 'primary' : 'outline-secondary'} onClick={() => setTheme('light')}>
              <Sun className="me-2" /> Light
            </Button>
            <Button variant={theme === 'dark' ? 'primary' : 'outline-secondary'} onClick={() => setTheme('dark')}>
              <Moon className="me-2" /> Dark
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default BookReaderPage;
