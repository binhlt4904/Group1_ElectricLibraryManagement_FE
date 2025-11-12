import React from 'react';
import { Row, Col, Button, Badge } from 'react-bootstrap';
import { Heart, HeartFill, BookmarkPlus, Share } from 'react-bootstrap-icons';
import styles from '../../../pages/public/BookDetailPage.module.css';
const BookHeader = ({ book, handleBorrow, handleWishlistToggle, isInWishlist, handleReportIssue, user, showLockOverlay,
  canReadContents , hideBorrowButton
}) => {
  console.log(canReadContents)
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

           
            <div className={styles.genreSection}>

              <Badge bg="light" text="dark" className={styles.genreBadge}>
                {book.category}
              </Badge>
            </div>



            <div className={styles.actionButtons}>
              
              {(!hideBorrowButton) && (
                <Button
                  variant="primary"
                  size="lg"
                  className="me-3"

                  onClick={(e) => {
                    e.preventDefault();
                    if (user && user.role === 'READER') {
                      handleBorrow();
                    } else if(!user) {
                      showLockOverlay("Please login to borrow book", e.currentTarget);
                    } else if(user && user.role !== 'READER') {
                      showLockOverlay("Only readers can borrow books", e.currentTarget);
                    }
                  }}
                >
                  Borrow Now
                </Button>
              )}
              <Button
                variant="outline-primary"
                size="lg"
                className="me-3"
                onClick={(e) => {
                    e.preventDefault();
                    if (user && user.role === 'READER') {
                      handleWishlistToggle(e);
                    } else if(!user) {
                      showLockOverlay("Please login to add book to wishlist", e.currentTarget);
                    } else if(user && user.role !== 'READER') {
                      showLockOverlay("Only readers can report books", e.currentTarget);
                    }
                  }}
              >
                {isInWishlist ? <HeartFill className="me-2" /> : <Heart className="me-2" />}
                {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </Button>

              <Button
                variant="outline-warning"
                size="lg"
                onClick={(e) => {
                    e.preventDefault();
                    if (user && user.role === 'READER') {
                      handleReportIssue();
                    } else if(!user) {
                      showLockOverlay("Please login to report book", e.currentTarget);
                    } else if(user && user.role !== 'READER') {
                      showLockOverlay("Only readers can report books", e.currentTarget);
                    }
                  }}
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