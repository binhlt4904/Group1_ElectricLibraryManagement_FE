import React from 'react';
import { Tab, Nav, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from '../../../pages/public/BookDetailPage.module.css';
const TabSection = ({activeTab, setActiveTab, contents, reviews, book,renderStars,relatedBooks, newReview, setNewReview,
  handleAddReview, user, editingReview, setEditingReview, editNote, setEditNote, editRate, setEditRate,
  handleEditReview, handleDeleteReview, handleSaveEdit
}) => {
  console.log(user)
    return (
        <div>
            <Row>
          <Col>
            <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
              <Nav variant="tabs" className={styles.customTabs}>
                <Nav.Item>
                  <Nav.Link eventKey="overview">Overview</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="contents">Contents ({contents.length} chapters)</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="details">Details</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="reviews">Reviews ({reviews.length})</Nav.Link>
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
                      {contents.map(content => (
                        <div key={content.id} className={styles.chapterItem}>
                          <Link
                            to={`/book-reader/${book.id}/${content.chapter}`}
                            className={styles.chapterLink}
                          >
                            <div className={styles.chapterInfo}>
                              <div className={styles.chapterNumber}>
                                Chapter {content.chapter}
                              </div>
                              <div className={styles.chapterTitle}>
                                {content.title}
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
                      <Col >
                        <div className={styles.detailItem}>
                          <strong>Publisher:</strong> {book.publisher}
                        </div>
                        <div className={styles.detailItem}>
                          <strong>Publication Year:</strong> {book.publishedDate}
                        </div>
                        <div className={styles.detailItem}>
                          <strong>Imported Date:</strong> {new Date(book.importedDate).toLocaleDateString()}
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

                      
                     

                      const canModify =
                        user &&
                        ((review.reviewerId) ===
                          (user.accountId) 
                          );
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

                <Tab.Pane eventKey="related">
                  <div className={styles.relatedBooks}>
                    <Row>
                      {relatedBooks.map(relatedBook => (
                        <Col key={relatedBook.id} md={6} lg={4} className="mb-3">
                          <Card className={styles.relatedBookCard}>
                            <Card.Img variant="top" src={`http://localhost:8080${relatedBook.image}`} />
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
        </div>
    );
};

export default TabSection;