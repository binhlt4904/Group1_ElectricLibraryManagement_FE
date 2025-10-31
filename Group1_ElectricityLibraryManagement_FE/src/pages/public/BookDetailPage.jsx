import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Nav, Tab, Card, ProgressBar } from 'react-bootstrap';
import { Heart, HeartFill, Star, StarFill, Share, BookmarkPlus, ArrowLeft } from 'react-bootstrap-icons';
import styles from './BookDetailPage.module.css';
import bookApi from '../../api/book';
import BookHeader from '../../components/commons/books/BookHeader';
import TabSection from '../../components/commons/books/TabSection';
const BookDetailPage = () => {
  const { id: bookId } = useParams();
  const [book, setBook] = useState(null);
  const [contents, setContents] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - replace with API call
  useEffect(() => {
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
    }
    
    fetchBookDetail();
  }, [bookId]);

  const handleWishlistToggle = () => {
    setIsInWishlist(!isInWishlist);
  };

  const handleBorrow = () => {
    console.log('Borrow book:', book.id);
    // Handle borrow logic
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
        <TabSection activeTab={activeTab} setActiveTab={setActiveTab} contents={contents} reviews={reviews} book={book} renderStars={renderStars} />
      </Container>
    </div>
  );
};

export default BookDetailPage;
