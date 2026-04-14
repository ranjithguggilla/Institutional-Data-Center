import { toast } from "react-toastify";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../auth/AuthContext";
import axios from "axios";
import AdminTopBar from "./AdminTopBar";
import "../css/student_home.css";
import { Helmet } from "react-helmet-async";
import email_logo from "../images/logo/email_logo.png";
import telephone_logo from "../images/logo/telephone_logo.png";
import github_student_logo from "../images/logo/github_student_logo.png";
import linkedin_student_logo from "../images/logo/linkedin_student_logo.png";
import ChangePasswordModal from "./ChangePasswordModal";

import { API_BASE } from "../../apiBase";

export default function WatchStudent() {
  const { studentId } = useParams();
  const { jwtToken, logoutUser, redirectUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [student, setStudent] = useState({});

  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    if (!jwtToken) {
      logoutUser();
    }
    redirectUser("ADMIN");

    getStudentObject();
    getAchievements();
    getProjects();
    getSkills();
    getInternships();
  }, [logoutUser]);

  async function getStudentObject() {
    try {
      const url = `${API_BASE}/student/get-student/${studentId}`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      });
      setStudent(response.data);

      if (!response.data.studentId) {
        navigate("/admin/student");
      }

      let blob = await getStudentImage(response.data.profilePicture);
      if (blob) {
        setStudent((prevStudent) => ({
          ...prevStudent,
          profilePicture: URL.createObjectURL(blob),
        }));
        return;
      }
      setStudent((prevStudent) => ({ ...prevStudent, profilePicture: null }));
    } catch (e) {
      navigate("/admin/student");
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
      return blob;
    } catch (error) {
      return null;
    }
  }

  async function getAchievements() {
    try {
      const url =
        `${API_BASE}/certification/get-all-certifications-by-id/${studentId}`;
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

  async function getProjects() {
    try {
      const url =
        `${API_BASE}/project/get-all-projects-by-id/${studentId}`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      });
      setProjects(response.data);
    } catch (e) {
      console.log(e);
    }
  }

  async function getSkills() {
    try {
      const url =
        `${API_BASE}/skill/get-all-skills-by-id/${studentId}`;
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

  async function getInternships() {
    try {
      const url =
        `${API_BASE}/internship/get-all-internships-by-id/${studentId}`;
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
        <title>Student - {studentId}</title>
      </Helmet>
      <div className="body-part pb-5 mt-3">
        <div className="row pt-4">
          <div className="col-xl-6 col-lg-8 offset-lg-2 offset-xl-3">
            <div className="card shadow">
              <div className="card-body">
                <div className="row mt-3">
                  <div className="col-sm-2 col-12 justify-content-sm-end align-items-sm-top d-flex">
                    <img
                      src={student.profilePicture}
                      alt="No Profile Pic"
                      className="img-fluid img-student-profile"
                    />
                  </div>
                  <div className="col-sm-10 mt-3 mt-sm-0">
                    <h3>{student.studentName}</h3>
                    <div className="mt-2 text-muted">
                      <b>
                        {studentId} | B.Tech, {student.department} |{" "}
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
      <ChangePasswordModal uploadPassword={uploadPassword} />
    </div>
  );
}
