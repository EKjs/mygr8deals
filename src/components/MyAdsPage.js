import { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Row, Table, Modal, Button,Toast,ToastContainer,FloatingLabel,Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { PencilSquare,Trash,Toggle2On } from "react-bootstrap-icons";
import LoadingSpinner from "./LoadingSpinner";

const MyAdsPage = () => {
    const [currentlyLoadedAds,setCurrentlyLoadedAds] = useState();
    const [error,setError] = useState(null);
    const [loading,setLoading] = useState(true);

    const [deleteId,setDeleteId] = useState();
    const [showModal, setShowModal] = useState(false);
    const [showToast,setShowToast] = useState(false);
    const [showToast2,setShowToast2] = useState(false);
    const [updateMyAdsList,setUpdateMyAdsList] = useState(false);

    const [adIdForStatus,setAdIdForStatus] = useState();
    const [adStatus,setAdStatus] = useState();
    const [adStatuses, setAdStatuses] = useState([]);
    const [showModalStateChg,setShowModalStateChg] = useState(false);
    const handleModalStateChgClose = () => setShowModalStateChg(false);
    const handleModalClose = () => setShowModal(false);
    
    useEffect(() => {
        const getAds = async () => {
            try {
                setLoading(true);
                console.log(process.env.REACT_APP_BE);
                const { data:adList } = await axios.get(`${process.env.REACT_APP_BE}ads/byuser/${localStorage.getItem("userId")}`);
                setCurrentlyLoadedAds(adList);
                console.log(adList);
                setLoading(false);
              } catch (error) {
                if (error.response) {
                  setError(error.response.data.error);
                  // setTimeout(() => setError(null), 3000);
                  setLoading(false);
                } else {
                  setError(error.message);
                  // setTimeout(() => setError(null), 3000);
                  setLoading(false);
                }
              }
        }
        getAds();
    }, [updateMyAdsList]);

    useEffect(() => {
      const getAvalableStatuses = async () =>{
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_BE}adstates`);
            setAdStatuses(data);
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
    }, [])

    const handleDeleteAd = async () => {
      try {
          setLoading(true);
          const { data } = await axios.delete(`${process.env.REACT_APP_BE}ads/${deleteId}`,{headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}});
          console.log(data);
          setShowModal(false);
          if (data.id===deleteId){
            setShowToast(true)
          }
          setLoading(false);
          setUpdateMyAdsList(prev=>!prev);
          
        } catch (error) {
          if (error.response) {
            setError(error.response.data.error);
            // setTimeout(() => setError(null), 5000);
            setLoading(false);
          } else {
            setError(error.message);
            // setTimeout(() => setError(null), 5000);
            setLoading(false);
          }
        }
     };



     const handleChangeAdStatus =async () => {
       const editData = {
        adNewStateId:adStatus,
       }
      try {
          setLoading(true);
          const { data } = await axios.put(`${process.env.REACT_APP_BE}adstates/updatestate/${adIdForStatus}`,editData,{headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}});
          console.log(data);
          setShowModalStateChg(false);
          if (data.id===adIdForStatus){
            setShowToast2(true)
          }
          setLoading(false);
          setUpdateMyAdsList(prev=>!prev);
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

    if (loading) return <LoadingSpinner />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (<>
      <Row>
      <ToastContainer className="p-3" position={'middle-center'}>
      <Toast bg='warning' onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Body> Ad # {deleteId} was deleted! </Toast.Body>
        </Toast>
        <Toast bg='warning' onClose={() => setShowToast2(false)} show={showToast2} delay={3000} autohide>
          <Toast.Body> Status successfully changed! </Toast.Body>
        </Toast>
      </ToastContainer>
        <Table responsive="sm">
    <thead>
      <tr>
        <th>ID</th>
        <th>Title</th>
        {/* <th>Description</th> */}
        <th>Price</th>
        <th>Sub category</th>
        <th>Category</th>
        <th>Created on</th>
        <th>Edit</th>
        <th>Delete</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
            {currentlyLoadedAds.map((ad,idx)=>(
            <tr key={`adk${idx}`}>
              <td><Link to={`/view/${ad.adId}`} style={{textDecoration:'none'}}>{ad.adId}</Link></td>
              <td>{ad.title}</td>
              {/* <td>{ad.description && ad.description.substring(0,50)}</td> */}
              <td>{ad.price}</td>
              <td>{ad.subCategory}</td>
              <td>{ad.category}</td>
              <td>{new Date(ad.created).toLocaleString()}</td>
              <td><Link to={`/editad/${ad.adId}`}><PencilSquare size={24} /></Link></td>
              <td><Trash size={24} style={{cursor:'pointer'}} onClick={()=>{
                setDeleteId(ad.adId);
                setShowModal(true)
              }} /></td>
              <td><Toggle2On size={24} style={{cursor:'pointer'}} onClick={()=>{
                setAdStatus(ad.currentState);
                setAdIdForStatus(ad.adId);
                setShowModalStateChg(true)
              }} /></td>
            </tr> ))}
      </tbody>
      </Table>
        </Row>
        <Modal
      show={showModal}
      onHide={handleModalClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Please confirm!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Do you really want to delete ad # {deleteId} ?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleModalClose}>
          No, missclicked!
        </Button>
        <Button variant="danger" onClick={handleDeleteAd}>Yes, pls delete!</Button>
      </Modal.Footer>
    </Modal>


    <Modal
      show={showModalStateChg}
      onHide={handleModalStateChgClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit description</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <FloatingLabel
                  controlId="floatingSelectStatus"
                  label="Choose status"
                >
                  <Form.Select
                    aria-label="Ad statuses list"
                    value={adStatus}
                    onChange={(e) =>
                      setAdStatus(parseInt(e.target.value, 10))
                    }
                  >
                    {adStatuses.map((status, idx) => (
                      <option key={`statusk${idx}`} value={status.id}>
                        {status.description}
                      </option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleModalStateChgClose}>
          No, missclicked!
        </Button>
        <Button variant="danger" onClick={handleChangeAdStatus}>Save changes</Button>
      </Modal.Footer>
    </Modal>

    </>
    )
}

export default MyAdsPage


/*                  */