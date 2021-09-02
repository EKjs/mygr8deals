import { useContext } from "react";
import { Spinner, Alert, Dropdown } from "react-bootstrap";
import { AppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

const MenuLinks = ({setShow}) => {
  const { categoriesList, subCategoriesList, loading, error  } =
    useContext(AppContext);

  if (loading) return <Spinner animation="border" variant="secondary" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  return (
    <ul>
      <li><Dropdown.Item as={Link} to="/" onClick={()=>setShow(false)}>View all ads</Dropdown.Item></li>
      {categoriesList.map((catItem, idx) => (
        <li key={`likc${idx}`}>
          <Dropdown.Item as={Link} to={`/bycategory/${catItem.id}`} onClick={()=>setShow(false)}>{catItem.description}</Dropdown.Item>
          <ul>
            {subCategoriesList
              .filter((scItem) => {
                return scItem.parentId === catItem.id;
              })
              .map((scItem, idx) => (
                <li key={`liksc${idx}`}> <Dropdown.Item as={Link} to={`/bysubcategory/${scItem.id}`} onClick={()=>setShow(false)}>{scItem.description}</Dropdown.Item> </li>
              ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};

export default MenuLinks;