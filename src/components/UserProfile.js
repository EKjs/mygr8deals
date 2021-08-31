import axios from 'axios';
import {useEffect, useState,useContext} from 'react';
import { Row,Col, Button, Modal,Alert } from 'react-bootstrap';
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { AppContext } from "../context/AppContext";
import LoadingSpinner from './LoadingSpinner';

const UserProfile = () => {
    const { signOut } = useContext(AppContext);
    const [profileData, setProfileData] = useState({});
    const [loading,setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);

    const handleModalClose = () => setShowModal(false);
    const handleModalShow = () => setShowModal(true);

    const handleDeleteProfile = async () => {
        try {
            setLoading(true);
            const { data } = await axios.delete(`${process.env.REACT_APP_BE}users/${localStorage.getItem('userId')}`,{headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}});
            
            console.log(data);
            signOut();
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

    useEffect(()=>{
       const loadAdDetails = async ()=>{
        try {
            setLoading(true);
            const { data } = await axios.get(`${process.env.REACT_APP_BE}users/${localStorage.getItem('userId')}`,{headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}});
            setProfileData(data);
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

    if(loading)return <LoadingSpinner/>;
    return (<>
      <Row className="justify-content-center">
        {error && <Alert>{error}</Alert>}
        <Col>
          <Row className="justify-content-center">
            <Col sm={6}>
              <h4><small className="text-muted">User name: </small>{profileData.name}</h4>
              <h4><small className="text-muted">E-Mail: </small>{profileData.email}</h4>
              <h4><small className="text-muted">Phone number: </small>{profileData.phone}</h4>
              <h4><small className="text-muted">Registered on: </small>{new Date(profileData.registerDate).toLocaleString()}</h4>
              <h4><small className="text-muted">User type: </small>{profileData.userType}</h4>
            </Col>
            {profileData.storeId && profileData.storeTitle && <Col sm={6}>
            <h4><small className="text-muted">Store name: </small>{profileData.storeTitle}</h4>
                </Col>}
          </Row>
            {!profileData.storeId && !profileData.storeTitle && <Row className="justify-content-center"><Col sm={6}>
            <p>You don't have a store yet. You can <mark><Link to="/registerstore">register</Link></mark> one.</p>
                </Col></Row>}
                <Row className="justify-content-center">
            <Col sm={6}>

            <Button variant="outline-dark" as={Link} to="/editprofile"><PencilSquare /> Edit profile </Button>
            <Button variant="outline-danger" onClick={handleModalShow}><Trash/> Delete profile</Button>{' '}
            </Col>
            </Row>
        </Col>
      </Row>
      <Modal
      show={showModal}
      onHide={handleModalClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Do you really want to delete your profile?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        All your ads, your favotites and all your data will be deleted.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleModalClose}>
          No, missclicked!
        </Button>
        <Button variant="danger" onClick={handleDeleteProfile}>Yes, pls delete!</Button>
      </Modal.Footer>
    </Modal>
    </>
    );
}

export default UserProfile
