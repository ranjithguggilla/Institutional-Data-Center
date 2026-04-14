import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../auth/AuthContext";
import { Link, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import logo from "../images/logo/vaagdevi_logo.png";
import user_logo from "../images/logo/profile_user_logo.png";
import "../css/faculty_home.css";
import { Helmet } from "react-helmet-async";
import email_logo from "../images/logo/email_logo.png";
import telephone_logo from "../images/logo/telephone_logo.png";
import github_student_logo from "../images/logo/github_student_logo.png";
import linkedin_student_logo from "../images/logo/linkedin_student_logo.png";
import upload_image_logo from "../images/logo/upload_logo_student.jpg";
import { toast } from "react-toastify";
import Modals from "./FacultyModals";
import { API_BASE } from "../../apiBase";

export default function FacultyHome() {
  const { logoutUser, jwtToken, redirectUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");

  const [faculty, setFaculty] = useState({});
  const [hod, setHod] = useState(false);
  const [departmentStudents, setDepartmentStudents] = useState([]);
  const [profilePictureError, setProfilePictureError] = useState(false);
  const [socialProfileError, setSocialProfileError] = useState(true);

  const [social, setSocial] = useState({});
  const [certifications, setCertifications] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [researchPapers, setResearchPapers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [personalDocuments, setPersonalDocuments] = useState([]);

  const [renderPage, setRenderPage] = useState(false);
  const [addDocuments, setAddDocuments] = useState(true);

  useEffect(() => {
    async function getFacultyObject() {
      try {
        const url =
          `${API_BASE}/faculty/get-faculty/${jwtDecode(jwtToken).sub}`;
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        });
        setFaculty(response.data);
        await getFacultyImage(response.data.profilePicture);
        if (response.data.designation === "HOD") {
          setHod(true);
          await getDepartmentStudents(response.data.department);
        }
      } catch (e) {
        console.log(e);
        logoutUser();
      }
    }

    async function getDepartmentStudents(department) {
      try {
        const url =
          `${API_BASE}/student/get-all-students-by-department/${department}`;
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        });

        const studentsWithImages = await Promise.all(
          response.data.map(async (student) => {
            const imageData = await getStudentImage(student.profilePicture);
            if (imageData !== null) {
              return {
                ...student,
                profilePicture: URL.createObjectURL(imageData),
              };
            }
            return { ...student, profilePicture: null };
          })
        );

        async function getStudentImage(imageUrl) {
          try {
            const response = await axios.get(
              `${API_BASE}${imageUrl}`,
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
            return blob;
          } catch (error) {
            return null;
          }
        }

        setDepartmentStudents(studentsWithImages);
      } catch (e) {
        console.log(e);
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
        setProfilePictureError(true);
      }
    }

    getFacultyObject();
    try {
      setUsername(jwtDecode(jwtToken).sub);
      redirectUser("FACULTY");
    } catch (e) {}
  }, [renderPage]);

  useEffect(() => {
    getCertifications();
    getExperiences();
    getResearchPapers();
    getProjects();
    getDocuments();
    getFacultySocial();
  }, [renderPage]);

  if (!jwtToken) {
    return <Navigate to="/login" />;
  }

  async function getFacultySocial() {
    try {
      const url = `${API_BASE}/social/get-all-socials-by-id`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      });
      setSocial(response.data[0]);
      if (Object.keys(response.data).length !== 0) {
        setSocialProfileError(true);
      } else {
        setSocialProfileError(false);
      }
    } catch (e) {
      console.log(e);
      logoutUser();
    }
  }

  async function uploadImage(event) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        `${API_BASE}/faculty/set-faculty-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + jwtToken,
          },
        }
      );
      setRenderPage(true);
      toast.success("Image has been successfully uploaded!");
    } catch (error) {
      toast.error("Error Uploading Image, Please upload lower than 10MB");
    }
  }

  async function uploadCertification(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", e.target.achievementFile.files[0]);
    formData.append("certificationName", e.target.certificationName.value);
    formData.append("expiryDate", e.target.expiryDate.value);
    formData.append("verification", e.target.verification.value);
    formData.append("type", e.target.type.value);

    try {
      const response = await axios.post(
        `${API_BASE}/faculty-certification/add-certification`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + jwtToken,
          },
        }
      );
      setRenderPage(true);
      toast.success("Achievement Uploaded!");
      const modal = document.getElementById("achievementModalButton");
      modal.click();
    } catch (error) {
      console.log(error);
      toast.error("Error Uploading Image, Please upload lower than 10MB");
      const modal = document.getElementById("achievementModalButton");
      modal.click();
    }
  }

  async function getCertifications() {
    try {
      const url =
        `${API_BASE}/faculty-certification/get-all-certifications-by-id`;
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
    } catch (e) {
      console.log(e);
      logoutUser();
    }
  }

  async function uploadExperience(e) {
    e.preventDefault();

    const experienceData = {
      company: e.target.organizationName.value,
      designation: e.target.designation.value,
      experienceFrom: e.target.experienceFrom.value,
      experienceTo: e.target.experienceTo.value,
      experienceType: e.target.experienceType.value,
    };

    try {
      const response = await axios.post(
        `${API_BASE}/experience/add-experience`,
        experienceData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        }
      );
      toast.success("Experience Uploaded!");
      const modal = document.getElementById("experienceModalButton");
      modal.click();
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong, Please try again...");
      const modal = document.getElementById("experienceModalButton");
      modal.click();
    }
  }

  async function getExperiences() {
    try {
      const url = `${API_BASE}/experience/get-all-experiences-by-id`;
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

  async function uploadResearchPaper(e) {
    e.preventDefault();

    const paperData = {
      publishedTitle: e.target.publishedTitle.value,
      publishedDescription: e.target.publishedDescription.value,
      publishedBy: e.target.publishedBy.value,
      paperReferences: e.target.paperReferences.value,
      publishedYear: e.target.publishedYear.value,
    };

    try {
      const response = await axios.post(
        `${API_BASE}/research-papers/add-paper`,
        paperData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        }
      );
      toast.success("Paper Uploaded!");
      const modal = document.getElementById("researchPaperModalButton");
      modal.click();
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong, Please try again...");
      const modal = document.getElementById("researchPaperModalButton");
      modal.click();
    }
  }

  async function getResearchPapers() {
    try {
      const url = `${API_BASE}/research-papers/get-all-papers-by-id`;
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

  async function uploadProject(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE}/faculty-project/add-project`,
        {
          projectTitle: e.target.title.value,
          description: e.target.description.value,
          tags: e.target.tags.value,
          url: e.target.url.value,
          verificationUrl: e.target.verification_url.value,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        }
      );
      setRenderPage(true);
      toast.success("Project Uploaded!");
      const modal = document.getElementById("projectModalButton");
      modal.click();
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong, Please try again...");
      const modal = document.getElementById("projectModalButton");
      modal.click();
    }
  }

  async function getProjects() {
    try {
      const url =
        `${API_BASE}/faculty-project/get-all-projects-by-id`;
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

  async function uploadDocuments(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("aadharCard", e.target.aadharCard.files[0]);
    formData.append("panCard", e.target.panCard.files[0]);

    try {
      const response = await axios.post(
        `${API_BASE}/personal-documents/add-documents`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + jwtToken,
          },
        }
      );
      setRenderPage(true);
      toast.success("Personal Documents Uploaded!");
      const modal = document.getElementById("personalDocumentModalButton");
      modal.click();
    } catch (error) {
      console.log(error);
      toast.error("Error Uploading Image, Please upload lower than 10MB");
      const modal = document.getElementById("personalDocumentModalButton");
      modal.click();
    }
  }

  async function getDocuments() {
    try {
      const url = `${API_BASE}/personal-documents/get-documents`;
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
    } catch (e) {
      setAddDocuments(false);
    }
  }

  async function uploadSocial(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE}/social/add-social`,
        {
          linkedin: e.target.linkedin.value,
          github: e.target.github.value,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        }
      );
      setRenderPage(true);
      toast.success("Social Uploaded!");
      const modal = document.getElementById("socialModalButton");
      modal.click();
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong, Please try again...");
      const modal = document.getElementById("socialModalButton");
      modal.click();
    }
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
        `${API_BASE}/faculty/change-password`,
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

  async function uploadStudentPassword(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE}/student/change-password-hod/${e.target.studentId.value}`,
        {
          currentPassword: "",
          newPassword: e.target.newPasswordStudent.value,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        }
      );
      toast.success("Password changed succesfully!!");
      e.target.newPasswordStudent.value = "";
      const modal = document.getElementById("studentPasswordModalButton");
      modal.click();
    } catch (e) {
      toast.error("Something Went Wrong, Please try again...");
      e.target.newPasswordStudent.value = "";
      const modal = document.getElementById("studentPasswordModalButton");
      modal.click();
    }
  }

  return (
    <div className="container-fluid">
      <Helmet>
        <title>Faculty Home</title>
      </Helmet>
      <div className="row mt-1 shadow">
        <div className="col-lg-3 col-md-4 col-sm-5 col-12">
          <img
            src={logo}
            alt="vaagdevi_logo"
            className="img-fluid vaagdevi_logo"
          />
        </div>
        <div className="col-lg-9 mb-2 col-md-8 col-sm-7 col-12 d-flex justify-content-end">
          <div className="align-items-center">
            <li className="nav-item btn border-secondary navbar_button dropdown mt-3 li_padding">
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
                {" " + faculty.facultyName}
              </Link>
              <ul className="dropdown-menu mt-3">
                <li>
                  <Link className="dropdown-item hover-animation" to="/faculty">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    data-bs-toggle="modal"
                    data-bs-target="#passwordBackdrop"
                    className="dropdown-item hover-animation"
                    to="#"
                  >
                    Change Password
                  </Link>
                </li>
                {hod && (
                  <>
                    <li>
                      <Link
                        data-bs-toggle="modal"
                        data-bs-target="#studentPasswordBackdrop"
                        className="dropdown-item hover-animation"
                        to="#"
                      >
                        Student Passwords
                      </Link>
                    </li>
                  </>
                )}
                <li>
                  <Link
                    onClick={() => logoutUser()}
                    className="dropdown-item hover-animation"
                    to="#"
                  >
                    Logout
                  </Link>
                </li>
              </ul>
            </li>
          </div>
        </div>
      </div>
      <div className="body-part pb-5 mt-3">
        <div className="row pt-4">
          <div className="col-xl-6 col-lg-8 offset-lg-2 offset-xl-3">
            <div className="card shadow">
              <div className="card-body">
                <div className="row mt-3">
                  <div className="col-sm-2 col-12 justify-content-sm-end align-items-sm-top d-flex">
                    {!profilePictureError ? (
                      <img
                        src={faculty.profilePicture}
                        alt="Profile"
                        className="img-fluid img-faculty-profile"
                      />
                    ) : (
                      <img
                        src={upload_image_logo}
                        onClick={() =>
                          document.getElementById("fileInput").click()
                        }
                        alt="Upload"
                        className="img-fluid img-upload-file"
                      />
                    )}
                    <input
                      id="fileInput"
                      type="file"
                      accept="image/*"
                      onChange={uploadImage}
                      className="img-upload-file-input"
                    />
                  </div>
                  <div className="col-sm-10 mt-3 mt-sm-0">
                    <h3>{faculty.facultyName}</h3>
                    <div className="mt-2 text-muted">
                      <b>
                        Faculty ID: {username} | Dept: {faculty.department}
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
                        <div>
                          {socialProfileError ? (
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
                            <button
                              data-bs-toggle="modal"
                              data-bs-target="#socialBackdrop"
                              className="btn btn-dark text-white"
                            >
                              Add Social?
                            </button>
                          )}
                        </div>
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
                    <button
                      type="button"
                      className="bi btn bi-plus-lg float-end"
                      data-bs-toggle="modal"
                      data-bs-target="#achievementBackdrop"
                    ></button>
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
                    <button
                      type="button"
                      className="bi btn bi-plus-lg float-end"
                      data-bs-toggle="modal"
                      data-bs-target="#researchPaperBackdrop"
                    ></button>
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
                    <button
                      type="button"
                      className="bi btn bi-plus-lg float-end"
                      data-bs-toggle="modal"
                      data-bs-target="#experienceBackdrop"
                    ></button>
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
                    <button
                      type="button"
                      className="bi btn bi-plus-lg float-end"
                      data-bs-toggle="modal"
                      data-bs-target="#projectBackdrop"
                    ></button>
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
                    {!addDocuments && (
                      <button
                        type="button"
                        className="bi btn bi-plus-lg float-end"
                        data-bs-toggle="modal"
                        data-bs-target="#personalDocumentBackdrop"
                      ></button>
                    )}
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
                {addDocuments && (
                  <>
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
                  </>
                )}
              </div>
            </div>

            {hod && (
              <>
                <div className="card mt-4 shadow">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-12">
                        <h5>
                          <b>Department Students</b>
                        </h5>
                        Check about the Department Students that made you proud
                        and contributed to your learnings.
                        <button
                          type="button"
                          className="bi btn bi-caret-down-fill float-end"
                          data-bs-toggle="collapse"
                          data-bs-target="#studentsDocumentsDropdown"
                          aria-expanded="false"
                          aria-controls="studentsDocumentsDropdown"
                        ></button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="collapse" id="studentsDocumentsDropdown">
                  <div className="row mt-1 mb-1">
                    {departmentStudents.map((student, index) => {
                      return (
                        <div key={index}>
                          <div className="card mt-2 mb-2 shadow">
                            <div className="card-body">
                              <div className="row">
                                <div className="col-sm-2 col-12 justify-content-sm-end align-items-sm-top d-flex">
                                  <img
                                    src={student.profilePicture}
                                    alt="No profile pic"
                                    className="img-fluid img-student-profile"
                                  />
                                </div>
                                <div className="col-sm-10 mt-2 col-12">
                                  <h5>
                                    <b>{student.studentName}</b> |{" "}
                                    {student.studentId}
                                  </h5>
                                  <div className="row">
                                    <div className="col-sm-3 col-4 text-muted">
                                      <i className="bi bi-dot"></i> CGPA:{" "}
                                      {student.cgpa}
                                    </div>
                                    <div className="col-5 text-muted">
                                      <i className="bi bi-dot"></i> Dept:{" "}
                                      {student.department}
                                    </div>
                                    <div className="col-sm-4 col-3 text-muted">
                                      <i className="bi bi-dot"></i>{" "}
                                      {student.batch}
                                    </div>
                                  </div>
                                  <Link
                                    to={"/faculty/" + student.studentId}
                                    className="vaagdevi_link_colors nav-link mt-1"
                                  >
                                    See Full Profile
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            <Modals
              uploadAchievement={uploadCertification}
              uploadExperience={uploadExperience}
              uploadResearchPaper={uploadResearchPaper}
              uploadProject={uploadProject}
              uploadDocuments={uploadDocuments}
              uploadSocial={uploadSocial}
              uploadPassword={uploadPassword}
              departmentStudents={departmentStudents}
              uploadStudentPassword={uploadStudentPassword}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
