import { useContext, useEffect } from "react";
import axios from "axios";
import { Spinner, Alert, Row } from "react-bootstrap";
import { AppContext } from "../context/AppContext";
import AdCard from "./AdCard";

const MainPage = () => {
    const { loading, error, currentlyLoadedAds, setCurrentlyLoadedAds,setLoading, setError } =
    useContext(AppContext);

    useEffect(() => {
        const getAds = async () => {
            try {
                setLoading(true);
                console.log(process.env.REACT_APP_BE);
                const { data:adList } = await axios.get(`${process.env.REACT_APP_BE}ads`);
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
    }, [setCurrentlyLoadedAds,setError,setLoading])

    if (loading) return <Spinner animation="border" variant="secondary" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Row className="g-4">
            {currentlyLoadedAds.map((ad,idx)=>(
            <AdCard key={`adk${idx}`}
            title={ad.title}
            photo={ad.photos}
            address={ad.address}
            price={ad.price}
            created={ad.created}
            catId={ad.catId}
            adId={ad.adId}
             /> ))}
        </Row>
    )
}

export default MainPage
