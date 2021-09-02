import { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Row,Col,Pagination } from "react-bootstrap";
import AdCard from "./AdCard";
import { useParams } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const MainPage = () => {
  const {subCatId,catId,cityId,adsByUserId} = useParams();
    const [currentlyLoadedAds,setCurrentlyLoadedAds] = useState();
    const [error,setError] = useState(null);
    const [loading,setLoading] = useState(true);

    console.log(subCatId,catId,cityId,adsByUserId);
    
    useEffect(() => {
      /* '/bycategory/:catId'
'/bysubcategory/:subCatId' */
      let url='ads/';

      if(!subCatId && catId)url+=`bycategory/${catId}`;
      else if(subCatId && !catId)url+=`bysubcategory/${subCatId}`;
      else if(cityId)url+=`bycity/${cityId}`;
      else if(adsByUserId)url+=`byuser/${adsByUserId}`;
        const getAds = async () => {
            try {
                setLoading(true);
                console.log(process.env.REACT_APP_BE);
                const { data:adList } = await axios.get(`${process.env.REACT_APP_BE}${url}`);
                setCurrentlyLoadedAds(adList);
                console.log(adList);
                setLoading(false);
              } catch (error) {
                if (error.response) {
                  setError(error.response.data.error);
                  setTimeout(() => setError(null), 3000);
                  setLoading(false);
                } else {
                  setError(error.message);
                  setTimeout(() => setError(null), 3000);
                  setLoading(false);
                }
              }
        }
        getAds()
    }, [subCatId,catId,cityId])

    if (loading) return <LoadingSpinner />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
      <Row>
        <Col>
        <Row className="g-4">
            {currentlyLoadedAds.map((ad,idx)=>(
            <AdCard key={`adk${idx}`}
            title={ad.title}
            photo={ad.photos}
            address={ad.address}
            price={ad.price}
            created={ad.created}
            catId={ad.catId}
            category={ad.category}
            subCategoryId={ad.subCategoryId}
            subCategory={ad.subCategory}
            cityName={ad.cityName}
            cityId={ad.cityId}
            adId={ad.adId}
            views={ad.views}
             /> ))}
        </Row>
{/*         <Row>
          <Col>
            <Pagination>{new Array(parseInt(currentlyLoadedAds[0].totalRows,10)).fill('x').map((x,idx)=>(<Pagination.Item key={idx} active={idx === 2}>
      {idx+1}
    </Pagination.Item>))}</Pagination>
          </Col>
        </Row> */}
        </Col>
      </Row>
    )
}

export default MainPage
