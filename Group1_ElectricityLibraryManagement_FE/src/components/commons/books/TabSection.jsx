import React from 'react';
import { Tab, Nav, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from '../../../pages/public/BookDetailPage.module.css';
const TabSection = ({activeTab, setActiveTab, contents, reviews, book,renderStars,relatedBooks}) => {
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
                    {reviews.map(review => (
                      <Card key={review.id} className={styles.reviewCard}>
                        <Card.Body>
                          <div className={styles.reviewHeader}>
                            <div>
                              <strong>{review.reviewerName}</strong>
                              <small className="text-muted ms-2">(ID: {review.id})</small>
                              <div className={styles.reviewStars}>
                                {renderStars(review.rate)}
                              </div>
                            </div>
                            <small className="text-muted">{review.createdDate}</small>
                          </div>
                          <p className={styles.reviewComment}>{review.note}</p>
                        </Card.Body>
                      </Card>
                    ))}
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