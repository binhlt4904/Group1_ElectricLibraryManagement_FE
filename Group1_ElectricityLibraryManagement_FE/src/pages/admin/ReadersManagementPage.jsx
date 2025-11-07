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

/** Chuẩn hoá nhiều định dạng lỗi BE về { field: message } */
function parseFieldErrors(err) {
  const map = {};
  const data = err?.response?.data ?? err?.data ?? err;

  if (data?.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
    Object.entries(data.errors).forEach(([k, v]) => {
      map[k] = Array.isArray(v) ? v[0] : String(v);
    });
  }

  if (Array.isArray(data?.fieldErrors)) {
    data.fieldErrors.forEach(e => {
      if (e?.field) map[e.field] = e?.message || 'Invalid';
    });
  }

  if (Array.isArray(data?.violations)) {
    data.violations.forEach(v => {
      if (v?.fieldName) map[v.fieldName] = v?.message || 'Invalid';
    });
  }

  if (Array.isArray(data?.details)) {
    data.details.forEach(d => {
      const key = d?.field || d?.propertyPath;
      if (key) map[key] = d?.message || 'Invalid';
    });
  }

  if (!Object.keys(map).length && data?.message) {
    map._common = String(data.message);
  }

  if (map['full_name'] && !map['fullName']) map['fullName'] = map['full_name'];

  return map;
}

const isDeletedStatus = (s) => String(s || '').toUpperCase() === 'DELETED';

