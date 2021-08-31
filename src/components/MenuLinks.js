import { useContext } from "react";
import { Spinner, Alert, Dropdown } from "react-bootstrap";
import { AppContext } from "../context/AppContext";
import axios from "axios";
const MenuLinks = ({setShow}) => {
  const { categoriesList, subCategoriesList, loading, error, setCurrentlyLoadedAds, setLoading, setError  } =
    useContext(AppContext);

    const menuItemClick = async ({load,id}) => {
        console.log(load,id,`${process.env.REACT_APP_BE}${load}/${id}`);
        try {
            setLoading(true);
            console.log(process.env.REACT_APP_BE);
            const { data:adList } = await axios.get(`${process.env.REACT_APP_BE}${load}/${id}`);
            setCurrentlyLoadedAds(adList);
            setShow(false);
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

  if (loading) return <Spinner animation="border" variant="secondary" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  return (
    <ul>
      {categoriesList.map((catItem, idx) => (
        <li key={`likc${idx}`}>
          <Dropdown.Item onClick={()=>menuItemClick({load:'ads/bycategory',id:catItem.id})}>{catItem.description}</Dropdown.Item>
          <ul>
            {subCategoriesList
              .filter((scItem) => {
                return scItem.parentId === catItem.id;
              })
              .map((scItem, idx) => (
                <li key={`liksc${idx}`}> <Dropdown.Item onClick={()=>menuItemClick({load:'ads/bysubcategory',id:scItem.id})}>{scItem.description}</Dropdown.Item> </li>
              ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};

export default MenuLinks;