import {useState,useContext,useEffect,useRef} from 'react'
import { Col, Row, Form, FloatingLabel,FormControl,Overlay,Popover,Dropdown,Carousel,Button,CloseButton,ListGroup } from 'react-bootstrap';
import { AppContext } from "../context/AppContext";
import LoadingSpinner from './LoadingSpinner';
import axios from 'axios';
import { Map, Marker } from "pigeon-maps";
import { useParams } from 'react-router-dom';

const CreateNewAd = () => {
  const {adId} = useParams();
    const { categoriesList, subCategoriesList,loading, error, currentlyLoadedAds, setCurrentlyLoadedAds,setLoading, setError } =
    useContext(AppContext);
    const axiosConfig = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data' }
      };

    const [adTitle, setAdTitle] = useState('');
    const [adPrice, setAdPrice] = useState(0);
    const [adAddress, setAdAddress] = useState('');
    const [adCurStatus, setAdCurStatus] = useState();
    const [adStatuses, setAdStatuses] = useState([]);

    const [selectedCatId,setSelectedCatId] = useState();
    const [selectedSubCatId,setSelectedSubCatId] = useState();
    const [curSubCatList,setCurSubCatList] = useState([]);
    const [plzOrCityInput, setPlzOrCityInput] = useState("");
    const [curCityId, setCurCityId] = useState();
    const [citiesToChoose,setCitiesToChoose] = useState([]);
    const [coords,setCoords] = useState([]);
    const [mapCenterCoords, setMapCenterCoords] = useState();
    const [photoArray, setPhotoArray] = useState([]);
    const [adDescription,setAdDescription] = useState();
    const [sellAsStore,setSellAsStore] = useState(false)

    const [show, setShow] = useState(false);
    const target = useRef(null);
    const timer = useRef(null);

    const submitDataToServer = async () => {
        const cleanPhotoArray=photoArray.length>0 ? photoArray.map(ph=>ph.filename) : null;
        const price = Number.isFinite(parseFloat(adPrice)) ? parseFloat(adPrice) : 0;
        const sendData = {
            title:adTitle,
            description:adDescription,
            subCategoryId:selectedSubCatId,
            price:price,
            cityId:curCityId,
            address:adAddress,
            photos:cleanPhotoArray,
            coords:coords,
            currentState:adCurStatus,
            sellAsStore:sellAsStore,
/*             storeId: Joi.number().allow(null), //checkbox +
            subCategoryId: Joi.number().required(),
            title: Joi.string().min(10).required(),
            description: Joi.string(),
            price: Joi.number().default(0),
            photos: Joi.array(),
            cityId: Joi.number().required(),
            address: Joi.string(),
            coords: Joi.array(),
            currentState:Joi.number(), */
        }
        console.log(sendData);
        try {
            setLoading(true);
            const { data } = await axios.post(`${process.env.REACT_APP_BE}ads`,sendData,{headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}});
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
    }

    const getCitiesListFromServer = async (curInpVal) => {
        const reqBody = { searchString: curInpVal };
        const { data } = await axios.post(
          `${process.env.REACT_APP_BE}search/plzorcity/`,
          reqBody
        );
        setCitiesToChoose(data);
        if (data.length > 0) setShow(true);
        else setShow(false);
      };
    
      const changePlzOrCityInput = (e) => {
        const curInpVal = e.target.value;
        setPlzOrCityInput(curInpVal);
        console.log(curInpVal);
        if (curInpVal.length > 2) {
          console.log(">2");
          if (timer.current) {
            clearTimeout(timer.current);
          }
          timer.current = setTimeout(() => {
            console.log("userStopped");
            getCitiesListFromServer(curInpVal);
          }, 1000);
        }else{
            if (timer.current) {
                clearTimeout(timer.current);
              }
        }
      };

      const cityClick = (city) => {
        setPlzOrCityInput(city.name);
        setCurCityId(city.id);
        setMapCenterCoords(city.coords)
        setCoords(city.coords);
      };
      
      const deletePhoto = async (photoFilename) => {
        setPhotoArray((prev) =>
        prev.filter(
          (item) => item.filename !== photoFilename
        )
      )
      const { data } = await axios.delete(`${process.env.REACT_APP_BE}image-upload/${photoFilename}`,axiosConfig);
      console.log(data);
      }

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
    }, [selectedCatId,subCategoriesList]);

