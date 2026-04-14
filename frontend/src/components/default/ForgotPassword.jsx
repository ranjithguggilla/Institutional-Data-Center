import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import logo from "../images/logo/vaagdevi_logo.png";
import "../css/login_page.css";

export default function ForgotPassword() {
  return (
    <div>
      <Helmet>
        <title>Forgot password — Institutional Data Center</title>
        <body className="bg-white" />
      </Helmet>
      <div className="container-fluid no-padding">
        <div className="row no-gutters">
          <div className="col-lg-7 no-padding col-12">
            <div className="container-fluid blurred_image image_container" />
          </div>
          <div className="col-lg-5 col-10 mt-lg-5 no-gutters text-white top_login_page">
            <div className="text-center mt-5">
              <img
                src={logo}
                alt="vaagdevi_logo"
                className="img-fluid vaagdevi_logo"
              />
            </div>
            <div className="col-10 col-md-8 offset-md-2 col-lg-10 offset-lg-1 offset-1">
              <div className="card card-border-radius mt-4 login-card-foreground">
                <div className="card-body p-4">
                  <h5 className="text-dark mb-3">Forgot password</h5>
                  <p className="text-muted small">
                    This application does not support automated password reset
                    yet. Please contact your department administrator or HOD to
                    reset your account password.
                  </p>
                  <Link
                    to="/login"
                    className="btn btn-danger vaagdevi_color_clicked social_logos col-12 mt-2"
                  >
                    Back to sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
