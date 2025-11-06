import React, { useState } from "react";
import styles from "./PublishersManagementPage.module.css";
import publisherApi from "../../api/publisher";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";

const AddPublisherPage = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    address: "",
    establishedYear: "",
    website: "",
    avatarUrl: "",
  });

  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  // 🧩 Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Nếu chọn file ảnh
    if (name === "avatar") {
      const file = files[0];
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        setPreviewAvatar(objectUrl);
      } else {
        setPreviewAvatar(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 🧩 Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const payload = {
        companyName: formData.companyName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        establishedYear: formData.establishedYear
          ? parseInt(formData.establishedYear)
          : null,
        website: formData.website,
        avatarUrl: formData.avatarUrl || null,
      };

      await publisherApi.create(payload);

      setSuccessMessage("✅ Publisher added successfully!");
      setFormData({
        companyName: "",
        email: "",
        phone: "",
        address: "",
        establishedYear: "",
        website: "",
        avatarUrl: "",
      });
      setPreviewAvatar(null);
      setTimeout(() => {
        navigate("/admin/publishers");
      }, 800);
    } catch (err) {
      console.error("Add publisher failed:", err);
      setErrorMessage("❌ Failed to add publisher. Please try again!");
    }
  };

  return (
    <div className={styles.publishersManagementPage}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Add New Publisher</h1>
          <p className={styles.pageSubtitle}>
            Fill out the form below to add a new publisher to the system.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <div className={`card ${styles.publishersCard}`}>
        <div
          className={`card-body ${styles.publishersCardBody}`}
          style={{ padding: "2rem" }}
        >
          <form onSubmit={handleSubmit}>
            {/* Company Name */}
            <div className="mb-3">
              <label className="form-label fw-bold">Company Name</label>
              <input
                type="text"
                className="form-control"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                placeholder="Enter publisher's name"
              />
            </div>

            {/* Email & Phone */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="publisher@email.com"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+84 123 456 789"
                />
              </div>
            </div>

            {/* Address */}
            <div className="mb-3">
              <label className="form-label fw-bold">Address</label>
              <textarea
                className="form-control"
                name="address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter publisher address"
              ></textarea>
            </div>

            {/* Established Year & Website */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Established Year</label>
                <input
                  type="number"
                  className="form-control"
                  name="establishedYear"
                  value={formData.establishedYear}
                  onChange={handleChange}
                  placeholder="e.g. 1995"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Website</label>
                <input
                  type="text"
                  className="form-control"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            {/* Avatar URL */}
            <div className="mb-3">
              <label className="form-label fw-bold">
                Avatar URL (optional)
              </label>
              <input
                type="text"
                className="form-control"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleChange}
                placeholder="Paste publisher logo URL"
              />
              {formData.avatarUrl && (
                <div className="mt-3 text-center">
                  <img
                    src={formData.avatarUrl}
                    alt="Preview"
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                    }}
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="text-end mt-4">
              <Button
                variant="primary"
                className={styles.addButton}
                type="submit" // ✅ đổi từ onClick sang type="submit"
              >
                <Plus className="me-2" />
                Add Publisher
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPublisherPage;
