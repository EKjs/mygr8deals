import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
import { CashCoin, DoorOpen, FileEarmarkPerson, LayoutTextWindowReverse, ListStars, PersonCheck, PersonPlus, PlusSquare, BookmarkHeart } from "react-bootstrap-icons";
import { NavLink, Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import SideBarMenu from "./SideBarMenu";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";

const Navigation = () => {
  const { isAuthenticated,signOut } = useContext(AppContext);
  const userType = localStorage.getItem("userType");
  

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Brand as={NavLink} to="/">
          I buy it!
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <SideBarMenu />

          <SearchBar />
          <Nav>
            {isAuthenticated ? (<>
{/*               <Nav.Link as={NavLink} to="/newad">
                <PlusSquare size={24} /> Sell!
              </Nav.Link> */}
              <Navbar.Text>Logged in as: </Navbar.Text>
              <Dropdown align="end">
              <Dropdown.Toggle as={Nav.Link}>
              {localStorage.getItem("userName")}
              </Dropdown.Toggle>
              <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/newad"><PlusSquare size={24} style={{marginRight:'1rem'}} /> Sell!</Dropdown.Item>
              <Dropdown.Item as={Link} to="/myads"><ListStars size={24} style={{marginRight:'1rem'}}/> My ads</Dropdown.Item>
              <Dropdown.Item as={Link} to="/myprofile"><FileEarmarkPerson size={24} style={{marginRight:'1rem'}}/>My profile</Dropdown.Item>
              <Dropdown.Item as={Link} to="/mystore"><CashCoin size={24} style={{marginRight:'1rem'}}/>My Store</Dropdown.Item>
              <Dropdown.Item as={Link} to="/messages"><LayoutTextWindowReverse size={24} style={{marginRight:'1rem'}}/>Messages</Dropdown.Item>
              <Dropdown.Item as={Link} to="/myfavads"><BookmarkHeart size={24} style={{marginRight:'1rem'}}/>Fav ads</Dropdown.Item>
              <Dropdown.Item as={Link} to="/myfavusers"><BookmarkHeart size={24} style={{marginRight:'1rem'}}/>Fav users</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={signOut}><DoorOpen size={24} /> Log out</Dropdown.Item>
            </Dropdown.Menu>
              
              </Dropdown>
            </>) : (
              <>
                <Nav.Link as={NavLink} to="/signin">
                  <PersonCheck size={24} /> Sign in
                </Nav.Link>
                <Nav.Link as={NavLink} to="/signup">
                  <PersonPlus size={24} /> Sign up
                </Nav.Link>
              </>
            )}
          </Nav>
          {userType==='999' && isAuthenticated && (<Nav>
            <Dropdown>
              <Dropdown.Toggle variant="danger" id="dropdown-basic">
                Admin
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/admin/categoryeditor">Edit categories</Dropdown.Item>
                
              </Dropdown.Menu>
            </Dropdown>
          </Nav>)}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
