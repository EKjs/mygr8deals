import { useState,useEffect,useContext } from 'react';
import LoadingSpinner from './LoadingSpinner';
import axios from 'axios';
import { Col, Row,Form,FloatingLabel,Button,Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AppContext } from "../context/AppContext";

const EditProfile = () => {
    const { signOut } = useContext(AppContext);
    
    const [loading,setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userName, setUserName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [showAlert, setShowAlert] = useState('');

    useEffect(()=>{
        const loadAdDetails = async ()=>{
            try {
                setLoading(true);
                const { data } = await axios.get(`${process.env.REACT_APP_BE}users/${localStorage.getItem('userId')}`,{headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}});
                setUserName(data.name);
                setPhone(data.phone);
                setEmail(data.email);

                console.log(data);
                setLoading(false);
              } catch (error) {
                if (error.response) {
                  setError(error.response.data.error);
                  setTimeout(() => setError(null), 5000);
                  setLoading(false);
                } else {
                  setError(error.message);
                  setTimeout(() => setError(null), 5000);
                  setLoading(false);
                }
              }
           };
           loadAdDetails()
    },[]);

    const handleSaveChanges = async ()=>{
        const editedProfile={
            userName:userName,
            email:email,
            phone:phone,
        }
        try {
            setLoading(true);
            const { data } = await axios.put(`${process.env.REACT_APP_BE}users/${localStorage.getItem('userId')}`,editedProfile,{headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}});
            console.log(data);
            if (String(data.id)===localStorage.getItem('userId')){
                setShowAlert('You must re-login for the changes to take effect!');
                setTimeout(()=>signOut(),5000)
            }
            setLoading(false);
          } catch (error) {
            if (error.response) {
              setError(error.response.data.error);
              // setTimeout(() => setError(null), 5000);
              setLoading(false);
            } else {
              setError(error.message);
              // setTimeout(() => setError(null), 5000);
              setLoading(false);
            }
          }
       };

    if(loading)return <LoadingSpinner/>;
    if(showAlert)return (<Row className="justify-content-center"><Alert>{showAlert}</Alert></Row>)
    return (
        
            <Row className="justify-content-center">
                {error && <Alert>{error}</Alert>}
          <Col sm={4}>
          <FloatingLabel
              controlId="floatingInputUserName"
              label="Enter your name (required)"
              className="mb-1"
            >
              <Form.Control
                type="text"
                placeholder="Some username"
                onChange={(e) => setUserName(e.target.value)}
                value={userName}
                required
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="floatingInputEmail"
              label="Enter your email (required)"
              className="mb-1"
            >
              <Form.Control
                type="text"
                placeholder="Some email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="floatingInputPhoneNumber"
              label="Enter your name (required)"
              className="mb-2"
            >
              <Form.Control
                type="text"
                placeholder="Some phone number"
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
                required
              />
            </FloatingLabel>
            <div className="d-grid gap-2">
            <Button variant="primary" size="sm" onClick={handleSaveChanges}>Save changes</Button>
            <Button variant="secondary" size="sm" as={Link} to="/">Cancel</Button>

            </div>
          </Col>
          </Row>
    )
}

export default EditProfile
