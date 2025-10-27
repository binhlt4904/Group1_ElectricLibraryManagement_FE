import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./AdminBookDetailPage.module.css";

const AdminBookDetailPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [contents, setContents] = useState([]);
  const [newContent, setNewContent] = useState({ chapter: "", title: "", content: "" });

  useEffect(() => {
    const fetchBookData = async () => {
      const [bookRes, contentRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/books/${id}`),
        axios.get(`http://localhost:8080/api/books/${id}/contents`)
      ]);
      setBook(bookRes.data);
      setContents(contentRes.data);
    };
    fetchBookData();
  }, [id]);

  const handleAddContent = async (e) => {
    e.preventDefault();
    const res = await axios.post(`http://localhost:8080/api/books/${id}/contents`, newContent);
    setContents([...contents, res.data]);
    setNewContent({ chapter: "", title: "", content: "" });
  };

  if (!book) return <p>Loading...</p>;

  return (
    <div className={styles.bookDetailPage}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>{book.title}</h1>
          <p className={styles.pageSubtitle}>{book.description}</p>
        </div>
      </div>

      {/* Book Info */}
      <div className={styles.bookInfoCard}>
        <h3 className={styles.sectionTitle}>Book Information</h3>
        <div className={styles.bookInfoGrid}>
          <p><strong>Book Code:</strong> {book.bookCode}</p>
          <p><strong>Publisher:</strong> {book.publisher?.name || "N/A"}</p>
          <p><strong>Category:</strong> {book.category?.name || "N/A"}</p>
          <p><strong>Published Date:</strong> {book.publishedDate || "N/A"}</p>
        </div>
      </div>

      {/* Book Contents Table */}
      <div className={styles.contentsCard}>
        <h3 className={styles.sectionTitle}>Book Contents</h3>
        <div className={styles.tableContainer}>
          <table className={styles.booksTable}>
            <thead>
              <tr>
                <th>Chapter</th>
                <th>Title</th>
                <th>Content</th>
              </tr>
            </thead>
            <tbody>
              {contents.length > 0 ? (
                contents.map((c) => (
                  <tr key={c.id} className={styles.bookRow}>
                    <td>{c.chapter}</td>
                    <td>{c.title}</td>
                    <td className={styles.contentCell}>{c.content}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", color: "gray" }}>
                    No contents yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Chapter */}
      <div className={styles.addContentCard}>
        <h3 className={styles.sectionTitle}>Add New Chapter</h3>
        <form onSubmit={handleAddContent} className={styles.addForm}>
          <div className={styles.formGroup}>
            <label>Chapter</label>
            <input
              type="number"
              value={newContent.chapter}
              onChange={(e) => setNewContent({ ...newContent, chapter: e.target.value })}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Title</label>
            <input
              type="text"
              value={newContent.title}
              onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Content</label>
            <textarea
              rows="4"
              value={newContent.content}
              onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
              required
            ></textarea>
          </div>
          <button type="submit" className={styles.addButton}>
            Add Chapter
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminBookDetailPage;
