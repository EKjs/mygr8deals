import axios from 'axios';
import {useEffect, useState} from 'react';
import { Row,Col, Button, Modal,Alert } from 'react-bootstrap';
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import { Link,useHistory } from 'react-router-dom';
import { Map, Marker } from "pigeon-maps";
import LoadingSpinner from './LoadingSpinner';

const StoreProfile = () => {
    const [storeData, setStoreData] = useState({});
    const [loading,setLoading] = useState(true);
    const [error, setError] = useState(null);
    const hist = useHistory();

    const [showModal, setShowModal] = useState(false);

    const handleModalClose = () => setShowModal(false);
    const handleModalShow = () => setShowModal(true);

    const handleDeleteStore = async () => {
        try {
            setLoading(true);
            const { data } = await axios.delete(`${process.env.REACT_APP_BE}stores/${storeData.id}`,{headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}});
            if (data.id===storeData.id){
              setLoading(false);
              hist.push(`/myprofile`)
            }  
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
       const loadStoreDetails = async ()=>{
        try {
            setLoading(true);
            const { data } = await axios.get(`${process.env.REACT_APP_BE}stores/my/`,{headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}});
            setStoreData(data);
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
       loadStoreDetails();
    },[]);

    if(loading)return <LoadingSpinner/>;
    if(!storeData)return (
      <Row className="justify-content-center">
        <Col sm={6}>
          <p className='text-center'>
            You don't have a store yet. You can{" "}
            <mark>
              <Link to="/registerstore">register</Link>
            </mark>{" "}
            one.
          </p>
        </Col>
      </Row>
    );

    return (
      <>
        <Row className="justify-content-center">
          {error && <Alert>{error}</Alert>}
          <Col sm={6}>
            <Row>
              <Col className='p-3'>
                <h4>
                  {storeData.title}
                </h4>
                <p>{storeData.description}</p>
                <h6>
                  <small className="text-muted">Address: </small>
                </h6>
                <p>{storeData.address}, {storeData.cityName}</p>
              </Col>
              <Col sm={6} className='p-3'>
              <img src={`${process.env.REACT_APP_BE}images/${storeData.photo}`} style={{objectFit:'scale-down', width:'18rem',height:'20rem' }} alt='logo' />
              </Col>
            </Row>
            <Row>
              <Col className='p-3'>
              <Map height={300} center={storeData.coords} defaultZoom={11}>
                    {storeData.coords && <Marker width={50} anchor={storeData.coords} />}
                  </Map>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button variant="outline-dark" as={Link} to={`/editstore/${storeData.id}`}>
                  <PencilSquare /> Edit store data
                </Button>
                <Button variant="outline-danger" onClick={handleModalShow}>
                  <Trash /> Delete store
                </Button>
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
            <Modal.Title>
              Do you really want to delete your store?
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            All your ads will be deleted.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={handleModalClose}>
              No, missclicked!
            </Button>
            <Button variant="danger" onClick={handleDeleteStore}>
              Yes, pls delete!
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
}

export default StoreProfile