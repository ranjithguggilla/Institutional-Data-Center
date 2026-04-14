import { toast } from "react-toastify";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../auth/AuthContext";
import axios from "axios";
import AdminTopBar from "./AdminTopBar";
import "../css/faculty_home.css";
import email_logo from "../images/logo/email_logo.png";
import telephone_logo from "../images/logo/telephone_logo.png";
import github_student_logo from "../images/logo/github_student_logo.png";
import linkedin_student_logo from "../images/logo/linkedin_student_logo.png";
import { Helmet } from "react-helmet-async";
import ChangePasswordModal from "./ChangePasswordModal";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function WatchFaculty() {
  const { facultyId } = useParams();
  const { jwtToken, logoutUser, redirectUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const [certifications, setCertifications] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [researchPapers, setResearchPapers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [personalDocuments, setPersonalDocuments] = useState([]);
  const [social, setSocial] = useState(null);

  const [faculty, setFaculty] = useState({});

  useEffect(() => {
    if (!jwtToken) {
      logoutUser();
    }
    redirectUser("ADMIN");

    getFacultyObject();
    getFacultySocial();
    getCertifications();
    getExperiences();
    getResearchPapers();
    getProjects();
    getDocuments();
    getFacultySocial();
  }, [logoutUser]);

  async function getFacultyObject() {
    try {
      const url = `${API_BASE}/faculty/get-faculty/${facultyId}`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      });

      if (!response.data.facultyId) {
        navigate("/admin/faculty");
      }

      setFaculty(response.data);
      await getFacultyImage(response.data.profilePicture);
    } catch (e) {
      navigate("/admin/faculty");
    }
  }

  async function getFacultyImage(imageUrl) {
    try {
      const response = await axios.get(`${API_BASE}${imageUrl}`, {
        headers: {
          Authorization: "Bearer " + jwtToken,
        },
        responseType: "arraybuffer",
      });
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      setFaculty((prevFaculty) => ({
        ...prevFaculty,
        profilePicture: URL.createObjectURL(blob),
      }));
    } catch (error) {
      return null;
    }
  }

  async function getFacultySocial() {
    try {
      const url =
        `${API_BASE}/social/get-all-socials-by-id/${facultyId}`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      });

      if (response.data) {
        setSocial(response.data[0]);
      }
    } catch (e) {}
  }

  async function getCertifications() {
    try {
      const url =
        `${API_BASE}/faculty-certification/get-all-certifications-by-id/${facultyId}`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      });
      const updatedCertifications = await Promise.all(
        response.data.map(async (certification) => {
          try {
            const response = await axios.get(
              `${API_BASE}${certification.certify}`,
              {
                headers: {
                  Authorization: "Bearer " + jwtToken,
                },
                responseType: "arraybuffer",
              }
            );
            const blob = new Blob([response.data], {
              type: response.headers["content-type"],
            });
            return { ...certification, certify: URL.createObjectURL(blob) };
          } catch (e) {
            console.log("Error fetching certification:", e);
            return certification;
          }
        })
      );
      setCertifications(updatedCertifications);
    } catch (e) {}
  }

  async function getExperiences() {
    try {
      const url =
        `${API_BASE}/experience/get-all-experiences-by-id/${facultyId}`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      });
      setExperiences(response.data);
    } catch (e) {
      console.log(e);
      logoutUser();
    }
  }

  async function getResearchPapers() {
    try {
      const url =
        `${API_BASE}/research-papers/get-all-papers-by-id/${facultyId}`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      });
      setResearchPapers(response.data);
    } catch (e) {
      console.log(e);
      logoutUser();
    }
  }

  async function getProjects() {
    try {
      const url =
        `${API_BASE}/faculty-project/get-all-projects-by-id/${facultyId}`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      });
      setProjects(response.data);
    } catch (e) {
      console.log(e);
      logoutUser();
    }
  }

  async function getDocuments() {
    try {
      const url =
        `${API_BASE}/personal-documents/get-documents/${facultyId}`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      });

      const documentsData = response.data;

      const aadharResponse = await axios.get(
        `${API_BASE}${documentsData.aadharCard}`,
        {
          headers: {
            Authorization: "Bearer " + jwtToken,
          },
          responseType: "arraybuffer",
        }
      );

      const panResponse = await axios.get(
        `${API_BASE}${documentsData.panCard}`,
        {
          headers: {
            Authorization: "Bearer " + jwtToken,
          },
          responseType: "arraybuffer",
        }
      );

      const aadharBlob = new Blob([aadharResponse.data], {
        type: aadharResponse.headers["content-type"],
      });
      const panBlob = new Blob([panResponse.data], {
        type: panResponse.headers["content-type"],
      });

      setPersonalDocuments({
        ...documentsData,
        aadharCard: URL.createObjectURL(aadharBlob),
        panCard: URL.createObjectURL(panBlob),
      });
    } catch (e) {}
  }

  async function uploadPassword(e) {
    e.preventDefault();

    if (e.target.currentPassword.value === e.target.newPassword.value) {
      toast.error("Both old and new passwords are same!");
      e.target.currentPassword.value = "";
      e.target.newPassword.value = "";
      e.target.newPasswordAgain.value = "";
      return;
    }

    if (e.target.newPassword.value !== e.target.newPasswordAgain.value) {
      toast.error("Both new passwords are not same!");
      e.target.currentPassword.value = "";
      e.target.newPassword.value = "";
      e.target.newPasswordAgain.value = "";
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE}/student/change-password`,
        {
          currentPassword: e.target.currentPassword.value,
          newPassword: e.target.newPassword.value,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        }
      );
      if (response.data) {
        toast.error("Your current password is incorrect");
        e.target.currentPassword.value = "";
        e.target.newPassword.value = "";
        e.target.newPasswordAgain.value = "";
        return;
      }
      toast.success("Password changed succesfully!!");
      const modal = document.getElementById("passwordModalButton");
      modal.click();
    } catch (error) {
      toast.error("Something Went Wrong, Please try again...");
      const modal = document.getElementById("passwordModalButton");
      modal.click();
    } finally {
      e.target.currentPassword.value = "";
      e.target.newPassword.value = "";
      e.target.newPasswordAgain.value = "";
    }
  }

  return (
    <div className="container-fluid">
      <AdminTopBar />
      <Helmet>
        <title>Faculty - {facultyId}</title>
      </Helmet>
      <div className="body-part pb-5 mt-3">
        <div className="row pt-4">
          <div className="col-xl-6 col-lg-8 offset-lg-2 offset-xl-3">
            <div className="card shadow">
              <div className="card-body">
                <div className="row mt-3">
                  <div className="col-sm-2 col-12 justify-content-sm-end align-items-sm-top d-flex">
                    <img
                      src={faculty.profilePicture}
                      alt="Profile"
                      className="img-fluid img-faculty-profile"
                    />
                  </div>
                  <div className="col-sm-10 mt-3 mt-sm-0">
                    <h3>{faculty.facultyName}</h3>
                    <div className="mt-2 text-muted">
                      <b>
                        Faculty ID: {facultyId} | Dept: {faculty.department}
                      </b>
                    </div>
                    <div className="mt-2 text-muted">
                      {faculty.designation}, Vaagdevi College of Engineering
                    </div>
                    <div className="row mt-2">
                      <div className="col-lg-4 col-sm-6 col-12 text-muted">
                        <img
                          src={telephone_logo}
                          alt="telephone_logo"
                          className="img-fluid icons-home-page"
                        />{" "}
                        {faculty.contactNumber}
                      </div>
                      <div className="col-lg-6 col-sm-6 col-12 text-muted">
                        <img
                          src={email_logo}
                          alt="email_logo"
                          className="img-fluid icons-home-page"
                        />{" "}
                        {faculty.emailId}
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col-12">
                        {social ? (
                          <>
                            <a
                              href={social.linkedin}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <img
                                src={linkedin_student_logo}
                                alt="linkedin_student_logo"
                                className="img-fluid linkedin-logo-faculty"
                              />
                            </a>
                            <a
                              href={social.github}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <img
                                src={github_student_logo}
                                alt="github_student_logo"
                                className="img-fluid github-logo-faculty"
                              />
                            </a>
                          </>
                        ) : (
                          <>
                            <img
                              src={linkedin_student_logo}
                              alt="linkedin_student_logo"
                              className="img-fluid linkedin-logo-faculty"
                            />
                            <img
                              src={github_student_logo}
                              alt="github_student_logo"
                              className="img-fluid github-logo-faculty"
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card mt-4 shadow">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h5>
                      <b>Certifications</b>
                    </h5>
                    Talk about the certifications you have completed, What
                    projects you undertook and what special skills you learned.
                    <button
                      type="button"
                      className="bi btn bi-caret-down-fill float-end"
                      data-bs-toggle="collapse"
                      data-bs-target="#certificationsDropdown"
                      aria-expanded="false"
                      aria-controls="certificationsDropdown"
                    ></button>
                  </div>
                </div>
              </div>
            </div>
            <div className="collapse shadow" id="certificationsDropdown">
              {certifications.map((certification, index) => (
                <div className="card card-body" key={index}>
                  <div className="row">
                    <div className="col-6">
                      <p>
                        Certification Name: {certification.certificationName}
                      </p>
                      <p>Expiry Date: {certification.expiryDate}</p>
                      <p>Verification: {certification.verification}</p>
                      <p>Type: {certification.type}</p>
                    </div>
                    <div className="col-6">
                      <img
                        src={certification.certify}
                        alt="certification_certificate"
                        className="img-fluid"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card mt-4 shadow">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h5>
                      <b>Research Papers</b>
                    </h5>
                    Talk about the Research Papers you have completed, What
                    projects you undertook and what special skills you learned.
                    <button
                      type="button"
                      className="bi btn bi-caret-down-fill float-end"
                      data-bs-toggle="collapse"
                      data-bs-target="#researchPapersDropdown"
                      aria-expanded="false"
                      aria-controls="researchPapersDropdown"
                    ></button>
                  </div>
                </div>
              </div>
            </div>
            <div className="collapse shadow" id="researchPapersDropdown">
              {researchPapers.map((researchPaper, index) => (
                <div className="card card-body" key={index}>
                  <div className="row">
                    <div className="col-12">
                      <p>Paper References: {researchPaper.paperReferences}</p>
                      <p>Published By: {researchPaper.publishedBy}</p>
                      <p>
                        Published Description:{" "}
                        {researchPaper.publishedDescription}
                      </p>
                      <p>Published Title: {researchPaper.publishedTitle}</p>
                      <p>Published Year: {researchPaper.publishedYear}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card mt-4 shadow">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h5>
                      <b>Experiences</b>
                    </h5>
                    Talk about the experiences you have completed, What projects
                    you undertook and what special skills you learned.
                    <button
                      type="button"
                      className="bi btn bi-caret-down-fill float-end"
                      data-bs-toggle="collapse"
                      data-bs-target="#experiencesDropdown"
                      aria-expanded="false"
                      aria-controls="experiencesDropdown"
                    ></button>
                  </div>
                </div>
              </div>
            </div>
            <div className="collapse shadow" id="experiencesDropdown">
              {experiences.map((experience, index) => (
                <div className="card card-body" key={index}>
                  <div className="row">
                    <div className="col-12">
                      <p>Organization Name: {experience.company}</p>
                      <p>Designation: {experience.designation}</p>
                      <p>Experience From: {experience.experienceFrom}</p>
                      <p>Experience To: {experience.experienceTo}</p>
                      <p>Experience Type: {experience.experienceType}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card mt-4 shadow">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h5>
                      <b>Projects</b>
                    </h5>
                    Talk about the projects that made you proud and contributed
                    to your learnings.
                    <button
                      type="button"
                      className="bi btn bi-caret-down-fill float-end"
                      data-bs-toggle="collapse"
                      data-bs-target="#projectsDropdown"
                      aria-expanded="false"
                      aria-controls="projectsDropdown"
                    ></button>
                  </div>
                </div>
              </div>
            </div>
            <div className="collapse shadow" id="projectsDropdown">
              {projects.map((project, index) => (
                <div className="card card-body" key={index}>
                  <p>Title: {project.projectTitle}</p>
                  <p>Description: {project.description}</p>
                  <p>Tags: {project.tags}</p>
                  <a href={project.url} rel="noreferrer" target="_blank">
                    {project.url}
                  </a>
                </div>
              ))}
            </div>

            <div className="card mt-4 shadow">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h5>
                      <b>Personal Documents</b>
                    </h5>
                    Talk about the Personal Documents that made you proud and
                    contributed to your learnings.
                    <button
                      type="button"
                      className="bi btn bi-caret-down-fill float-end"
                      data-bs-toggle="collapse"
                      data-bs-target="#personalDocumentsDropdown"
                      aria-expanded="false"
                      aria-controls="personalDocumentsDropdown"
                    ></button>
                  </div>
                </div>
              </div>
            </div>
            <div className="collapse shadow" id="personalDocumentsDropdown">
              <div className="row mt-1 mb-1">
                <div className="col-6 d-flex justify-content-center text-align-center">
                  <img
                    src={personalDocuments.aadharCard}
                    alt="Aadhar Card"
                    className="img-fluid"
                  />
                </div>
                <div className="col-6 d-flex justify-content-center text-align-center">
                  <img
                    src={personalDocuments.panCard}
                    alt="Pan Card"
                    className="img-fluid"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChangePasswordModal uploadPassword={uploadPassword} />
    </div>
  );
}
