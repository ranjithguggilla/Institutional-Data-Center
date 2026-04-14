import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../auth/AuthContext";
import logo from "../images/logo/vaagdevi_logo.png";
import user_logo from "../images/logo/profile_user_logo.png";
import email_logo from "../images/logo/email_logo.png";
import telephone_logo from "../images/logo/telephone_logo.png";
import github_student_logo from "../images/logo/github_student_logo.png";
import linkedin_student_logo from "../images/logo/linkedin_student_logo.png";
import upload_image_logo from "../images/logo/upload_logo_student.jpg";
import "../css/student_home.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import Modals from "./Modals";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function StudentHome() {
  const { jwtToken, logoutUser, redirectUser } = useContext(AuthContext);
  const [student, setStudent] = useState({});
  const [profilePictureError, setProfilePictureError] = useState(false);
  const [username, setUsername] = useState("");
  const [renderPage, setRenderPage] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    getStudentObject();
    try {
      setUsername(jwtDecode(jwtToken).sub);
    } catch (e) {}
  }, []);

  useEffect(() => {
    async function getSkills() {
      try {
        const url = `${API_BASE}/skill/get-all-skills-by-id`;
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        });
        setSkills(response.data);
      } catch (e) {
        logoutUser();
      }
    }

    async function getProjects() {
      try {
        const url = `${API_BASE}/project/get-all-projects-by-id`;
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        });
        setProjects(response.data);
      } catch (e) {
        logoutUser();
      }
    }

    async function getAchievements() {
      try {
        const url =
          `${API_BASE}/certification/get-all-certifications-by-id`;
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        });
        const updatedAchievements = await Promise.all(
          response.data.map(async (achievement) => {
            try {
              const response = await axios.get(
                `${API_BASE}${achievement.certify}`,
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
              return { ...achievement, certify: URL.createObjectURL(blob) };
            } catch (e) {
              console.log("Error fetching achievement:", e);
              return achievement;
            }
          })
        );
        setAchievements(updatedAchievements);
      } catch (e) {
        logoutUser();
      }
    }

    async function getInternships() {
      try {
        const url =
          `${API_BASE}/internship/get-all-internships-by-id`;
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        });
        const updatedInternships = await Promise.all(
          response.data.map(async (internship) => {
            try {
              const response = await axios.get(
                `${API_BASE}${internship.verification}`,
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
              const certifyUrl = URL.createObjectURL(blob);
              return { ...internship, verification: certifyUrl };
            } catch (e) {
              console.log("Error fetching verification:", e);
              return internship;
            }
          })
        );
        setInternships(updatedInternships);
      } catch (e) {
        console.log("Error fetching internships:", e);
        logoutUser();
      }
    }

    async function fetchData() {
      await getSkills();
      await getProjects();
      await getAchievements();
      await getInternships();
    }

    fetchData();
  }, [renderPage]);

  useEffect(() => {
    if (!jwtToken) {
      logoutUser();
    }
    redirectUser("STUDENT");
  }, [logoutUser]);

  async function getStudentObject() {
    try {
      const url =
        `${API_BASE}/student/get-student/${jwtDecode(jwtToken).sub}`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      });
      setStudent(response.data);
      await getStudentImage(response.data.profilePicture);
    } catch (e) {
      logoutUser();
    }
  }

  async function uploadSkill(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE}/skill/add-skill`,
        {
          domain: e.target.domain.value,
          skill: e.target.skill.value,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        }
      );
      setRenderPage(true);
      toast.success("Skill Uploaded!");
      const modal = document.getElementById("skillModalButton");
      modal.click();
      e.target.domain.value = "";
      e.target.skill.value = "";
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong, Please try again...");
      const modal = document.getElementById("skillModalButton");
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

    if (e.target.newPassword.value != e.target.newPasswordAgain.value) {
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

  async function uploadAchievement(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", e.target.achievementFile.files[0]);
    formData.append("certificationName", e.target.certificationName.value);
    formData.append("expiryDate", e.target.expiryDate.value);
    formData.append("verification", e.target.verification.value);
    formData.append("type", e.target.type.value);

    try {
      const response = await axios.post(
        `${API_BASE}/certification/add-certification`,
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
      e.target.certificationName.value = "";
      e.target.expiryDate.value = "";
      e.target.verification.value = "";
      e.target.type.value = "";
      e.target.achievementFile.value = null;
    } catch (error) {
      console.log(error);
      toast.error("Error Uploading Image, Please upload lower than 10MB");
      const modal = document.getElementById("achievementModalButton");
      modal.click();
    }
  }

  async function uploadProject(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE}/project/add-project`,
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
      e.target.title.value = "";
      e.target.description.value = "";
      e.target.tags.value = "";
      e.target.url.value = "";
      e.target.verification_url.value = "";
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, Please try again...");
      const modal = document.getElementById("projectModalButton");
      modal.click();
    }
  }

  async function uploadInternship(e) {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("internshipName", e.target.internshipName.value);
      formData.append("companyName", e.target.companyName.value);
      formData.append("cdomain", e.target.domain.value);
      formData.append("startDate", e.target.startDate.value);
      formData.append("endDate", e.target.endDate.value);
      formData.append("file", e.target.internshipFile.files[0]);
      formData.append("internshipType", e.target.internshipType.value);

      const response = await axios.post(
        `${API_BASE}/internship/add-internship`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + jwtToken,
          },
        }
      );
      setRenderPage(true);
      toast.success("Internship Uploaded!");
      const modal = document.getElementById("internshipModalButton");
      modal.click();
      e.target.internshipName.value = "";
      e.target.companyName.value = "";
      e.target.domain.value = "";
      e.target.startDate.value = "";
      e.target.endDate.value = "";
      e.target.internshipFile.value = null;
      e.target.internshipType.value = "";
    } catch (error) {
      console.log(error);
      toast.error("Error Uploading Image, Please upload lower than 10MB");
      const modal = document.getElementById("internshipModalButton");
      modal.click();
    }
  }

  async function getStudentImage(imageUrl) {
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
      setStudent((prevStudent) => ({
        ...prevStudent,
        profilePicture: URL.createObjectURL(blob),
      }));
    } catch (error) {
      setProfilePictureError(true);
    }
  }

  async function uploadImage(event) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        `${API_BASE}/student/set-student-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + jwtToken,
          },
        }
      );
      toast.success("Image upload was successful");
      setRenderPage(true);
    } catch (error) {
      toast.error("Error Uploading Image, Please upload lower than 10MB");
    }
  }

  return (
    <div className="container-fluid">
      <Helmet>
        <title>Student Home</title>
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
                {" " + student.studentName}
              </Link>
              <ul className="dropdown-menu mt-3">
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
                        src={student.profilePicture}
                        alt="Profile"
                        className="img-fluid img-student-profile"
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
                      className="img-upload-file-input"
                      onChange={uploadImage}
                    />
                  </div>
                  <div className="col-sm-10 mt-3 mt-sm-0">
                    <h3>{student.studentName}</h3>
                    <div className="mt-2 text-muted">
                      <b>
                        {username} | B.Tech, {student.department} |{" "}
                        {student.batch}
                      </b>
                    </div>
                    <div className="mt-2 text-muted">
                      Vaagdevi College of Engineering
                    </div>
                    <div className="mt-2 text-muted">
                      <b>CGPA: {student.cgpa}</b>
                    </div>
                    <div className="row mt-2">
                      <div className="col-lg-3 col-sm-6 col-12 text-muted">
                        <img
                          src={telephone_logo}
                          alt="telephone_logo"
                          className="img-fluid icons-home-page"
                        />{" "}
                        {student.mobileNumber}
                      </div>
                      <div className="col-lg-6 col-sm-6 col-12 text-muted">
                        <img
                          src={email_logo}
                          alt="email_logo"
                          className="img-fluid icons-home-page"
                        />{" "}
                        {student.emailId}
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col-12">
                        <img
                          src={linkedin_student_logo}
                          alt="linkedin_student_logo"
                          className="img-fluid linkedin-logo-student"
                        />
                        <img
                          src={github_student_logo}
                          alt="github_student_logo"
                          className="img-fluid github-logo-student"
                        />
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
                      <b>Achievements</b>
                    </h5>
                    Talk about the achievements you have completed, What
                    projects you undertook and what special skills you learned.
                    <button
                      type="button"
                      className="bi btn bi-caret-down-fill float-end"
                      data-bs-toggle="collapse"
                      data-bs-target="#achievementsDropdown"
                      aria-expanded="false"
                      aria-controls="achievementsDropdown"
                    >
                      NT
                    </button>
                    <button
                      type="button"
                      className="bi btn bi-caret-down-fill float-end"
                      data-bs-toggle="collapse"
                      data-bs-target="#achievementsDropdown2"
                      aria-expanded="false"
                      aria-controls="achievementsDropdown2"
                    >
                      T
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="collapse shadow" id="achievementsDropdown">
              {achievements
                .filter((achievement) => achievement.type === "Non-Technical")
                .map((achievement, index) => (
                  <div className="card card-body" key={index}>
                    <div className="row">
                      <div className="col-6">
                        <p>Achievement Name: {achievement.certificationName}</p>
                        <p>Expiry Date: {achievement.expiryDate}</p>
                        <p>Verification: {achievement.verification}</p>
                        <p>Type: {achievement.type}</p>
                      </div>
                      <div className="col-6">
                        <img
                          src={achievement.certify}
                          alt="achievement_certificate"
                          className="img-fluid"
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="collapse shadow" id="achievementsDropdown2">
              {achievements
                .filter((achievement) => achievement.type === "Technical")
                .map((achievement, index) => (
                  <div className="card card-body" key={index}>
                    <div className="row">
                      <div className="col-6">
                        <p>Achievement Name: {achievement.certificationName}</p>
                        <p>Expiry Date: {achievement.expiryDate}</p>
                        <p>Verification: {achievement.verification}</p>
                        <p>Type: {achievement.type}</p>
                      </div>
                      <div className="col-6">
                        <img
                          src={achievement.certify}
                          alt="achievement_certificate"
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
                    <button
                      type="button"
                      className="bi btn bi-plus-lg float-end"
                      data-bs-toggle="modal"
                      data-bs-target="#skillBackdrop"
                    ></button>
                    <h5>
                      <b>Skills</b>
                    </h5>
                    Talk about your skills that made you proud and contributed
                    to your practical learnings.
                    <button
                      type="button"
                      className="bi btn bi-caret-down-fill float-end"
                      data-bs-toggle="collapse"
                      data-bs-target="#skillsDropdown"
                      aria-expanded="false"
                      aria-controls="skillsDropdown"
                    ></button>
                  </div>
                </div>
              </div>
            </div>
            <div className="collapse shadow" id="skillsDropdown">
              {skills.map((skill, index) => (
                <div className="card card-body" key={index}>
                  <p>Skill: {skill.skill}</p>
                  <p>Domain: {skill.domain}</p>
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
                      data-bs-target="#internshipBackdrop"
                    ></button>
                    <h5>
                      <b>Internships</b>
                    </h5>
                    Talk about your internships that made you proud and
                    contributed to your learnings.
                    <button
                      type="button"
                      className="bi btn bi-caret-down-fill float-end"
                      data-bs-toggle="collapse"
                      data-bs-target="#internshipsDropdown"
                      aria-expanded="false"
                      aria-controls="internshipsDropdown"
                    ></button>
                  </div>
                </div>
              </div>
            </div>
            <div className="collapse shadow" id="internshipsDropdown">
              {internships.map((internship, index) => (
                <div className="card card-body" key={index}>
                  <div className="row">
                    <div className="col-6">
                      <p>Internship Name: {internship.internshipName}</p>
                      <p>Company Name: {internship.companyName}</p>
                      <p>Domain: {internship.domain}</p>
                      <p>Internship Type: {internship.internshipType}</p>
                      <p>Start Date: {internship.startDate}</p>
                      <p>End Date: {internship.endDate}</p>
                    </div>
                    <div className="col-6">
                      <img
                        src={internship.verification}
                        alt="internship_certificate"
                        className="img-fluid"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Modals
        uploadProject={uploadProject}
        uploadSkill={uploadSkill}
        uploadInternship={uploadInternship}
        uploadAchievement={uploadAchievement}
        uploadPassword={uploadPassword}
      />
    </div>
  );
}
