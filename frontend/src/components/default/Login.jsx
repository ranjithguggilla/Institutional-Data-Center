import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../images/logo/vaagdevi_logo.png";
import AuthContext from "../auth/AuthContext";
import "../css/login_page.css";

export default function Login() {
  const { jwtToken } = useContext(AuthContext);
  const { loginUser } = useContext(AuthContext);
  const { redirectUser } = useContext(AuthContext);
  const [student, setStudent] = useState(true);
  const [faculty, setFaculty] = useState(false);
  const [admin, setAdmin] = useState(false);

  /** True while login request is in flight (shows disabled + spinner). */
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (jwtToken) {
      redirectUser(null, jwtToken);
    }
  }, [jwtToken]);

  return (
    <div>
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
                    <div className="col-3 offset-sm-1">
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
                            setAdmin(false);
                          }}
                        >
                          Student
                        </p>
                      )}
                    </div>
                    <div className="col-3 offset-sm-1">
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
                            setAdmin(false);
                          }}
                        >
                          Faculty
                        </p>
                      )}
                    </div>
                    <div className="col-3 offset-sm-1">
                      {admin ? (
                        <button
                          type="button"
                          className="btn vaagdevi_color_clicked social_logos titles"
                        >
                          Admin
                        </button>
                      ) : (
                        <p
                          className="p-titles"
                          onClick={() => {
                            setStudent(false);
                            setFaculty(false);
                            setAdmin(true);
                          }}
                        >
                          Admin
                        </p>
                      )}
                    </div>
                  </div>
                  <hr />
                  <div className="row mt-4">
                    <div className="col-10 offset-1">
                      <form
                        method="post"
                        onSubmit={(e) => loginUser(e, setIsSubmitting)}
                      >
                        <div className="mb-3">
                          <label htmlFor="username" className="form-label">
                            {student
                              ? "Student ID"
                              : faculty
                              ? "Faculty ID"
                              : admin
                              ? "Admin ID"
                              : ""}
                          </label>
                          <input
                            type="text"
                            className="form-control social_logos border-dark"
                            name="username"
                            id="username"
                            aria-describedby="helpId"
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="password" className="form-label">
                            Password
                          </label>
                          <input
                            type="password"
                            className="form-control social_logos border-dark"
                            name="password"
                            id="password"
                          />
                          <Link
                            to="/forgot-password"
                            className="register-now d-inline-block mt-1"
                          >
                            Forgot Password?
                          </Link>
                        </div>

                        {isSubmitting ? (
                          <button
                            type="submit"
                            disabled
                            className="btn btn-danger btn-block col-12 social_logos vaagdevi_color_clicked"
                          >
                            <h5 className="mb-0 d-flex align-items-center justify-content-center gap-2">
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden
                              />
                              Please wait...
                            </h5>
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="btn btn-danger btn-block col-12 social_logos vaagdevi_color_clicked "
                          >
                            <h5 className="mb-0">Sign in</h5>
                          </button>
                        )}
                      </form>
                      <div className="col-12 mt-2 text-center register_now text-muted">
                        Don't have an account yet?{" "}
                        <Link to="/register" className="register-now">
                          Register for free
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
