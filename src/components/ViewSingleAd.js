import axios from 'axios';
import { Alert,Row,Col,Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { Map, Marker } from "pigeon-maps";
import { TelephoneFill } from 'react-bootstrap-icons';
import AddToFavsButton from './AddToFavsButton';

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
    },[adId]);
if (loading)return <LoadingSpinner/>
    return ( <Row>
        {/*  <Row className="mb-5">
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
        </Row>*/}
        
            {error && <Alert>{error}</Alert>}
            <Col>
            <Row>
            <Col className="m-3 p-3" style={{backgroundColor:'#faf9f9'}}>
                <Carousel variant="dark">
                  {adData.photos && adData.photos.length>0 ? adData.photos.map((photo, idx) => (
                    <Carousel.Item key={`photoK${idx}`} >
                      <img  style={{objectFit:'scale-down',height:'25rem'}}
                        className="d-block w-100"
                        src={`${process.env.REACT_APP_BE}/images/${photo}`}
                        alt="Something interesting"
                      />
                    </Carousel.Item>
                  )) : <Carousel.Item><img  style={{objectFit:'scale-down',height:'25rem'}} className="d-block w-100" src='/images/noimg.png' alt="Nothing here" /></Carousel.Item>}
                </Carousel>
            </Col>
            </Row>
            <Row>
<Col className="m-3 p-3"  style={{backgroundColor:'#faf9f9'}}>
<Row>
<Col>
                  <h4>{adData.title}</h4>
                  {adData.price && adData.price>0 && <h3>{adData.price}€</h3>}
                  <p className="mt-3">{adData.description}</p>
              </Col>

</Row>
<Row className="mt-4">
            <Col >
                 <p className='fs-6 text-muted'>Views: {adData.views}</p> 
                  
              </Col>
              <Col>
              <AddToFavsButton targetId={adData.adId} description={adData.title} />
              </Col>
              <Col>
              <p className="fs-6 text-muted text-end">ID: {adData.adId}</p>
              </Col>
            </Row>
</Col>
             
            </Row>
            
            </Col>
              <Col sm={4} >
                  <Row>
                  <Col className="m-3 p-3"  style={{backgroundColor:'#faf9f9'}}>
                  {adData.storeId && (<><Link to={`/viewstore/${adData.storeId}`} style={{textDecoration:'none'}}><h4 classname="secondary">{adData.storeName}</h4></Link><br/></>)}
                  <Link className="fs-6 text-muted" to={`/byuser/${adData.ownerId}`} style={{textDecoration:'none'}}><h4>{adData.userName}</h4></Link> <br/>
                  <h5><TelephoneFill size={24}/> {adData.userPhone}</h5><br/>
                  <p className='fs-6 text-muted'>Member since {new Date(adData.created).toLocaleString()}</p>
                  <p className='fs-6 text-muted'>Was online {new Date(adData.wasOnline).toLocaleString()}</p>
                  <AddToFavsButton targetId={adData.ownerId} description={adData.userName} path='user' />
                  </Col>
                  </Row>
                  <Row>
                  <Col className="m-3 p-3"  style={{backgroundColor:'#faf9f9'}}>
                  <h5>{adData.cityName}</h5>
                  <p>{adData.address}</p>
                  <Map height={300} center={adData.coords} defaultZoom={11}>
                    {adData.coords && <Marker width={50} anchor={adData.coords} />}
                  </Map>
                  </Col>
                  </Row>
              </Col>

        </Row>



    )
}

export default ViewSingleAd
