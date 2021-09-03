import {useState,useContext,useEffect} from 'react'
import { Col, Row, Form, FloatingLabel, Carousel,Button,Alert } from 'react-bootstrap';
import { AppContext } from "../context/AppContext";
import LoadingSpinner from './LoadingSpinner';
import axios from 'axios';
 import { useParams } from 'react-router-dom';
import CitiesSearchInput from './CitiesSearchInput';
import MapGeolocationPos from './MapGeolocationPos';
import { useHistory } from 'react-router';
import { TrashFill } from 'react-bootstrap-icons';


const CreateNewAd = () => {
  const {adId} = useParams();
  const hist = useHistory();
   const { categoriesList, subCategoriesList } =
    useContext(AppContext);
    const axiosConfig = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data' }
      };
    const [loading,setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [adTitle, setAdTitle] = useState('');
    const [adPrice, setAdPrice] = useState(0);
    const [adAddress, setAdAddress] = useState('');
    const [adCurStatus, setAdCurStatus] = useState();
    const [adStatuses, setAdStatuses] = useState([]);

    const [cityPlaceholder, setCityPlaceholder] = useState()
    
    const [selectedCatId,setSelectedCatId] = useState();
    const [selectedSubCatId,setSelectedSubCatId] = useState();
    const [curSubCatList,setCurSubCatList] = useState([]);

    const [curCityId, setCurCityId] = useState();
    const [coords,setCoords] = useState();
    const [photoArray, setPhotoArray] = useState([]);
    const [adDescription,setAdDescription] = useState();
    const [sellAsStore,setSellAsStore] = useState(false)

    const submitDataToServer = async () => {
        //const cleanPhotoArray=photoArray.length>0 ? photoArray.map(ph=>ph.filename) : null;
        const price = Number.isFinite(parseFloat(adPrice)) ? parseFloat(adPrice) : 0;
        const sendData = {
            title:adTitle,
            description:adDescription,
            subCategoryId:selectedSubCatId,
            price:price,
            cityId:curCityId,
            address:adAddress,
            photos:photoArray,
            coords:coords,
            currentState:adCurStatus,
            sellAsStore:sellAsStore,
        }
        console.log(sendData);
        try {
            setLoading(true);
            let resp;
            if (adId){
              resp = await axios.put(`${process.env.REACT_APP_BE}ads/${adId}`,sendData,{headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}});
            }else{
              resp = await axios.post(`${process.env.REACT_APP_BE}ads`,sendData,{headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}});
            }
            console.log(resp.data);
            if (resp.data.id){
              hist.push(`/view/${resp.data.id}`)
            }
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

    
    

      const deletePhoto = async (photoFilename) => {
        setPhotoArray((prev) =>
        prev.filter(
          (item) => item !== photoFilename
        )
      )
      const baseUrl = `${process.env.REACT_APP_BE}image-upload/`;
      //const newOrEdit = adId ? baseUrl + 'editor/' : 'newad/';
      try{
      const { data } = await axios.delete(`${baseUrl}${photoFilename}`,axiosConfig);
      console.log(data);
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

    useEffect(() => {
        if (selectedCatId){
            //const curCat = categoriesList.find(cat=>cat.id===selectedCatId);
            const subCatsOfCat=subCategoriesList.filter(subCat=>subCat.parentId===selectedCatId);
            setCurSubCatList(subCatsOfCat);
            if(subCatsOfCat.length>0){
              if(!adId){
                setSelectedSubCatId(subCatsOfCat[0].id)
              }
            }else{
                setSelectedSubCatId(null);
            }
        }else{
            
            setSelectedCatId(categoriesList[0].id);
            
        }
    }, [selectedCatId,subCategoriesList,categoriesList,adId]);

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
    getAvalableStatuses();

    if(adId){
      const loadAdDetails = async ()=>{
        try {
            setLoading(true);
            const { data } = await axios.get(`${process.env.REACT_APP_BE}ads/${adId}`);
            setAdTitle(data.title);
            setAdPrice(data.price);
            setAdAddress(data.address);
            setAdCurStatus(data.currentState);
            setAdDescription(data.description)
            setPhotoArray(data.photos);
            console.log('photos',data.photos);
            setSelectedSubCatId(data.subCategoryId);
            setCoords(data.coords)
            setSelectedCatId(data.catId);
            setCityPlaceholder(data.cityName);
            setCurCityId(data.cityId)
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
    };


}, [adId])


const uploadImages = async(e) => {
    const formData = new FormData();
    for (let i=0;i<e.target.files.length;i++){
        formData.append('image', e.target.files[i]);
    }
    try {
        setLoading(true);

        const { data:uploadedFilesPath } = await axios.post(`${process.env.REACT_APP_BE}image-upload`,formData,axiosConfig);
        console.log(uploadedFilesPath);
        if(photoArray)setPhotoArray(prev=>[...prev,...uploadedFilesPath]);
        else setPhotoArray(uploadedFilesPath)
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

    if(!curSubCatList || loading)return <LoadingSpinner/>;

    return (
      <>
        <Row>
          {error && <Alert>{error}</Alert>}
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
          <Col sm={7}>
            <Row>
              <Col>
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
            </Row>
            <Row>
              <Col>
                <FloatingLabel
                  controlId="floatingTextareaDescription"
                  label="Enter description"
                >
                  <Form.Control
                    as="textarea"
                    placeholder="Enter description here"
                    onChange={(e) => setAdDescription(e.target.value)}
                    value={adDescription}
                    style={{ height: '200px' }}
                  />
                </FloatingLabel>
              </Col>
            </Row>
            <Row className='mt-3'>
              <Col>
                <Form.Check
                  required
                  label="Sell as store"
                  feedback="Sell as store"
                  value={sellAsStore}
                  onChange={(e) => setSellAsStore(e.target.checked)}
                />{" "}
                <br />
                <Form.Check
                  required
                  label="Agree to terms and conditions"
                  feedback="You must agree before submitting."
                />{" "}
                <br />
                <Button variant="primary" onClick={submitDataToServer}>
                  Submit
                </Button>
              </Col>

              <Col>
                <Form.Group controlId="formFileMultiple" className="mb-3">
                  <Form.Control type="file" multiple onChange={uploadImages} />
                  <Form.Label>Choose photos to upload</Form.Label>
                </Form.Group>

                {photoArray && photoArray.length > 0 && (
                  <>
                    <Carousel variant='dark'>
                      {photoArray.map((photo, idx) => (
                        <Carousel.Item key={`photoK${idx}`}>
                          <img
                            className="d-block w-100"
                            src={`${process.env.REACT_APP_BE}images/${photo}`}
                            alt="what is it?"
                            style={{ objectFit: "scale-down", height: "25rem" }}
                          />
                          <Carousel.Caption>
                          <Button onClick={() => deletePhoto(photo)} variant="outline-danger"> <TrashFill size={24} /> </Button>
                          </Carousel.Caption>
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  </>
                )}
              </Col>
            </Row>
          </Col>
          <Col sm={5}>
            <Row>
              <Col>
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
            <Row>
              <Col>
                <FloatingLabel
                  controlId="floatingSelectStatus"
                  label="Choose status"
                >
                  <Form.Select
                    aria-label="Ad statuses list"
                    value={adCurStatus}
                    onChange={(e) =>
                      setAdCurStatus(parseInt(e.target.value, 10))
                    }
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
              <Col>
                <CitiesSearchInput
                  setCoords={setCoords}
                  setCityId={setCurCityId}
                  cityPlaceholder={cityPlaceholder}
                />
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
                <MapGeolocationPos setCoords={setCoords} coords={coords} />
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    );
}

export default CreateNewAd
