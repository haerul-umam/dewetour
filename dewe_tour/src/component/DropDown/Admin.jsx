import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import "./DropDown.css";

export default function Admin({ onLogout }) {
  return (
    <>
      <Dropdown>
        <Dropdown.Toggle variant="light" id="dropdown-basic">
          <img src="/assets/images/avatar.png" alt="" />
        </Dropdown.Toggle>

        <Dropdown.Menu align="end">
          <li>
            <Link className="dropdown-item" to="/master-data">
              <img src="/assets/icons/journey.png" alt="trip" className="me-2"/> Data
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/transaction">
              <img src="/assets/icons/bill.png" alt="transaction" className="me-2"/> Transaction
            </Link>
          </li>
          <hr />
          <li>
            <button className="dropdown-item" onClick={() => onLogout({ type: "LOGOUT" })}>
              <img src="/assets/icons/logout.png" alt="logout" className="me-2"/> Logout
            </button>
          </li>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}
