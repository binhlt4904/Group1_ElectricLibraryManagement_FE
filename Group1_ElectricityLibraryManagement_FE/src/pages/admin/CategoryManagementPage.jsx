import React, { useEffect, useMemo, useState } from "react";
import {
  Row, Col, Card, Table, Form, InputGroup, Button, Spinner, Alert, Badge, Modal
} from "react-bootstrap";
import { Search, Tag, Pencil, Trash, ArrowCounterclockwise, Plus } from "react-bootstrap-icons";
import categoryManagementApi from "../../api/admin/categoryManagementApi";

/** Chuẩn hoá lỗi trả về từ BE về { fieldErrors, common } */
const parseBackendError = (err) => {
  const d = err?.response?.data ?? err?.data ?? err ?? {};
  const fieldErrors = {};
  let common = "";

  // các format thường gặp
  if (typeof d.message === "string" && d.message.trim()) common = d.message.trim();
  if (!common && typeof d.error === "string" && d.error.trim()) common = d.error.trim();

  // Spring validation: Map<String, String> errors
  if (d.errors && typeof d.errors === "object" && !Array.isArray(d.errors)) {
    Object.entries(d.errors).forEach(([k, v]) => (fieldErrors[k] = Array.isArray(v) ? v[0] : String(v)));
  }

  // List violations/details/fieldErrors
  ["violations", "details", "fieldErrors"].forEach((key) => {
    if (Array.isArray(d[key])) {
      d[key].forEach((it) => {
        const field = it.field || it.fieldName || it.propertyPath || it.name;
        const msg = it.message || it.defaultMessage || it.description;
        if (field && msg) fieldErrors[field] = msg;
      });
    }
  });

  // Nếu phát hiện thông điệp kiểu duplicate/exist → đổ vào field name khi chưa có
  if (!fieldErrors.name && /exist|already|duplicate/i.test(common || "")) {
    fieldErrors.name = common;
    common = "";
  }

  // Nếu hoàn toàn không có message cụ thể
  if (!common && !Object.keys(fieldErrors).length) {
    common = "Something went wrong. Please try again.";
  }

  return { fieldErrors, common };
};

