import { Link } from "react-router-dom";
import { Dropdown, Image } from "react-bootstrap";
import { useEffect, useState } from "react";
import "./DropDown.css";

export default function User(props) {
  const { onLogout, user } = props
  const [avatar, setAvatar] = useState(null)
 
  const setAva = () =>{
  
    if (user?.user.image){
      return user?.user.image
    }
    if (user?.user.gender === "male"){
      return "/assets/icons/male.png"
    }
    return "/assets/icons/female.png"
  }

  useEffect(()=> {
    setAvatar(setAva())
    //eslint-disable-next-line
  },[])
  return (
    <>
      <Dropdown>
        <Dropdown.Toggle variant="light" id="dropdown-basic">
          <Image src={avatar} alt="" id="ava" roundedCircle/>
        </Dropdown.Toggle>

        <Dropdown.Menu align="end">
          <li>
            <Link className="dropdown-item" to="/profile">
              <img src="/assets/icons/user.png" alt="profile" className="me-2"/>Profile
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/payment">
              <img src="/assets/icons/bill.png" alt="payment" className="me-2" />Payment
            </Link>
          </li>
          <hr />
          <li>
            <button className="dropdown-item" onClick={() => onLogout({ type: "LOGOUT" })}>
              <img src="/assets/icons/logout.png" alt="logout" className="me-2"/>Logout
            </button>
          </li>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}
