import { Form, Button, Col, Row, FloatingLabel,Alert,Spinner } from "react-bootstrap";
import { useState,useContext } from 'react';
import { Redirect,useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const SignUp = () => {
  const location = useLocation();
  const [userName,setUserName]=useState('');
  const [phone,setPhoneNum]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [passwordConfirm,setPasswordConfirm]=useState('');
  const { loading, error, signUp, isAuthenticated } =
  useContext(AppContext);
  const [validated, setValidated] = useState(false);

  const submitForm = async (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    setValidated(true);
    e.preventDefault();
    await signUp({userName,email,password,passwordConfirm,phone})
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
        <Form noValidate validated={validated} onSubmit={submitForm}>
        {error && <Alert variant='danger'>{error}</Alert>}
          <Form.Text className="text-muted">
            Please enter your email and password
          </Form.Text>
          <FloatingLabel controlId="floatingInputUserName" label="Enter your name" className="mb-1">
            <Form.Control type="text" placeholder="John Doe" onChange={(e)=>setUserName(e.target.value)} value={userName} required />
          </FloatingLabel>
          <FloatingLabel controlId="floatingInputPhoneNum" label="Enter your phone number (optional)" className="mb-1">
            <Form.Control  type="tel" placeholder="+49 123 456 789 101" onChange={(e)=>setPhoneNum(e.target.value)} value={phone} />
          </FloatingLabel>
          <FloatingLabel controlId="floatingInputEmail" label="Email address" className="mb-1">
            <Form.Control  type="email" placeholder="name@example.com" onChange={(e)=>setEmail(e.target.value)} value={email} required />
          </FloatingLabel>
          <FloatingLabel controlId="floatingInputPassword" label="Password" className="mb-1">
            <Form.Control  type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} value={password} required />
          </FloatingLabel>
          <FloatingLabel controlId="floatingInputConfirmPassword" label="Confirm password" className="mb-3">
            <Form.Control type="password" placeholder="Confirm password" onChange={(e)=>setPasswordConfirm(e.target.value)} value={passwordConfirm} required />
          </FloatingLabel>
          <Form.Check
          required
          label="Agree to terms and conditions"
          feedback="You must agree before submitting."
        />
          <Button variant="primary" type="submit" className="w-100">
            Sign in
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default SignUp;

/*     "userName":"Garry",
    "email":"garry@mail.com",
    "password":"$up3Rp4$$w0RD" */