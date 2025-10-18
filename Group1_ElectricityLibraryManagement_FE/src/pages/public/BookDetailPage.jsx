import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Badge, Nav, Tab, Card, ProgressBar } from 'react-bootstrap';
import { Heart, HeartFill, Star, StarFill, Share, BookmarkPlus, ArrowLeft } from 'react-bootstrap-icons';
import styles from './BookDetailPage.module.css';

const BookDetailPage = ({ bookId }) => {
  const [book, setBook] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - replace with API call
  useEffect(() => {
    const mockBook = {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
      rating: 4.2,
      totalRatings: 1250,
      availability: "available",
      category: "Classic Literature",
      publishYear: 1925,
      isbn: "978-0-7432-7356-5",
      pages: 180,
      language: "English",
      publisher: "Scribner",
      description: "The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on prosperous Long Island and in New York City, the novel tells the first-person story of Nick Carraway, a young Yale graduate and World War I veteran from the Midwest who moves to Long Island in 1922, intending to work in the bond business.",
      genres: ["Classic Literature", "American Literature", "Fiction", "Romance"],
      copiesTotal: 5,
      copiesAvailable: 2,
      reviews: [
        {
          id: 1,
          user: "BookLover123",
          rating: 5,
          comment: "A timeless classic that captures the essence of the American Dream. Fitzgerald's prose is absolutely beautiful.",
          date: "2024-01-15"
        },
        {
          id: 2,
          user: "LiteratureStudent",
          rating: 4,
          comment: "Great character development and symbolism. Required reading for understanding American literature.",
          date: "2024-01-10"
        }
      ],
      relatedBooks: [
        {
          id: 2,
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop"
        },
        {
          id: 3,
          title: "1984",
          author: "George Orwell",
          coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop"
        }
      ]
    };
    setBook(mockBook);
  }, [bookId]);

  const handleWishlistToggle = () => {
    setIsInWishlist(!isInWishlist);
  };

  const handleBorrow = () => {
    console.log('Borrow book:', book.id);
    // Handle borrow logic
  };

  const handleReserve = () => {
    console.log('Reserve book:', book.id);
    // Handle reserve logic
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

  const getAvailabilityInfo = () => {
    if (!book) return null;
    
    const availabilityPercentage = (book.copiesAvailable / book.copiesTotal) * 100;
    let variant = 'success';
    let text = 'Available';
    
    if (book.copiesAvailable === 0) {
      variant = 'danger';
      text = 'All copies borrowed';
    } else if (availabilityPercentage < 50) {
      variant = 'warning';
      text = 'Limited availability';
    }
    
    return { variant, text, percentage: availabilityPercentage };
  };

  if (!book) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const availabilityInfo = getAvailabilityInfo();

  return (
    <div className={styles.bookDetailPage}>
      <Container>
        {/* Back Button */}
        <Row className="mb-3">
          <Col>
            <Button variant="link" className={styles.backButton}>
              <ArrowLeft className="me-2" />
              Back to Books
            </Button>
          </Col>
        </Row>

        {/* Book Header */}
        <Row className="mb-4">
          <Col lg={4}>
            <div className={styles.bookCoverContainer}>
              <img
                src={book.coverImage}
                alt={`${book.title} cover`}
                className={styles.bookCover}
              />
            </div>
          </Col>
          <Col lg={8}>
            <div className={styles.bookInfo}>
              <h1 className={styles.bookTitle}>{book.title}</h1>
              <h2 className={styles.bookAuthor}>by {book.author}</h2>
              
              <div className={styles.ratingSection}>
                <div className={styles.stars}>
                  {renderStars(book.rating)}
                </div>
                <span className={styles.ratingText}>
                  {book.rating.toFixed(1)} ({book.totalRatings} reviews)
                </span>
              </div>

              <div className={styles.genreSection}>
                {book.genres.map((genre, index) => (
                  <Badge key={index} bg="light" text="dark" className={styles.genreBadge}>
                    {genre}
                  </Badge>
                ))}
              </div>

              <div className={styles.availabilitySection}>
                <div className={styles.availabilityHeader}>
                  <Badge bg={availabilityInfo.variant} className={styles.availabilityBadge}>
                    {availabilityInfo.text}
                  </Badge>
                  <span className={styles.copiesInfo}>
                    {book.copiesAvailable} of {book.copiesTotal} copies available
                  </span>
                </div>
                <ProgressBar
                  variant={availabilityInfo.variant}
                  now={availabilityInfo.percentage}
                  className={styles.availabilityBar}
                />
              </div>

              <div className={styles.actionButtons}>
                <Button
                  variant="primary"
                  size="lg"
                  className="me-3"
                  disabled={book.copiesAvailable === 0}
                  onClick={book.copiesAvailable > 0 ? handleBorrow : handleReserve}
                >
                  {book.copiesAvailable > 0 ? 'Borrow Now' : 'Join Waitlist'}
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
                <Button variant="outline-secondary" size="lg">
                  <Share className="me-2" />
                  Share
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Tabs Section */}
        <Row>
          <Col>
            <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
              <Nav variant="tabs" className={styles.customTabs}>
                <Nav.Item>
                  <Nav.Link eventKey="overview">Overview</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="details">Details</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="reviews">Reviews ({book.reviews.length})</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="related">Related Books</Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content className={styles.tabContent}>
                <Tab.Pane eventKey="overview">
                  <div className={styles.overview}>
                    <h3>About this book</h3>
                    <p>{book.description}</p>
                  </div>
                </Tab.Pane>

                <Tab.Pane eventKey="details">
                  <div className={styles.details}>
                    <Row>
                      <Col md={6}>
                        <div className={styles.detailItem}>
                          <strong>ISBN:</strong> {book.isbn}
                        </div>
                        <div className={styles.detailItem}>
                          <strong>Pages:</strong> {book.pages}
                        </div>
                        <div className={styles.detailItem}>
                          <strong>Language:</strong> {book.language}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className={styles.detailItem}>
                          <strong>Publisher:</strong> {book.publisher}
                        </div>
                        <div className={styles.detailItem}>
                          <strong>Publication Year:</strong> {book.publishYear}
                        </div>
                        <div className={styles.detailItem}>
                          <strong>Category:</strong> {book.category}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Tab.Pane>

                <Tab.Pane eventKey="reviews">
                  <div className={styles.reviews}>
                    {book.reviews.map(review => (
                      <Card key={review.id} className={styles.reviewCard}>
                        <Card.Body>
                          <div className={styles.reviewHeader}>
                            <div>
                              <strong>{review.user}</strong>
                              <div className={styles.reviewStars}>
                                {renderStars(review.rating)}
                              </div>
                            </div>
                            <small className="text-muted">{review.date}</small>
                          </div>
                          <p className={styles.reviewComment}>{review.comment}</p>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </Tab.Pane>

                <Tab.Pane eventKey="related">
                  <div className={styles.relatedBooks}>
                    <Row>
                      {book.relatedBooks.map(relatedBook => (
                        <Col key={relatedBook.id} md={6} lg={4} className="mb-3">
                          <Card className={styles.relatedBookCard}>
                            <Card.Img variant="top" src={relatedBook.coverImage} />
                            <Card.Body>
                              <Card.Title className={styles.relatedBookTitle}>
                                {relatedBook.title}
                              </Card.Title>
                              <Card.Text className={styles.relatedBookAuthor}>
                                by {relatedBook.author}
                              </Card.Text>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BookDetailPage;
