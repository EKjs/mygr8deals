import { useState, useEffect, createContext } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useHistory } from "react-router";

export const AppContext = createContext();

const AppContextWrapper = ({ children }) => {
  const hist = useHistory();
  const authToken = localStorage.getItem("token");
/*   const userName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId"); */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  /* useEffect(() => authToken && setIsAuthenticated(true), [authToken]); */

  const [categoriesList, setCategoriesList] = useState([]);
  const [subCategoriesList, setSubCategoriesList] = useState([]);
  //const [currentlyLoadedAds,setCurrentlyLoadedAds] = useState([]);
//  const [userType,setUserType] = useState(null);
  const [updateMenuItems,setUpdateMenuItems] = useState(true);
  const [searchParams,setSearchParams] = useState({});

  useEffect(()=>{
    const loadMenuData = async () => {
      try {
        setLoading(true);
        const { data:catList } = await axios.get(`${process.env.REACT_APP_BE}categories`);
        setCategoriesList(catList);
        const { data:subCatList } = await axios.get(`${process.env.REACT_APP_BE}subcategories`);
        setSubCategoriesList(subCatList);
        setLoading(false);
        //console.log('c',catList,'sc',subCatList);
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

    };
    loadMenuData();
},[updateMenuItems])

  useEffect(() => {
    if (authToken){
      const decoded = jwt_decode(authToken);
      console.log(decoded,Date.now());
      console.log(new Date(decoded.exp*1000).toLocaleString());
      if(Date.now()<decoded.exp*1000){
        console.log('token not expired');
        setIsAuthenticated(true)
      }else{
        console.log('token expired');
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        localStorage.removeItem("userType");
        setIsAuthenticated(false);
        hist.push('/signin');
      }
    }
  }, [authToken,hist]);

  const signUp = async (data) => {
    if (data.password !== data.passwordConfirm) {
      setError("Passwords do not match");
      setTimeout(() => setError(null), 3000);
      return;
    }
    try {
      setLoading(true);
      const {
        data: { token, userName, userId, userType },
      } = await axios.post(
        `${process.env.REACT_APP_BE}users/`,
        data
      );
      localStorage.setItem("token", token);
      localStorage.setItem("userName", userName);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userType", userType);
      setIsAuthenticated(true);
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
  };

  const signIn = async (data) => {
    try {
      setLoading(true);
      const {
        data: { token, userName, userId, userType },
      } = await axios.post(
        `${process.env.REACT_APP_BE}users/signin`,
        data
      );
      localStorage.setItem("token", token);
      localStorage.setItem("userName", userName);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userType", userType);
      setIsAuthenticated(true);
      setLoading(false);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error);
        setTimeout(() => setError(null), 5000);
        setLoading(false);
      } else {
        setError(error.message);
        setTimeout(() => setError(null), 5000);
        setLoading(false);
      }
    }
  };

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
  };

  return (
    <AppContext.Provider
      value={{ searchParams,setSearchParams,categoriesList,subCategoriesList, loading, isAuthenticated, error, signUp, signIn, signOut, setLoading, setError,updateMenuItems,setUpdateMenuItems }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextWrapper;
