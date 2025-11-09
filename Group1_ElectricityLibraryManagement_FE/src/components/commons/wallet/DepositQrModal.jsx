// src/components/wallet/DepositQrModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Modal, Button, Form, InputGroup, Alert } from "react-bootstrap";
import axios from "axios";
import walletApi from "../../../api/wallet";

const DepositQrModal = ({
  show,
  onHide,
  userId,
  bankCode = "TPB",
  accountNumber = "06159974001",
  accountName = "Le Tien Binh",
}) => {
  const [amount, setAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [transactionCode, setTransactionCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingPending, setExistingPending] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Edit amount in-place (PATCH)
  const [editAmountMode, setEditAmountMode] = useState(false);
  const [newAmount, setNewAmount] = useState("");

  // Khi mở modal: kiểm tra có PENDING không để khôi phục QR
  useEffect(() => {
    if (!show || !userId) return;

    const loadPending = async () => {
      try {
        setErrorMsg("");
        const res = await walletApi.getPendingTransactions(userId);
        const tx = res.data;
        console.log(tx)
        if (tx) {
          setExistingPending(tx);
          setAmount(tx.amount);
          setTransactionCode(tx.transactionCode);
          setSubmitted(true);
          setTimestamp(Date.now()); // buộc reload ảnh QR
        } else {
          // không có pending -> sẵn sàng tạo mới
          setExistingPending(null);
          setSubmitted(false);
          setAmount("");
          setTransactionCode("");
        }
      } catch (e) {
        setErrorMsg("Unable to check pending transaction. Please try again..");
      }
    };

    loadPending();
  }, [show, userId]);

  // Refresh QR mỗi 60s sau khi đã tạo (chỉ để cache-busting ảnh)
  useEffect(() => {
    if (!submitted) return;
    const itv = setInterval(() => setTimestamp(Date.now()), 60_000);
    return () => clearInterval(itv);
  }, [submitted]);

  const qrLink = useMemo(() => {
    const a = Number(amount) || 0;
    const info = encodeURIComponent(transactionCode || "");
    const name = encodeURIComponent(accountName);
    // timestamp chỉ để tránh cache, KHÔNG làm đổi transactionCode
    return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact.png?amount=${a}&addInfo=${info}&accountName=${name}&t=${timestamp}`;
  }, [amount, bankCode, accountNumber, accountName, transactionCode, timestamp]);

  const handleCreateQr = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Nếu đã có pending (khôi phục được), không cho tạo mới
    if (existingPending) {
      setSubmitted(true);
      return;
    }

    const value = Number(amount);
    if (!value || value <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const code = `NAP_UID${userId}_${Date.now()}`;
    setLoading(true);

    try {
      const res = await walletApi.handleTransaction(userId, value, code);

      if (res.status === 201 || res.status === 200) {
        // Tạo thành công -> refetch pending để lấy dữ liệu chuẩn từ server
        const p = await walletApi.getPendingTransactions(userId);
        const tx = p.data ?? { amount: value, transactionCode: code };
        setExistingPending(tx);
        setAmount(tx.amount);
        setTransactionCode(tx.transactionCode);
        setSubmitted(true);
        setTimestamp(Date.now());
      } else if (res.status === 409) {
        // Đã có pending -> khôi phục giao dịch đang chờ
        const p = await walletApi.getPendingTransactions(userId);
        const tx = p.data;
        if (tx) {
          setExistingPending(tx);
          setAmount(tx.amount);
          setTransactionCode(tx.transactionCode);
          setSubmitted(true);
          setTimestamp(Date.now());
        } else {
          setErrorMsg("You have a pending transaction.");
        }
      } else {
        setErrorMsg(res.data?.message || "Unable to create deposit transaction.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An error occurred while generating the QR code. Please try again..");
    } finally {
      setLoading(false);
    }
  };

  const copyContent = async () => {
    try {
      await navigator.clipboard.writeText(transactionCode);
    } catch {
      /* noop */
    }
  };

  // --- Đổi số tiền (PATCH amount, giữ nguyên transactionCode) ---
  const startEditAmount = () => {
    setNewAmount(String(amount || ""));
    setEditAmountMode(true);
  };

  const cancelEditAmount = () => {
    setEditAmountMode(false);
    setNewAmount("");
  };

  const saveNewAmount = async () => {
    const v = Number(newAmount);
    if (!v || v <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    console.log(existingPending)
    if (!existingPending?.id) {
      alert("No pending transactions found.");
      return;
    }
    try {
      setLoading(true);
      const res = await walletApi.updateAmountTransaction(existingPending.id, v);
      const updated = res.data ?? { ...existingPending, amount: v };
      setExistingPending(updated);
      setAmount(updated.amount);
      setEditAmountMode(false);
      setTimestamp(Date.now()); // reload ảnh QR
    } catch (e) {
      alert("Amount could not be updated. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Hủy giao dịch (cancel PENDING) ---
  const cancelPending = async () => {
    if (!existingPending?.id) return;
    try {
      setLoading(true);
      await walletApi.cancelTransaction(existingPending.id);
      // Clear state để user tạo mới
      setExistingPending(null);
      setSubmitted(false);
      setAmount("");
      setTransactionCode("");
      setEditAmountMode(false);
      setNewAmount("");
      setTimestamp(Date.now());
    } catch (e) {
      alert("Transaction could not be canceled. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>Top up your wallet</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {errorMsg && (
          <Alert variant="danger" className="mb-3">
            {errorMsg}
          </Alert>
        )}

        {existingPending && submitted && (
          <Alert variant="warning" className="mb-3">
            You have a <strong>PENDING</strong> transaction. Here is the QR code for that transaction.
            Please complete the transfer or update the amount if necessary.
          </Alert>
        )}

        {!submitted ? (
          <Form onSubmit={handleCreateQr}>
            <Form.Label>Số tiền muốn nạp (VNĐ)</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Text>₫</InputGroup.Text>
              <Form.Control
                type="number"
                min="1000"
                step="1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount (e.g 100000)"
                required
              />
            </InputGroup>
            <div className="d-flex justify-content-end">
              <Button type="submit" disabled={loading || submitted || !!existingPending}>
                {loading ? "Creating..." : "Create QR Code"}
              </Button>
            </div>
          </Form>
        ) : (
          <>
            <div className="p-3 bg-light rounded mb-3">
              <div><strong>Bank:</strong> TP Bank</div>
              <div><strong>Account Number:</strong> {accountNumber}</div>
              <div><strong>Account Owner:</strong> {accountName}</div>

              {!editAmountMode ? (
                <div className="d-flex align-items-center gap-2">
                  <strong>Amount:</strong>
                  <span>{Number(amount).toLocaleString()} VNĐ</span>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={startEditAmount}
                    disabled={!existingPending}
                  >
                    Change amount
                  </Button>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <Form.Control
                    type="number"
                    min="1000"
                    step="1000"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    style={{ maxWidth: 180 }}
                  />
                  <Button size="sm" onClick={saveNewAmount} disabled={loading}>
                    Save
                  </Button>
                  <Button size="sm" variant="outline-secondary" onClick={cancelEditAmount}>
                    Cancel
                  </Button>
                </div>
              )}

              <div className="d-flex align-items-center gap-2 mt-2">
                <strong>Content:</strong>
                <code className="text-primary">{transactionCode}</code>
                <Button variant="link" size="sm" onClick={copyContent}>Copy</Button>
              </div>
              <small className="text-muted">
                QR code refreshes every 60 seconds (no new transaction created).
              </small>
            </div>

            <div className="text-center">
              <img
                key={timestamp}
                src={qrLink}
                alt="QR chuyển khoản"
                style={{ width: 256, height: 256, border: "1px solid #eee" }}
              />
              <div className="mt-2">
                <small className="text-muted">
                  Scan with the banking app, enter the correct content for the system to automatically record.
                </small>
              </div>
            </div>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        {!submitted ? (
          <Button variant="secondary" onClick={onHide}>Đóng</Button>
        ) : (
          <>
            {/* Hủy giao dịch để nhập lại số tiền và tạo QR mới */}
            <Button
              variant="danger"
              onClick={cancelPending}
              disabled={!existingPending || loading}
              title="Cancel pending transaction to re-enter amount and generate new QR"
            >
              Cancel transaction
            </Button>

            <Button onClick={onHide}>Done</Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default DepositQrModal;
