import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import axios from 'axios';
import { Col, Row,Form,FloatingLabel,Button,Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import CitiesSearchInput from './CitiesSearchInput';
import MapGeolocationPos from './MapGeolocationPos';

const RegisterStore = () => {
    const axiosConfig = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data' }
      };

    const [loading,setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [storeTitle, setStoreTitle] = useState('');
    const [storeAddress, setStoreAddress] = useState('');
    const [storeDescription, setStoreDescription] = useState('');
    const [storeLogoImg, setStoreLogoImg] = useState('');
    const [cityId,setCityId] = useState();
    const [coords,setCoords] = useState();


const uploadImage = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
        setLoading(true);

        const { data:uploadedFile } = await axios.post(`${process.env.REACT_APP_BE}image-upload`,formData,axiosConfig);
        console.log(uploadedFile);
        setStoreLogoImg(uploadedFile[0].path);
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
}
      

/*     useEffect(()=>{
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
    },[]); */

     const handleSaveChanges = async ()=>{
        const storeData={
            title:storeTitle,
            address:storeAddress,
            description:storeDescription,
            coords:coords,
            cityId:cityId,
            photo:storeLogoImg,
        };
        try {
            setLoading(true);
            const { data } = await axios.post(`${process.env.REACT_APP_BE}stores/`,storeData,{headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}});
            console.log(data);
            //fdfd
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
 


    if(loading)return <LoadingSpinner/>;
    
    return (
        
        <Row className="justify-content-center">
            <Col md={10}>
                {error && <Alert>{error}</Alert>}
                <Row>
          <Col md={4}>
          <FloatingLabel
              controlId="floatingInputStoreName"
              label="Enter name of your store (required)"
              className="mb-1"
            >
              <Form.Control
                type="text"
                placeholder="Some title"
                onChange={(e) => setStoreTitle(e.target.value)}
                value={storeTitle}
                required
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="floatingInputStoreDescription"
              label="Enter your store's description (required)"
              className="mb-2"
            >
            <Form.Control
                as="textarea"
                placeholder="Some descriptiion"
                style={{ height: '300px' }}
                onChange={(e) => setStoreDescription(e.target.value)}
                value={storeDescription}
                required
            />
            </FloatingLabel>


          </Col>
          <Col md={4}>
              <Row>
                  <Col>
                  <FloatingLabel
              controlId="floatingInputStoreAddress"
              label="Enter address of your store (required)"
              className="mb-1"
            >
              <Form.Control
                type="text"
                placeholder="Some address"
                onChange={(e) => setStoreAddress(e.target.value)}
                value={storeAddress}
                required
              />
            </FloatingLabel>
                  </Col>
              </Row>
            <Row className="my-2">
              <Col>
                <CitiesSearchInput setCoords={setCoords} setCityId={setCityId} />
              </Col>
            </Row>
            <Row>
              <Col>
                <MapGeolocationPos setCoords={setCoords} coords={coords} />
              </Col>
            </Row>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Control type="file" onChange={uploadImage} />
              <Form.Label>Choose photo or logo</Form.Label>
            </Form.Group>
            {storeLogoImg && <img className='img-fluid' src={storeLogoImg} alt='logo'/>}
          </Col>

            </Row>
            <Row className="d-grid gap-2">
            <Button variant="primary" size="sm" onClick={handleSaveChanges}>Save changes</Button>
            <Button variant="secondary" size="sm" as={Link} to="/">Cancel</Button>

            </Row>
            </Col>
            
          </Row>)
}

export default RegisterStore
