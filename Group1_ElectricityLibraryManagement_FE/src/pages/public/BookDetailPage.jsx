import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../../components/contexts/UserContext";
import { PencilSquare, Trash } from "react-bootstrap-icons";

import {
  Container,
  Row,
  Col,
  Button,
  Badge,
  Nav,
  Tab,
  Card,
  ProgressBar,
} from "react-bootstrap";
import {
  Heart,
  HeartFill,
  Star,
  StarFill,
  Share,
  BookmarkPlus,
  ArrowLeft,
} from "react-bootstrap-icons";
import styles from "./BookDetailPage.module.css";
import bookApi from "../../api/book";
import reviewApi from "../../api/review"; // thêm file này như mình đã hướng dẫn ở trên

const BookDetailPage = () => {
  const { id: bookId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [book, setBook] = useState(null);
  const [contents, setContents] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [newReview, setNewReview] = useState({ note: "", rate: 5 }); // ← đưa vào đây

  const { currentUser } = useContext(UserContext);
  console.log(user);

  const handleAddReview = async () => {
    if (!user) {
      alert("⚠️ Please login to write a review!");
      navigate("/login");
      return;
    }

    if (
      user.role.toLowerCase() !== "user" &&
      user.role.toLowerCase() !== "reader"
    ) {
      alert("❌ Only readers can write reviews.");
      return;
    }

    try {
      const payload = {
        bookId: Number(bookId),
        readerId: user.accountId,
        note: newReview.note,
        rate: newReview.rate,
        roleName: String(user.role).toUpperCase(), // ép chuỗi in hoa
      };

      await reviewApi.create(payload);
      alert("✅ Review added!");

      const reviewsRes = await reviewApi.findByBookId(bookId);
      setReviews(reviewsRes.data);
      setNewReview({ note: "", rate: 5 });
    } catch (err) {
      console.error(err);
      alert(
        "❌ Error adding review: " + (err.response?.data?.message || "Unknown")
      );
    }
  };

  const [editingReview, setEditingReview] = useState(null);
  const [editNote, setEditNote] = useState("");
  const [editRate, setEditRate] = useState(5);

  const handleEditReview = (review) => {
    setEditingReview(review);
    setEditNote(review.note);
    setEditRate(review.rate);
  };

  const handleSaveEdit = async () => {
    try {
      await reviewApi.update(
        book.id,
        editingReview.id,
        { note: editNote, rate: editRate },
        user.accountId,
        user.role
      );

      alert("✅ Review updated!");
      const res = await reviewApi.findByBookId(bookId);
      setReviews(res.data);
      setEditingReview(null);
    } catch (err) {
      console.error(err);
      alert("❌ Error updating review");
    }
  };

  const handleDeleteReview = async (review) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await reviewApi.remove(book.id, review.id, user.accountId, user.role);
      alert("🗑️ Review deleted successfully");
      setReviews(reviews.filter((r) => r.id !== review.id));
    } catch (err) {
      console.error(err);
      alert("❌ Error deleting review");
    }
  };

  // Mock data - replace with API call
  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        const bookRes = await bookApi.findBookUserById(bookId);
        console.log(bookRes.data);
        const contentsRes = await bookApi.findBookContentsById(bookId);
        const reviewsRes = await bookApi.findReviewsByBookId(bookId);

        setBook(bookRes.data);
        setContents(contentsRes.data);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };
    const mockBook = {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      coverImage:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
      rating: 4.2,
      totalRatings: 1250,
      availability: "available",
      category: "Classic Literature",
      categoryname: "Classic Literature", // ERD attribute
      publishYear: 1925,
      isbn: "978-0-7432-7356-5",
      pages: 180,
      language: "English",
      publisher: "Scribner",
      imported_date: "2024-01-01", // ERD attribute
      description:
        "The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on prosperous Long Island and in New York City, the novel tells the first-person story of Nick Carraway, a young Yale graduate and World War I veteran from the Midwest who moves to Long Island in 1922, intending to work in the bond business.",
      genres: [
        "Classic Literature",
        "American Literature",
        "Fiction",
        "Romance",
      ],
      copiesTotal: 5,
      copiesAvailable: 2,
      contents: [
        // BookContent chapters
        {
          id: 1,
          chapter: 1,
          title: "In My Younger and More Vulnerable Years",
          pages: "1-15",
        },
        {
          id: 2,
          chapter: 2,
          title: "The Eyes of Doctor T. J. Eckleburg",
          pages: "16-35",
        },
        {
          id: 3,
          chapter: 3,
          title: "Gatsby's Party",
          pages: "36-60",
        },
        {
          id: 4,
          chapter: 4,
          title: "The Green Light",
          pages: "61-85",
        },
        {
          id: 5,
          chapter: 5,
          title: "Daisy and Gatsby Reunited",
          pages: "86-110",
        },
        {
          id: 6,
          chapter: 6,
          title: "The Past Repeated",
          pages: "111-135",
        },
        {
          id: 7,
          chapter: 7,
          title: "The Confrontation",
          pages: "136-160",
        },
        {
          id: 8,
          chapter: 8,
          title: "The Death of Gatsby",
          pages: "161-175",
        },
        {
          id: 9,
          chapter: 9,
          title: "The Funeral",
          pages: "176-180",
        },
      ],
      reviews: [
        {
          id: 1,
          reviewer_id: "user_123", // ERD attribute
          user: "BookLover123",
          rating: 5,
          note: "A timeless classic that captures the essence of the American Dream. Fitzgerald's prose is absolutely beautiful.", // ERD attribute
          comment:
            "A timeless classic that captures the essence of the American Dream. Fitzgerald's prose is absolutely beautiful.",
          date: "2024-01-15",
        },
        {
          id: 2,
          reviewer_id: "user_456", // ERD attribute
          user: "LiteratureStudent",
          rating: 4,
          note: "Great character development and symbolism. Required reading for understanding American literature.", // ERD attribute
          comment:
            "Great character development and symbolism. Required reading for understanding American literature.",
          date: "2024-01-10",
        },
      ],
      relatedBooks: [
        {
          id: 2,
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          coverImage:
            "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop",
        },
        {
          id: 3,
          title: "1984",
          author: "George Orwell",
          coverImage:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop",
        },
      ],
    };
    fetchBookDetail();
  }, [bookId]);

  const handleWishlistToggle = () => {
    setIsInWishlist(!isInWishlist);
  };

  const handleBorrow = () => {
    console.log("Borrow book:", book.id);
    // Handle borrow logic
  };

  const handleReserve = () => {
    console.log("Reserve book:", book.id);
    // Handle reserve logic
  };

  const handleReportIssue = () => {
    console.log("Report issue for book:", book.id);
    // Handle report issue logic - could open modal or navigate to report form
    alert(
      "Report issue functionality - would open a form to report problems with this book"
    );
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

    const availabilityPercentage =
      (book.copiesAvailable / book.copiesTotal) * 100;
    let variant = "success";
    let text = "Available";

    if (book.copiesAvailable === 0) {
      variant = "danger";
      text = "All copies borrowed";
    } else if (availabilityPercentage < 50) {
      variant = "warning";
      text = "Limited availability";
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
            <Button
              as={Link}
              to="/books"
              variant="link"
              className={styles.backButton}
            >
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
                  onClick={handleBorrow}
                >
                  Borrow Now
                </Button>
                <Button
                  variant="outline-primary"
                  size="lg"
                  className="me-3"
                  onClick={handleWishlistToggle}
                >
                  {isInWishlist ? (
                    <HeartFill className="me-2" />
                  ) : (
                    <Heart className="me-2" />
                  )}
                  {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
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

        {/* Tabs Section */}
        <Row>
          <Col>
            <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
              <Nav variant="tabs" className={styles.customTabs}>
                <Nav.Item>
                  <Nav.Link eventKey="overview">Overview</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="contents">
                    Contents ({contents.length} chapters)
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="details">Details</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="reviews">
                    Reviews ({reviews.length})
                  </Nav.Link>
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

                <Tab.Pane eventKey="contents">
                  <div className={styles.contents}>
                    <h3>Table of Contents</h3>
                    <div className={styles.chapterList}>
                      {contents.map((chapter) => (
                        <div key={chapter.id} className={styles.chapterItem}>
                          <Link
                            to={`/book-reader/${bookId}/${chapter.id}`}
                            className={styles.chapterLink}
                          >
                            <div className={styles.chapterInfo}>
                              <div className={styles.chapterNumber}>
                                Chapter {chapter.chapter}
                              </div>
                              <div className={styles.chapterTitle}>
                                {chapter.title}
                              </div>
                              {/* <div className={styles.chapterPages}>
                                Pages {chapter.pages}
                              </div> */}
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </Tab.Pane>

                <Tab.Pane eventKey="details">
                  <div className={styles.details}>
                    <Row>
                      <Col>
                        <div className={styles.detailItem}>
                          <strong>Publisher:</strong> {book.publisher}
                        </div>
                        <div className={styles.detailItem}>
                          <strong>Publication Year:</strong>{" "}
                          {book.publishedDate}
                        </div>
                        <div className={styles.detailItem}>
                          <strong>Imported Date:</strong>{" "}
                          {new Date(book.importedDate).toLocaleDateString()}
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
                    {/* FORM VIẾT REVIEW */}
                    <div className="mb-4 p-3 border rounded bg-light">
                      <h5 className="fw-bold mb-2">Write a Review</h5>
                      <textarea
                        className="form-control mb-2"
                        rows={3}
                        placeholder="Share your thoughts about this book..."
                        value={newReview.note}
                        onChange={(e) =>
                          setNewReview({ ...newReview, note: e.target.value })
                        }
                      />
                      <div className="d-flex align-items-center mb-2">
                        <label className="me-2 mb-0 fw-semibold">Rating:</label>
                        <select
                          className="form-select w-auto"
                          value={newReview.rate}
                          onChange={(e) =>
                            setNewReview({
                              ...newReview,
                              rate: Number(e.target.value),
                            })
                          }
                        >
                          {[1, 2, 3, 4, 5].map((r) => (
                            <option key={r} value={r}>
                              {r} ★
                            </option>
                          ))}
                        </select>
                      </div>
                      <Button variant="primary" onClick={handleAddReview}>
                        Submit Review
                      </Button>
                    </div>

                    {/* DANH SÁCH REVIEW */}
                    {reviews.map((review) => {
                      console.log("🧾 Review:", review);
                      console.log("👤 User:", user);

                      const normalize = (s) =>
                        s?.toLowerCase().replace(/\s+/g, ""); // chuẩn hóa: bỏ khoảng trắng & viết thường

                      const canModify =
                        user &&
                        (normalize(review.reviewerName) ===
                          normalize(user.username) ||
                          ["STAFF", "ADMIN"].includes(
                            user.role?.toUpperCase()
                          ));
                      const isEditing = editingReview?.id === review.id;

                      return (
                        <Card key={review.id} className={styles.reviewCard}>
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <strong>{review.reviewerName}</strong>
                                <div className={styles.reviewStars}>
                                  {renderStars(review.rate)}
                                </div>
                              </div>

                              {canModify && (
                                <div>
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleEditReview(review)}
                                  >
                                    ✏️
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDeleteReview(review)}
                                  >
                                    🗑️
                                  </Button>
                                </div>
                              )}
                            </div>

                            <small className="text-muted">
                              {new Date(review.createdDate).toLocaleString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </small>

                            {isEditing ? (
                              <div className="mt-3">
                                <textarea
                                  className="form-control mb-2"
                                  rows={3}
                                  value={editNote}
                                  onChange={(e) => setEditNote(e.target.value)}
                                />
                                <select
                                  className="form-select w-auto mb-2"
                                  value={editRate}
                                  onChange={(e) =>
                                    setEditRate(Number(e.target.value))
                                  }
                                >
                                  {[1, 2, 3, 4, 5].map((r) => (
                                    <option key={r} value={r}>
                                      {r} ★
                                    </option>
                                  ))}
                                </select>
                                <Button
                                  size="sm"
                                  variant="success"
                                  onClick={handleSaveEdit}
                                >
                                  💾 Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="ms-2"
                                  onClick={() => setEditingReview(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <p className="mt-2">{review.note}</p>
                            )}
                          </Card.Body>
                        </Card>
                      );
                    })}
                  </div>
                </Tab.Pane>

                {/* <Tab.Pane eventKey="related">
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
                </Tab.Pane> */}
              </Tab.Content>
            </Tab.Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BookDetailPage;
