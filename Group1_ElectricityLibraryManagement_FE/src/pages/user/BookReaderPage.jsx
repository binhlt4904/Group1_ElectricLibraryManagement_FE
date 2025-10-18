import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Dropdown, 
  ProgressBar,
  Offcanvas,
  ListGroup,
  Form
} from 'react-bootstrap';
import { 
  ChevronLeft, 
  ChevronRight, 
  List, 
  Bookmark, 
  BookmarkFill,
  Gear,
  ArrowLeft,
  Search,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon
} from 'react-bootstrap-icons';
import styles from './BookReaderPage.module.css';

const BookReaderPage = () => {
  const { bookId, chapterId } = useParams();
  const navigate = useNavigate();
  
  // Reader state
  const [currentChapter, setCurrentChapter] = useState(parseInt(chapterId) || 1);
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [bookmarks, setBookmarks] = useState([1, 3]); // Mock bookmarked chapters
  const [readingProgress, setReadingProgress] = useState(45); // Mock progress percentage

  // Mock book data
  const book = {
    id: parseInt(bookId) || 1,
    title: "The Digital Revolution: A Comprehensive Guide",
    author: "Dr. Sarah Johnson",
    totalChapters: 12,
    chapters: [
      { id: 1, title: "Introduction to Digital Transformation", content: `# Introduction to Digital Transformation

Welcome to the fascinating world of digital transformation. In this comprehensive guide, we'll explore how technology has revolutionized the way we live, work, and interact with the world around us.

## What is Digital Transformation?

Digital transformation is the integration of digital technology into all areas of a business, fundamentally changing how you operate and deliver value to customers. It's also a cultural change that requires organizations to continually challenge the status quo, experiment, and get comfortable with failure.

The journey of digital transformation began decades ago, but it has accelerated dramatically in recent years. From the early days of computers to today's artificial intelligence and machine learning capabilities, we've witnessed unprecedented changes in how information is processed, stored, and shared.

## Key Components of Digital Transformation

### 1. Technology Infrastructure
The foundation of any digital transformation initiative lies in robust technology infrastructure. This includes cloud computing, data analytics platforms, and cybersecurity measures that protect digital assets.

### 2. Data and Analytics
Data has become the new oil of the digital economy. Organizations that can effectively collect, analyze, and act upon data insights gain significant competitive advantages.

### 3. Customer Experience
Digital transformation puts the customer at the center of all business decisions. By leveraging technology, companies can create more personalized, efficient, and engaging customer experiences.

### 4. Operational Processes
Streamlining and automating operational processes through digital tools leads to increased efficiency, reduced costs, and improved quality of service.

## The Impact on Society

The digital revolution has transformed not just businesses, but entire societies. From how we communicate with friends and family to how we access education and healthcare, digital technologies have created new possibilities and opportunities.

However, this transformation also brings challenges. Issues such as digital divide, privacy concerns, and the need for digital literacy have become increasingly important as we navigate this new digital landscape.

## Looking Ahead

As we continue through this guide, we'll explore each aspect of digital transformation in detail, providing practical insights and real-world examples that illustrate the profound impact of technology on our modern world.

The journey ahead is exciting and full of possibilities. Let's begin this exploration together.` },
      { id: 2, title: "The Evolution of Computing", content: "# The Evolution of Computing\n\nFrom room-sized computers to smartphones..." },
      { id: 3, title: "Internet and Connectivity", content: "# Internet and Connectivity\n\nThe world wide web changed everything..." },
      { id: 4, title: "Mobile Revolution", content: "# Mobile Revolution\n\nSmartphones put the internet in our pockets..." },
      { id: 5, title: "Cloud Computing", content: "# Cloud Computing\n\nStoring and processing data in the cloud..." },
      { id: 6, title: "Big Data and Analytics", content: "# Big Data and Analytics\n\nMaking sense of massive amounts of information..." },
      { id: 7, title: "Artificial Intelligence", content: "# Artificial Intelligence\n\nMachines that can learn and think..." },
      { id: 8, title: "Internet of Things", content: "# Internet of Things\n\nConnecting everyday objects to the internet..." },
      { id: 9, title: "Cybersecurity", content: "# Cybersecurity\n\nProtecting our digital assets and privacy..." },
      { id: 10, title: "Digital Ethics", content: "# Digital Ethics\n\nNavigating the moral implications of technology..." },
      { id: 11, title: "Future Technologies", content: "# Future Technologies\n\nWhat's coming next in the digital world..." },
      { id: 12, title: "Conclusion and Next Steps", content: "# Conclusion and Next Steps\n\nSummarizing our journey through digital transformation..." }
    ]
  };

  const currentChapterData = book.chapters.find(ch => ch.id === currentChapter);
  const isFirstChapter = currentChapter === 1;
  const isLastChapter = currentChapter === book.totalChapters;
  const isBookmarked = bookmarks.includes(currentChapter);

  // Navigation functions
  const goToPreviousChapter = () => {
    if (!isFirstChapter) {
      setCurrentChapter(currentChapter - 1);
      navigate(`/book-reader/${bookId}/${currentChapter - 1}`);
    }
  };

  const goToNextChapter = () => {
    if (!isLastChapter) {
      setCurrentChapter(currentChapter + 1);
      navigate(`/book-reader/${bookId}/${currentChapter + 1}`);
    }
  };

  const goToChapter = (chapterId) => {
    setCurrentChapter(chapterId);
    navigate(`/book-reader/${bookId}/${chapterId}`);
    setShowTableOfContents(false);
  };

  // Settings functions
  const increaseFontSize = () => {
    if (fontSize < 24) setFontSize(fontSize + 2);
  };

  const decreaseFontSize = () => {
    if (fontSize > 12) setFontSize(fontSize - 2);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleBookmark = () => {
    if (isBookmarked) {
      setBookmarks(bookmarks.filter(id => id !== currentChapter));
    } else {
      setBookmarks([...bookmarks, currentChapter]);
    }
  };

  // Update progress based on current chapter
  useEffect(() => {
    const progress = (currentChapter / book.totalChapters) * 100;
    setReadingProgress(progress);
  }, [currentChapter, book.totalChapters]);

  return (
    <div className={`${styles.bookReaderPage} ${theme === 'dark' ? styles.darkTheme : styles.lightTheme}`}>
      {/* Header */}
      <div className={styles.readerHeader}>
        <Container fluid>
          <Row className="align-items-center">
            <Col xs={2}>
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/borrow-history')}
                className={styles.backButton}
              >
                <ArrowLeft />
              </Button>
            </Col>
            <Col xs={8}>
              <div className={styles.bookInfo}>
                <h5 className={styles.bookTitle}>{book.title}</h5>
                <p className={styles.bookAuthor}>by {book.author}</p>
              </div>
            </Col>
            <Col xs={2} className="text-end">
              <div className={styles.headerActions}>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setShowTableOfContents(true)}
                  className={styles.actionButton}
                >
                  <List />
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className={styles.actionButton}
                >
                  <Gear />
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Progress Bar */}
      <div className={styles.progressContainer}>
        <ProgressBar 
          now={readingProgress} 
          className={styles.readingProgress}
          variant="primary"
        />
        <div className={styles.progressText}>
          Chapter {currentChapter} of {book.totalChapters} • {Math.round(readingProgress)}% complete
        </div>
      </div>

      {/* Main Content */}
      <Container fluid className={styles.readerContent}>
        <Row className="justify-content-center">
          <Col lg={8} xl={6}>
            <Card className={styles.contentCard}>
              <Card.Body className={styles.contentBody}>
                {/* Chapter Header */}
                <div className={styles.chapterHeader}>
                  <div className={styles.chapterInfo}>
                    <span className={styles.chapterNumber}>Chapter {currentChapter}</span>
                    <h1 className={styles.chapterTitle}>{currentChapterData?.title}</h1>
                  </div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={toggleBookmark}
                    className={styles.bookmarkButton}
                  >
                    {isBookmarked ? <BookmarkFill /> : <Bookmark />}
                  </Button>
                </div>

                {/* Chapter Content */}
                <div 
                  className={styles.chapterContent}
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {currentChapterData?.content.split('\n').map((paragraph, index) => {
                    if (paragraph.startsWith('# ')) {
                      return <h1 key={index} className={styles.contentHeading1}>{paragraph.substring(2)}</h1>;
                    } else if (paragraph.startsWith('## ')) {
                      return <h2 key={index} className={styles.contentHeading2}>{paragraph.substring(3)}</h2>;
                    } else if (paragraph.startsWith('### ')) {
                      return <h3 key={index} className={styles.contentHeading3}>{paragraph.substring(4)}</h3>;
                    } else if (paragraph.trim() === '') {
                      return <br key={index} />;
                    } else {
                      return <p key={index} className={styles.contentParagraph}>{paragraph}</p>;
                    }
                  })}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Navigation Footer */}
      <div className={styles.readerFooter}>
        <Container fluid>
          <Row className="align-items-center">
            <Col xs={4}>
              <Button
                variant="outline-primary"
                onClick={goToPreviousChapter}
                disabled={isFirstChapter}
                className={styles.navButton}
              >
                <ChevronLeft className="me-2" />
                Previous
              </Button>
            </Col>
            <Col xs={4} className="text-center">
              <span className={styles.chapterIndicator}>
                {currentChapter} / {book.totalChapters}
              </span>
            </Col>
            <Col xs={4} className="text-end">
              <Button
                variant="outline-primary"
                onClick={goToNextChapter}
                disabled={isLastChapter}
                className={styles.navButton}
              >
                Next
                <ChevronRight className="ms-2" />
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Table of Contents Offcanvas */}
      <Offcanvas 
        show={showTableOfContents} 
        onHide={() => setShowTableOfContents(false)}
        placement="start"
        className={styles.tocOffcanvas}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Table of Contents</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ListGroup variant="flush">
            {book.chapters.map((chapter) => (
              <ListGroup.Item
                key={chapter.id}
                action
                active={chapter.id === currentChapter}
                onClick={() => goToChapter(chapter.id)}
                className={styles.tocItem}
              >
                <div className={styles.tocChapterNumber}>Chapter {chapter.id}</div>
                <div className={styles.tocChapterTitle}>{chapter.title}</div>
                {bookmarks.includes(chapter.id) && (
                  <BookmarkFill className={styles.tocBookmark} />
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Settings Offcanvas */}
      <Offcanvas 
        show={showSettings} 
        onHide={() => setShowSettings(false)}
        placement="end"
        className={styles.settingsOffcanvas}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Reading Settings</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className={styles.settingsSection}>
            <h6 className={styles.settingsTitle}>Font Size</h6>
            <div className={styles.fontControls}>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={decreaseFontSize}
                disabled={fontSize <= 12}
              >
                <ZoomOut />
              </Button>
              <span className={styles.fontSizeDisplay}>{fontSize}px</span>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={increaseFontSize}
                disabled={fontSize >= 24}
              >
                <ZoomIn />
              </Button>
            </div>
          </div>

          <div className={styles.settingsSection}>
            <h6 className={styles.settingsTitle}>Theme</h6>
            <div className={styles.themeControls}>
              <Button
                variant={theme === 'light' ? 'primary' : 'outline-secondary'}
                size="sm"
                onClick={() => setTheme('light')}
                className={styles.themeButton}
              >
                <Sun className="me-2" />
                Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'primary' : 'outline-secondary'}
                size="sm"
                onClick={() => setTheme('dark')}
                className={styles.themeButton}
              >
                <Moon className="me-2" />
                Dark
              </Button>
            </div>
          </div>

          <div className={styles.settingsSection}>
            <h6 className={styles.settingsTitle}>Bookmarks</h6>
            <div className={styles.bookmarksList}>
              {bookmarks.length > 0 ? (
                bookmarks.map(chapterId => {
                  const chapter = book.chapters.find(ch => ch.id === chapterId);
                  return (
                    <div 
                      key={chapterId} 
                      className={styles.bookmarkItem}
                      onClick={() => goToChapter(chapterId)}
                    >
                      <BookmarkFill className={styles.bookmarkIcon} />
                      <div>
                        <div className={styles.bookmarkChapter}>Chapter {chapterId}</div>
                        <div className={styles.bookmarkTitle}>{chapter?.title}</div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className={styles.noBookmarks}>No bookmarks yet</p>
              )}
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default BookReaderPage;
