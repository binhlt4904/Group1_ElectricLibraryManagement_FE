import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Badge,
  Spinner,
  Alert,
  Button,
  Modal,
} from 'react-bootstrap';
import {
  PersonFill,
  EnvelopeFill,
  TelephoneFill,
  CalendarFill,
  ShieldFillCheck,
} from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import styles from './ProfilePage.module.css';

import profileApi from '../../api/user/profile';
import UserContext from '../../components/contexts/UserContext';

const pickMessage = (err) =>
  err?.response?.data?.message ||
  err?.response?.data?.error ||
  err?.message ||
  'Unexpected error';

const SmartRow = ({
  icon,
  label,
  type = 'text',
  readValue,
  isEditing,
  inputRef,
  name,
}) => (
  <Form.Group className="mb-3">
    <Form.Label className={styles.label}>
      {icon} {label}
    </Form.Label>

    {!isEditing ? (
      <Form.Control
        type={type}
        value={readValue ?? ''}
        disabled
        readOnly
        className={styles.input}
      />
    ) : (
      <Form.Control
        ref={inputRef ?? null}
        type={type}
        name={name}
        defaultValue={readValue ?? ''}
        className={styles.input}
      />
    )}
  </Form.Group>
);

const ProfilePage = () => {
  const { user } = useContext(UserContext); // { username, role, accountId }
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [data, setData] = useState(null); // ReaderDetailDto | StaffDetailDto

  // Edit state (uncontrolled inputs để tránh mất focus)
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveAlert, setSaveAlert] = useState(null); // { variant: 'success'|'danger', text: string }

  // Change password modal state
  const [showChangePwdModal, setShowChangePwdModal] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [changePwdAlert, setChangePwdAlert] = useState(null); // { variant, text }

  // Refs cho 3 field được phép sửa
  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);

  // Refs cho change password
  const oldPwdRef = useRef(null);
  const newPwdRef = useRef(null);
  const confirmPwdRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await profileApi.get();
        if (mounted) setData(res);
      } catch (e) {
        if (mounted) setErr(pickMessage(e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const profileType = useMemo(() => {
    if (!data) return null;
    if ('readerCode' in data) return 'READER';
    if ('position' in data) return 'STAFF';
    return 'UNKNOWN';
  }, [data]);

  const roleFromContext = useMemo(() => {
    const r = Array.isArray(user?.role) ? user.role[0] : user?.role;
    return r ? String(r).toUpperCase().replace(/^ROLE_/, '') : undefined;
  }, [user]);

  const validate = (fullName, email, phone) => {
    if (!fullName) return 'Full name is required.';
    if (!email) return 'Email is required.';
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) return 'Email is invalid.';
    if (phone && !/^\+?[0-9]{8,15}$/.test(phone)) {
      return 'Phone is invalid (8-15 digits).';
    }
    return '';
  };

  const handleEdit = () => {
    setSaveAlert(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSaveAlert(null);
  };

  const handleSave = async () => {
    const fullName = fullNameRef.current?.value?.trim() ?? '';
    const email = emailRef.current?.value?.trim() ?? '';
    const phone = phoneRef.current?.value?.trim() ?? '';

    const v = validate(fullName, email, phone);
    if (v) {
      setSaveAlert({ variant: 'danger', text: v });
      return;
    }

    try {
      setSaving(true);
      setSaveAlert(null);

      const payload = { fullName, email, phone };
      const updated = await profileApi.update(payload);

      setData((prev) =>
        updated && typeof updated === 'object'
          ? { ...(prev || {}), ...updated }
          : { ...(prev || {}), ...payload },
      );

      setIsEditing(false);
      setSaveAlert({ variant: 'success', text: 'Saved successfully.' });
    } catch (e) {
      setSaveAlert({ variant: 'danger', text: pickMessage(e) });
    } finally {
      setSaving(false);
    }
  };

  // --- Change password handlers ---
  const openChangePwdModal = () => {
    setChangePwdAlert(null);
    if (oldPwdRef.current) oldPwdRef.current.value = '';
    if (newPwdRef.current) newPwdRef.current.value = '';
    if (confirmPwdRef.current) confirmPwdRef.current.value = '';
    setShowChangePwdModal(true);
  };

  const closeChangePwdModal = () => {
    if (changingPwd) return;
    setShowChangePwdModal(false);
  };

  const handleChangePassword = async () => {
    const oldPassword = oldPwdRef.current?.value ?? '';
    const newPassword = newPwdRef.current?.value ?? '';
    const confirmPassword = confirmPwdRef.current?.value ?? '';

    if (!oldPassword || !newPassword || !confirmPassword) {
      setChangePwdAlert({
        variant: 'danger',
        text: 'All fields are required.',
      });
      return;
    }

    if (newPassword.length < 6) {
      setChangePwdAlert({
        variant: 'danger',
        text: 'New password must be at least 6 characters.',
      });
      return;
    }

    if (newPassword === oldPassword) {
      setChangePwdAlert({
        variant: 'danger',
        text: 'New password must be different from current password.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setChangePwdAlert({
        variant: 'danger',
        text: 'Password confirmation does not match.',
      });
      return;
    }

    try {
      setChangingPwd(true);
      setChangePwdAlert(null);

      await profileApi.changePassword({ oldPassword, newPassword });

      setChangePwdAlert({
        variant: 'success',
        text: 'Password changed successfully.',
      });

      if (oldPwdRef.current) oldPwdRef.current.value = '';
      if (newPwdRef.current) newPwdRef.current.value = '';
      if (confirmPwdRef.current) confirmPwdRef.current.value = '';
    } catch (e) {
      setChangePwdAlert({
        variant: 'danger',
        text: pickMessage(e),
      });
    } finally {
      setChangingPwd(false);
    }
  };

  const TitleBar = ({ title }) => (
    <Card.Header className={styles.cardHeader}>
      <h4 className={styles.cardTitle}>{title}</h4>
      <div className={styles.cardActions}>
        {!isEditing ? (
          <Button variant="outline-secondary" onClick={handleEdit}>
            Edit
          </Button>
        ) : (
          <>
            <Button variant="primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
            <Button
              variant="outline-secondary"
              className="ms-2"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </Button>
          </>
        )}
      </div>
    </Card.Header>
  );

  const LeftCard = () => {
    const stableName = data?.fullName || user?.username || '';
    const badgeText =
      profileType === 'READER'
        ? 'READER'
        : profileType === 'STAFF'
        ? 'STAFF'
        : roleFromContext || 'USER';

    return (
      <Card className={`custom-card ${styles.profileCard}`}>
        <Card.Body className={styles.profileCardBody}>
          <div className={styles.welcomeBox}>
            <h1 className={styles.welcomeText}>Welcome</h1>
          </div>
          <h3 className={styles.userName}>{stableName}</h3>
          <Badge bg="secondary" className={styles.membershipBadge}>
            {badgeText}
          </Badge>

          <div className={styles.memberInfo}>
            {profileType === 'READER' && (
              <div className={styles.infoItem}>
                <PersonFill className={styles.infoIcon} />
                <div>
                  <small className={styles.infoLabel}>Reader Code</small>
                  <div className={styles.infoValue}>{data?.readerCode ?? '-'}</div>
                </div>
              </div>
            )}

            {profileType === 'STAFF' && (
              <>
                <div className={styles.infoItem}>
                  <PersonFill className={styles.infoIcon} />
                  <div>
                    <small className={styles.infoLabel}>Position</small>
                    <div className={styles.infoValue}>{data?.position ?? '-'}</div>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <CalendarFill className={styles.infoIcon} />
                  <div>
                    <small className={styles.infoLabel}>Join Date</small>
                    <div className={styles.infoValue}>{data?.joinDate ?? '-'}</div>
                  </div>
                </div>
              </>
            )}
          </div>

          {roleFromContext === 'ADMIN' && (
            <div className={styles.adminAccess}>
              <Button
                as={Link}
                to="/admin"
                variant="outline-primary"
                size="lg"
                className={styles.adminButton}
              >
                <ShieldFillCheck className="me-2" /> Access Admin Panel
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    );
  };

  const ReaderDetails = () => (
    <Card className={`custom-card ${styles.detailsCard}`}>
      <TitleBar title="Personal Information" />
      <Card.Body className={styles.detailsBody}>
        {saveAlert && <Alert variant={saveAlert.variant}>{saveAlert.text}</Alert>}

        <Form>
          <Row>
            <Col md={6}>
              <SmartRow
                icon={<PersonFill className="me-2" />}
                label="Full Name"
                name="fullName"
                readValue={data?.fullName}
                isEditing={isEditing}
                inputRef={fullNameRef}
              />
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className={styles.label}>
                  <PersonFill className="me-2" /> Username
                </Form.Label>
                <Form.Control
                  value={data?.username ?? ''}
                  disabled
                  readOnly
                  className={styles.input}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <SmartRow
                icon={<EnvelopeFill className="me-2" />}
                label="Email"
                type="email"
                name="email"
                readValue={data?.email}
                isEditing={isEditing}
                inputRef={emailRef}
              />
            </Col>
            <Col md={6}>
              <SmartRow
                icon={<TelephoneFill className="me-2" />}
                label="Phone"
                name="phone"
                readValue={data?.phone}
                isEditing={isEditing}
                inputRef={phoneRef}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className={styles.label}>
                  <PersonFill className="me-2" /> Reader Code
                </Form.Label>
                <Form.Control
                  value={data?.readerCode ?? ''}
                  disabled
                  readOnly
                  className={styles.input}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );

  // Staff card
  const StaffDetails = () => (
    <Card className={`custom-card ${styles.detailsCard}`}>
      <TitleBar title="Personal Information" />
      <Card.Body className={styles.detailsBody}>
        {saveAlert && <Alert variant={saveAlert.variant}>{saveAlert.text}</Alert>}

        <Form>
          <Row>
            <Col md={6}>
              <SmartRow
                icon={<PersonFill className="me-2" />}
                label="Full Name"
                name="fullName"
                readValue={data?.fullName}
                isEditing={isEditing}
                inputRef={fullNameRef}
              />
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className={styles.label}>
                  <PersonFill className="me-2" /> Username
                </Form.Label>
                <Form.Control
                  value={data?.username ?? ''}
                  disabled
                  readOnly
                  className={styles.input}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <SmartRow
                icon={<EnvelopeFill className="me-2" />}
                label="Email"
                type="email"
                name="email"
                readValue={data?.email}
                isEditing={isEditing}
                inputRef={emailRef}
              />
            </Col>
            <Col md={6}>
              <SmartRow
                icon={<TelephoneFill className="me-2" />}
                label="Phone"
                name="phone"
                readValue={data?.phone}
                isEditing={isEditing}
                inputRef={phoneRef}
              />
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className={styles.label}>
                  <PersonFill className="me-2" /> Position
                </Form.Label>
                <Form.Control
                  value={data?.position ?? ''}
                  disabled
                  readOnly
                  className={styles.input}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className={styles.label}>
                  <CalendarFill className="me-2" /> Join Date
                </Form.Label>
                <Form.Control
                  value={data?.joinDate ?? ''}
                  disabled
                  readOnly
                  className={styles.input}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className={styles.label}>
                  <CalendarFill className="me-2" /> Hire Date
                </Form.Label>
                <Form.Control
                  value={data?.hireDate ?? ''}
                  disabled
                  readOnly
                  className={styles.input}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );

  const AccountSettings = () => (
    <Card className={`custom-card ${styles.settingsCard} mt-4`}>
      <Card.Body>
        <h6 className={styles.settingsTitle}>Account Settings</h6>
        <p className={styles.settingsText}>
          Change your password regularly to keep your account secure.
        </p>
        <Button variant="outline-danger" size="sm" onClick={openChangePwdModal}>
          Change Password
        </Button>
      </Card.Body>
    </Card>
  );

  const ChangePasswordModal = () => (
    <Modal
      show={showChangePwdModal}
      onHide={closeChangePwdModal}
      centered
      backdrop="static"
    >
      <Modal.Header closeButton={!changingPwd}>
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className={styles.settingsText}>
          Enter your current password and choose a new, strong password.
        </p>

        {changePwdAlert && (
          <Alert variant={changePwdAlert.variant}>{changePwdAlert.text}</Alert>
        )}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label className={styles.label}>Current Password</Form.Label>
            <Form.Control
              type="password"
              ref={oldPwdRef}
              placeholder="Enter current password"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className={styles.label}>New Password</Form.Label>
            <Form.Control
              type="password"
              ref={newPwdRef}
              placeholder="Enter new password"
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label className={styles.label}>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              ref={confirmPwdRef}
              placeholder="Re-enter new password"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={closeChangePwdModal}
          disabled={changingPwd}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleChangePassword}
          disabled={changingPwd}
        >
          {changingPwd ? 'Updating…' : 'Update Password'}
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <Container fluid className={styles.pageWrapper}>
      <Row>
        <Col>
          <h2 className={styles.pageTitle}>My Profile</h2>
        </Col>
      </Row>

      {loading && (
        <div className="d-flex align-items-center gap-2">
          <Spinner animation="border" size="sm" /> <span>Loading...</span>
        </div>
      )}
      {!loading && err && (
        <Alert variant="danger" className="mt-2">
          {err}
        </Alert>
      )}

      {!loading && !err && data && (
        <>
          <Row className="mt-3">
            <Col xl={4} lg={5} className="mb-3">
              <LeftCard />
            </Col>
            <Col xl={8} lg={7}>
              {profileType === 'READER' && <ReaderDetails />}
              {profileType === 'STAFF' && <StaffDetails />}
              {profileType === 'UNKNOWN' && (
                <Alert variant="warning">
                  Unknown profile type. Please contact admin.
                </Alert>
              )}
              <AccountSettings />
            </Col>
          </Row>
          <ChangePasswordModal />
        </>
      )}
    </Container>
  );
};

export default ProfilePage;



