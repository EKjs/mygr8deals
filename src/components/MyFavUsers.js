import { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Row, Table, Modal, Button,Toast,ToastContainer,Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { PencilSquare,Trash } from "react-bootstrap-icons";
import LoadingSpinner from "./LoadingSpinner";

const MyFavUsers = () => {
    const [favUsers,setFavUsers] = useState();
    const [error,setError] = useState(null);
    const [loading,setLoading] = useState(true);

    const [deleteId,setDeleteId] = useState();
    const [showModal, setShowModal] = useState(false);
    const [showToast,setShowToast] = useState(false);
    const [updateFavList,setUpdateFavList] = useState(false);

    const [editId,setEditId] = useState();
    const [editAdId,setEditAdId] = useState();
    const [editFavText, setEditFavText] = useState('');
    const [showModalEditor,setShowModalEditor] = useState(false);

    const handleModalEditorClose = () => setShowModalEditor(false);
    const handleModalClose = () => setShowModal(false);

    useEffect(() => {
        const getFavUsers = async () => {
            try {
                setLoading(true);
                console.log(process.env.REACT_APP_BE);
                const { data:favList } = await axios.get(`${process.env.REACT_APP_BE}favusers/myfav/`,{headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}});
                setFavUsers(favList);
                console.log(favList);
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
        getFavUsers();
    }, [updateFavList]);

    const handleDeleteFavAd = async () => {
      try {
          setLoading(true);
          const { data } = await axios.delete(`${process.env.REACT_APP_BE}favads/${deleteId}`,{headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}});
          console.log(data);
          setShowModal(false);
          if (data.id===deleteId){
            setShowToast(true);
          }
          setLoading(false);
          setUpdateFavList(prev=>!prev)
        } catch (error) {
          if (error.response) {
            setError(error.response.data.error);
            //setTimeout(() => setError(null), 5000);
            setLoading(false);
          } else {
            setError(error.message);
           // setTimeout(() => setError(null), 5000);
            setLoading(false);
          }
        }
     };

     const handleSaveChanges = async() =>{
       const editData = {
        favAdId:editAdId,
        description:editFavText
       }
       try {
        setLoading(true);
        const { data } = await axios.put(`${process.env.REACT_APP_BE}favads/${editId}`,editData,{headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}});
        console.log(data);
        setShowModalEditor(false);
        setLoading(false);
        setUpdateFavList(prev=>!prev)
      } catch (error) {
        if (error.response) {
          setError(error.response.data.error);
          //setTimeout(() => setError(null), 5000);
          setLoading(false);
        } else {
          setError(error.message);
         // setTimeout(() => setError(null), 5000);
          setLoading(false);
        }
      }
     }

    if (loading) return <LoadingSpinner />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (<>
      <Row>
      <ToastContainer className="p-3" position={'middle-center'}>
      <Toast bg='warning' onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Body> Fav # {deleteId} was deleted! </Toast.Body>
        </Toast>
      </ToastContainer>
        <Table responsive="sm">
    <thead>
      <tr>
        <th>Title</th>
        <th>Description</th>
        <th>Edit</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
            {favUsers.map((fav,idx)=>(
            <tr key={`adk${idx}`}>
              <td><Link to={`/view/${fav.adId}`} style={{textDecoration:'none'}}>{fav.adTitle}</Link></td>
              <td>{fav.description}</td>
              <td><PencilSquare size={24} style={{cursor:'pointer'}} onClick={()=>{
                setEditFavText(fav.description);
                setEditId(fav.id);
                setEditAdId(fav.adId);
                setShowModalEditor(true);
              }}/> </td>
              <td><Trash size={24} style={{cursor:'pointer'}} onClick={()=>{
                setDeleteId(fav.id);
                setShowModal(true)
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
        Do you really want to remove from favotites # {deleteId} ?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleModalClose}>
          No, missclicked!
        </Button>
        <Button variant="danger" onClick={handleDeleteFavAd}>Yes, pls delete!</Button>
      </Modal.Footer>
    </Modal>
    <Modal
      show={showModalEditor}
      onHide={handleModalEditorClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit description</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form.Control value={editFavText} cols={40} onChange={(e)=>setEditFavText(e.target.value)} as="textarea" rows={3} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleModalEditorClose}>
          No, missclicked!
        </Button>
        <Button variant="danger" onClick={handleSaveChanges}>Save changes</Button>
      </Modal.Footer>
    </Modal>



    </>
    )
}

export default MyFavUsers
