import React from 'react';
import { Row, Col, Button, Badge } from 'react-bootstrap';
import { Heart, HeartFill, BookmarkPlus, Share } from 'react-bootstrap-icons';
import styles from '../../../pages/public/BookDetailPage.module.css';
const BookHeader = ({book,handleBorrow, handleWishlistToggle,isInWishlist,handleReportIssue }) => {
    return (
        <div>
            <Row className="mb-4">
          <Col lg={4}>
            <div className={styles.bookCoverContainer}>
              <img
                src={
                book.image
                  ? `http://localhost:8080${book.image}`
                  : "https://via.placeholder.com/300x400?text=No+Cover"
              }
                alt={`${book.title} cover`}
                className={styles.bookCover}
              />
            </div>
          </Col>
          <Col lg={8}>
            <div className={styles.bookInfo}>
              <h1 className={styles.bookTitle}>{book.title}</h1>
              <h2 className={styles.bookAuthor}>by {book.author}</h2>
              
              {/* <div className={styles.ratingSection}>
                <div className={styles.stars}>
                  {renderStars(reviews.rating)}
                </div>
                <span className={styles.ratingText}>
                  {book.rating.toFixed(1)} ({book.totalRatings} reviews)
                </span>
              </div> */}

              <div className={styles.genreSection}>
                
                  <Badge bg="light" text="dark" className={styles.genreBadge}>
                    {book.category}
                  </Badge>
              </div>

              

              <div className={styles.actionButtons}>
                {/* <Button
                  variant="primary"
                  size="lg"
                  className="me-3"
                  disabled={book.copiesAvailable === 0}
                  onClick={book.copiesAvailable > 0 ? handleBorrow : handleReserve}
                >
                  {book.copiesAvailable > 0 ? 'Borrow Now' : 'Join Waitlist'}
                </Button> */}
                <Button
                  variant="primary"
                  size="lg"
                  className="me-3"
                  
                  onClick={ handleBorrow }
                >
                   Borrow Now
                </Button>
                <Button
                  variant="outline-primary"
                  size="lg"
                  className="me-3"
                  onClick={handleWishlistToggle}
                >
                  {isInWishlist ? <HeartFill className="me-2" /> : <Heart className="me-2" />}
                  {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </Button>
                <Button variant="outline-secondary" size="lg" className="me-3">
                  <BookmarkPlus className="me-2" />
                  Save
                </Button>
                <Button variant="outline-secondary" size="lg" className="me-3">
                  <Share className="me-2" />
                  Share
                </Button>
                <Button
                  variant="outline-warning"
                  size="lg"
                  onClick={handleReportIssue}
                >
                  Report Issue
                </Button>
              </div>
            </div>
          </Col>
        </Row>
        </div>
    );
};

export default BookHeader;