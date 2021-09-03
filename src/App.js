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
import EditStore from "./components/EditStore";
import SearchResults from "./components/SearchResults";
import MyAdsPage from "./components/MyAdsPage";
import MyFavAds from "./components/MyFavAds";
import MyMessages from "./components/MyMessages";
import StoreProfile from "./components/StoreProfile";
import ViewStore from "./components/ViewStore";
import NotFound from "./components/NotFound";
import MyFavUsers from "./components/MyFavUsers";
function App() {
  return (
    <AppContextWrapper>
      <Container fluid>
        <Navigation />
        <Row className="justify-content-center my-4">
          <Col md={9}>
            <Switch>
              <Route exact path="/view/:adId" component={ViewSingleAd} />
              <Route exact path="/signin" component={SignIn} />
              <Route exact path="/signup" component={SignUp} />
              <Route exact path="/search" component={SearchResults} />
              <Route exact path="/viewstore/:storeId" component={ViewStore} />
              <ProtectedRoute exact path="/myprofile" component={UserProfile} />
              <ProtectedRoute exact path="/myfavads" component={MyFavAds} />
              <ProtectedRoute exact path="/myfavusers" component={MyFavUsers} />
              <ProtectedRoute exact path="/mystore" component={StoreProfile} />
              <ProtectedRoute exact path="/messages" component={MyMessages} />
              <ProtectedRoute
                exact
                path="/editprofile"
                component={EditProfile}
              />
              <ProtectedRoute
                exact
                path="/registerstore"
                component={EditStore}
              />
              <ProtectedRoute
                exact
                path="/editstore/:storeId"
                component={EditStore}
              />
              <ProtectedRoute exact path="/newad" component={CreateNewAd} />
              <ProtectedRoute exact path="/myads" component={MyAdsPage} />
              <ProtectedRoute
                exact
                path="/editad/:adId"
                component={CreateNewAd}
              />
              <ProtectedRoute
                exact
                path="/admin/categoryeditor"
                component={AddEditCategory}
              />

              <Route
                exact
                path="/bysubcategory/:subCatId"
                component={MainPage}
              />
              <Route exact path="/bycategory/:catId" component={MainPage} />
              <Route exact path="/bycity/:cityId" component={MainPage} />
              <Route exact path="/byuser/:adsByUserId" component={MainPage} />
              <Route exact path="/bystore/:adsByStoreId" component={MainPage} />

              <Route exact path="/" component={MainPage} />
              <Route path="*" component={NotFound} />
            </Switch>
          </Col>
        </Row>
        <Footer />
      </Container>
    </AppContextWrapper>
  );
}
export default App;
