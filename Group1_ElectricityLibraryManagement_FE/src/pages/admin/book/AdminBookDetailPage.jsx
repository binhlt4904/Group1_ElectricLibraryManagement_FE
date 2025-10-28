import React, { useEffect, useState } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import { useParams } from "react-router-dom";
import styles from "./AdminBookDetailPage.module.css";
import { Button } from "react-bootstrap";
import { Eye, Pencil, Trash } from "react-bootstrap-icons";

const AdminBookDetailPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [contents, setContents] = useState([]);
  const [viewContent, setViewContent] = useState(null); // lưu object thay vì id

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookRes, contentRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/v1/public/admin/books/${id}`),
          axios.get(`http://localhost:8080/api/v1/public/admin/books/${id}/contents`),
        ]);
        setBook(bookRes.data);
        setContents(contentRes.data);
      } catch (error) {
        console.error("Error loading book detail:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleToggleVisibility = async (contentId, isHidden) => {
    try {
      await axios.put(`http://localhost:8080/api/book-contents/${contentId}/visibility`, {
        hidden: !isHidden,
      });
      setContents((prev) =>
        prev.map((c) => (c.id === contentId ? { ...c, hidden: !c.hidden } : c))
      );
    } catch (err) {
      console.error("Failed to toggle visibility:", err);
    }
  };

  if (!book) return <p>Loading...</p>;

  return (
    <div className={styles.bookDetailPage}>
      {/* ===== BOOK INFO ===== */}
      <div className={styles.bookInfoCard}>
        <div className={styles.bookInfoWrapper}>
          <div className={styles.bookCoverContainer}>
            <img
              src={
                book.image
                  ? `http://localhost:8080${book.image}`
                  : "https://via.placeholder.com/300x400?text=No+Cover"
              }
              alt={book.title}
              className={styles.bookCoverLarge}
            />
          </div>
          <div className={styles.bookDetailsRight}>
            <h2 className={styles.pageTitle}>{book.title}</h2>
            <p><strong>Author:</strong> {book.author || "N/A"}</p>
            <p><strong>Publisher:</strong> {book.publisher || "N/A"}</p>
            <p><strong>Category:</strong> {book.category || "N/A"}</p>
            <p><strong>Published Date:</strong> {book.publishedDate}</p>
          </div>
        </div>
      </div>

      {/* ===== CONTENTS TABLE ===== */}
      <div className={styles.contentsCard}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Book Contents</h3>
          <button className={styles.addButton}>+ Add Chapter</button>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.booksTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>Chapter</th>
                <th>Title</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contents.map((c, index) => (
                <tr
                  key={c.id}
                  className={`${styles.bookRow} ${c.hidden ? styles.hiddenRow : ""}`}
                >
                  <td>{index + 1}</td>
                  <td>{c.chapter}</td>
                  <td>{c.title}</td>
                  <td className={styles.actionsCell}>
                    <div className={styles.actionButtons}>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => setViewContent(c)}
                        className={styles.actionButton}
                      >
                        <Eye />
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleEdit(book.id)}
                        className={styles.actionButton}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleToggleVisibility(c.id, c.hidden)}
                        className={styles.actionButton}
                      >
                        <Trash />
                      </Button>
                    </div>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== POPUP VIEW CONTENT ===== */}
      {viewContent && (
        <div className={styles.modalOverlay} onClick={() => setViewContent(null)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()} // tránh đóng khi click bên trong
          >
            <button
              className={styles.closeButton}
              onClick={() => setViewContent(null)}
            >
              ✖
            </button>
            <h3>{viewContent.chapter}: {viewContent.title}</h3>
            <div
              className={styles.modalBody}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(viewContent.content || ""),
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookDetailPage;
