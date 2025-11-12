import React, { useState} from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { PersonFill} from 'react-bootstrap-icons';
import styles from './LoginPage.module.css';
import auth from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
const ResetPasswordPage = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
  const handleSubmit = async (e) => {
    console.log("Reset token: ", token);
    e.preventDefault();
    setMessage(null);
    setIsSuccess(false);

    if (!password || !confirmPassword) {
        setMessage("All fields are required");
        setIsSuccess(false);
        return;
    }

    if (password !== confirmPassword) {
        setMessage("Passwords do not match");
        setIsSuccess(false);
        return;
    }

    if (password.length < 6) {
        setMessage("Password must be at least 6 characters long");
        setIsSuccess(false);
        return;
    }

    try {
      const resetPasswordRequest = {newPassword: password};
      await auth.resetPassword(token, resetPasswordRequest);
      setIsSuccess(true);
      setMessage("Reset password successful!. You can login with your new password.");
        setTimeout(() => navigate("/login"), 1000);
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
                  <h1 className={styles.title}>Set new password</h1>
                  <p className={styles.subtitle}>Please enter your password for your account.</p>
                </div>

                {message && (
                  <Alert variant={isSuccess ? "success": "danger"}>{message}</Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className={styles.label}>
                          <PersonFill className="me-2" />
                          New password: 
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="password"
                          value={password}
                          onChange={((e) => setPassword(e.target.value))}
                          placeholder="Enter your new password"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className={styles.label}>
                          <PersonFill className="me-2" />
                          Confirm new password:
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="confirmPassword"
                          value={confirmPassword}
                          onChange={((e) => setConfirmPassword(e.target.value))}
                          placeholder="Comfirm new password"
                        />
                    </Form.Group>
                    <div className={`${styles.formOptions} d-flex justify-content-end`}>
                        <Button variant="link" className={styles.forgotPassword} onClick={() => navigate("/login")}>
                            Login Page
                        </Button>
                    </div>

                      <Button
                        type="submit"
                        className="btn-primary-solid w-100 mb-3"
                        size="lg"
                        disabled={isSuccess}
                      >
                        {isSuccess ? 'Processing...' : 'Change'}
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

export default ResetPasswordPage;
