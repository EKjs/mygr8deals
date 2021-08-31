import { useState, useRef, useContext } from "react";
import {
  Form,
  FormControl,
  Button,
  InputGroup,
  Popover,
  Overlay,
  Dropdown, Navbar
} from "react-bootstrap";
import { Search, GeoAlt } from "react-bootstrap-icons";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const SearchBar = () => {
    const { setCurrentlyLoadedAds } =
    useContext(AppContext);
  const [plzOrCityInput, setPlzOrCityInput] = useState("");
  const [citiesList, setCitiesList] = useState([]);
  const [searchQ, setSearchQ] = useState("");
  const [radius, setRadius] = useState("");

  const [show, setShow] = useState(false);
  const target = useRef(null);
  const timer = useRef(null);

  const getCitiesListFromServer = async (curInpVal) => {
    const reqBody = { searchString: curInpVal };
    const { data } = await axios.post(
      `${process.env.REACT_APP_BE}search/plzorcity/`,
      reqBody
    );
    setCitiesList(data);
    if (data.length > 0) setShow(true);
    else setShow(false);
  };

  const changePlzOrCityInput = (e) => {
    const curInpVal = e.target.value;
    setPlzOrCityInput(curInpVal);
    console.log(curInpVal);
    if (curInpVal.length > 2) {
      console.log(">2");
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        console.log("userStopped");
        getCitiesListFromServer(curInpVal);
      }, 1000);
    }else{
      if (timer.current) {
          clearTimeout(timer.current);
        }
  }
  };

  const doSearch = () => {
    const reqBody = {
      userSearchQuery: searchQ,
      cityOrPlz: plzOrCityInput,
      distance: radius,
    };
    const getData = async () => {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BE}search/`,
        reqBody
      );
      setCurrentlyLoadedAds(data)
    };
    getData();
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
          <FormControl
            type="text"
            placeholder="City or PLZ"
            className="mr-2"
            aria-label="SearchCityPLZ"
            value={plzOrCityInput}
            onChange={changePlzOrCityInput}
            onBlur={() => setShow(false)}
            onFocus={() =>
              plzOrCityInput.length > 3 &&
              citiesList.length > 0 &&
              setShow(true)
            }
            ref={target}
          />
          <Overlay target={target.current} show={show} placement="bottom">
            <Popover
              className="overflow-auto"
              style={{ maxHeight: "50%" }}
              id="popover-basic"
            >
              <Popover.Body>
                {citiesList.map((item, idx) => (
                  <Dropdown.Item
                    key={`optK${idx}`}
                    onClick={() => setPlzOrCityInput(item.name)}
                  >
                    {item.name}
                  </Dropdown.Item>
                ))}
              </Popover.Body>
            </Popover>
          </Overlay>
          
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
            variant="outline-grey-100"
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