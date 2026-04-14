import React, { useContext } from "react";
import logo from "../images/logo/vaagdevi_logo.png";
import user_logo from "../images/logo/profile_user_logo.png";
import "../css/admin_home.css";
import { Link } from "react-router-dom";
import AuthContext from "../auth/AuthContext";
import { Helmet } from "react-helmet-async";

export default function AdminTopBar() {
  const { logoutUser } = useContext(AuthContext);
  return (
    <>
      <Helmet>
        <title>Admin Home</title>
      </Helmet>
      <div className="row mt-1 shadow">
        <div className="col-lg-3 col-md-4 col-sm-5 col-6">
          <img
            src={logo}
            alt="vaagdevi_logo"
            className="img-fluid vaagdevi_logo"
          />
        </div>
        <div className="col-lg-9 col-md-8 col-sm-7 col-6 d-flex justify-content-end">
          <div className="align-items-center">
            <li className="nav-item btn border-secondary navbar_button dropdown mt-3 mb-2 li_padding">
              <Link
                className="nav-link dropdown-toggle"
                to="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={user_logo}
                  alt="user_logo"
                  className="img-fluid user_logo"
                />
                {" Principal"}
              </Link>
              <ul className="dropdown-menu mt-3">
                <li>
                  <Link
                    className="dropdown-item hover-animation"
                    to="/admin/student"
                  >
                    Students
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item hover-animation"
                    to="/admin/faculty"
                  >
                    Faculty
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item hover-animation"
                    data-bs-toggle="modal"
                    data-bs-target="#passwordBackdrop"
                    to="#"
                  >
                    Change Password
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={() => logoutUser()}
                    className="dropdown-item hover-animation"
                    to="/login"
                  >
                    Logout
                  </Link>
                </li>
              </ul>
            </li>
          </div>
        </div>
      </div>
    </>
  );
}
