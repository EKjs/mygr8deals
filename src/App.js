import { Route, Switch } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import AppContextWrapper from "./context/AppContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navigation from "./components/Navigation";
import MainPage from "./components/MainPage";
import Footer from "./components/Footer";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import CreateNewAd from "./components/CreateNewAd";
import AddEditCategory from "./components/admin/AddEditCategory";
import ViewSingleAd from "./components/ViewSingleAd";
import UserProfile from "./components/UserProfile";
import EditProfile from "./components/EditProfile";
import RegisterStore from "./components/RegisterStore";
import SearchResults from "./components/SearchResults";
import MyAdsPage from "./components/MyAdsPage";
import MyFavAds from "./components/MyFavAds";
import MyMessages from "./components/MyMessages";
function App() {
  return (
    <AppContextWrapper>
      <Container fluid>

        <Navigation />
        <Row className="justify-content-center my-4">
          <Col md={9}>
            <Switch>
            <Route exact path="/view/:adId" component={ViewSingleAd}/>
               <Route exact path="/signin" component={SignIn}/>
            <Route exact path="/signup" component={SignUp}/>
            <Route exact path="/search" component={SearchResults}/>
            <ProtectedRoute exact path="/myprofile" component={UserProfile}/>
            <ProtectedRoute exact path="/myfavads" component={MyFavAds}/>
            <ProtectedRoute exact path="/messages" component={MyMessages}/>
            <ProtectedRoute exact path="/editprofile" component={EditProfile}/>
            <ProtectedRoute exact path="/registerstore" component={RegisterStore}/>
            <ProtectedRoute exact path='/newad' component={CreateNewAd} />
            <ProtectedRoute exact path='/myads' component={MyAdsPage} />
            <ProtectedRoute exact path='/editad/:adId' component={CreateNewAd} />
            <ProtectedRoute exact path='/admin/categoryeditor' component={AddEditCategory} />
            
            {/*    <Route exact path="/leaderboard" component={LeaderBoard}/>
              <ProtectedRoute exact path='/creategame' component={CreateGame} />
              <ProtectedRoute exact path='/findgame' component={FindGame} />
              <ProtectedRoute exact path='/mygames' component={MyGames} />
              <ProtectedRoute exact path='/play/:gameId' component={Game} />
              <Route path='*' component={NotFound} /> */}
              <Route exact path="/bysubcategory/:subCatId" component={MainPage}/>
              <Route exact path="/bycategory/:catId" component={MainPage}/>
              <Route exact path="/bycity/:cityId" component={MainPage}/>
              <Route exact path="/byuser/:adsByUserId" component={MainPage}/>
              <Route exact path="/" component={MainPage}/>
            </Switch>
          </Col>
        </Row>
        <Footer/>
        
      </Container>
    </AppContextWrapper>
  );
}

export default App;