useEffect(() => {
    const getAvalableStatuses = async () =>{
        try {
            setLoading(true);
            const { data } = await axios.get(`${process.env.REACT_APP_BE}adstates`);
            setAdStatuses(data);
            setAdCurStatus(data[0].id)
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
    getAvalableStatuses()
}, [])

const mapClick = ({ latLng }) => {
/*     console.log(event, latLng, pixel ); */
    setCoords(latLng)
}

const uploadImages = async(e) => {
    const formData = new FormData();
    for (let i=0;i<e.target.files.length;i++){
        formData.append('image', e.target.files[i]);
    }
    //e.target.files.forEach(file=>formData.append('image', file));

    try {
        setLoading(true);

        const { data:uploadedFilesPath } = await axios.post(`${process.env.REACT_APP_BE}image-upload`,formData,axiosConfig);
        console.log(uploadedFilesPath);
        setPhotoArray(prev=>[...prev,...uploadedFilesPath]);
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


const getMyLocation = () => {

    let options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      
      function success(pos) {
        let crd = pos.coords;
        //crd.accuracy
        setCoords([crd.latitude,crd.longitude]);
        setMapCenterCoords([crd.latitude,crd.longitude]);
      };
      
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      };
      
      navigator.geolocation.getCurrentPosition(success, error, options);
      

}

    if(!curSubCatList)return <LoadingSpinner/>;

    return (
      <>
        <Row>
          <Col>
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
        </Row>
        <Row className="my-2">
          <Col sm={9}>
            <FloatingLabel
              controlId="floatingInputTitle"
              label="Enter title (required)"
              className="mb-1"
            >
              <Form.Control
                type="text"
                placeholder="Some title"
                onChange={(e) => setAdTitle(e.target.value)}
                value={adTitle}
                required
              />
            </FloatingLabel>
          </Col>
          <Col sm={3}>
            <FloatingLabel
              controlId="floatingInputPrice"
              label="Enter price"
              className="mb-1"
            >
              <Form.Control
                type="text"
                placeholder="1 000 000"
                onChange={(e) => setAdPrice(e.target.value)}
                value={adPrice}
              />
            </FloatingLabel>
          </Col>
        </Row>
        <Row className="my-2">
          <Col sm={9}>
            <FloatingLabel
              controlId="floatingTextareaDescription"
              label="Enter description"
            >
              <Form.Control
                as="textarea"
                placeholder="Enter description here"
                onChange={(e)=>setAdDescription(e.target.value)}
                value={adDescription}
              />
            </FloatingLabel>
          </Col>

          <Col sm={3}>
            <FloatingLabel
              controlId="floatingSelectStatus"
              label="Choose status"
            >
              <Form.Select
                aria-label="Ad statuses list"
                value={adCurStatus}
                onChange={(e) => setAdCurStatus(parseInt(e.target.value, 10))}
              >
                {adStatuses.map((status, idx) => (
                  <option key={`statusk${idx}`} value={status.id}>
                    {status.description}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
          </Col>
        </Row>
        <Row className="my-2">
          <Col sm={4}>

          <Form.Check
          required
          label="Sell as store"
          feedback="Sell as store"
          value={sellAsStore}
          onChange={(e)=>setSellAsStore(e.target.checked)}
        /> <br/>
                  <Form.Check
          required
          label="Agree to terms and conditions"
          feedback="You must agree before submitting."
        /> <br/>
          <Button variant='primary' onClick={submitDataToServer}>Submit</Button>

          </Col>
          <Col sm={5}>
            <Form.Group controlId="formFileMultiple" className="mb-3">
              <Form.Control type="file" multiple onChange={uploadImages} />
              <Form.Label>Choose photos to upload</Form.Label>
            </Form.Group>

            {photoArray.length > 0 && (
              <>
                <Carousel>
                  {photoArray.map((photo, idx) => (
                    <Carousel.Item key={`photoK${idx}`}>
                      <img
                        className="d-block w-100"
                        src={photo.path}
                        alt="ad photo"
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
                <ListGroup>
                  {photoArray.map((photo, idx) => (
                    <ListGroup.Item key={`phlK${idx}`}>
                      <CloseButton
                        aria-label="Delete photo"
                        onClick={() =>deletePhoto(photo.filename)}
                      />
                      {photo.filename}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </>
            )}
          </Col>
          <Col sm={3}>
            <Row className="my-2">
              <Col>
                <FormControl
                  type="text"
                  placeholder="City or PLZ"
                  aria-label="SearchCityPLZ"
                  value={plzOrCityInput}
                  onChange={changePlzOrCityInput}
                  onBlur={() => setShow(false)}
                  onFocus={() =>
                    plzOrCityInput.length > 3 &&
                    citiesToChoose.length > 0 &&
                    setShow(true)
                  }
                  ref={target}
                />
                <Overlay target={target.current} show={show} placement="bottom">
                  <Popover
                    className="overflow-auto"
                    style={{ maxHeight: "50%" }}
                    id="popover-basic"
                  >
                    <Popover.Body>
                      {citiesToChoose.map((item, idx) => (
                        <Dropdown.Item
                          key={`optK${idx}`}
                          onClick={() => cityClick(item)}
                        >
                          {item.name}
                        </Dropdown.Item>
                      ))}
                    </Popover.Body>
                  </Popover>
                </Overlay>
              </Col>
            </Row>
            <Row className="my-2">
              <FloatingLabel
                controlId="floatingInputAddress"
                label="Enter address (optional)"
                className="mb-1"
              >
                <Form.Control
                  as="textarea"
                  placeholder="Some street 1"
                  onChange={(e) => setAdAddress(e.target.value)}
                  value={adAddress}
                />
              </FloatingLabel>
            </Row>
            <Row>
              <Col>
                <Map
                  height={300}
                  center={mapCenterCoords}
                  defaultZoom={11}
                  onClick={mapClick}
                >
                  {coords && <Marker width={50} anchor={coords} />}
                </Map>
                <Button className="mb-3" variant="info" onClick={getMyLocation}>
                  Locate!
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    );
}

export default CreateNewAd
