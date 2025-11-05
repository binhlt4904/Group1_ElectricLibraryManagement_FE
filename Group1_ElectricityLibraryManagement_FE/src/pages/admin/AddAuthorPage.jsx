import React, { useState } from "react";
import styles from "./AuthorsManagementPage.module.css";
import authorApi from "../../api/author";

const AddAuthorPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    biography: "",
    avatar: null,
    avatarUrl: "",
    gender: "",
    birthDate: "",
    deathDate: "",
    nationality: "",
    website: "",
    socialLinks: "",
  });

  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // 🧩 Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "avatar") {
      const file = files[0];
      setFormData({ ...formData, avatar: file });
      if (file) {
        setPreviewAvatar(URL.createObjectURL(file));
      } else {
        setPreviewAvatar(null);
      }
    } else if (name === "avatarUrl") {
      setFormData({ ...formData, avatarUrl: value, avatar: null });
      setPreviewAvatar(value || null);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 🧩 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      let avatarUrl = formData.avatarUrl || null;

      // ✅ Upload avatar file if present
      if (formData.avatar) {
        const resUpload = await authorApi.uploadAvatar(formData.avatar);
        avatarUrl = resUpload.data;
      }

      // ✅ Prepare payload
      const authorPayload = {
        fullName: formData.fullName,
        email: formData.email,
        biography: formData.biography,
        avatarUrl: avatarUrl,
        gender: formData.gender,
        birthDate: formData.birthDate || null,
        deathDate: formData.deathDate || null,
        nationality: formData.nationality,
        website: formData.website,
        socialLinks: formData.socialLinks,
      };

      await authorApi.create(authorPayload);
      setSuccessMessage("✅ Thêm tác giả thành công!");
      setFormData({
        fullName: "",
        email: "",
        biography: "",
        avatar: null,
        avatarUrl: "",
        gender: "",
        birthDate: "",
        deathDate: "",
        nationality: "",
        website: "",
        socialLinks: "",
      });
      setPreviewAvatar(null);
    } catch (err) {
      console.error("Add author failed:", err);
      setErrorMessage("❌ Không thể thêm tác giả. Vui lòng thử lại!");
    }
  };

  return (
    <div className={styles.authorsManagementPage}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Add New Author</h1>
          <p className={styles.pageSubtitle}>
            Fill out the form below to add a new author to the system.
          </p>
        </div>
      </div>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <div className={`card ${styles.authorsCard}`}>
        <div className={`card-body ${styles.authorsCardBody}`} style={{ padding: "2rem" }}>
          <form onSubmit={handleSubmit}>
            {/* Full name */}
            <div className="mb-3">
              <label className="form-label fw-bold">Full Name</label>
              <input
                type="text"
                className="form-control"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter author's full name"
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-bold">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter author's email"
              />
            </div>

            {/* Gender, Birth, Death */}
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">Gender</label>
                <select
                  className="form-select"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">Birth Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">Death Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="deathDate"
                  value={formData.deathDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Nationality + Website */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Nationality</label>
                <input
                  type="text"
                  className="form-control"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  placeholder="e.g. British, Vietnamese"
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

            {/* Social Links */}
            <div className="mb-3">
              <label className="form-label fw-bold">Social Links</label>
              <input
                type="text"
                className="form-control"
                name="socialLinks"
                value={formData.socialLinks}
                onChange={handleChange}
                placeholder='e.g. {"facebook": "link", "twitter": "link"}'
              />
            </div>

            {/* Biography */}
            <div className="mb-3">
              <label className="form-label fw-bold">Biography</label>
              <textarea
                className="form-control"
                name="biography"
                rows="4"
                value={formData.biography}
                onChange={handleChange}
                placeholder="Write a short biography..."
              />
            </div>

            {/* Avatar */}
            <div className="mb-3">
              <label className="form-label fw-bold">Avatar (choose file or paste URL)</label>
              <input
                type="text"
                className="form-control mb-2"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleChange}
                placeholder="Paste image URL (optional)"
              />
              <input
                type="file"
                className="form-control"
                name="avatar"
                accept="image/*"
                onChange={handleChange}
                disabled={!!formData.avatarUrl}
              />
              <small className="text-muted">Supported: JPG, PNG, JPEG</small>

              {previewAvatar && (
                <div className="mt-3">
                  <img
                    src={previewAvatar}
                    alt="Preview"
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="text-end mt-4">
              <button type="submit" className="btn btn-primary px-4">
                Add Author
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAuthorPage;
