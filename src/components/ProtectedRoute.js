import { useContext } from 'react';
import { Redirect, Route, useLocation } from 'react-router-dom';
import { AppContext } from "../context/AppContext";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { pathname } = useLocation();
  const { isAuthenticated } = useContext(AppContext);
  return isAuthenticated ? (
    <Route {...rest} render={() => <Component />} />
  ) : (
    <Redirect to={{ pathname: '/', state: { next: pathname } }} />
  );
};

export default ProtectedRoute;
