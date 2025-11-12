import React, { useEffect, useState } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./AdminBookDetailPage.module.css";
import { Button, Alert, Form } from "react-bootstrap";
import { Eye, Pencil, Trash } from "react-bootstrap-icons";
import bookApi from "../../../api/book";
import BookReaderModal from "../../../components/commons/books/BookReaderModal";


const AdminBookDetailPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [contents, setContents] = useState([]);
  const [viewContent, setViewContent] = useState(null); 
  const [editingContentId, setEditingContentId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [editContentForm, setEditContentForm] = useState({
    chapter: '',
    title: '',
    file: null, 
    isDeleted: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookRes = await bookApi.findBookAdminById(id);
        const contentRes = await bookApi.findBookContentsById(id);
        console.log(contentRes)
        setBook(bookRes.data);
        setContents(contentRes.data);
      } catch (error) {
        console.error("Error loading book detail:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleNavigate = () => {
    navigate(`/admin/books/add/${book.id}`);
  }

  const startEditContent = (content) => {
    console.log(content)
    setEditingContentId(content.id);
    setEditContentForm({
      chapter: content.chapter ?? '',
      title: content.title ?? '',
      file: null,
      isDeleted: content.isDeleted || false,
    });
  };

  const onChangeContent = (field, value) => {
    setEditContentForm((p) => ({ ...p, [field]: value }));
  };

  const cancelEditContent = () => {
    setEditingContentId(null);
    setEditContentForm({ chapter: '', title: '', file: null });
  };

  const saveEditContent = async (contentId) => {
    try {
      const form = new FormData();
      form.append('chapter', editContentForm.chapter ?? '');
      form.append('title', editContentForm.title ?? '');
      if (editContentForm.file) form.append('file', editContentForm.file); 
      form.append('isDeleted', editContentForm.isDeleted);

      const response = await bookApi.updateBookContent(contentId, form);
      console.log(response.data)

      if (response?.status >= 200 && response?.status < 300) {
        showAlertMessage('Update book content successfully!');

      } else {
        throw new Error('Upload failed');
      }
      setContents(response.data);

      cancelEditContent();
    } catch (err) {
      console.error('Update content failed:', err);
    }
  };

  const showAlertMessage = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  if (!book) return <p>Loading...</p>;


  return (
    <div className={styles.bookDetailPage}>
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
          <div className={styles.bookDescription}>
            <strong>Description:</strong>{" "}
            <span style={{ whiteSpace: "pre-line" }}>
              {book.description || "N/A"}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.contentsCard}>
        <div className={styles.sectionHeader}>
          {showAlert && <Alert variant="success" className={styles.alert}>{alertMessage}</Alert>}
          <h3 className={styles.sectionTitle}>Book Contents</h3>
          <button className={styles.addButton} onClick={handleNavigate}>+ Add Chapter</button>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.booksTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>Chapter</th>
                <th>Title</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contents.map((c, index) => {
                const isEditing = editingContentId === c.id;

                return (
                  <tr
                    key={c.id}
                    className={`${styles.bookRow} ${c.hidden ? styles.hiddenRow : ""}`}
                  >
                    <td>{index + 1}</td>

                    <td>
                      {!isEditing ? (
                        c.chapter
                      ) : (
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={editContentForm.chapter}
                          onChange={(e) => onChangeContent('chapter', e.target.value)}
                          placeholder="Chapter"
                          min={0}
                        />
                      )}
                    </td>

                    <td>
                      {!isEditing ? (
                        c.title
                      ) : (
                        <div className="d-flex flex-column gap-2">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={editContentForm.title}
                            onChange={(e) => onChangeContent('title', e.target.value)}
                            placeholder="Title"
                          />
                          <div className="d-flex align-items-center gap-2">
                            <input
                              type="file"
                              className="form-control form-control-sm"
                              onChange={(e) => onChangeContent('file', e.target.files?.[0] ?? null)}
                              accept="application/pdf"
                            />
                            {c.content && (
                              <a
                                href={`http://localhost:8080${c.content}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-muted small"
                              >
                                (Current file)
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </td>
                    <td>
                      {!isEditing ? (
                        <span
                          className={`badge ${c.isDeleted ? 'bg-secondary' : 'bg-success'}`}
                        >
                          {c.isDeleted ? 'Inactive' : 'Active'}
                        </span>
                      ) : (
                        <Form.Check
                          type="switch"
                          id={`status-${c.id}`}
                          label={editContentForm.isDeleted ? 'Inactive' : 'Active'}
                          checked={!editContentForm.isDeleted} 
                          onChange={(e) => onChangeContent('isDeleted', !e.target.checked)}
                        />
                      )}
                    </td>

                    <td className={styles.actionsCell}>
                      <div className={styles.actionButtons}>
                        {!isEditing ? (
                          <>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => setViewContent(c)}
                              
                            >
                              <Eye />
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => startEditContent(c)}
                              className="ms-2"
                            >
                              <Pencil />
                            </Button>
                            
                          </>
                        ) : (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => saveEditContent(c.id)}
                              className={styles.actionButton}
                            >
                              Save
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={cancelEditContent}
                              className={styles.actionButton}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <BookReaderModal
        show={!!viewContent}
        onClose={() => setViewContent(null)}
        title={viewContent ? `Chapter ${viewContent.chapter} - ${viewContent.title}` : ""}
        fileUrl={viewContent ? `http://localhost:8080${viewContent.content}` : ""}
      />



    </div>
  );
};

export default AdminBookDetailPage;