const CategoryManagementPage = () => {
  // filters
  const [keyword, setKeyword] = useState("");
  const [deletedFilter, setDeletedFilter] = useState("ALL"); // ALL | ACTIVE | DELETED

  // data
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // toast đơn giản
  const [toast, setToast] = useState({ show: false, variant: "success", message: "" });
  const showToast = (variant, message) => {
    setToast({ show: true, variant, message });
    setTimeout(() => setToast({ show: false, variant, message: "" }), 2200);
  };

  // Create / Edit modal + lỗi
  const [showEditModal, setShowEditModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ id: null, name: "" });
  const isUpdate = useMemo(() => form.id !== null && form.id !== undefined, [form]);
  const [fieldErrors, setFieldErrors] = useState({}); // { name: '...' }
  const [commonError, setCommonError] = useState(""); // lỗi chung trong modal

  // Delete / Restore modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // 'delete' | 'restore'
  const [target, setTarget] = useState(null); // {id,name}

  const fetchList = async () => {
    setLoading(true); setErr("");
    try {
      const isDeleted = deletedFilter === "ALL" ? null : (deletedFilter === "DELETED");
      const res = await categoryManagementApi.getAll({ keyword, isDeleted });
      setRows(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      setErr("Failed to load categories.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); /* eslint-disable-next-line */ }, [deletedFilter]);

  const onSearch = (e) => { e?.preventDefault?.(); fetchList(); };

  // ===== Create / Edit =====
  const openCreate = () => {
    setForm({ id: null, name: "" });
    setFieldErrors({});
    setCommonError("");
    setShowEditModal(true);
  };
  const openEdit = (row) => {
    if (row?.isDeleted) return;
    setForm({ id: row.id, name: row.name || "" });
    setFieldErrors({});
    setCommonError("");
    setShowEditModal(true);
  };

  const submitForm = async () => {
    // FE validate cơ bản
    if (!form.name?.trim()) {
      setFieldErrors({ name: "Name is required." });
      setCommonError("");
      return;
    }

    setEditing(true);
    setFieldErrors({});
    setCommonError("");

    try {
      const payload = { name: form.name.trim() };

      // GIỮ NGUYÊN cách gọi API của bạn
      if (isUpdate) {
        await categoryManagementApi.update({ id: form.id, name: payload.name });
        showToast("success", "Category updated.");
      } else {
        await categoryManagementApi.create(payload);
        showToast("success", "Category created.");
      }

      setShowEditModal(false);   // chỉ đóng khi thành công
      fetchList();
    } catch (e) {
      // —— Hiển thị đúng lỗi từ BE & KHÔNG đóng modal ——
      const { fieldErrors: fe, common } = parseBackendError(e);
      setFieldErrors(fe);
      setCommonError(common);
    } finally {
      setEditing(false);
    }
  };

  // ===== Delete / Restore =====
  const openDelete = (row) => {
    if (row?.isDeleted) return;
    setTarget(row);
    setConfirmAction("delete");
    setShowConfirmModal(true);
  };
  const openRestore = (row) => {
    if (!row?.isDeleted) return;
    setTarget(row);
    setConfirmAction("restore");
    setShowConfirmModal(true);
  };
  const doConfirm = async () => {
    if (!target?.id || !confirmAction) return;
    setConfirmLoading(true);
    try {
      if (confirmAction === "delete") {
        await categoryManagementApi.remove(target.id);
        showToast("success", "Category deleted.");
      } else {
        await categoryManagementApi.restore(target.id);
        showToast("success", "Category restored.");
      }
      setShowConfirmModal(false);
      setTarget(null);
      setConfirmAction(null);
      fetchList();
    } catch (e) {
      const { common } = parseBackendError(e);
      showToast("danger", common);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h2 className="d-flex align-items-center gap-2 mb-1">
                <Tag /> Category Management
              </h2>
              <div className="text-muted">Search by name & filter by status</div>
            </div>
            <div>
              <Button variant="primary" onClick={openCreate}>
                <Plus className="me-1" /> Create Category
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {toast.show && <Alert variant={toast.variant}>{toast.message}</Alert>}
      {err && <Alert variant="danger">{err}</Alert>}

      {/* Filters */}
      <Row className="mb-3">
        <Col lg={6} className="mb-2">
          <Form onSubmit={onSearch}>
            <InputGroup>
              <Form.Control
                placeholder="Search by name…"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <Button type="submit"><Search /></Button>
            </InputGroup>
          </Form>
        </Col>
        <Col lg={3} className="mb-2">
          <Form.Select
            value={deletedFilter}
            onChange={(e) => setDeletedFilter(e.target.value)}
          >
            <option value="ALL">All status</option>
            <option value="ACTIVE">Active</option>
            <option value="DELETED">Deleted</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Table */}
      <Card>
        <Card.Body>
          {loading ? (
            <div className="d-flex align-items-center gap-2">
              <Spinner animation="border" size="sm" />
              <span>Loading…</span>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th style={{ width: 70 }}>#</th>
                    <th>Name</th>
                    <th style={{ width: 150 }}>Status</th>
                    <th style={{ width: 220 }}>Created</th>
                    <th style={{ width: 220 }}>Updated</th>
                    <th style={{ width: 220 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-4">No data</td></tr>
                  ) : rows.map((c, idx) => {
                    const isDeleted = !!c.isDeleted;
                    return (
                      <tr key={c.id ?? idx}>
                        <td>{idx + 1}</td>
                        <td>{c.name ?? "—"}</td>
                        <td>
                          {isDeleted ? <Badge bg="danger">DELETED</Badge> : <Badge bg="success">ACTIVE</Badge>}
                        </td>
                        <td>{c.createdDate ? new Date(c.createdDate).toLocaleString() : "—"}</td>
                        <td>{c.updatedDate ? new Date(c.updatedDate).toLocaleString() : "—"}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              title={isDeleted ? "Cannot edit a deleted category" : "Edit"}
                              disabled={isDeleted}
                              onClick={() => !isDeleted && openEdit(c)}
                            >
                              <Pencil />
                            </Button>

                            {!isDeleted ? (
                              <Button
                                variant="outline-danger"
                                size="sm"
                                title="Delete"
                                onClick={() => openDelete(c)}
                              >
                                <Trash />
                              </Button>
                            ) : (
                              <Button
                                variant="outline-success"
                                size="sm"
                                title="Restore"
                                onClick={() => openRestore(c)}
                              >
                                <ArrowCounterclockwise />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Create / Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isUpdate ? "Update Category" : "Create Category"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {commonError && <Alert variant="danger" className="mb-3">{commonError}</Alert>}
          <Form>
            <Form.Label>Name *</Form.Label>
            <Form.Control
              value={form.name}
              isInvalid={!!fieldErrors.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: "" });
              }}
              placeholder="Category name"
            />
            <Form.Control.Feedback type="invalid">
              {fieldErrors.name}
            </Form.Control.Feedback>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)} disabled={editing}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submitForm} disabled={editing}>
            {editing ? "Saving…" : (isUpdate ? "Save changes" : "Create")}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete / Restore Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {confirmAction === "delete" ? "Confirm Delete" : "Confirm Restore"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {target && (
            <>
              {confirmAction === "delete" ? (
                <p>Delete category <strong>{target.name}</strong>? This will mark it as deleted.</p>
              ) : (
                <p>Restore category <strong>{target.name}</strong>?</p>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)} disabled={confirmLoading}>
            Cancel
          </Button>
          <Button
            variant={confirmAction === "delete" ? "danger" : "success"}
            onClick={doConfirm}
            disabled={confirmLoading}
          >
            {confirmLoading ? "Processing…" : (confirmAction === "delete" ? "Delete" : "Restore")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CategoryManagementPage;
