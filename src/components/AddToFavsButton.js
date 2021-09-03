import axios from "axios";
import { useState,useContext } from "react";
import { OverlayTrigger,Tooltip } from "react-bootstrap";
import { AppContext } from "../context/AppContext";
import { Heart,HeartFill } from "react-bootstrap-icons";

const AddToFavsButton = ({targetId,description,path}) => {
    const { isAuthenticated } = useContext(AppContext);
    const [addedToFavs,setAddedToFavs] = useState(false);

    const addToFavors = async(id,descr) => {
        let url=`${process.env.REACT_APP_BE}favads/`;
        let favData = {
            favAdId: targetId,
            description: description,
          };
        if (path==='user'){
            url=`${process.env.REACT_APP_BE}favusers/`;
            favData = {
                favUserId: targetId,
                description: description,
              };
        }
        try {
            const { data } = await axios.post(url,favData,{headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}});
            console.log(data);
            setAddedToFavs(true);
          } catch (error) {
            if (error.response) console.log(error.response.data.error);
            else console.log(error.message);
          }
      }

      if (!isAuthenticated)return <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Sign in to add to favs</Tooltip>}>
      <span className="d-inline-block">
        <Heart style={{ pointerEvents: 'none' }} />
      </span>
    </OverlayTrigger>
      if (addedToFavs) return <HeartFill size={30} color='red' />
      else return <Heart size={30} color='red' style={{cursor:'pointer'}} onClick={()=>addToFavors()} />

}

export default AddToFavsButton
