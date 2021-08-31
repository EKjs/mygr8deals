import { Form, Button, Col, Row, FloatingLabel,Alert,Spinner } from "react-bootstrap";
import { useState,useContext } from 'react';
import { Redirect,useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const SignIn = () => {
  const location = useLocation();
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const { loading, error, signIn, isAuthenticated } =
  useContext(AppContext);

  const submitForm = async (e) => {
    e.preventDefault();
    await signIn({email,password})
  };
  if (isAuthenticated)
    return (
      <Redirect
        to={{
          pathname: location.state ? location.state.next : '/',
          from: location.pathname
        }}
      />
    );
  if (loading) return <Spinner animation="border" variant="secondary" />;
  return (
    <Row className="justify-content-center mt-5">
      <Col md={4}>
        <Form onSubmit={submitForm}>
        {error && <Alert variant='danger'>{error}</Alert>}
          <Form.Text className="text-muted">
            Please enter your email and password
          </Form.Text>
          <FloatingLabel controlId="floatingInput" label="Email address">
            <Form.Control type="email" placeholder="name@example.com" onChange={(e)=>setEmail(e.target.value)} required />
          </FloatingLabel>
          <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
            <Form.Control type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} required />
          </FloatingLabel>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Remember me" /> {/* fake for now */}
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Sign in
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default SignIn;