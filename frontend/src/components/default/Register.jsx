import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import logo from "../images/logo/vaagdevi_logo.png";
import "../css/login_page.css";
import { API_BASE } from "../../apiBase";

export default function Register() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(true);
  const [faculty, setFaculty] = useState(false);
  const [loading, setLoading] = useState(true);

  const onSubmit = async (e) => {
    e.preventDefault();
    const userName = e.target.username.value.trim();
    const password = e.target.password.value;
    const confirm = e.target.confirm.value;

    if (!userName || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    const role = student ? "STUDENT" : "FACULTY";

    try {
      setLoading(false);
      await axios.post(
        `${API_BASE}/user/register`,
        { userName, password, role },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Account created. You can sign in now.");
      navigate("/login");
    } catch (err) {
      const data = err.response?.data;
      const serverMsg =
        data && typeof data === "object" && typeof data.message === "string"
          ? data.message
          : typeof data === "string"
            ? data
            : null;
      const fallback =
        err.response?.status === 409
          ? "This user ID is already registered."
          : "Registration failed. Please try again.";
      toast.error(serverMsg || fallback);
    } finally {
      setLoading(true);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Register — Institutional Data Center</title>
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
                <div className="card-body">
                  <div className="row top_logos_buttons">
                    <div className="col-4 offset-sm-1">
                      {student ? (
                        <button
                          type="button"
                          className="btn vaagdevi_color_clicked social_logos titles"
                        >
                          Student
                        </button>
                      ) : (
                        <p
                          className="p-titles"
                          onClick={() => {
                            setStudent(true);
                            setFaculty(false);
                          }}
                        >
                          Student
                        </p>
                      )}
                    </div>
                    <div className="col-4 offset-sm-1">
                      {faculty ? (
                        <button
                          type="button"
                          className="btn vaagdevi_color_clicked social_logos titles"
                        >
                          Faculty
                        </button>
                      ) : (
                        <p
                          className="p-titles"
                          onClick={() => {
                            setStudent(false);
                            setFaculty(true);
                          }}
                        >
                          Faculty
                        </p>
                      )}
                    </div>
                  </div>
                  <hr />
                  <div className="row mt-4">
                    <div className="col-10 offset-1">
                      <form method="post" onSubmit={onSubmit}>
                        <div className="mb-3">
                          <label htmlFor="reg-username" className="form-label text-dark">
                            {student ? "Student ID" : "Faculty ID"}
                          </label>
                          <input
                            type="text"
                            className="form-control social_logos border-dark"
                            name="username"
                            id="reg-username"
                            autoComplete="username"
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="reg-password" className="form-label text-dark">
                            Password
                          </label>
                          <input
                            type="password"
                            className="form-control social_logos border-dark"
                            name="password"
                            id="reg-password"
                            autoComplete="new-password"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="reg-confirm" className="form-label text-dark">
                            Confirm password
                          </label>
                          <input
                            type="password"
                            className="form-control social_logos border-dark"
                            name="confirm"
                            id="reg-confirm"
                            autoComplete="new-password"
                            required
                          />
                        </div>
                        {loading ? (
                          <button
                            type="submit"
                            className="btn btn-danger btn-block col-12 social_logos vaagdevi_color_clicked"
                          >
                            <h5 className="mb-0">Create account</h5>
                          </button>
                        ) : (
                          <button
                            type="submit"
                            disabled
                            className="btn btn-danger btn-block col-12 social_logos vaagdevi_color_clicked"
                          >
                            <h5 className="mb-0">
                              <span className="spinner-border" role="status" />{" "}
                              Please wait...
                            </h5>
                          </button>
                        )}
                      </form>
                      <p className="small text-muted mt-3">
                        After signing up, your profile may still need to be
                        completed by an administrator before the dashboard loads
                        fully.
                      </p>
                      <div className="col-12 mt-2 text-center text-muted">
                        Already have an account?{" "}
                        <Link to="/login" className="register-now">
                          Sign in
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
