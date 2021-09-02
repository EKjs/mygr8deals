import { useState } from 'react';
import {Button, Offcanvas, Navbar} from 'react-bootstrap';
import { List } from 'react-bootstrap-icons';
import MenuLinks from './MenuLinks';


const SideBarMenu = () => {
    const [show, setShow] = useState(false);
    const closeMenu = () => setShow(false);
    const showMenu = () => setShow(true);

  
    return (
      <Navbar.Text className='me-auto'>
        <Button variant="secondary" onClick={showMenu}>
         <List size={24}/> All categories
        </Button>
  
        <Offcanvas show={show} onHide={closeMenu}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>What would you like to buy?</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <MenuLinks setShow={setShow} />
          </Offcanvas.Body>
        </Offcanvas>
        </Navbar.Text>)
}

export default SideBarMenu
