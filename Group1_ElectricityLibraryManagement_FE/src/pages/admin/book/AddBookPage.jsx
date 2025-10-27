import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./BooksManagementPage.module.css";
import categoryApi from "../../../api/category";
import authorApi from "../../../api/author";
import publisherApi from "../../../api/publisher";
import bookApi from "../../../api/book";

const AddBookPage = () => {
  const [formData, setFormData] = useState({
    bookCode: "",
    title: "",
    description: "",
    authorId: "",
    categoryId: "",
    publisherId: "",
    image: null, // 🔹 đổi từ content -> image
  });

  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [previewImage, setPreviewImage] = useState(null); // 🔹 thêm preview
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
        setErrorMessage("Không thể tải dữ liệu. Vui lòng thử lại!");
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
        setPreviewImage(URL.createObjectURL(file)); // 🔹 hiện preview
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
    if (formData.image) {
      data.append("image", formData.image); // 🔹 đổi field name
    }

    try {
      await bookApi.addBook(data);

      setSuccessMessage("✅ Thêm sách thành công!");
      setFormData({
        title: "",
        description: "",
        authorId: "",
        categoryId: "",
        publisherId: "",
        image: null,
      });
      setPreviewImage(null);
    } catch (err) {
      console.error(err);
      setErrorMessage("❌ Thêm sách thất bại. Vui lòng kiểm tra lại dữ liệu.");
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

            {/* Select fields */}
            <div className="row">
              <div className="col-md-4 mb-3">
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

              <div className="col-md-4 mb-3">
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

              <div className="col-md-4 mb-3">
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
