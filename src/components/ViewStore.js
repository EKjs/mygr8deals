import axios from 'axios';
import {useEffect, useState} from 'react';
import { Row,Col,Alert } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { Map, Marker } from "pigeon-maps";
import LoadingSpinner from './LoadingSpinner';

const ViewStore = () => {
  const {storeId} = useParams();
  const [storeData, setStoreData] = useState({});
    const [loading,setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
       const loadStoreDetails = async ()=>{
        try {
            setLoading(true);
            const { data } = await axios.get(`${process.env.REACT_APP_BE}stores/${storeId}`,{headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}});
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
    },[storeId]);

    if(loading)return <LoadingSpinner/>;
    return (
      <>
        <Row className="justify-content-center">
          {error && <Alert>{error}</Alert>}
          <Col sm={6}>
            <Row>
              <Col className='p-3'>
              <Link to={`/bystore/${storeData.id}`} style={{textDecoration:'none'}}><h4>
                 {storeData.title}
                </h4>
              </Link>
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

          </Col>
        </Row>

      </>
    );
}

export default ViewStore