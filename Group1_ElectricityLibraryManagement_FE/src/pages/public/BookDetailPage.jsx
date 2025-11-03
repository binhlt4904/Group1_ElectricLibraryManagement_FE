import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Nav, Tab, Card, ProgressBar, Modal, Form, Alert } from 'react-bootstrap';
import { Heart, HeartFill, Star, StarFill, Share, BookmarkPlus, ArrowLeft } from 'react-bootstrap-icons';
import styles from './BookDetailPage.module.css';
import bookApi from '../../api/book';
import BookHeader from '../../components/commons/books/BookHeader';
import TabSection from '../../components/commons/books/TabSection';
import borrowalReaderHistoryApi from '../../api/user/borrowReaderHistory';
const BookDetailPage = () => {
  const { id: bookId } = useParams();
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [contents, setContents] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [borrowedBook, setBorrowedBook] = useState(null);
  const [dueDate, setDueDate] = useState('');
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [borrowError, setBorrowError] = useState('');
  const [borrowsuccess, setBorrowSuccess] = useState('');

  const handleClose = () => setShowBorrowModal(false);
  // const handleShow = () => setShowBorrowModal(true);

  // Mock data - replace with API call
  const fetchBookDetail = async () => {
    try {
      const bookRes = await bookApi.findBookUserById(bookId);
      console.log(bookRes.data)
      const contentsRes = await bookApi.findBookContentsById(bookId);
      const reviewsRes = await bookApi.findReviewsByBookId(bookId);

      setBook(bookRes.data);
      setContents(contentsRes.data);
      setReviews(reviewsRes.data);
    } catch (error) {
      console.error("Error fetching book details:", error);
    }
  };
  const fetchRelatedBooks = async () => {
    try {
      const relatedRes = await bookApi.getRelatedBooks(bookId);
      setRelatedBooks(relatedRes.data);
    } catch (error) {
      console.error("Error fetching related books:", error);
    }
  };
  useEffect(() => {
    fetchBookDetail();
    fetchRelatedBooks();

  }, [bookId]);



  const handleWishlistToggle = () => {
    setIsInWishlist(!isInWishlist);
  };

  const handleBorrow = () => {
    console.log('Borrow book:', book.id);
    setBorrowedBook(book);
    setShowBorrowModal(true);
    setDueDate('');
    setBorrowError('');
    setBorrowSuccess('');
    // Handle borrow logic
  };

  const validateDueDate = () => {
    if (!dueDate) return 'Please select a return date.';

    const today = new Date();
    const selected = new Date(dueDate);

    if (selected <= today) return 'Return date must be in the future.';

    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 2);
    if (selected > maxDate)
      return 'Return date cannot be more than 2 months from today.';

    return '';
  };

  const handleConfirmBorrow = async () => {
    const validationError = validateDueDate();
    if (validationError) {
      setBorrowError(validationError);
      setBorrowSuccess('');
      return;
    }

    try {
      // TODO: Gọi API thực tế, ví dụ:
      // await borrowApi.borrowBook(book.id, dueDate);
      await borrowalReaderHistoryApi.borrowBook(borrowedBook.id, dueDate);
      console.log('Borrowed book:', book.id, 'Due:', dueDate);
      setBorrowSuccess('Book borrowed successfully!');
      setBorrowError('');
      setTimeout(() => setShowBorrowModal(false), 1200);
    } catch (err) {
      console.log("error is", err.message);
      setBorrowError('Failed to borrow the book.'+ err.message);
    }
  };

  const handleReportIssue = () => {
    console.log('Report issue for book:', book.id);
    // Handle report issue logic - could open modal or navigate to report form
    alert('Report issue functionality - would open a form to report problems with this book');
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarFill key={i} className={styles.starFilled} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className={styles.starHalf} />);
      } else {
        stars.push(<Star key={i} className={styles.starEmpty} />);
      }
    }
    return stars;
  };

  if (!book) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.bookDetailPage}>
      <Container>
        {/* Back Button */}
        <Row className="mb-3">
          <Col>
            <Button as={Link} to="/books" variant="link" className={styles.backButton}>
              <ArrowLeft className="me-2" />
              Back to Books
            </Button>
          </Col>
        </Row>

        {/* Book Header */}
        <BookHeader book={book} handleBorrow={handleBorrow} handleWishlistToggle={handleWishlistToggle} isInWishlist={isInWishlist} handleReportIssue={handleReportIssue} />
        {/* Tabs Section */}
        <TabSection activeTab={activeTab} setActiveTab={setActiveTab} contents={contents} reviews={reviews} book={book} renderStars={renderStars} relatedBooks={relatedBooks} />
      </Container>
      <Modal show={showBorrowModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Book Borrowal Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {borrowError && <Alert variant="danger">{borrowError}</Alert>}
          {borrowsuccess && <Alert variant="success">{borrowsuccess}</Alert>}
          <Form>
            <Form.Group>
              <Form.Label>Select return date:</Form.Label>
              <Form.Control
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleConfirmBorrow}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BookDetailPage;
