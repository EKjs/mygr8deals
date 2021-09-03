import { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CheckCircle,CheckAll, Trash } from "react-bootstrap-icons";
import LoadingSpinner from "./LoadingSpinner";

const MyMessages = () => {
    const [messageList,setMessageList] = useState();
    const [error,setError] = useState(null);
    const [loading,setLoading] = useState(true);
    const [updateMessageList,setUpdateMessageList] = useState(false);

   
    useEffect(() => {
        const getMessageList = async () => {
            try {
                setLoading(true);
                const { data:msgList } = await axios.get(`${process.env.REACT_APP_BE}messages/inbox/`,{headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}});
                setMessageList(msgList);
                console.log(msgList);
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
        getMessageList();
    }, [updateMessageList]);

const markRead = async(msgId)=>{
  try {
    setLoading(true);
    const { data:res } = await axios.get(`${process.env.REACT_APP_BE}messages/markread/${msgId}`,{headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}});
    if(res.id===msgId){
      setUpdateMessageList(prev=>!prev);
    }
    console.log(res);
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
};
const deleteMsg = async(msgId)=>{
  try {
    setLoading(true);
    const { data:res } = await axios.delete(`${process.env.REACT_APP_BE}messages/${msgId}`,{headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}});
    if(res.id===msgId){
      setUpdateMessageList(prev=>!prev);
    };
    console.log(res);
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

    if (loading) return <LoadingSpinner />;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!messageList || messageList.length<1) return <Alert variant="danger">No messages</Alert>;

    return (<>
      <Row>
        <Table responsive="sm">
    <thead>
      <tr>
        <th>From</th>
        <th>Title</th>
        {/* <th>Description</th> */}
        <th>Link to ad</th>
        <th>Mark</th>
{/*         <th>Sub category</th>
        <th>Category</th>
        <th>Created on</th>
        <th>Edit</th>
        <th>Delete</th>
        <th>Status</th> */}
      </tr>
    </thead>
    <tbody>
            {messageList.map((msg,idx)=>(
            <tr key={`adk${idx}`}>
              <td><p>{msg.fromUserName}</p></td>
              <td><p>{msg.msgRead ? msg.msgTitle : <mark>{msg.msgTitle}</mark>}</p></td>
              <td><Link to={`/view/${msg.adId}`} style={{textDecoration:'none'}}>{msg.adId}</Link></td>
              <td>{msg.msgRead ? <CheckAll size={24} /> : <CheckCircle size={24} style={{cursor:'pointer'}} onClick={()=>{
                markRead(msg.id)
              }} />} 
              <Trash size={24} style={{cursor:'pointer'}} onClick={()=>{
                deleteMsg(msg.id);
              }} />
              
              
              </td>
              {/* <td>{ad.description && ad.description.substring(0,50)}</td> */}
{/*               <td>{ad.price}</td>
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
              }} /></td> */}
            </tr> ))}
      </tbody>
      </Table>
        </Row>


    </>
    )
}

export default MyMessages


/*                  */