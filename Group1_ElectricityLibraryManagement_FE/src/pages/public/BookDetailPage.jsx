import React, { useState, useEffect,useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Nav, Tab, Card, ProgressBar, Modal, Form, Alert } from 'react-bootstrap';
import { Heart, HeartFill, Star, StarFill, Share, BookmarkPlus, ArrowLeft } from 'react-bootstrap-icons';
import styles from './BookDetailPage.module.css';
import bookApi from '../../api/book';
import reviewApi from "../../api/review"; // thêm file này như mình đã hướng dẫn ở trên
import BookHeader from '../../components/commons/books/BookHeader';
import TabSection from '../../components/commons/books/TabSection';
import UserContext from "../../components/contexts/UserContext";
import reportApi from '../../api/admin/reportApi';
import borrowalReaderHistoryApi from '../../api/user/borrowReaderHistory';
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

  const [borrowedBook, setBorrowedBook] = useState(null);
  const [dueDate, setDueDate] = useState('');
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [borrowError, setBorrowError] = useState('');
  const [borrowsuccess, setBorrowSuccess] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState(null);
  const [reportDescription, setReportDescription] = useState(null);
  // const [reportBook, setReportBook] = useState(null);
  const handleClose = () => setShowBorrowModal(false);
  // const handleShow = () => setShowBorrowModal(true);

  const types = ['Content Issue', 'Access Issue', 'Other Issue'];

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
      setBorrowError('Failed to borrow the book.' + err.message);
    }
  };

  const handleReportIssue = () => {
    console.log('Report issue for book:', book.id);
    setShowReportModal(true);
    // Handle report issue logic - could open modal or navigate to report form
  };

  const handleReportConfirm = async (reportType, reportDescription) => {

    const params = {
      bookId: book.id,
      reportType: reportType,
      description: reportDescription,
    };

    try {
      const response = await reportApi.createReport(params);
      setShowReportModal(false);
    } catch (error) {
      alert('Error in reporting issue:', error.message);
      console.error('Failed to report issue:', error);
    }
  }
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

      {/* Modal for report */}
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Information for report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Description: </Form.Label>
              <Form.Control
                type="text"
                placeholder="Brief note about issue of book"
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Report Type: </Form.Label>
              <Form.Select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className={styles.filterSelect}
              >
                {types.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReportModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleReportConfirm(reportType, reportDescription)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BookDetailPage;
