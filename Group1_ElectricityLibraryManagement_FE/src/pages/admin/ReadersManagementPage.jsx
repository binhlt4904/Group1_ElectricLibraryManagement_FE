import React, { useEffect, useState } from 'react';
import {
  Row, Col, Card, Button, Table, Form, InputGroup, Pagination, Spinner, Modal, Alert
} from 'react-bootstrap';
import {
  People, Search, Eye, Pencil, Trash, Envelope, Telephone, ExclamationTriangleFill
} from 'react-bootstrap-icons';
import accountManagementApi from '../../api/admin/accountManagementApi';
import styles from './ReadersManagementPage.module.css';

const PAGE_SIZE = 10;

const ReadersManagementPage = () => {
  // filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL | ACTIVE | INACTIVE | DELETED

  // paging
  const [currentPage, setCurrentPage] = useState(1); // UI 1-based
  const [totalPages, setTotalPages] = useState(0);

  // data
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  // notifications
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  // edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    id: null,
    username: '',
    fullName: '',
    email: '',
    phone: '',
    status: 'ACTIVE',
    password: '',            // NEW
  });

  // delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await accountManagementApi.findReaders({
        full_name: searchTerm,
        status: statusFilter === 'ALL' ? '' : statusFilter, // ALL => không gửi status
        page: currentPage - 1,   // BE 0-based
        size: PAGE_SIZE,
      });
      const pageData = res?.data ?? { content: [], totalPages: 0 };
      setRows(pageData.content || []);
      setTotalPages(pageData.totalPages || 0);
    } catch (e) {
      console.error(e);
      setErr('Failed to load readers. Please try again.');
      setRows([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter]);

  const onSearch = (e) => {
    e?.preventDefault?.();
    setCurrentPage(1);
    loadData();
  };

  const openEdit = (u) => {
    setEditForm({
      id: u.id,
      username: u.username ?? '',
      fullName: u.fullName ?? '',
      email: u.email ?? '',
      phone: u.phone ?? '',
      status: u.status ?? 'ACTIVE',
      password: '',            // NEW: không fill mật khẩu cũ
    });
    setShowEditModal(true);
  };

  const submitEdit = async () => {
    if (!editForm.id) return;
    setEditing(true);
    try {
      const payload = {
        username: editForm.username?.trim(),
        fullName: editForm.fullName?.trim(),
        email: editForm.email?.trim(),
        phone: editForm.phone?.trim(),
        status: editForm.status,
      };
      if (editForm.password?.trim()) {
        payload.password = editForm.password.trim();   // NEW
      }
      await accountManagementApi.updateAccount(editForm.id, payload);
      setShowEditModal(false);
      toast('success', 'Reader updated successfully.');
      loadData();
    } catch (e) {
      console.error(e);
      toast('danger', 'Update failed. Check username and password and try again.');
    } finally {
      setEditing(false);
    }
  };


  const openDelete = (u) => {
    setDeleteTarget(u);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget?.id) return;
    setDeleting(true);
    try {
      await accountManagementApi.deleteAccount(deleteTarget.id);
      setShowDeleteModal(false);
      setDeleteTarget(null);
      toast('success', 'Reader deleted successfully.');
      // Nếu trang hiện tại rỗng sau khi xóa, lùi 1 trang rồi reload
      if (rows.length === 1 && currentPage > 1) {
        setCurrentPage((p) => Math.max(1, p - 1));
        // loadData sẽ tự chạy vì currentPage thay đổi
      } else {
        loadData();
      }
    } catch (e) {
      console.error(e);
      toast('danger', 'Delete failed. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const toast = (variant, message) => {
    setAlertVariant(variant);
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2500);
  };

  return (
    <div className={styles.readersManagementPage}>
      {/* Page Header */}
      <Row className="mb-4">
        <Col>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>
                <People className="me-3" />
                Readers Management
              </h1>
              <p className={styles.pageSubtitle}>
                Manage reader accounts and status
              </p>
            </div>
          </div>
        </Col>
      </Row>

      {showAlert && (
        <Alert variant={alertVariant} className={styles.alert}>
          {alertMessage}
        </Alert>
      )}

      {/* Filters (search fullName + status với ALL) */}
      <Row className="mb-4">
        <Col lg={6} className="mb-3">
          <Form onSubmit={onSearch}>
            <InputGroup size="lg">
              <Form.Control
                type="text"
                placeholder="Search by full name…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              <Button variant="primary" type="submit">
                <Search />
              </Button>
            </InputGroup>
          </Form>
        </Col>
        <Col lg={3} className="mb-3">
          <Form.Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            size="lg"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="DELETED">DELETED</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Readers Table */}
      <Card className={`custom-card ${styles.readersCard}`}>
        <Card.Body className={styles.readersCardBody}>
          {loading ? (
            <div className="d-flex align-items-center gap-2">
              <Spinner animation="border" size="sm" />
              <span>Loading…</span>
            </div>
          ) : err ? (
            <div className="text-danger">{err}</div>
          ) : (
            <div className={styles.tableContainer}>
              <Table responsive className={styles.readersTable}>
                <thead>
                  <tr>
                    <th style={{ width: 70 }}>#</th>
                    <th style={{ minWidth: 140 }}>Username</th>
                    <th style={{ minWidth: 180 }}>Full name</th>
                    <th style={{ minWidth: 220 }}>Email</th>
                    <th style={{ minWidth: 150 }}>Phone</th>
                    <th style={{ minWidth: 140 }}>Status</th>
                    <th style={{ width: 140 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-4">No data</td>
                    </tr>
                  ) : (
                    rows.map((u, idx) => (
                      <tr key={u.id ?? idx} className={styles.readerRow}>
                        <td>{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>

                        <td>{u.username ?? '—'}</td>

                        <td>{u.fullName ?? '—'}</td>

                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <Envelope /> <span>{u.email ?? '—'}</span>
                          </div>
                        </td>

                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <Telephone /> <span>{u.phone ?? '—'}</span>
                          </div>
                        </td>

                        <td>
                          <span
                            className={[
                              styles.statusPill,
                              (u.status === 'ACTIVE' && styles.statusActive) ||
                              (u.status === 'INACTIVE' && styles.statusInactive) ||
                              styles.statusDeleted
                            ].filter(Boolean).join(' ')}
                          >
                            {u.status ?? '—'}
                          </span>
                        </td>

                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              title="View"
                              onClick={() => console.log('view', u.id)}
                            >
                              <Eye />
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              title="Edit"
                              onClick={() => openEdit(u)}
                            >
                              <Pencil />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              title="Delete"
                              onClick={() => openDelete(u)}
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
          )}

          {/* Pagination (server-side) */}
          {totalPages > 1 && (
            <div className={styles.paginationContainer}>
              <Pagination>
                <Pagination.First
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                />
                {[...Array(totalPages)].map((_, i) => {
                  const n = i + 1;
                  return (
                    <Pagination.Item
                      key={n}
                      active={n === currentPage}
                      onClick={() => setCurrentPage(n)}
                    >
                      {n}
                    </Pagination.Item>
                  );
                })}
                <Pagination.Next
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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

      {/* Edit Modal */}
      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Reader</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  placeholder="reader01"
                />
              </Col>
              <Col md={6}>
                <Form.Label>Full name</Form.Label>
                <Form.Control
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  placeholder="Nguyen Van A"
                />
              </Col>
              <Col md={6}>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  placeholder="reader@library.com"
                />
              </Col>
              <Col md={6}>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  placeholder="0900000000"
                />
              </Col>

              {/* NEW: Password */}
              <Col md={6}>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  placeholder="New Password"
                />
                <Form.Text muted>Let empty if not change</Form.Text>
              </Col>

              <Col md={6}>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="DELETED">DELETED</option>
                </Form.Select>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)} disabled={editing}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submitEdit} disabled={editing}>
            {editing ? 'Saving…' : 'Save changes'}
          </Button>
        </Modal.Footer>
      </Modal>


      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <ExclamationTriangleFill className="me-2 text-danger" />
            Confirm Delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteTarget && (
            <>
              <p>Are you sure you want to delete this reader?</p>
              <div className={styles.deleteReaderInfo}>
                <strong>Username:</strong> {deleteTarget.username}<br />
                <strong>Full name:</strong> {deleteTarget.fullName}<br />
                <strong>Email:</strong> {deleteTarget.email}<br />
                <strong>Phone:</strong> {deleteTarget.phone}
              </div>
              <p className="text-danger mt-2">
                <small>This action cannot be undone.</small>
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReadersManagementPage;
