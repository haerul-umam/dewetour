import { Redirect, Route } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { useContext } from "react";
import Loading from "../component/Loading/Loading"

export function PrivateRouteUser({component:Component,...rest}) {
    const [stateUser,] = useContext(AuthContext)
    
    function checkUser(props){
        
        if (!localStorage.token && stateUser.forward){  //handle logout
            return <Redirect to="/" />
        }

        if (stateUser.isLogin && stateUser.user.role === "user"){
            return <Component {...props}/>
        }

        if (stateUser.user.role === "admin"){
            return <Redirect to="/" />
        }
        return <Loading/>
        

    }
    
    return (
        <>
            <Route {...rest} render={(props) => (checkUser(props))} />
        </>
    )
}


export function PrivateRouteAdmin({component:Component,...rest}){
    const [stateUser,] = useContext(AuthContext)

    function checkUser(props){
        
        if (!localStorage.token && stateUser.forward){
            return <Redirect to="/" />
        }

        if (stateUser.isLogin && stateUser.user.role === "admin"){
            return <Component {...props}/>
        }

        if (stateUser.user.role === "user"){
            return <Redirect to="/" />
        }

        return <Loading/>

        
    }
    
    return (
        <>
            <Route {...rest} render={(props) => (checkUser(props))} />
        </>
    )
}