import axios from 'axios';
import { Alert,Row,Col,Carousel,Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { Map, Marker } from "pigeon-maps";

const ViewSingleAd = () => {
    const {adId}=useParams();
    const [loading,setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [adData, setAdData] = useState({});
    useEffect(()=>{
       const loadAdDetails = async ()=>{
        try {
            setLoading(true);
            const { data } = await axios.get(`${process.env.REACT_APP_BE}ads/${adId}`);
            setAdData(data);
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
if (loading)return <LoadingSpinner/>
    return ( <Row className="g-4 my-2">
        <Col>
        <Row className="mb-5">
            <Col>
            <Breadcrumb>
                <Breadcrumb.Item><Link to="/">All ads</Link></Breadcrumb.Item>
                <Breadcrumb.Item><Link to={`/categories/${adData.catId}`}>
                    {adData.category}
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                <Link to={`/subcategories/${adData.subCategoryId}`}>
                    {adData.subcategory}</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active>{adData.subcategory} in {adData.cityName}</Breadcrumb.Item>
            </Breadcrumb>
            </Col>
        </Row>
        <Row className="justify-content-center">
            {error && <Alert>{error}</Alert>}
            <Col sm={4}>
                <Carousel>
                  {adData.photos ? adData.photos.map((photo, idx) => (
                    <Carousel.Item key={`photoK${idx}`}>
                      <img
                        className="d-block w-100"
                        src={`${process.env.REACT_APP_BE}/images/${photo}`}
                        alt="ad photo"
                      />
                    </Carousel.Item>
                  )) : <Carousel.Item><img className="d-block w-100" src='/images/noimg.png' alt="No photo" /></Carousel.Item>}
                </Carousel>
            </Col>
            <Col sm={4}>
                <Row>
                <Col>
                <h5>{adData.userName}</h5>
                
                {new Date(adData.created).toLocaleString()}
                <h6>{adData.userPhone}</h6>
                </Col>
                </Row>
                <Row>
                <Col>
                <h6>{adData.cityName}</h6>
                <h6>{adData.address}</h6>
                <Map
                  height={300}
                  center={adData.coords}
                  defaultZoom={11}
                >
                  {adData.coords && <Marker width={50} anchor={adData.coords} />}
                </Map>
                </Col>
                </Row>
            </Col>

        </Row>
        <Row>
            <Col sm={4}>
                <h4>{adData.title}</h4>
                {adData.price && adData.price>0 && <h3>{adData.price}€</h3>}
                <p>{adData.description}</p>
            </Col>
        </Row>
        <Row>
            <Col sm={4}>
                Views:{adData.views}
                ID: {adData.adId}
            </Col>
        </Row>
        </Col>
    </Row>

    )
}

export default ViewSingleAd
