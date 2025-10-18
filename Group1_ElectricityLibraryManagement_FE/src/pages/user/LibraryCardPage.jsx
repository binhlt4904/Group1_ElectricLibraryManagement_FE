import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { Download, Printer, QrCode, PersonFill, CalendarFill, CreditCardFill } from 'react-bootstrap-icons';
import styles from './LibraryCardPage.module.css';

const LibraryCardPage = () => {
  const [showDownloadAlert, setShowDownloadAlert] = useState(false);
  
  // Mock user data - replace with actual user data from context/API
  const userData = {
    firstName: 'John',
    lastName: 'Doe',
    memberId: 'EL2024001234',
    card_number: 'EL2024001234', // ERD attribute
    membershipType: 'Premium',
    issueDate: '2024-01-15',
    issue_date: '2024-01-15', // ERD attribute
    expirationDate: '2025-01-15',
    expiry_date: '2025-01-15', // ERD attribute
    status: 'Active', // ERD attribute
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, City, State 12345',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  };

  const handleDownload = () => {
    // Simulate download functionality
    setShowDownloadAlert(true);
    setTimeout(() => setShowDownloadAlert(false), 3000);
    console.log('Downloading library card...');
  };

  const handlePrint = () => {
    // Simulate print functionality
    window.print();
    console.log('Printing library card...');
  };

  const getMembershipColor = (type) => {
    switch (type) {
      case 'Premium': return 'warning';
      case 'Standard': return 'primary';
      case 'Student': return 'info';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadgeVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'expired':
        return 'danger';
      case 'suspended':
        return 'warning';
      case 'pending':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const isExpiringSoon = () => {
    const expirationDate = new Date(userData.expirationDate);
    const today = new Date();
    const daysUntilExpiration = Math.ceil((expirationDate - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration <= 30;
  };

  return (
    <div className={styles.libraryCardPage}>
      <Container>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <h1 className={styles.pageTitle}>My Library Card</h1>
            <p className={styles.pageSubtitle}>
              Your digital library card for accessing all library services
            </p>
          </Col>
        </Row>

        {showDownloadAlert && (
          <Alert variant="success" className={styles.alert}>
            Library card downloaded successfully!
          </Alert>
        )}

        {/* Expiration Warning */}
        {isExpiringSoon() && (
          <Alert variant="warning" className={styles.expirationAlert}>
            <strong>Card Expiring Soon!</strong> Your library card expires on {formatDate(userData.expirationDate)}. 
            Please renew your membership to continue accessing library services.
          </Alert>
        )}

        <Row className="justify-content-center">
          <Col lg={8} xl={6}>
            {/* Digital Library Card */}
            <div className={styles.cardContainer}>
              <div className={styles.libraryCard}>
                {/* Card Front */}
                <div className={styles.cardFront}>
                  {/* Header */}
                  <div className={styles.cardHeader}>
                    <div className={styles.logoSection}>
                      <div className={styles.logoGrid}>
                        {[...Array(25)].map((_, i) => (
                          <div key={i} className={styles.logoPixel}></div>
                        ))}
                      </div>
                      <div className={styles.libraryName}>
                        <div className={styles.libraryTitle}>ELECTRICITY</div>
                        <div className={styles.librarySubtitle}>LIBRARY</div>
                      </div>
                    </div>
                    <Badge 
                      bg={getMembershipColor(userData.membershipType)}
                      className={styles.membershipBadge}
                    >
                      {userData.membershipType}
                    </Badge>
                  </div>

                  {/* Member Info */}
                  <div className={styles.memberSection}>
                    <div className={styles.photoSection}>
                      <img
                        src={userData.photo}
                        alt="Member Photo"
                        className={styles.memberPhoto}
                      />
                    </div>
                    <div className={styles.memberInfo}>
                      <h3 className={styles.memberName}>
                        {userData.firstName} {userData.lastName}
                      </h3>
                      <div className={styles.memberId}>
                        ID: {userData.memberId}
                      </div>
                      <div className={styles.memberDetails}>
                        <div className={styles.detailItem}>
                          <CalendarFill className={styles.detailIcon} />
                          <span>Expires: {formatDate(userData.expirationDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Barcode Section */}
                  <div className={styles.barcodeSection}>
                    <div className={styles.barcode}>
                      {[...Array(50)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`${styles.barcodeLine} ${Math.random() > 0.5 ? styles.thick : styles.thin}`}
                        ></div>
                      ))}
                    </div>
                    <div className={styles.barcodeNumber}>{userData.memberId}</div>
                  </div>
                </div>

                {/* Card Back */}
                <div className={styles.cardBack}>
                  <div className={styles.backHeader}>
                    <h4>Library Services</h4>
                  </div>
                  <div className={styles.servicesList}>
                    <div className={styles.serviceItem}>✓ Borrow books, audiobooks, and digital media</div>
                    <div className={styles.serviceItem}>✓ Access computers and WiFi</div>
                    <div className={styles.serviceItem}>✓ Reserve meeting rooms</div>
                    <div className={styles.serviceItem}>✓ Attend events and workshops</div>
                    <div className={styles.serviceItem}>✓ Access online databases</div>
                  </div>
                  <div className={styles.contactInfo}>
                    <h5>Contact Information</h5>
                    <p>📧 info@electricitylibrary.org</p>
                    <p>📞 (555) 123-BOOK</p>
                    <p>🌐 www.electricitylibrary.org</p>
                  </div>
                  <div className={styles.qrSection}>
                    <div className={styles.qrCode}>
                      <QrCode size={60} />
                    </div>
                    <small>Scan for mobile access</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Actions */}
            <div className={styles.cardActions}>
              <Button
                variant="primary"
                size="lg"
                onClick={handleDownload}
                className={styles.actionButton}
              >
                <Download className="me-2" />
                Download Card
              </Button>
              <Button
                variant="outline-primary"
                size="lg"
                onClick={handlePrint}
                className={styles.actionButton}
              >
                <Printer className="me-2" />
                Print Card
              </Button>
            </div>

            {/* Member Information Card */}
            <Card className={`custom-card ${styles.infoCard} mt-4`}>
              <Card.Header className={styles.infoCardHeader}>
                <h4 className={styles.infoCardTitle}>
                  <PersonFill className="me-2" />
                  Member Information
                </h4>
              </Card.Header>
              <Card.Body className={styles.infoCardBody}>
                <Row>
                  <Col md={6}>
                    <div className={styles.infoGroup}>
                      <label className={styles.infoLabel}>Full Name</label>
                      <div className={styles.infoValue}>
                        {userData.firstName} {userData.lastName}
                      </div>
                    </div>
                    <div className={styles.infoGroup}>
                      <label className={styles.infoLabel}>Card Number</label>
                      <div className={styles.infoValue}>{userData.card_number}</div>
                    </div>
                    <div className={styles.infoGroup}>
                      <label className={styles.infoLabel}>Membership Type</label>
                      <div className={styles.infoValue}>
                        <Badge bg={getMembershipColor(userData.membershipType)}>
                          {userData.membershipType}
                        </Badge>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className={styles.infoGroup}>
                      <label className={styles.infoLabel}>Issue Date</label>
                      <div className={styles.infoValue}>{formatDate(userData.issue_date)}</div>
                    </div>
                    <div className={styles.infoGroup}>
                      <label className={styles.infoLabel}>Expiration Date</label>
                      <div className={`${styles.infoValue} ${isExpiringSoon() ? styles.expiring : ''}`}>
                        {formatDate(userData.expiry_date)}
                        {isExpiringSoon() && <span className={styles.expiringText}> (Expiring Soon)</span>}
                      </div>
                    </div>
                    <div className={styles.infoGroup}>
                      <label className={styles.infoLabel}>Status</label>
                      <div className={styles.infoValue}>
                        <Badge bg={getStatusBadgeVariant(userData.status)}>{userData.status}</Badge>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Digital Wallet Integration */}
            <Card className={`custom-card ${styles.walletCard} mt-4`}>
              <Card.Header className={styles.walletCardHeader}>
                <h4 className={styles.walletCardTitle}>
                  <CreditCardFill className="me-2" />
                  Add to Digital Wallet
                </h4>
              </Card.Header>
              <Card.Body className={styles.walletCardBody}>
                <p className={styles.walletDescription}>
                  Add your library card to your phone's digital wallet for quick access at the library.
                </p>
                <div className={styles.walletButtons}>
                  <Button variant="dark" className={styles.walletButton}>
                    Add to Apple Wallet
                  </Button>
                  <Button variant="outline-dark" className={styles.walletButton}>
                    Add to Google Pay
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

export default LibraryCardPage;
