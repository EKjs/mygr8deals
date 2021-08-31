import {useContext} from 'react';
import { Card, Button, Col } from "react-bootstrap";
import { Trash, Pencil } from "react-bootstrap-icons";
import { AppContext } from "../context/AppContext";
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdCard = ({photo,title,address,price,created,catId,adId}) => {
  const { setError,setLoading } = useContext(AppContext);
  const userType = localStorage.getItem("userType");
  const adminDeleteAd = async (adId) => {
    console.log(adId);
    try {
      setLoading(true);
      const { data } = await axios.delete(`${process.env.REACT_APP_BE}ads/${adId}`,{headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}});
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

  return (
    <Col>
      <Card style={{ width: '18rem' }} border={catId===13 ? 'success': 'secondary'}>
        {userType==='999' && <Card.Header><Pencil /><Trash onClick={()=>adminDeleteAd(adId)} /></Card.Header> }
        <Card.Img variant="top" src={photo ? `${process.env.REACT_APP_BE}images/${photo[0]}` : 'images/noimg.png' } />
        <Card.Body>
          <Card.Title>{price} €</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{address && address.length>60 ? address.substring(0, 60) + '...' : ''}</Card.Subtitle>
          <Card.Text>
            {title.substring(0, 100)}{title.length>100 && '...'}
          </Card.Text>
          <Button variant="primary" as={Link} to={`/view/${adId}`}>Go somewhere</Button>
        </Card.Body>
        <Card.Footer className="text-muted">{new Date(created).toLocaleString()}</Card.Footer>
      </Card>
      </Col>
  );
};

export default AdCard;
