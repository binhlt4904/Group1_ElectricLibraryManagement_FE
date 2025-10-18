import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { PersonFill, EnvelopeFill, TelephoneFill, GeoAltFill, CalendarFill, CameraFill } from 'react-bootstrap-icons';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, City, State 12345',
    dateOfBirth: '1990-05-15',
    membershipType: 'Premium',
    joinDate: '2022-01-15'
  });

  const [originalData, setOriginalData] = useState({ ...formData });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setOriginalData({ ...formData });
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      console.log('Profile updated:', formData);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const getMembershipBadgeVariant = (type) => {
    switch (type) {
      case 'Premium': return 'warning';
      case 'Standard': return 'primary';
      case 'Student': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <div className={styles.profilePage}>
      <Container>
        {showAlert && (
          <Alert variant="success" className={styles.alert}>
            Profile updated successfully!
          </Alert>
        )}

        <Row>
          <Col lg={4}>
            {/* Profile Card */}
            <Card className={`custom-card ${styles.profileCard}`}>
              <Card.Body className={styles.profileCardBody}>
                <div className={styles.avatarSection}>
                  <div className={styles.avatarContainer}>
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                      alt="Profile"
                      className={styles.avatar}
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      className={styles.avatarButton}
                      disabled={!isEditing}
                    >
                      <CameraFill />
                    </Button>
                  </div>
                  <h3 className={styles.userName}>
                    {formData.firstName} {formData.lastName}
                  </h3>
                  <Badge 
                    bg={getMembershipBadgeVariant(formData.membershipType)}
                    className={styles.membershipBadge}
                  >
                    {formData.membershipType} Member
                  </Badge>
                </div>

                <div className={styles.memberInfo}>
                  <div className={styles.infoItem}>
                    <CalendarFill className={styles.infoIcon} />
                    <div>
                      <small className={styles.infoLabel}>Member Since</small>
                      <div className={styles.infoValue}>
                        {new Date(formData.joinDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long'
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.quickStats}>
                  <div className={styles.statItem}>
                    <div className={styles.statNumber}>24</div>
                    <div className={styles.statLabel}>Books Borrowed</div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statNumber}>3</div>
                    <div className={styles.statLabel}>Currently Reading</div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statNumber}>12</div>
                    <div className={styles.statLabel}>Wishlist Items</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8}>
            {/* Profile Details */}
            <Card className={`custom-card ${styles.detailsCard}`}>
              <Card.Header className={styles.cardHeader}>
                <h4 className={styles.cardTitle}>Personal Information</h4>
                <div className={styles.cardActions}>
                  {!isEditing ? (
                    <Button variant="primary" onClick={handleEdit}>
                      Edit Profile
                    </Button>
                  ) : (
                    <div className={styles.editActions}>
                      <Button variant="outline-secondary" onClick={handleCancel} className="me-2">
                        Cancel
                      </Button>
                      <Button variant="primary" onClick={handleSave}>
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>
              </Card.Header>
              <Card.Body className={styles.detailsBody}>
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className={styles.label}>
                          <PersonFill className="me-2" />
                          First Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={styles.input}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className={styles.label}>
                          <PersonFill className="me-2" />
                          Last Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={styles.input}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className={styles.label}>
                      <EnvelopeFill className="me-2" />
                      Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={styles.input}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className={styles.label}>
                      <TelephoneFill className="me-2" />
                      Phone Number
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={styles.input}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className={styles.label}>
                      <GeoAltFill className="me-2" />
                      Address
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={styles.input}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className={styles.label}>
                      <CalendarFill className="me-2" />
                      Date of Birth
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={styles.input}
                    />
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>

            {/* Account Settings */}
            <Card className={`custom-card ${styles.settingsCard} mt-4`}>
              <Card.Header className={styles.cardHeader}>
                <h4 className={styles.cardTitle}>Account Settings</h4>
              </Card.Header>
              <Card.Body>
                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h6>Email Notifications</h6>
                    <p className={styles.settingDescription}>
                      Receive notifications about due dates, new arrivals, and events
                    </p>
                  </div>
                  <Form.Check
                    type="switch"
                    id="email-notifications"
                    defaultChecked
                    className={styles.settingSwitch}
                  />
                </div>

                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h6>SMS Reminders</h6>
                    <p className={styles.settingDescription}>
                      Get text message reminders for due dates and holds
                    </p>
                  </div>
                  <Form.Check
                    type="switch"
                    id="sms-notifications"
                    defaultChecked
                    className={styles.settingSwitch}
                  />
                </div>

                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h6>Privacy Settings</h6>
                    <p className={styles.settingDescription}>
                      Make your reading history and reviews public
                    </p>
                  </div>
                  <Form.Check
                    type="switch"
                    id="privacy-settings"
                    className={styles.settingSwitch}
                  />
                </div>

                <hr className={styles.divider} />

                <div className={styles.dangerZone}>
                  <h6 className={styles.dangerTitle}>Danger Zone</h6>
                  <Button variant="outline-danger" size="sm">
                    Change Password
                  </Button>
                  <Button variant="outline-danger" size="sm" className="ms-2">
                    Delete Account
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProfilePage;
