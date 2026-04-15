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
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import Modals from "./Modals";
import { API_BASE } from "../../apiBase";

function isAuthError(error) {
  const s = error?.response?.status;
  return s === 401 || s === 403;
}

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
  const [profileForm, setProfileForm] = useState({
    studentName: "",
    emailId: "",
    mobileNumber: "",
    department: "",
    batch: "",
    cgpa: "",
    linkedinUrl: "",
    githubUrl: "",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [pendingActions, setPendingActions] = useState({});

  function setActionLoading(key, value) {
    setPendingActions((prev) => ({ ...prev, [key]: value }));
  }

  function normalizeExternalUrl(url) {
    if (!url) return "";
    const trimmed = String(url).trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  }

  useEffect(() => {
    if (!jwtToken) return;
    getStudentObject();
    try {
      setUsername(jwtDecode(jwtToken).sub);
    } catch (e) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load profile when token appears
  }, [jwtToken]);

  useEffect(() => {
    if (!jwtToken) return;

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
        if (isAuthError(e)) logoutUser();
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
        if (isAuthError(e)) logoutUser();
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
        if (isAuthError(e)) logoutUser();
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
        if (isAuthError(e)) logoutUser();
      }
    }

    async function fetchData() {
      await getSkills();
      await getProjects();
      await getAchievements();
      await getInternships();
    }

    fetchData();
  }, [renderPage, jwtToken]);

  useEffect(() => {
    if (jwtToken) {
      redirectUser("STUDENT");
    }
  }, [jwtToken]);

  async function getStudentObject() {
    if (!jwtToken) return;
    try {
      const sub = jwtDecode(jwtToken).sub;
      const url = `${API_BASE}/student/get-student/${encodeURIComponent(sub)}`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      });
      setStudent(response.data);
      setProfileForm({
        studentName: response.data.studentName || "",
        emailId: response.data.emailId || "",
        mobileNumber: response.data.mobileNumber || "",
        department: response.data.department || "",
        batch: response.data.batch || "",
        cgpa: response.data.cgpa || "",
        linkedinUrl: response.data.linkedinUrl || "",
        githubUrl: response.data.githubUrl || "",
      });
      if (response.data.profilePicture) {
        await getStudentImage(response.data.profilePicture);
      } else {
        setProfilePictureError(true);
      }
    } catch (e) {
      if (isAuthError(e)) {
        logoutUser();
      } else {
        console.error(e);
        toast.error(
          "Could not load your student profile. If you just registered, restart the API and try again."
        );
        setStudent({});
        setProfilePictureError(true);
      }
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
      formData.append("domain", e.target.cdomain.value);
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
      e.target.cdomain.value = "";
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

  async function saveProfile(e) {
    e.preventDefault();
    if (!jwtToken) return;
    let sub;
    try {
      sub = jwtDecode(jwtToken).sub;
    } catch {
      toast.error("Session invalid. Please sign in again.");
      return;
    }
    const id = String(sub).trim();
    const previousStudent = { ...student };
    const nextStudent = {
      ...student,
      studentId: id,
      studentName: profileForm.studentName.trim(),
      emailId: profileForm.emailId.trim(),
      mobileNumber: profileForm.mobileNumber.trim(),
      department: profileForm.department.trim(),
      batch: profileForm.batch.trim(),
      cgpa: profileForm.cgpa.trim(),
      linkedinUrl: profileForm.linkedinUrl.trim(),
      githubUrl: profileForm.githubUrl.trim(),
      studentGender:
        typeof student.studentGender === "boolean" ? student.studentGender : false,
    };
    setStudent(nextStudent);
    setActionLoading("profile-save", true);
    try {
      const res = await axios.put(
        `${API_BASE}/student/update-student/${encodeURIComponent(id)}`,
        nextStudent,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        }
      );
      if (res.data === false) {
        throw new Error("Server rejected save");
      }
      toast.success("Profile updated successfully.");
      setIsEditingProfile(false);
    } catch (error) {
      setStudent(previousStudent);
      const msg =
        error?.response?.data?.message ||
        (typeof error?.response?.data === "string"
          ? error.response.data.slice(0, 200)
          : null);
      toast.error(msg || "Failed to update profile.");
    } finally {
      setActionLoading("profile-save", false);
    }
  }

  async function updateSkill(skill) {
    const updatedSkill = {
      ...skill,
      skill: window.prompt("Skill name", skill.skill) ?? skill.skill,
      domain: window.prompt("Skill domain", skill.domain) ?? skill.domain,
    };
    if (!updatedSkill.skill.trim() || !updatedSkill.domain.trim()) return;
    const previousSkills = [...skills];
    setSkills((prev) =>
      prev.map((item) => (item.skillId === skill.skillId ? updatedSkill : item))
    );
    setActionLoading(`skill-update-${skill.skillId}`, true);
    try {
      await axios.put(
        `${API_BASE}/skill/update-skill/${skill.skillId}`,
        updatedSkill,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        }
      );
      toast.success("Skill updated.");
    } catch (error) {
      setSkills(previousSkills);
      toast.error("Failed to update skill.");
    } finally {
      setActionLoading(`skill-update-${skill.skillId}`, false);
    }
  }

  async function deleteSkill(skillId) {
    if (!window.confirm("Delete this skill?")) return;
    const previousSkills = [...skills];
    setSkills((prev) => prev.filter((item) => item.skillId !== skillId));
    setActionLoading(`skill-delete-${skillId}`, true);
    try {
      await axios.delete(`${API_BASE}/skill/delete-skill/${skillId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      });
      toast.success("Skill deleted.");
    } catch (error) {
      setSkills(previousSkills);
      toast.error("Failed to delete skill.");
    } finally {
      setActionLoading(`skill-delete-${skillId}`, false);
    }
  }

  async function updateProject(project) {
    const updatedProject = {
      ...project,
      projectTitle:
        window.prompt("Project title", project.projectTitle) ?? project.projectTitle,
      description:
        window.prompt("Project description", project.description) ??
        project.description,
      tags: window.prompt("Project tags", project.tags) ?? project.tags,
      url: window.prompt("Project URL", project.url) ?? project.url,
      verificationUrl:
        window.prompt("Verification URL", project.verificationUrl) ??
        project.verificationUrl,
    };
    if (!updatedProject.projectTitle.trim()) return;
    const previousProjects = [...projects];
    setProjects((prev) =>
      prev.map((item) =>
        item.projectId === project.projectId ? updatedProject : item
      )
    );
    setActionLoading(`project-update-${project.projectId}`, true);
    try {
      await axios.put(
        `${API_BASE}/project/update-project/${project.projectId}`,
        updatedProject,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        }
      );
      toast.success("Project updated.");
    } catch (error) {
      setProjects(previousProjects);
      toast.error("Failed to update project.");
    } finally {
      setActionLoading(`project-update-${project.projectId}`, false);
    }
  }

  async function deleteProject(projectId) {
    if (!window.confirm("Delete this project?")) return;
    const previousProjects = [...projects];
    setProjects((prev) => prev.filter((item) => item.projectId !== projectId));
    setActionLoading(`project-delete-${projectId}`, true);
    try {
      await axios.delete(`${API_BASE}/project/delete-project/${projectId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      });
      toast.success("Project deleted.");
    } catch (error) {
      setProjects(previousProjects);
      toast.error("Failed to delete project.");
    } finally {
      setActionLoading(`project-delete-${projectId}`, false);
    }
  }

  async function updateAchievement(achievement) {
    const updatedAchievement = {
      ...achievement,
      certificationName:
        window.prompt("Achievement name", achievement.certificationName) ??
        achievement.certificationName,
      expiryDate: window.prompt("Expiry date (yyyy-mm-dd)", achievement.expiryDate) ?? achievement.expiryDate,
      verification:
        window.prompt("Verification", achievement.verification) ??
        achievement.verification,
      type: window.prompt("Type (Technical/Non-Technical)", achievement.type) ?? achievement.type,
    };
    if (!updatedAchievement.certificationName.trim()) return;
    const previousAchievements = [...achievements];
    setAchievements((prev) =>
      prev.map((item) =>
        item.certificationId === achievement.certificationId
          ? updatedAchievement
          : item
      )
    );
    setActionLoading(`achievement-update-${achievement.certificationId}`, true);
    try {
      await axios.put(
        `${API_BASE}/certification/update-certification/${achievement.certificationId}`,
        updatedAchievement,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        }
      );
      toast.success("Achievement updated.");
    } catch (error) {
      setAchievements(previousAchievements);
      toast.error("Failed to update achievement.");
    } finally {
      setActionLoading(`achievement-update-${achievement.certificationId}`, false);
    }
  }

  async function deleteAchievement(certificationId) {
    if (!window.confirm("Delete this achievement?")) return;
    const previousAchievements = [...achievements];
    setAchievements((prev) =>
      prev.filter((item) => item.certificationId !== certificationId)
    );
    setActionLoading(`achievement-delete-${certificationId}`, true);
    try {
      await axios.delete(
        `${API_BASE}/certification/delete-certification/${certificationId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        }
      );
      toast.success("Achievement deleted.");
    } catch (error) {
      setAchievements(previousAchievements);
      toast.error("Failed to delete achievement.");
    } finally {
      setActionLoading(`achievement-delete-${certificationId}`, false);
    }
  }

  async function updateInternship(internship) {
    const updatedInternship = {
      ...internship,
      internshipName:
        window.prompt("Internship name", internship.internshipName) ??
        internship.internshipName,
      companyName:
        window.prompt("Company name", internship.companyName) ??
        internship.companyName,
      domain: window.prompt("Domain", internship.domain) ?? internship.domain,
      startDate:
        window.prompt("Start date (yyyy-mm-dd)", internship.startDate) ??
        internship.startDate,
      endDate:
        window.prompt("End date (yyyy-mm-dd)", internship.endDate) ??
        internship.endDate,
      internshipType:
        window.prompt(
          "Internship type (On-Site/Remote/Hybrid)",
          internship.internshipType
        ) ?? internship.internshipType,
    };
    if (!updatedInternship.internshipName.trim()) return;
    const previousInternships = [...internships];
    setInternships((prev) =>
      prev.map((item) =>
        item.internshipId === internship.internshipId ? updatedInternship : item
      )
    );
    setActionLoading(`internship-update-${internship.internshipId}`, true);
    try {
      await axios.put(
        `${API_BASE}/internship/update-internship/${internship.internshipId}`,
        updatedInternship,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        }
      );
      toast.success("Internship updated.");
    } catch (error) {
      setInternships(previousInternships);
      toast.error("Failed to update internship.");
    } finally {
      setActionLoading(`internship-update-${internship.internshipId}`, false);
    }
  }

  async function deleteInternship(internshipId) {
    if (!window.confirm("Delete this internship?")) return;
    const previousInternships = [...internships];
    setInternships((prev) =>
      prev.filter((item) => item.internshipId !== internshipId)
    );
    setActionLoading(`internship-delete-${internshipId}`, true);
    try {
      await axios.delete(`${API_BASE}/internship/delete-internship/${internshipId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      });
      toast.success("Internship deleted.");
    } catch (error) {
      setInternships(previousInternships);
      toast.error("Failed to delete internship.");
    } finally {
      setActionLoading(`internship-delete-${internshipId}`, false);
    }
  }

  if (!jwtToken) {
    return <Navigate to="/login" replace />;
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
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <h3>{student.studentName}</h3>
                      {!isEditingProfile ? (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => setIsEditingProfile(true)}
                        >
                          Edit Profile
                        </button>
                      ) : null}
                    </div>
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
                        <a
                          href={student.mobileNumber ? `tel:${student.mobileNumber}` : "#"}
                          className="text-muted text-decoration-none"
                        >
                          <img
                            src={telephone_logo}
                            alt="telephone_logo"
                            className="img-fluid icons-home-page"
                          />{" "}
                          {student.mobileNumber}
                        </a>
                      </div>
                      <div className="col-lg-6 col-sm-6 col-12 text-muted">
                        <a
                          href={student.emailId ? `mailto:${student.emailId}` : "#"}
                          className="text-muted text-decoration-none"
                        >
                          <img
                            src={email_logo}
                            alt="email_logo"
                            className="img-fluid icons-home-page"
                          />{" "}
                          {student.emailId}
                        </a>
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col-12">
                        <a
                          href={normalizeExternalUrl(student.linkedinUrl)}
                          target="_blank"
                          rel="noreferrer"
                          className={!student.linkedinUrl ? "pe-none opacity-50" : ""}
                        >
                          <img
                            src={linkedin_student_logo}
                            alt="linkedin_student_logo"
                            className="img-fluid linkedin-logo-student"
                          />
                        </a>
                        <a
                          href={normalizeExternalUrl(student.githubUrl)}
                          target="_blank"
                          rel="noreferrer"
                          className={!student.githubUrl ? "pe-none opacity-50" : ""}
                        >
                          <img
                            src={github_student_logo}
                            alt="github_student_logo"
                            className="img-fluid github-logo-student"
                          />
                        </a>
                      </div>
                    </div>
                    {isEditingProfile ? (
                      <form className="border rounded p-3 mt-3" onSubmit={saveProfile}>
                        <div className="row g-2">
                          <div className="col-md-6">
                            <input
                              className="form-control"
                              value={profileForm.studentName}
                              onChange={(e) =>
                                setProfileForm((prev) => ({
                                  ...prev,
                                  studentName: e.target.value,
                                }))
                              }
                              placeholder="Student name"
                              required
                            />
                          </div>
                          <div className="col-md-6">
                            <input
                              className="form-control"
                              value={profileForm.emailId}
                              onChange={(e) =>
                                setProfileForm((prev) => ({
                                  ...prev,
                                  emailId: e.target.value,
                                }))
                              }
                              placeholder="Email"
                              type="email"
                              required
                            />
                          </div>
                          <div className="col-md-6">
                            <input
                              className="form-control"
                              value={profileForm.mobileNumber}
                              onChange={(e) =>
                                setProfileForm((prev) => ({
                                  ...prev,
                                  mobileNumber: e.target.value,
                                }))
                              }
                              placeholder="Mobile number"
                              required
                            />
                          </div>
                          <div className="col-md-6">
                            <input
                              className="form-control"
                              value={profileForm.department}
                              onChange={(e) =>
                                setProfileForm((prev) => ({
                                  ...prev,
                                  department: e.target.value,
                                }))
                              }
                              placeholder="Department"
                              required
                            />
                          </div>
                          <div className="col-md-4">
                            <input
                              className="form-control"
                              value={profileForm.batch}
                              onChange={(e) =>
                                setProfileForm((prev) => ({
                                  ...prev,
                                  batch: e.target.value,
                                }))
                              }
                              placeholder="Batch"
                              required
                            />
                          </div>
                          <div className="col-md-4">
                            <input
                              className="form-control"
                              value={profileForm.cgpa}
                              onChange={(e) =>
                                setProfileForm((prev) => ({
                                  ...prev,
                                  cgpa: e.target.value,
                                }))
                              }
                              placeholder="CGPA"
                            />
                          </div>
                          <div className="col-md-4">
                            <input
                              className="form-control"
                              value={profileForm.linkedinUrl}
                              onChange={(e) =>
                                setProfileForm((prev) => ({
                                  ...prev,
                                  linkedinUrl: e.target.value,
                                }))
                              }
                              placeholder="LinkedIn URL"
                            />
                          </div>
                          <div className="col-md-12">
                            <input
                              className="form-control"
                              value={profileForm.githubUrl}
                              onChange={(e) =>
                                setProfileForm((prev) => ({
                                  ...prev,
                                  githubUrl: e.target.value,
                                }))
                              }
                              placeholder="GitHub URL"
                            />
                          </div>
                        </div>
                        <div className="d-flex gap-2 justify-content-end mt-3">
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => {
                              setIsEditingProfile(false);
                              setProfileForm({
                                studentName: student.studentName || "",
                                emailId: student.emailId || "",
                                mobileNumber: student.mobileNumber || "",
                                department: student.department || "",
                                batch: student.batch || "",
                                cgpa: student.cgpa || "",
                                linkedinUrl: student.linkedinUrl || "",
                                githubUrl: student.githubUrl || "",
                              });
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="btn btn-danger"
                            disabled={!!pendingActions["profile-save"]}
                          >
                            {pendingActions["profile-save"] ? "Saving..." : "Save Profile"}
                          </button>
                        </div>
                      </form>
                    ) : null}
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
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            disabled={!!pendingActions[`achievement-update-${achievement.certificationId}`]}
                            onClick={() => updateAchievement(achievement)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            disabled={!!pendingActions[`achievement-delete-${achievement.certificationId}`]}
                            onClick={() => deleteAchievement(achievement.certificationId)}
                          >
                            Delete
                          </button>
                        </div>
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
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            disabled={!!pendingActions[`achievement-update-${achievement.certificationId}`]}
                            onClick={() => updateAchievement(achievement)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            disabled={!!pendingActions[`achievement-delete-${achievement.certificationId}`]}
                            onClick={() => deleteAchievement(achievement.certificationId)}
                          >
                            Delete
                          </button>
                        </div>
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
                  <a
                    href={normalizeExternalUrl(project.url)}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {project.url}
                  </a>
                  <a
                    href={normalizeExternalUrl(project.verificationUrl)}
                    rel="noreferrer"
                    target="_blank"
                    className="d-block"
                  >
                    {project.verificationUrl}
                  </a>
                  <div className="d-flex gap-2 mt-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      disabled={!!pendingActions[`project-update-${project.projectId}`]}
                      onClick={() => updateProject(project)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      disabled={!!pendingActions[`project-delete-${project.projectId}`]}
                      onClick={() => deleteProject(project.projectId)}
                    >
                      Delete
                    </button>
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
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      disabled={!!pendingActions[`skill-update-${skill.skillId}`]}
                      onClick={() => updateSkill(skill)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      disabled={!!pendingActions[`skill-delete-${skill.skillId}`]}
                      onClick={() => deleteSkill(skill.skillId)}
                    >
                      Delete
                    </button>
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
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          disabled={!!pendingActions[`internship-update-${internship.internshipId}`]}
                          onClick={() => updateInternship(internship)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          disabled={!!pendingActions[`internship-delete-${internship.internshipId}`]}
                          onClick={() => deleteInternship(internship.internshipId)}
                        >
                          Delete
                        </button>
                      </div>
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
