import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Form,
  InputGroup,
  Pagination,
  Modal,
  Alert,
} from "react-bootstrap";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash,
  Download,
  PersonFill,
  ExclamationTriangleFill,
  BookFill,
  Calendar,
} from "react-bootstrap-icons";
import styles from "./AuthorsManagementPage.module.css";
import authorApi from "../../api/author";
import { useNavigate } from "react-router-dom";

const AuthorsManagementPage = () => {
  const [authors, setAuthors] = useState([]);
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [authorToDelete, setAuthorToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();

  // ⬇️ thêm các state này
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Mock authors data
  useEffect(() => {
    const loadAuthors = async () => {
      try {
        const res = await authorApi.getAll();
        setAuthors(res.data);
        setFilteredAuthors(res.data);
      } catch (error) {
        console.error("Failed to load authors:", error);
      }
    };
    loadAuthors();
  }, []);

  // ✅ Search logic (đã sửa)
  useEffect(() => {
    if (!searchTerm) {
      setFilteredAuthors(authors);
      return;
    }

    const term = searchTerm.toLowerCase();

    const filtered = authors.filter((author) => {
      const fullName = author.fullName?.toLowerCase() || "";
      const nationality = author.nationality?.toLowerCase() || "";
      return fullName.includes(term) || nationality.includes(term);
    });

    setFilteredAuthors(filtered);
    setCurrentPage(1);
  }, [authors, searchTerm]);

  const calculateAge = (birthDate, deathDate) => {
    const birth = new Date(birthDate);
    const death = deathDate ? new Date(deathDate) : new Date();
    const age = Math.floor((death - birth) / (365.25 * 24 * 60 * 60 * 1000));
    return deathDate ? `${age} (deceased)` : `${age} years old`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleView = async (authorId) => {
    try {
      const res = await authorApi.getById(authorId);
      setSelectedAuthor(res.data);
      setShowViewModal(true);
    } catch (err) {
      console.error("Failed to load author details:", err);
    }
  };

  const handleEdit = async (authorId) => {
    try {
      const res = await authorApi.getById(authorId);
      const data = res.data;

      // ✅ Chuyển ISO date → yyyy-MM-dd
      const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - offset * 60 * 1000);
        return localDate.toISOString().split("T")[0]; // "YYYY-MM-DD"
      };

      setEditForm({
        ...data,
        birthDate: formatDateForInput(data.birthDate),
        deathDate: formatDateForInput(data.deathDate),
      });

      setShowEditModal(true);
    } catch (err) {
      console.error("Failed to load author for edit:", err);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      await authorApi.update(editForm.id, editForm);
      setShowEditModal(false);
      showAlertMessage("✅ Author updated successfully!");
      // reload list
      const res = await authorApi.getAll();
      setAuthors(res.data);
    } catch (err) {
      console.error("Update failed:", err);
      showAlertMessage("❌ Failed to update author.");
    }
  };

  const handleDelete = (author) => {
    setAuthorToDelete(author);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (!authorToDelete) return;

      // 🔹 Gọi API BE để xóa mềm
      await authorApi.delete(authorToDelete.id);

      // 🔹 Đóng modal
      setShowDeleteModal(false);
      showAlertMessage(
        `🗑️ Author "${authorToDelete.fullName}" set to inactive.`
      );

      // 🔹 Reload danh sách từ backend để có dữ liệu mới (isDeleted=true)
      const res = await authorApi.getAll();
      setAuthors(res.data);
    } catch (err) {
      console.error("Delete failed:", err);
      showAlertMessage("❌ Failed to deactivate author.");
    }
  };

  const handleAddNew = () => {
    navigate("/admin/authors/add");
  };

  const handleExport = () => {
    console.log("Export authors data");
    showAlertMessage("Authors data exported successfully!");
  };

  const showAlertMessage = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAuthors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAuthors.length / itemsPerPage);

  return (
    <div className={styles.authorsManagementPage}>
      {/* Page Header */}
      <Row className="mb-4">
        <Col>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>
                <PersonFill className="me-3" />
                Authors Management
              </h1>
              <p className={styles.pageSubtitle}>
                Manage author profiles, biographies, and their published works
              </p>
            </div>
            <div className={styles.headerActions}>
              <Button
                variant="outline-primary"
                onClick={handleExport}
                className="me-2"
              >
                <Download className="me-1" />
                Export
              </Button>
              <Button variant="primary" onClick={handleAddNew}>
                <Plus className="me-1" />
                Add New Author
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {showAlert && (
        <Alert variant="success" className={styles.alert}>
          {alertMessage}
        </Alert>
      )}

      {/* Search */}
      <Row className="mb-4">
        <Col lg={6} className="mb-3">
          <InputGroup size="lg">
            <Form.Control
              type="text"
              placeholder="Search by author name or nationality..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <Button variant="primary">
              <Search />
            </Button>
          </InputGroup>
        </Col>
        <Col lg={6} className="mb-3">
          <div className={styles.resultsInfo}>
            Showing {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, filteredAuthors.length)} of{" "}
            {filteredAuthors.length} authors
          </div>
        </Col>
      </Row>

      {/* Authors Table */}
      {/* Authors Table */}
      <Card className={`custom-card ${styles.authorsCard}`}>
        <Card.Body className={styles.authorsCardBody}>
          <div className={styles.tableContainer}>
            <Table responsive hover className={styles.authorsTable}>
              <thead>
                <tr>
                  <th>Author</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>Birth</th>
                  <th>Nationality</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((author) => (
                  <tr key={author.id} className={styles.authorRow}>
                    {/* Avatar + Name */}
                    <td className={styles.authorCell}>
                      <div className={styles.authorInfo}>
                        <img
                          src={author.avatarUrl || "/default-avatar.png"}
                          alt={author.fullName}
                          className={styles.authorPhoto}
                        />
                        <div className={styles.authorDetails}>
                          <div className={styles.authorName}>
                            {author.fullName}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td>{author.email || "—"}</td>

                    {/* Gender */}
                    <td>{author.gender || "—"}</td>

                    {/* Birth Date */}
                    <td>
                      {author.birthDate ? formatDate(author.birthDate) : "—"}
                    </td>

                    {/* Nationality */}
                    <td>{author.nationality || "—"}</td>

                    {/* 🔹 Status from isDeleted */}
                    <td>
                      {author.isDeleted ? (
                        <Badge bg="secondary">Inactive</Badge>
                      ) : (
                        <Badge bg="success">Active</Badge>
                      )}
                    </td>

                    {/* Created Date */}
                    <td className={styles.dateCell}>
                      {author.createdDate
                        ? new Date(author.createdDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "—"}
                    </td>

                    {/* Actions */}
                    <td className={styles.actionsCell}>
                      <div className={styles.actionButtons}>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleView(author.id)}
                          className={styles.actionButton}
                        >
                          <Eye />
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleEdit(author.id)}
                          className={styles.actionButton}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(author)}
                          className={styles.actionButton}
                        >
                          <Trash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.paginationContainer}>
              <Pagination>
                <Pagination.First
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* View Author Modal */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Author Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedAuthor && (
            <div className="p-3">
              {/* Avatar + Name */}
              <div className="text-center mb-4">
                <img
                  src={selectedAuthor.avatarUrl || "/default-avatar.png"}
                  alt="avatar"
                  className="rounded-circle mb-3 shadow"
                  style={{ width: 130, height: 130, objectFit: "cover" }}
                />
                <h4 className="fw-bold mb-0">{selectedAuthor.fullName}</h4>
                {selectedAuthor.nationality && (
                  <p className="text-muted">{selectedAuthor.nationality}</p>
                )}
              </div>

              {/* Basic Info */}
              <Row className="mb-3">
                <Col md={6}>
                  <p>
                    <b>Email:</b> {selectedAuthor.email || "—"}
                  </p>
                  <p>
                    <b>Gender:</b> {selectedAuthor.gender || "—"}
                  </p>
                  <p>
                    <b>Birth Date:</b>{" "}
                    {selectedAuthor.birthDate
                      ? formatDate(selectedAuthor.birthDate)
                      : "—"}
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <b>Death Date:</b>{" "}
                    {selectedAuthor.deathDate
                      ? formatDate(selectedAuthor.deathDate)
                      : "—"}
                  </p>
                  <p>
                    <b>Website:</b>{" "}
                    {selectedAuthor.website ? (
                      <a
                        href={selectedAuthor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {selectedAuthor.website}
                      </a>
                    ) : (
                      "—"
                    )}
                  </p>
                  <p>
                    <b>Social Links:</b>{" "}
                    {selectedAuthor.socialLinks
                      ? selectedAuthor.socialLinks
                      : "—"}
                  </p>
                </Col>
              </Row>

              {/* Biography */}
              <div className="mb-3">
                <h6 className="fw-bold">Biography</h6>
                <p
                  style={{
                    whiteSpace: "pre-line",
                    textAlign: "justify",
                  }}
                >
                  {selectedAuthor.biography || "No biography available."}
                </p>
              </div>

              {/* Books Count / Created Date */}
              <Row>
                <Col md={6}>
                  <p>
                    <b>Total Books:</b>{" "}
                    {selectedAuthor.booksCount ??
                      selectedAuthor.books?.length ??
                      0}
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <b>Created Date:</b>{" "}
                    {selectedAuthor.createdDate
                      ? new Date(selectedAuthor.createdDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )
                      : "—"}
                  </p>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Edit Author Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Author</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {editForm && (
            <Form>
              {/* Full Name */}
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={editForm.fullName || ""}
                  onChange={handleEditChange}
                  placeholder="Enter full name"
                />
              </Form.Group>

              {/* Email */}
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={editForm.email || ""}
                  onChange={handleEditChange}
                  placeholder="Enter email"
                />
              </Form.Group>

              {/* Gender + Birth + Death */}
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      name="gender"
                      value={editForm.gender || ""}
                      onChange={handleEditChange}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Birth Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="birthDate"
                      value={editForm.birthDate || ""}
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Death Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="deathDate"
                      value={editForm.deathDate || ""}
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Nationality + Website */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nationality</Form.Label>
                    <Form.Control
                      type="text"
                      name="nationality"
                      value={editForm.nationality || ""}
                      onChange={handleEditChange}
                      placeholder="e.g. British, Vietnamese"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Website</Form.Label>
                    <Form.Control
                      type="text"
                      name="website"
                      value={editForm.website || ""}
                      onChange={handleEditChange}
                      placeholder="https://example.com"
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Social Links */}
              <Form.Group className="mb-3">
                <Form.Label>Social Links</Form.Label>
                <Form.Control
                  type="text"
                  name="socialLinks"
                  value={editForm.socialLinks || ""}
                  onChange={handleEditChange}
                  placeholder='e.g. {"facebook": "link", "twitter": "link"}'
                />
              </Form.Group>

              {/* Biography */}
              <Form.Group className="mb-3">
                <Form.Label>Biography</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="biography"
                  value={editForm.biography || ""}
                  onChange={handleEditChange}
                  placeholder="Short biography..."
                />
              </Form.Group>

              {/* Avatar URL / Upload */}
              <Row className="align-items-center">
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Avatar URL</Form.Label>
                    <Form.Control
                      type="text"
                      name="avatarUrl"
                      value={editForm.avatarUrl || ""}
                      onChange={handleEditChange}
                      placeholder="Paste image URL or leave empty"
                    />
                  </Form.Group>
                </Col>
                <Col md={4} className="text-center">
                  <img
                    src={editForm.avatarUrl || "/default-avatar.png"}
                    alt="preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <ExclamationTriangleFill className="me-2 text-danger" />
            Confirm Delete
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {authorToDelete && (
            <div>
              <p>Are you sure you want to delete this author?</p>
              <div className={styles.deleteAuthorInfo}>
                <strong>Name:</strong> {authorToDelete.fullName || "—"}
                <br />
                <strong>Nationality:</strong>{" "}
                {authorToDelete.nationality || "—"}
                <br />
                <strong>Books:</strong>{" "}
                {authorToDelete.booksCount ?? authorToDelete.books?.length ?? 0}{" "}
                book(s)
              </div>
              <p className="text-danger mt-3">
                <small>
                  This action <b>cannot be undone</b> and will permanently
                  remove this author and may affect all related books.
                </small>
              </p>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete Author
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AuthorsManagementPage;
