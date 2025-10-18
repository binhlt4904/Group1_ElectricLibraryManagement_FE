import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Badge } from 'react-bootstrap';
import { Heart, HeartFill, Star, StarFill } from 'react-bootstrap-icons';
import styles from './BookCard.module.css';

const BookCard = ({
  book,
  onWishlistToggle,
  isInWishlist = false,
  showRating = true,
  showAvailability = true
}) => {
  const {
    id,
    title,
    author,
    coverImage,
    rating = 0,
    totalRatings = 0,
    availability = 'available',
    category,
    publishYear
  } = book;



  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (onWishlistToggle) {
      onWishlistToggle(book);
    }
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

  const getAvailabilityBadge = () => {
    switch (availability) {
      case 'available':
        return <Badge bg="success" className={styles.availabilityBadge}>Available</Badge>;
      case 'borrowed':
        return <Badge bg="warning" className={styles.availabilityBadge}>Borrowed</Badge>;
      case 'reserved':
        return <Badge bg="info" className={styles.availabilityBadge}>Reserved</Badge>;
      case 'unavailable':
        return <Badge bg="danger" className={styles.availabilityBadge}>Unavailable</Badge>;
      default:
        return null;
    }
  };

  return (
    <Link to={`/books/${book.id}`} className={styles.bookCardLink}>
      <Card className={`custom-card ${styles.bookCard}`}>
        <div className={styles.imageContainer}>
        <Card.Img 
          variant="top" 
          src={coverImage || 'https://via.placeholder.com/300x400?text=No+Cover'} 
          alt={`${title} cover`}
          className={styles.bookCover}
        />
        <Button
          variant="link"
          className={styles.wishlistButton}
          onClick={handleWishlistClick}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isInWishlist ? (
            <HeartFill className={styles.heartFilled} />
          ) : (
            <Heart className={styles.heartEmpty} />
          )}
        </Button>
        {showAvailability && (
          <div className={styles.availabilityContainer}>
            {getAvailabilityBadge()}
          </div>
        )}
      </div>
      
      <Card.Body className={styles.cardBody}>
        <Card.Title className={styles.bookTitle} title={title}>
          {title}
        </Card.Title>
        
        <Card.Subtitle className={styles.bookAuthor} title={author}>
          by {author}
        </Card.Subtitle>
        
        {showRating && rating > 0 && (
          <div className={styles.ratingContainer}>
            <div className={styles.stars}>
              {renderStars(rating)}
            </div>
            <span className={styles.ratingText}>
              {rating.toFixed(1)} ({totalRatings} reviews)
            </span>
          </div>
        )}
        
        <div className={styles.bookMeta}>
          {category && (
            <Badge bg="light" text="dark" className={styles.categoryBadge}>
              {category}
            </Badge>
          )}
          {publishYear && (
            <span className={styles.publishYear}>{publishYear}</span>
          )}
        </div>
        
        <div className={styles.cardActions}>
          <Button 
            variant="primary" 
            size="sm" 
            className={styles.actionButton}
            disabled={availability === 'unavailable'}
          >
            {availability === 'available' ? 'Borrow' : 'View Details'}
          </Button>
        </div>
      </Card.Body>
      </Card>
    </Link>
  );
};

export default BookCard;
