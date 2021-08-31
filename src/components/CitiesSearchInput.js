import { Dropdown,FormControl,Popover,Overlay } from 'react-bootstrap';
import { useState,useRef } from 'react';
import axios from 'axios';

const CitiesSearchInput = ({setCoords,setCityId}) => {
    const [plzOrCityInput, setPlzOrCityInput] = useState('');
    const [citiesToChoose,setCitiesToChoose] = useState([]);
    const [show, setShow] = useState(false);
    const target = useRef(null);
    const timer = useRef(null);

    const getCitiesListFromServer = async (curInpVal) => {
        const reqBody = { searchString: curInpVal };
        const { data } = await axios.post(`${process.env.REACT_APP_BE}search/plzorcity/`,reqBody);
        setCitiesToChoose(data);
        if (data.length > 0)setShow(true);
        else setShow(false);
    };

    const cityClick = (city) => {
        setPlzOrCityInput(city.name);
        setCityId(city.id);
        setCoords(city.coords);
        console.log(city.id,city.coords);
    };

    const changePlzOrCityInput = (e) => {
        const curInpVal = e.target.value;
        setPlzOrCityInput(curInpVal);
        if (curInpVal.length > 2) {
          if (timer.current) {
            clearTimeout(timer.current);
          }
          timer.current = setTimeout(() => {
            getCitiesListFromServer(curInpVal);
          }, 1000);
        }else{
            if (timer.current)clearTimeout(timer.current);
        }
    };

    return (
        <>
    <FormControl
        type="text"
        placeholder="City or PLZ"
        aria-label="SearchCityPLZ"
        value={plzOrCityInput}
        onChange={changePlzOrCityInput}
        onBlur={() => setShow(false)}
        onFocus={() =>
        plzOrCityInput.length > 3 &&
        citiesToChoose.length > 0 &&
        setShow(true)
        }
        ref={target}
        />
        <Overlay target={target.current} show={show} placement="bottom">
            <Popover className="overflow-auto" style={{ maxHeight: "50%" }} id="popover-basic">
            <Popover.Body>
                {citiesToChoose.map((item, idx) => (
                <Dropdown.Item key={`optK${idx}`} onClick={() => cityClick(item)}>
                    {item.name}
                </Dropdown.Item>
                ))}
            </Popover.Body>
            </Popover>
        </Overlay>  
        </>
    )
}

export default CitiesSearchInput
