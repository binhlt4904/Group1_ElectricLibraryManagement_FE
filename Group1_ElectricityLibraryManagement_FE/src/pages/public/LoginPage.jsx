import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { Eye, EyeSlash, PersonFill, LockFill } from 'react-bootstrap-icons';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Login attempt:', formData);
      // Handle successful login
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
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
                  <h1 className={styles.title}>Welcome Back</h1>
                  <p className={styles.subtitle}>Sign in to your library account</p>
                </div>

                {errors.general && (
                  <Alert variant="danger" className={styles.alert}>
                    {errors.general}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className={styles.label}>
                      <PersonFill className="me-2" />
                      Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      isInvalid={!!errors.email}
                      className={styles.input}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className={styles.label}>
                      <LockFill className="me-2" />
                      Password
                    </Form.Label>
                    <div className={styles.passwordContainer}>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        isInvalid={!!errors.password}
                        className={styles.passwordInput}
                      />
                      <Button
                        variant="link"
                        className={styles.passwordToggle}
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                      >
                        {showPassword ? <EyeSlash /> : <Eye />}
                      </Button>
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className={styles.formOptions}>
                    <Form.Check
                      type="checkbox"
                      id="remember-me"
                      label="Remember me"
                      className={styles.checkbox}
                    />
                    <Button variant="link" className={styles.forgotPassword}>
                      Forgot password?
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="btn-primary-solid w-100 mb-3"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </Form>

                <div className={styles.divider}>
                  <span>or</span>
                </div>

                <div className={styles.socialLogin}>
                  <Button variant="outline-primary" className="w-100 mb-2">
                    Continue with Google
                  </Button>
                  <Button variant="outline-dark" className="w-100">
                    Continue with Facebook
                  </Button>
                </div>

                <div className={styles.footer}>
                  <p>
                    Don't have an account?{' '}
                    <Button variant="link" className={styles.signupLink}>
                      Sign up here
                    </Button>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
