import { useEffect, useState,useContext } from "react";
import axios from "axios";
import { Alert, Row, Col, FloatingLabel, Form } from "react-bootstrap";
import AdCard from "./AdCard";
import LoadingSpinner from "./LoadingSpinner";
import { AppContext } from "../context/AppContext";

    
const SearchResults = () => {

    const {  categoriesList, subCategoriesList ,searchParams,setSearchParams } = useContext(AppContext);
    const [currentlyLoadedAds,setCurrentlyLoadedAds] = useState();
    const [error,setError] = useState(null);
    const [loading,setLoading] = useState(true);
    const [selectedCatId,setSelectedCatId] = useState();
    const [selectedSubCatId,setSelectedSubCatId] = useState();
    const [curSubCatList,setCurSubCatList] = useState([]);
    const [searchInCat,setSearchInCat] = useState(false);
    const [searchInSubCat,setSearchInSubCat] = useState(false);

    useEffect(() => {

        const getAds = async () => {
            try {
                setLoading(true);
                console.log(process.env.REACT_APP_BE);
                const { data:adList } = await axios.post(`${process.env.REACT_APP_BE}search/v2/`,searchParams);
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
    }, [searchParams]);

    useEffect(() => {
      console.log(searchInCat);
      if(searchInCat)setSearchParams(prev=>{
        const reqBody = {
          cityId: prev.cityId,
          cityCoords:prev.cityCoords,
          distance: prev.distance,
          searchText:prev.searchText,
          catId:selectedCatId,
          subCatId:null,
        };
        return reqBody;
      });
    }, [searchInCat,selectedCatId,setSearchParams])
    useEffect(() => {
      console.log(searchInSubCat);
      if(searchInSubCat)setSearchParams(prev=>{
        prev.subCatId=selectedSubCatId;
        return prev;
      });
    }, [searchInSubCat,selectedSubCatId,setSearchParams])

    useEffect(() => {
      if (selectedCatId){
          //const curCat = categoriesList.find(cat=>cat.id===selectedCatId);
          const subCatsOfCat=subCategoriesList.filter(subCat=>subCat.parentId===selectedCatId);
          setCurSubCatList(subCatsOfCat);
          if(subCatsOfCat.length>0){
              setSelectedSubCatId(subCatsOfCat[0].id)
              
          }else{
              
              setSelectedSubCatId(null);
          }
      }else{
          
          setSelectedCatId(categoriesList[0].id);
          
      }
  }, [selectedCatId,subCategoriesList,categoriesList]);

    if (loading) return <LoadingSpinner />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Row>
          <Col>
          <Row>
          <Col sm={3}>
            <FloatingLabel
              controlId="floatingSelectCat"
              label="Choose category"
            >
              <Form.Select
                aria-label="Categories list"
                value={selectedCatId}
                onChange={(e) => setSelectedCatId(parseInt(e.target.value, 10))}
              >
                {categoriesList.map((cat, idx) => (
                  <option key={`catk${idx}`} value={cat.id}>
                    {cat.description}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
          </Col>
          <Col>
          <div className="form-check form-switch">
          <input className="form-check-input" type="checkbox" id="switchUseCategories" defaultChecked={searchInCat} onChange={(e)=>setSearchInCat(e.target.checked)} />
          <label className="form-check-label" htmlFor="switchUseCategories">Search in this category</label>
        </div>
          </Col>
          </Row>
          <Row>
          <Col sm={3}>
            <FloatingLabel
              controlId="floatingSelectSubCat"
              label="Choose sub-category"
            >
              <Form.Select
                aria-label="Sub categories list"
                value={selectedSubCatId}
                onChange={(e) =>
                  setSelectedSubCatId(parseInt(e.target.value, 10))
                }
              >
                {curSubCatList.map((subCat, idx) => (
                  <option key={`subCatk${idx}`} value={subCat.id}>
                    {subCat.description}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
          </Col>
          <Col>
          <div className="form-check form-switch">
          <input className="form-check-input" type="checkbox" id="switchUseSubCategories" defaultChecked={searchInSubCat} onChange={(e)=>setSearchInSubCat(e.target.checked)} />
          <label className="form-check-label" htmlFor="switchUseSubCategories">Search in this sub category</label>
        </div>
          </Col>
          </Row>
          
          <Row className="g-4">
          <Alert variant="success">Search results for: </Alert>
          {currentlyLoadedAds.length===0 && <Alert variant="info">No items found!</Alert>}
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
          </Col>

        </Row>
    )
}

export default SearchResults
