import { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Row,Col } from "react-bootstrap";
import AdCard from "./AdCard";
import { useParams } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import PageNums from "./PageNums";

const ADSPERPAGE=8;

const MainPage = () => {
  const {subCatId,catId,cityId,adsByUserId,adsByStoreId} = useParams();
    const [currentlyLoadedAds,setCurrentlyLoadedAds] = useState();
    const [error,setError] = useState(null);
    const [loading,setLoading] = useState(true);

    const [curPage,setCurPage] = useState(1);
    const [totalPages,setTotalPages] = useState();

    console.log(subCatId,catId,cityId,adsByUserId);
    
    useEffect(() => {
      /* '/bycategory/:catId'
'/bysubcategory/:subCatId' */
      let url='ads/';

      if(!subCatId && catId)url+=`bycategory/${catId}`;
      else if(subCatId && !catId)url+=`bysubcategory/${subCatId}`;
      else if(cityId)url+=`bycity/${cityId}`;
      else if(adsByUserId)url+=`byuser/${adsByUserId}`;
      else if(adsByStoreId)url+=`bystore/${adsByStoreId}`;
        const getAds = async () => {
            try {
                setLoading(true);
                console.log(process.env.REACT_APP_BE);
                const { data:adList } = await axios.get(`${process.env.REACT_APP_BE}${url}?skip=${(curPage-1)*ADSPERPAGE}&limit=${ADSPERPAGE}`);
                setCurrentlyLoadedAds(adList);
                if(adList.length>0){
                  setTotalPages(Math.ceil(parseInt(adList[0].totalRows,10)/ADSPERPAGE));
                }else {
                  setTotalPages(0);
                  setCurPage(1);
                }
                console.log(adList);
                setLoading(false);
              } catch (error) {
                if (error.response) {
                  setError(error.response.data.error);
                  //setTimeout(() => setError(null), 3000);
                  setLoading(false);
                } else {
                  setError(error.message);
                  //setTimeout(() => setError(null), 3000);
                  setLoading(false);
                }
              }
        }
        getAds()
    }, [subCatId,catId,cityId,adsByStoreId,adsByUserId,curPage])

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
        <Row className='justify-content-center mt-4'>
          <Col sm='auto'>
          <PageNums totalPages={totalPages} currentPage={curPage} cbPageClick={setCurPage} />
          </Col>
        </Row>
        
        </Col>
      </Row>
    )
}

export default MainPage
