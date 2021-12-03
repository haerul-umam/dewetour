import style from "./Header.module.css"
import Login from "../Modal/Login";
import Register from "../Modal/Register"

import { useContext } from "react";
import { Link } from "react-router-dom";
import Admin from "../DropDown/Admin";
import User from "../DropDown/User";

import { AuthContext } from "../../context/authContext"
import { ModalContext } from "../../context/modalContext"

function LoginRegister() {
  const [modal, setModal] = useContext(ModalContext)
 
  const showLogin = () => {
    setModal({ type: "login", payload: true });
  };

  const showRegister = () => {
    setModal({ type: "register", payload: true });
  };

  const closeModal = () => {
    setModal({ type: "close" });
  };


  return (
    <>
      <Login modal={{show:modal.loginShow, closeModal, setModal}} />
      <Register modal={{show:modal.registerShow, closeModal, setModal}} />
      <li className="nav-item">
        <button className={`${style.Link} btn nav-link me-1`} onClick={showLogin}>
          Login
        </button>
      </li>
      <li className="nav-item">
        <button className={`${style.Link} btn btn-warning nav-link border-warning`} onClick={showRegister}>
          Register
        </button>
      </li>
    </>
  );
}


export default function Header() {
  const [stateUser, dispatchUser] = useContext(AuthContext)
  
  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container-fluid">
        <Link to="/">
          <img src="/assets/images/logo.png" alt="logo" />
        </Link>
        <ul className="nav d-flex align-items-center">
        {
          stateUser.isLogin ? 
          <> {stateUser.user.role === "admin" ?<><Admin onLogout={dispatchUser} /> </>
          : 
          <><User onLogout={dispatchUser} user={stateUser} /> </>}
          </> 
          : 
          <LoginRegister/>
        }
        </ul>
      </div>
    </nav>
  );
}
