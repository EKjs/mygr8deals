import { useState, useContext } from "react";
import {
  Form,
  FormControl,
  Button,
  InputGroup,
 Navbar
} from "react-bootstrap";
import { Search, GeoAlt } from "react-bootstrap-icons";
import { useHistory } from "react-router-dom";

import { AppContext } from "../context/AppContext";
import CitiesSearchInput from "./CitiesSearchInput";

const SearchBar = () => {
    const { setSearchParams } =
    useContext(AppContext);
    const hist = useHistory();
  const [curCityId, setCurCityId] = useState();
  const [coords,setCoords] = useState();
  const [searchQ, setSearchQ] = useState('');
  const [radius, setRadius] = useState('');



  const doSearch = () => {

    //cityId, cityCoords, distance, searchText, catId, subCatId
    const reqBody = {
      cityId: curCityId,
      cityCoords:coords,
      distance: radius,
      searchText:searchQ,
/*       catId:null,
      subCatId:null, */
    };
    setSearchParams(reqBody);
    const location = {
      pathname: '/search',
      state: { fromDashboard: true }
    }
    hist.push(location)
    /* const getData = async () => {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BE}search/v2/`,
        reqBody
      );
      setSearchParams(data)
      console.log(data);
    };
    getData(); */
  };
  const inputRadius = (e) => {
    const r = new RegExp(/^[0-9]*$/);
    if (e.target.value.match(r)) {
      console.log(e.target.value);
      if (parseInt(e.target.value, 10) > 100) {
        setRadius(100);
      } else setRadius(e.target.value);
    }
  };

  return (
    <Navbar.Text className='me-auto'>
      <Form className="d-flex flex-column flex-md-row">
        <InputGroup className="col">
          <InputGroup.Text style={{ backgroundColor: "#f7f7f9" }}>
            <Search />
          </InputGroup.Text>
          <FormControl
            type="search"
            placeholder="Search"
            className="mr-2"
            aria-label="Search"
            onChange={(e) => setSearchQ(e.target.value)}
          />
          </InputGroup>
          <InputGroup className="col">
          <InputGroup.Text style={{ backgroundColor: "#f7f7f9" }}>
            <GeoAlt />
          </InputGroup.Text>
            <CitiesSearchInput setCoords={setCoords}  setCityId={setCurCityId} /> 
          </InputGroup>
          <InputGroup className="col">
          <InputGroup.Text style={{ backgroundColor: "#f7f7f9" }}>
            +
          </InputGroup.Text>
          <FormControl
            type="text"
            as="input"
            htmlSize={1}
            placeholder="0 km"
            className="mr-2"
            aria-label="radius"
            onChange={inputRadius}
            value={radius}
            list="distance-variants"
          />
        <datalist id="distance-variants">
            <option value="5"/>
            <option value="10"/>
            <option value="15"/>
            <option value="25"/>
            <option value="50"/>
        </datalist>
          <Button
            onClick={doSearch}
            variant="secondary"
            style={{ backgroundColor: "#f7f7f9" }}
          >
            Search
          </Button>
        </InputGroup>
      </Form>
      </Navbar.Text>
  );
};
export default SearchBar;