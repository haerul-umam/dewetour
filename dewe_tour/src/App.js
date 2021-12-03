import { Route, Switch } from "react-router-dom"
import { useContext, useEffect } from "react"
import { AuthContext } from "./context/authContext";

import { API, setAuthToken } from "./config/api";
import {PrivateRouteUser, PrivateRouteAdmin} from "./config/privateRoute";

import "bootstrap/dist/css/bootstrap.min.css"
import 'react-notifications/lib/notifications.css';
import './index.css';

import Home from "./pages/Home";
import TourDetail from "./pages/TourDetail";
import Payment from "./pages/Payment";
import Profile from "./pages/Profile";
import AdminData from "./pages/AdminData";
import Transactions from "./pages/Transactions";
import AddTrip from "./pages/AddTrip";
import SearchTrip from "./pages/SearchTrip";
import AddCountryAdmin from "./pages/AddCountryAdmin";
import EditCountryAdmin from "./pages/EditCountryAdmin";


function App() {
  const [,dispatchUser] = useContext(AuthContext)


  const checkAuth = async () => {

    try {
      if(localStorage.token){
        setAuthToken(localStorage.getItem("token"))
        
        const response = await API.get("/check-user")
  
        let payload = response.data?.user 
        payload.token = localStorage.token
       
        dispatchUser({
          type:"AUTH_SUCCESS",
          payload
        })
      }
    }catch(e) {
      dispatchUser({type:"AUTH_ERROR"})
      console.log(e)
    }
  }

  useEffect(() => {
    checkAuth()
    //eslint-disable-next-line
  },[])

  return (
    <>
     <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/trip/:id" component={TourDetail} />
        <Route path="/search" component={SearchTrip} />
        <PrivateRouteUser path="/payment" component={Payment} />
        <PrivateRouteUser path="/profile" component={Profile} />
        <PrivateRouteAdmin path="/master-data" component={AdminData} />
        <PrivateRouteAdmin path="/transaction" component={Transactions} />
        <PrivateRouteAdmin path="/add-trip" component={AddTrip} />
        <PrivateRouteAdmin path="/add-country" component={AddCountryAdmin} />
        <PrivateRouteAdmin path="/edit-country/:id" component={EditCountryAdmin} />
     </Switch>
    </>
  );
}

export default App;
