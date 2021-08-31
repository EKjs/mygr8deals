import { useEffect } from 'react';
import { Map, Marker } from "pigeon-maps";

const MapGeolocationPos = ({setCoords,coords}) => {
    const mapClick = ({ latLng }) => {
        setCoords(latLng);
    };
    useEffect(()=>{
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
            };
        const success=pos=>setCoords([pos.coords.latitude,pos.coords.longitude]);
        const error=err=>console.warn(`ERROR(${err.code}): ${err.message}`);
        if (!coords)navigator.geolocation.getCurrentPosition(success, error, options);
    },[setCoords,coords])
    return (
        <Map
            height={300}
            center={coords}
            defaultZoom={11}
            onClick={mapClick}
        >
            {coords && <Marker width={50} anchor={coords} />}
        </Map>
    )
}

export default MapGeolocationPos
