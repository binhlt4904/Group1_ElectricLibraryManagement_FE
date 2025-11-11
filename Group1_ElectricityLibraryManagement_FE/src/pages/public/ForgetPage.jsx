import React, { useState, useContext} from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import {PersonFill} from 'react-bootstrap-icons';
import styles from './LoginPage.module.css';
import auth from '../../api/auth';
const ForgetPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsSuccess(false);


    if (!email) {
        setMessage("Email is required");
        setIsSuccess(false);
        return;
    }

    try {
      const forgetPasswordRequest = {email};
      await auth.forgetPassword(forgetPasswordRequest);
      setIsSuccess(true);
      setMessage("Link that reset password, is sent to your email!");
    } catch (error) {
      setMessage(error.message);
      setIsSuccess(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className={`custom-card ${styles.loginCard}`}>
              <Card.Body className={styles.cardBody}>
                <div className={styles.header}>
                  <h1 className={styles.title}>Find Your Account</h1>
                  <p className={styles.subtitle}>Please enter your fpt.edu email to search for your account.</p>
                </div>

                {message && (
                  <Alert variant={isSuccess ? "success": "danger"}>{message}</Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className={styles.label}>
                      <PersonFill className="me-2" />
                      FPT email
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="email"
                      value={email}
                      onChange={((e) => setEmail(e.target.value))}
                      placeholder="Enter your email"
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    className="btn-primary-solid w-100 mb-3"
                    size="lg"
                    disabled={isSuccess}
                  >
                    {isSuccess ? 'Processing...' : 'Search'}
                  </Button>
                </Form>
                
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgetPage;
