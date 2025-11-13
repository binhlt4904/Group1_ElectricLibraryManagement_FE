import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./BooksManagementPage.module.css";
import bookApi from "../../../api/book";
import authorApi from "../../../api/author";
import categoryApi from "../../../api/category";
import publisherApi from "../../../api/publisher";
import notificationAPI from "../../../api/notification";

const AddBookPage = () => {
  const [formData, setFormData] = useState({
    bookCode: "",
    title: "",
    description: "",
    authorId: "",
    categoryId: "",
    publisherId: "",
    publishedDate: "",
    image: null,
  });

  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [authorsRes, categoriesRes, publishersRes] = await Promise.all([
          authorApi.findAll(),
          categoryApi.findAll(),
          publisherApi.findAll(),
        ]);
        setAuthors(authorsRes.data);
        setCategories(categoriesRes.data);
        setPublishers(publishersRes.data);
      } catch (err) {
        console.error(err);
        setErrorMessage("Error loading data. Please try again!");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setFormData({ ...formData, image: file });
      if (file) {
        setPreviewImage(URL.createObjectURL(file)); 
      } else {
        setPreviewImage(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const data = new FormData();
    data.append("bookCode", formData.bookCode);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("authorId", formData.authorId);
    data.append("categoryId", formData.categoryId);
    data.append("publisherId", formData.publisherId);
    data.append("publishedDate", formData.publishedDate);
    if (formData.image) {
      data.append("image", formData.image); 
    }

    try {
      const response = await bookApi.addBook(data);

      // Send notification to all users about the new book
      try {
        if (response.data && response.data.id) {
          await notificationAPI.sendNewBookNotification(response.data.id, formData.title);
          console.log('Book notification sent successfully');
        }
      } catch (notifError) {
        console.error('Failed to send book notification:', notifError);
        // Don't fail the book creation if notification fails
      }

      setSuccessMessage("Add Book Successfully!");
      setFormData({
        bookCode: "",
        title: "",
        description: "",
        authorId: "",
        categoryId: "",
        publisherId: "",
        publishedDate: "",
        image: null,
      });
      setPreviewImage(null);
    } catch (err) {
      console.error(err);
      setErrorMessage("Error adding book. " + err.response?.data?.message || "Error adding book. Please try again.");
    }
  };

  return (
    <div className={styles.booksManagementPage}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Add New Book</h1>
          <p className={styles.pageSubtitle}>
            Fill out the form below to add a new book to the library.
          </p>
        </div>
      </div>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <div className={`card ${styles.booksCard}`}>
        <div className={`card-body ${styles.booksCardBody}`} style={{ padding: "2rem" }}>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Book Code</label>
              <input
                type="text"
                className="form-control"
                name="bookCode"
                value={formData.bookCode}
                onChange={handleChange}
                required
                placeholder="Enter book code (e.g., BK001)"
              />
            </div>
            {/* Title */}
            <div className="mb-3">
              <label className="form-label fw-bold">Title</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter book title"
              />
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label fw-bold">Description</label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Enter a short description"
              />
            </div>


            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Published Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="publishedDate"
                  value={formData.publishedDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Author</label>
                <select
                  className="form-select"
                  name="authorId"
                  value={formData.authorId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select author</option>
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.fullName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Select fields */}
            <div className="row">


              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Category</label>
                <select
                  className="form-select"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Publisher</label>
                <select
                  className="form-select"
                  name="publisherId"
                  value={formData.publisherId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select publisher</option>
                  {publishers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.companyName}
                    </option>
                  ))}
                </select>
              </div>
            </div>


            {/* Upload image */}
            <div className="mb-3">
              <label className="form-label fw-bold">Upload Book Image</label>
              <input
                type="file"
                className="form-control"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
              <small className="text-muted">Supported formats: JPG, PNG, JPEG</small>

              {previewImage && (
                <div className="mt-3">
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{ width: "180px", height: "auto", borderRadius: "8px" }}
                  />
                </div>
              )}
            </div>

            {/* Submit button */}
            <div className="text-end">
              <button type="submit" className="btn btn-primary px-4">
                Add Book
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBookPage;
