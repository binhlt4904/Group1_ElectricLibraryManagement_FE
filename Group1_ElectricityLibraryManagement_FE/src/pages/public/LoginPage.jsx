import React, { useState, useContext} from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { Eye, EyeSlash, PersonFill, LockFill } from 'react-bootstrap-icons';
import styles from './LoginPage.module.css';
import auth from '../../api/auth';
import { jwtDecode } from 'jwt-decode';
import UserContext from "../../components/contexts/UserContext";
import { useNavigate } from 'react-router-dom';
const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const {setUserContext} = useContext(UserContext);

  const navigate = useNavigate();

  // const validateForm = () => {
  //   const newErrors = {};

  //   if (!formData.email) {
  //     newErrors.email = 'Email is required';
  //   } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
  //     newErrors.email = 'Email is invalid';
  //   }

  //   if (!formData.password) {
  //     newErrors.password = 'Password is required';
  //   } else if (formData.password.length < 6) {
  //     newErrors.password = 'Password must be at least 6 characters';
  //   }

  //   return newErrors;
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsSuccess(false);

    try {
      const userRequest = {username, password};
      const response = await auth.login(userRequest);

      const header = response.headers["Authorization"]
                            || response.headers["authorization"];
      const accessToken = header ? header.replace("Bearer ", "")
                                  : response.data.accessToken;
      console.log("Access token when log in: ",accessToken);
      if (!accessToken) {
        throw new Error("Access token not found in response");
      }
      localStorage.setItem("accessToken", accessToken);
      const decodedToken = jwtDecode(accessToken);
      const userExtracted = {
        username: decodedToken.sub,
        role: decodedToken.role,
        accountId: decodedToken.accountId,
      };
      console.log("User extracted in UserContext: ", userExtracted);
      setUserContext(userExtracted);
      setIsSuccess(true);
      setMessage("Login successful!");

      //navigate home page
      navigate("/")
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
                  <h1 className={styles.title}>Welcome Back</h1>
                  <p className={styles.subtitle}>Sign in to your library account</p>
                </div>

                {message && (
                  <Alert variant={isSuccess ? "success": "danger"}>{message}</Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className={styles.label}>
                      <PersonFill className="me-2" />
                      UserName
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={username}
                      onChange={((e) => setUsername(e.target.value))}
                      placeholder="Enter your username"
                    />
                    {/* <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback> */}
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className={styles.label}>
                      <LockFill className="me-2" />
                      Password
                    </Form.Label>
                    <div className={styles.passwordContainer}>
                      <Form.Control
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                      />
                    </div>
                    {/* <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback> */}
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
                    disabled={isSuccess}
                  >
                    {isSuccess ? 'Signing in...' : 'Sign In'}
                  </Button>
                </Form>
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