const ReadersManagementPage = () => {
  // filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // paging
  const [currentPage, setCurrentPage] = useState(1);
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
    password: '',
  });
  const [editErrors, setEditErrors] = useState({});

  // delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // detail modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [detail, setDetail] = useState(null);

  // ===== LOAD DATA =====
  const loadData = async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await accountManagementApi.findReaders({
        full_name: searchTerm,
        status: statusFilter === 'ALL' ? '' : statusFilter,
        page: currentPage - 1,
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

  const toast = (variant, message) => {
    setAlertVariant(variant);
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2500);
  };

  // ===== CRUD =====
  const openEdit = (u) => {
    if (isDeletedStatus(u?.status)) return;
    setEditErrors({});
    setEditForm({
      id: u.id,
      username: u.username ?? '',
      fullName: u.fullName ?? '',
      email: u.email ?? '',
      phone: u.phone ?? '',
      status: u.status ?? 'ACTIVE',
      password: '',
    });
    setShowEditModal(true);
  };

  const submitEdit = async () => {
    if (!editForm.id) return;
    setEditing(true);
    setEditErrors({});
    try {
      const payload = {
        username: editForm.username?.trim(),
        fullName: editForm.fullName?.trim(),
        email: editForm.email?.trim(),
        phone: editForm.phone?.trim(),
        status: editForm.status,
      };
      if (editForm.password?.trim()) {
        payload.password = editForm.password.trim();
      }
      await accountManagementApi.updateAccount(editForm.id, payload);
      setShowEditModal(false);
      toast('success', 'Reader updated successfully.');
      loadData();
    } catch (e) {
      console.error(e);
      const fieldMap = parseFieldErrors(e);
      if (Object.keys(fieldMap).length) {
        setEditErrors(fieldMap);
        if (fieldMap._common) toast('danger', fieldMap._common);
      } else {
        toast('danger', 'Update failed. Check fields and try again.');
      }
    } finally {
      setEditing(false);
    }
  };

  const openDelete = (u) => {
    if (isDeletedStatus(u?.status)) return;
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
      if (rows.length === 1 && currentPage > 1) {
        setCurrentPage((p) => Math.max(1, p - 1));
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

  const openDetail = async (accountId) => {
    if (!accountId) return;
    setShowDetailModal(true);
    setDetail(null);
    setDetailError('');
    setDetailLoading(true);
    try {
      const res = await accountManagementApi.getReaderDetail(accountId);
      setDetail(res?.data ?? null);
    } catch (e) {
      console.error(e);
      setDetailError('Không tải được chi tiết độc giả.');
    } finally {
      setDetailLoading(false);
    }
  };

  // ===== RENDER =====
  return (
    <div className={styles.readersManagementPage}>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>
              <People className="me-3" />
              Readers Management
            </h1>
            <p className={styles.pageSubtitle}>
              Manage reader accounts and status
            </p>
          </div>
        </Col>
      </Row>

      {showAlert && (
        <Alert variant={alertVariant} className={styles.alert}>
          {alertMessage}
        </Alert>
      )}

      {/* Filters */}
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

      {/* Table */}
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
                    <th>#</th>
                    <th>Username</th>
                    <th>Full name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-4">No data</td>
                    </tr>
                  ) : (
                    rows.map((u, idx) => {
                      const isDel = isDeletedStatus(u.status);
                      return (
                        <tr key={u.id ?? idx}>
                          <td>{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>
                          <td>{u.username ?? '—'}</td>
                          <td>{u.fullName ?? '—'}</td>
                          <td><Envelope /> {u.email ?? '—'}</td>
                          <td><Telephone /> {u.phone ?? '—'}</td>
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
                              <Button variant="outline-primary" size="sm" onClick={() => openDetail(u.id)}>
                                <Eye />
                              </Button>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                disabled={isDel}
                                onClick={() => !isDel && openEdit(u)}
                              >
                                <Pencil />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                disabled={isDel}
                                onClick={() => !isDel && openDelete(u)}
                              >
                                <Trash />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.paginationContainer}>
              <Pagination>
                <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} />
                {[...Array(totalPages)].map((_, i) => {
                  const n = i + 1;
                  return (
                    <Pagination.Item key={n} active={n === currentPage} onClick={() => setCurrentPage(n)}>
                      {n}
                    </Pagination.Item>
                  );
                })}
                <Pagination.Next onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Reader detail</Modal.Title></Modal.Header>
        <Modal.Body>
          {detailLoading ? (
            <div className="d-flex align-items-center gap-2">
              <Spinner animation="border" size="sm" /><span>Loading…</span>
            </div>
          ) : detailError ? (
            <div className="text-danger">{detailError}</div>
          ) : detail ? (
            <div className="vstack gap-2">
              <div><b>Full name:</b> {detail.fullName}</div>
              <div><b>Email:</b> {detail.email}</div>
              <div><b>Username:</b> {detail.username}</div>
              <div><b>Phone:</b> {detail.phone}</div>
              <div><b>Status:</b> {detail.status}</div>
              <div><b>Reader code:</b> {detail.readerCode}</div>
            </div>
          ) : null}
        </Modal.Body>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Reader</Modal.Title></Modal.Header>
        <Modal.Body>
          {editErrors._common && <Alert variant="danger">{editErrors._common}</Alert>}
          <Form>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  value={editForm.username}
                  isInvalid={!!editErrors.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                />
                <Form.Control.Feedback type="invalid">{editErrors.username}</Form.Control.Feedback>
              </Col>
              <Col md={6}>
                <Form.Label>Full name</Form.Label>
                <Form.Control
                  value={editForm.fullName}
                  isInvalid={!!editErrors.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                />
                <Form.Control.Feedback type="invalid">{editErrors.fullName}</Form.Control.Feedback>
              </Col>
              <Col md={6}>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={editForm.email}
                  isInvalid={!!editErrors.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
                <Form.Control.Feedback type="invalid">{editErrors.email}</Form.Control.Feedback>
              </Col>
              <Col md={6}>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  value={editForm.phone}
                  isInvalid={!!editErrors.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
                <Form.Control.Feedback type="invalid">{editErrors.phone}</Form.Control.Feedback>
              </Col>
              <Col md={6}>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={editForm.password}
                  isInvalid={!!editErrors.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  placeholder="New password (optional)"
                />
                <Form.Control.Feedback type="invalid">{editErrors.password}</Form.Control.Feedback>
              </Col>
              <Col md={6}>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={editForm.status}
                  isInvalid={!!editErrors.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{editErrors.status}</Form.Control.Feedback>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)} disabled={editing}>Cancel</Button>
          <Button variant="primary" onClick={submitEdit} disabled={editing}>
            {editing ? 'Saving…' : 'Save changes'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title><ExclamationTriangleFill className="me-2 text-danger" />Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteTarget && (
            <>
              <p>Are you sure you want to delete this reader?</p>
              <div>
                <b>Username:</b> {deleteTarget.username}<br />
                <b>Full name:</b> {deleteTarget.fullName}<br />
                <b>Email:</b> {deleteTarget.email}<br />
                <b>Phone:</b> {deleteTarget.phone}
              </div>
              <p className="text-danger mt-2"><small>This action cannot be undone.</small></p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={deleting}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReadersManagementPage;
