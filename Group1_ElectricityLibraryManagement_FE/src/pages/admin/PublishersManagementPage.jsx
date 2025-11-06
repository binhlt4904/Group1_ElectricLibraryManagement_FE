import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  InputGroup,
  Badge,
  Pagination,
  Modal,
  Alert,
} from "react-bootstrap";
import {
  Building,
  Search,
  Plus,
  Eye,
  PencilSquare,
  Trash,
  GeoAlt,
  Telephone,
  Envelope,
  Globe,
  BookFill,
  Calendar,
} from "react-bootstrap-icons";
import styles from "./PublishersManagementPage.module.css";
import publisherApi from "../../api/publisher";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PublishersManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [publisherToDelete, setPublisherToDelete] = useState(null);
  const ITEMS_PER_PAGE = 5;


  const [publishers, setPublishers] = useState([]);
  const navigate = useNavigate();

  // 🔹 Modal View / Edit state
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [editData, setEditData] = useState({});
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ Gọi BE phân trang
  const loadPublishers = async (page = 1, search = "") => {
    try {
      const res = await publisherApi.getPaged(page - 1, ITEMS_PER_PAGE, search);
      setPublishers(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalElements(res.data.totalElements || 0);
    } catch (e) {
      console.error("Failed to load publishers:", e);
    }
  };

  // Lần đầu
  useEffect(() => {
    loadPublishers(1, "");
  }, []);

  // ✅ Debounce search: gọi BE sau 400ms
  useEffect(() => {
    const t = setTimeout(() => {
      setCurrentPage(1);
      loadPublishers(1, searchTerm);
    }, 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Đổi trang
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      loadPublishers(page, searchTerm);
    }
  };

  // 🔹 (Tùy chọn) Lọc trạng thái/country client-side
  const uiFilteredPublishers = publishers.filter((p) => {
    const matchesStatus =
      selectedStatus === "all" ||
      (p.isDeleted ? "inactive" : "active") === selectedStatus;

    const matchesCountry =
      selectedCountry === "all" ||
      (p.address || "").toLowerCase().includes(selectedCountry.toLowerCase());

    return matchesStatus && matchesCountry;
  });

  const countries = [
    "all",
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
  ];
  const statuses = ["all", "active", "inactive"];

  // Filter publishers based on search and filters
  const filteredPublishers = publishers.filter((publisher) => {
    const matchesSearch =
      publisher.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      publisher.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      publisher.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" ||
      (publisher.isDeleted ? "inactive" : "active") === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  /** 🔹 View + Edit logic */
  const handleView = (publisher) => {
    setSelectedPublisher(publisher);
    setShowView(true);
  };

  const handleEdit = (publisher) => {
    setEditData(publisher);
    setShowEdit(true);
  };

  const handleCloseModals = () => {
    setShowView(false);
    setShowEdit(false);
    setSelectedPublisher(null);
    setEditData({});
    setSuccess("");
    setError("");
  };

  /** 🔹 Handle edit input */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  /** 🔹 Save edit */
  const handleSave = async () => {
    try {
      await publisherApi.update(editData.id, editData);
      setSuccess("✅ Updated successfully!");
      loadPublishers(currentPage, searchTerm);
      setTimeout(handleCloseModals, 1200);
    } catch (err) {
      console.error("Update failed:", err);
      setError("❌ Failed to update publisher.");
    }
  };

  // ✅ Pagination logic


  const handleDeleteClick = (publisher) => {
    setPublisherToDelete(publisher);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!publisherToDelete) return;

    try {
      const updatedPublisher = {
        ...publisherToDelete,
        isDeleted: true, // 🔹 soft delete
      };

      await publisherApi.update(publisherToDelete.id, updatedPublisher);

      setShowDeleteModal(false);
      setPublisherToDelete(null);
      setSuccess("✅ Publisher marked as inactive!");
      loadPublishers(currentPage, searchTerm);
    } catch (error) {
      console.error("❌ Soft delete failed:", error);
      setError("Failed to delete publisher. Please try again.");
    }
  };

  const getStatusVariant = (status) => {
    return status === "active" ? "success" : "secondary";
  };

  return (
    <Container fluid className={styles.publishersManagementPage}>
      {/* Page Header */}
      <Row className="mb-4">
        <Col>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>
                <Building className="me-3" />
                Publishers Management
              </h1>
              <p className={styles.pageSubtitle}>
                Manage publishing houses and their information
              </p>
            </div>
            <div className={styles.headerActions}>
              <Button
                variant="primary"
                className={styles.addButton}
                onClick={() => navigate("/admin/publishers/add")}
              >
                <Plus className="me-2" />
                Add Publisher
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col lg={4} className="mb-3">
          <InputGroup>
            <InputGroup.Text>
              <Search />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search publishers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </InputGroup>
        </Col>
        {/* <Col lg={3} className="mb-3">
          <Form.Select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className={styles.filterSelect}
          >
            {countries.map((country) => (
              <option key={country} value={country}>
                {country === "all" ? "All Countries" : country}
              </option>
            ))}
          </Form.Select>
        </Col> */}
        <Col lg={3} className="mb-3">
          <Form.Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={styles.filterSelect}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === "all"
                  ? "All Status"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </Form.Select>
        </Col>
        {/* Thay thống kê kết quả */}
        <Col lg={2} className="mb-3">
          <div className={styles.resultsInfo}>
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
            {Math.min(currentPage * ITEMS_PER_PAGE, totalElements)} of{" "}
            {totalElements} publishers
          </div>
        </Col>
      </Row>

      {/* Publishers Table */}
      <Row>
        <Col>
          <Card className={styles.publishersCard}>
            <Card.Body className={styles.publishersCardBody}>
              <div className={styles.tableContainer}>
                <Table responsive hover className={styles.publishersTable}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Publisher</th>
                      <th>Contact</th>
                      <th>Address</th>
                      <th>Founded</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {uiFilteredPublishers.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center text-muted">
                          No publishers found.
                        </td>
                      </tr>
                    ) : (
                      uiFilteredPublishers.map((publisher, index) => (
                        <tr key={publisher.id}>
                          <td>
                            {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                          </td>

                          {/* Publisher name + website */}
                          <td className={styles.publisherCell}>
                            <div className={styles.publisherInfo}>
                              <div className={styles.publisherIcon}>
                                {publisher.avatarUrl ? (
                                  <img
                                    src={publisher.avatarUrl}
                                    alt="logo"
                                    style={{
                                      width: "36px",
                                      height: "36px",
                                      borderRadius: "50%",
                                      objectFit: "cover",
                                      boxShadow:
                                        "0 0 3px rgba(216, 203, 203, 0.2)",
                                    }}
                                  />
                                ) : (
                                  <Building
                                    size={28}
                                    className="text-secondary"
                                  />
                                )}
                              </div>

                              <div className={styles.publisherDetails}>
                                <div className={styles.publisherName}>
                                  {publisher.companyName}
                                </div>
                                <div className={styles.publisherWebsite}>
                                  {publisher.website ? (
                                    <a
                                      href={publisher.website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {publisher.website}
                                    </a>
                                  ) : (
                                    <span className="text-muted">—</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Contact */}
                          <td className={styles.contactCell}>
                            <div>
                              <div>
                                <Envelope className="me-2 text-muted" />
                                {publisher.email || "—"}
                              </div>
                              <div>
                                <Telephone className="me-2 text-muted" />
                                {publisher.phone || "—"}
                              </div>
                            </div>
                          </td>

                          {/* Address */}
                          <td className={styles.addressCell}>
                            <GeoAlt className="me-2 text-muted" />
                            {publisher.address || "—"}
                          </td>

                          {/* Founded Year */}
                          <td>
                            <Calendar className="me-2 text-muted" />
                            {publisher.establishedYear || "—"}
                          </td>

                          {/* Status (isDeleted) */}
                          <td>
                            <Badge
                              bg={publisher.isDeleted ? "secondary" : "success"}
                              className={styles.statusBadge}
                            >
                              {publisher.isDeleted ? "Inactive" : "Active"}
                            </Badge>
                          </td>

                          {/* Actions */}
                          <td className={styles.actionsCell}>
                            <div className={styles.actionButtons}>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                title="View Details"
                                onClick={() => handleView(publisher)}
                              >
                                <Eye />
                              </Button>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                title="Edit Publisher"
                                onClick={() => handleEdit(publisher)}
                              >
                                <PencilSquare />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                title="Delete Publisher"
                                onClick={() => handleDeleteClick(publisher)}
                              >
                                <Trash />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <Pagination>
            <Pagination.First
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}

      {/* 🔹 View Publisher Modal (Styled like Author Details) */}
      <Modal show={showView} onHide={handleCloseModals} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Publisher Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedPublisher && (
            <div className="p-3">
              {/* Avatar + Name */}
              <div className="text-center mb-4">
                <img
                  src={selectedPublisher.avatarUrl || "/default-publisher.png"}
                  alt="logo"
                  className="rounded-circle mb-3 shadow"
                  style={{
                    width: 130,
                    height: 130,
                    objectFit: "cover",
                    border: "2px solid #eee",
                  }}
                />
                <h4 className="fw-bold mb-0">
                  {selectedPublisher.companyName}
                </h4>
                {selectedPublisher.address && (
                  <p className="text-muted mt-1">
                    <GeoAlt className="me-1" />
                    {selectedPublisher.address}
                  </p>
                )}
              </div>

              {/* Basic Info */}
              <Row className="mb-3">
                <Col md={6}>
                  <p>
                    <b>Email:</b> {selectedPublisher.email || "—"}
                  </p>
                  <p>
                    <b>Phone:</b> {selectedPublisher.phone || "—"}
                  </p>
                  <p>
                    <b>Founded:</b> {selectedPublisher.establishedYear || "—"}
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <b>Website:</b>{" "}
                    {selectedPublisher.website ? (
                      <a
                        href={selectedPublisher.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {selectedPublisher.website}
                      </a>
                    ) : (
                      "—"
                    )}
                  </p>
                  <p>
                    <b>Status:</b>{" "}
                    <Badge
                      bg={selectedPublisher.isDeleted ? "secondary" : "success"}
                    >
                      {selectedPublisher.isDeleted ? "Inactive" : "Active"}
                    </Badge>
                  </p>
                  {/* <p>
                    <b>Total Books:</b> {selectedPublisher.totalBooks ?? "—"}
                  </p> */}
                </Col>
              </Row>

              {/* Description / Extra Info */}
              <div className="mb-3">
                <h6 className="fw-bold">About</h6>
                <p
                  style={{
                    whiteSpace: "pre-line",
                    textAlign: "justify",
                  }}
                >
                  {selectedPublisher.description ||
                    "No additional information provided."}
                </p>
              </div>

              {/* Created Date */}
              {selectedPublisher.createdDate && (
                <div className="text-end text-muted">
                  <small>
                    <i>
                      Created on:{" "}
                      {new Date(
                        selectedPublisher.createdDate
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </i>
                  </small>
                </div>
              )}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 🔹 Edit Modal */}
      <Modal show={showEdit} onHide={handleCloseModals} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Publisher</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          {editData && (
            <Form>
              {/* Company Name */}
              <Form.Group className="mb-3">
                <Form.Label>Company Name</Form.Label>
                <Form.Control
                  type="text"
                  name="companyName"
                  value={editData.companyName || ""}
                  onChange={handleChange}
                  placeholder="Enter company name"
                />
              </Form.Group>

              {/* Email & Phone */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={editData.email || ""}
                      onChange={handleChange}
                      placeholder="publisher@email.com"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={editData.phone || ""}
                      onChange={handleChange}
                      placeholder="+84 123 456 789"
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Address & Website */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="address"
                      value={editData.address || ""}
                      onChange={handleChange}
                      placeholder="Enter address"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Website</Form.Label>
                    <Form.Control
                      type="text"
                      name="website"
                      value={editData.website || ""}
                      onChange={handleChange}
                      placeholder="https://example.com"
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Established Year */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Established Year</Form.Label>
                    <Form.Control
                      type="number"
                      name="establishedYear"
                      value={editData.establishedYear || ""}
                      onChange={handleChange}
                      placeholder="e.g. 1995"
                    />
                  </Form.Group>
                </Col>

                {/* Status */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="isDeleted"
                      value={editData.isDeleted ? "true" : "false"}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          isDeleted: e.target.value === "true",
                        })
                      }
                    >
                      <option value="false">Active</option>
                      <option value="true">Inactive</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* Avatar URL + Preview */}
              <Row className="align-items-center">
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Logo URL (optional)</Form.Label>
                    <Form.Control
                      type="text"
                      name="avatarUrl"
                      value={editData.avatarUrl || ""}
                      onChange={handleChange}
                      placeholder="Paste logo URL or leave empty"
                    />
                  </Form.Group>
                </Col>
                <Col md={4} className="text-center">
                  <img
                    src={editData.avatarUrl || "/default-publisher.png"}
                    alt="preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                    }}
                  />
                </Col>
              </Row>

              {/* Description */}
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  value={editData.description || ""}
                  onChange={handleChange}
                  placeholder="Short description about the publisher..."
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Publisher</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {publisherToDelete && (
            <div>
              <Alert variant="warning">
                <strong>Warning:</strong> This action cannot be undone.
              </Alert>

              <p>
                Are you sure you want to delete publisher{" "}
                <strong>{publisherToDelete.companyName}</strong>?
              </p>

              <div className={styles.deletePublisherInfo}>
                <strong>Publisher Details:</strong>
                <br />• Name: {publisherToDelete.companyName}
                <br />• Email: {publisherToDelete.email || "—"}
                <br />• Address: {publisherToDelete.address || "—"}
                <br />• Founded: {publisherToDelete.establishedYear || "—"}
                <br />• Status:{" "}
                {publisherToDelete.isDeleted ? "Inactive" : "Active"}
                <br />
                <br />
                <strong>Note:</strong> This will mark the publisher as inactive,
                not remove it permanently.
              </div>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete Publisher
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PublishersManagementPage;
