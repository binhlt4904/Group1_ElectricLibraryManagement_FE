import React, { useState, useEffect,useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Nav, Tab, Card, ProgressBar } from 'react-bootstrap';
import { Heart, HeartFill, Star, StarFill, Share, BookmarkPlus, ArrowLeft } from 'react-bootstrap-icons';
import styles from './BookDetailPage.module.css';
import bookApi from '../../api/book';
import reviewApi from "../../api/review"; // thêm file này như mình đã hướng dẫn ở trên
import BookHeader from '../../components/commons/books/BookHeader';
import TabSection from '../../components/commons/books/TabSection';
import UserContext from "../../components/contexts/UserContext";
const BookDetailPage = () => {
  const { id: bookId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [contents, setContents] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [newReview, setNewReview] = useState({ note: "", rate: 5 }); // ← đưa vào đây

  const { currentUser } = useContext(UserContext);

  /** ❤️ Kiểm tra sách có trong localStorage không */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsInWishlist(saved.includes(Number(bookId)));
  }, [bookId]);

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
  const fetchBookDetail = async () => {
      try {
        const bookRes = await bookApi.findBookUserById(bookId);

        const contentsRes = await bookApi.findBookContentsUserById(bookId);
        console.log(contentsRes.data)
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

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("⚠️ Please login to use wishlist!");
      navigate("/login");
      return;
    }

    const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
    let updated;

    if (saved.includes(Number(bookId))) {
      updated = saved.filter((id) => id !== Number(bookId));
      setIsInWishlist(false);
      // alert("🗑️ Removed from wishlist!");
    } else {
      updated = [...saved, Number(bookId)];
      setIsInWishlist(true);
      // alert("✅ Added to wishlist!");
    }

    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const handleBorrow = () => {
    // console.log("Borrow book:", book.id);
    // Handle borrow logic
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

  if (!book) {
    return <div className={styles.loading}>Loading...</div>;
  }

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
        <BookHeader book={book} handleBorrow={handleBorrow} handleWishlistToggle={handleWishlistToggle} isInWishlist={isInWishlist} handleReportIssue={handleReportIssue} />
        {/* Tabs Section */}
        <TabSection activeTab={activeTab} setActiveTab={setActiveTab} contents={contents} reviews={reviews} book={book} renderStars={renderStars} relatedBooks={relatedBooks} 
        handleAddReview={handleAddReview} newReview={newReview} setNewReview={setNewReview} editingReview={editingReview} setEditingReview={setEditingReview} editNote={editNote}
        setEditNote={setEditNote} editRate={editRate} setEditRate={setEditRate} handleEditReview={handleEditReview} handleDeleteReview={handleDeleteReview} handleSaveEdit={handleSaveEdit} user={user}/>
      </Container>
    </div>
  );
};

export default BookDetailPage;
