import React, { useContext, useEffect, useMemo, useState } from "react";
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
import upload_image_logo from "../images/logo/upload_logo_student.jpg";
import { GoogleScholarIcon, OrcidIcon, ResearchGateIcon } from "./socialIcons";
import { toast } from "react-toastify";
import Modals from "./FacultyModals";
import { API_BASE } from "../../apiBase";

function isSessionExpiredError(error) {
  const s = error?.response?.status;
  return s === 401 || s === 403;
}

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
  const [licenses, setLicenses] = useState([]);
  const [grants, setGrants] = useState([]);

  const [renderPage, setRenderPage] = useState(false);
  const [addDocuments, setAddDocuments] = useState(true);
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

  const loginId = useMemo(() => {
    if (!jwtToken) return "";
    try {
      const sub = jwtDecode(jwtToken).sub;
      return sub != null ? String(sub).trim() : "";
    } catch {
      return "";
    }
  }, [jwtToken]);

  const facultyDisplayName = useMemo(() => {
    const n =
      faculty?.facultyName != null ? String(faculty.facultyName).trim() : "";
    if (n) return n;
    if (loginId) return loginId;
    if (username && String(username).trim()) return String(username).trim();
    return "Faculty member";
  }, [faculty?.facultyName, loginId, username]);

  const departmentDisplay = useMemo(() => {
    const d =
      faculty?.department != null ? String(faculty.department).trim() : "";
    return d || "—";
  }, [faculty?.department]);

  useEffect(() => {
    async function getFacultyObject() {
      try {
        const sub = jwtDecode(jwtToken).sub;
        const url = `${API_BASE}/faculty/get-faculty/${encodeURIComponent(sub)}`;
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        });
        setFaculty(response.data);
        if (response.data.profilePicture) {
          await getFacultyImage(response.data.profilePicture);
        } else {
          setProfilePictureError(true);
        }
        if (response.data.designation === "HOD") {
          setHod(true);
          await getDepartmentStudents(response.data.department);
        }
      } catch (e) {
        console.error(e);
        if (isSessionExpiredError(e)) {
          toast.error("Session expired. Please sign in again.");
          logoutUser();
        } else {
          toast.error(
            "No faculty profile found for this login. Ask an admin to add a faculty record whose Faculty ID matches your account exactly (including spaces)."
          );
          setFaculty({});
        }
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

  async function fetchLicensesList() {
    try {
      const r = await axios.get(`${API_BASE}/faculty-license/list`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      });
      setLicenses(r.data || []);
    } catch (err) {
      if (isSessionExpiredError(err)) {
        toast.error("Session expired. Please sign in again.");
        logoutUser();
      } else {
        setLicenses([]);
      }
    }
  }

  async function fetchGrantsList() {
    try {
      const r = await axios.get(`${API_BASE}/faculty-grant/list`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      });
      setGrants(r.data || []);
    } catch (err) {
      if (isSessionExpiredError(err)) {
        toast.error("Session expired. Please sign in again.");
        logoutUser();
      } else {
        setGrants([]);
      }
    }
  }

  useEffect(() => {
    getCertifications();
    getExperiences();
    getResearchPapers();
    getProjects();
    getDocuments();
    getFacultySocial();
    fetchLicensesList();
    fetchGrantsList();
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
      const rows = Array.isArray(response.data) ? response.data : [];
      setSocial(rows[0] ?? {});
      if (rows.length !== 0) {
        setSocialProfileError(true);
      } else {
        setSocialProfileError(false);
      }
    } catch (e) {
      console.error(e);
      if (isSessionExpiredError(e)) {
        toast.error("Session expired. Please sign in again.");
        logoutUser();
      } else {
        setSocial({});
      }
    }
  }

  /**
   * Refetch faculty row and load profile image blob (same as initial page load).
   * @returns {Promise<boolean>} true if the image is shown; false if an error toast was shown
   */
  async function reloadFacultyAndProfileImage() {
    try {
      const sub = jwtDecode(jwtToken).sub;
      const url = `${API_BASE}/faculty/get-faculty/${encodeURIComponent(sub)}`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      });
      const data = response.data;
      if (!data?.profilePicture) {
        setFaculty(data);
        setProfilePictureError(true);
        toast.error(
          "Upload finished but no photo path was returned. Try refreshing the page."
        );
        return false;
      }
      try {
        const imgRes = await axios.get(`${API_BASE}${data.profilePicture}`, {
          headers: {
            Authorization: "Bearer " + jwtToken,
          },
          responseType: "arraybuffer",
        });
        const blob = new Blob([imgRes.data], {
          type: imgRes.headers["content-type"] || "image/jpeg",
        });
        setFaculty((prev) => {
          const old = prev.profilePicture;
          if (typeof old === "string" && old.startsWith("blob:")) {
            URL.revokeObjectURL(old);
          }
          return { ...data, profilePicture: URL.createObjectURL(blob) };
        });
        setProfilePictureError(false);
        return true;
      } catch {
        setFaculty(data);
        setProfilePictureError(true);
        toast.error(
          "Photo was saved but could not be loaded from the server. If this persists after a refresh, ask an admin to check file storage."
        );
        return false;
      }
    } catch (e) {
      if (isSessionExpiredError(e)) {
        toast.error("Session expired. Please sign in again.");
        logoutUser();
      } else {
        toast.error("Could not refresh your profile after upload.");
      }
      return false;
    }
  }

  async function uploadImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const input = event.target;
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post(`${API_BASE}/faculty/set-faculty-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + jwtToken,
        },
      });
      input.value = "";
      const displayed = await reloadFacultyAndProfileImage();
      if (displayed) {
        toast.success("Image has been successfully uploaded!");
      }
    } catch (error) {
      input.value = "";
      if (isSessionExpiredError(error)) {
        toast.error("Session expired. Please sign in again.");
        logoutUser();
      } else {
        toast.error("Error Uploading Image, Please upload lower than 10MB");
      }
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
      console.error(e);
      if (isSessionExpiredError(e)) {
        toast.error("Session expired. Please sign in again.");
        logoutUser();
      } else {
        setCertifications([]);
      }
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
      console.error(e);
      if (isSessionExpiredError(e)) {
        toast.error("Session expired. Please sign in again.");
        logoutUser();
      } else {
        setExperiences([]);
      }
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
      console.error(e);
      if (isSessionExpiredError(e)) {
        toast.error("Session expired. Please sign in again.");
        logoutUser();
      } else {
        setResearchPapers([]);
      }
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
      console.error(e);
      if (isSessionExpiredError(e)) {
        toast.error("Session expired. Please sign in again.");
        logoutUser();
      } else {
        setProjects([]);
      }
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

  function openSocialModal() {
    const set = (id, v) => {
      const el = document.getElementById(id);
      if (el) el.value = v ?? "";
    };
    set("linkedin", social?.linkedin);
    set("github", social?.github);
    set("googleScholar", social?.googleScholar);
    set("orcid", social?.orcid);
    set("researchGate", social?.researchGate);
    set("portfolioUrl", social?.portfolioUrl);
    const el = document.getElementById("socialBackdrop");
    if (el && window.bootstrap?.Modal) {
      window.bootstrap.Modal.getOrCreateInstance(el).show();
    }
  }

  function openProfileModal() {
    const el = document.getElementById("profileBackdrop");
    if (el && window.bootstrap?.Modal) {
      window.bootstrap.Modal.getOrCreateInstance(el).show();
    }
  }

  function openLicenseModal(row) {
    const set = (id, v) => {
      const h = document.getElementById(id);
      if (h) h.value = v ?? "";
    };
    set("license_id_field", row?.licenseId != null ? String(row.licenseId) : "");
    set("license_title", row?.title);
    set("license_issuingBody", row?.issuingBody);
    set("license_number", row?.licenseNumber);
    set("license_expiry", row?.expiryDate ? String(row.expiryDate).slice(0, 10) : "");
    set("license_verificationUrl", row?.verificationUrl);
    set("license_notes", row?.notes);
    const el = document.getElementById("licenseBackdrop");
    if (el && window.bootstrap?.Modal) {
      window.bootstrap.Modal.getOrCreateInstance(el).show();
    }
  }

  function openGrantModal(row) {
    const set = (id, v) => {
      const h = document.getElementById(id);
      if (h) h.value = v ?? "";
    };
    set("grant_id_field", row?.grantId != null ? String(row.grantId) : "");
    set("grant_title", row?.title);
    set("grant_agency", row?.fundingAgency);
    set("grant_amount", row?.amount);
    set("grant_start", row?.startDate ? String(row.startDate).slice(0, 10) : "");
    set("grant_end", row?.endDate ? String(row.endDate).slice(0, 10) : "");
    set("grant_desc", row?.description);
    set("grant_projectUrl", row?.projectUrl);
    const el = document.getElementById("grantBackdrop");
    if (el && window.bootstrap?.Modal) {
      window.bootstrap.Modal.getOrCreateInstance(el).show();
    }
  }

  async function uploadFacultyProfile(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const val = (name) => {
      const el = form.elements.namedItem(name);
      const raw = el && "value" in el ? el.value : "";
      return raw != null ? String(raw).trim() : "";
    };
    const body = {
      facultyName: val("facultyName"),
      department: val("department"),
      emailId: val("emailId"),
      contactNumber: val("contactNumber"),
      designation: val("designation"),
      address: val("address"),
    };
    const dob = val("dateOfBirth");
    if (dob) {
      body.dateOfBirth = dob;
    }
    try {
      const putRes = await axios.put(`${API_BASE}/faculty/me`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      });
      if (putRes.data === false) {
        toast.error("Profile could not be saved. Try again or contact an administrator.");
        return;
      }
      toast.success("Profile updated.");
      document.getElementById("profileModalButton")?.click();
      const sub = jwtDecode(jwtToken).sub;
      const url = `${API_BASE}/faculty/get-faculty/${encodeURIComponent(sub)}`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      });
      setFaculty(response.data || {});
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response.data : null);
      toast.error(msg || "Could not save profile. Check the API is running and you are logged in.");
    }
  }

  async function uploadLicense(e) {
    e.preventDefault();
    const licenseId = Number(document.getElementById("license_id_field")?.value || 0);
    const payload = {
      title: document.getElementById("license_title")?.value?.trim(),
      issuingBody: document.getElementById("license_issuingBody")?.value?.trim(),
      licenseNumber: document.getElementById("license_number")?.value?.trim(),
      expiryDate: document.getElementById("license_expiry")?.value?.trim() || null,
      verificationUrl: document.getElementById("license_verificationUrl")?.value?.trim(),
      notes: document.getElementById("license_notes")?.value?.trim(),
    };
    try {
      if (licenseId) {
        await axios.put(`${API_BASE}/faculty-license/update/${licenseId}`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        });
        toast.success("License updated.");
      } else {
        await axios.post(`${API_BASE}/faculty-license/add`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        });
        toast.success("License added.");
      }
      document.getElementById("licenseModalButton")?.click();
      await fetchLicensesList();
    } catch (err) {
      toast.error("Could not save license.");
    }
  }

  async function uploadGrant(e) {
    e.preventDefault();
    const grantId = Number(document.getElementById("grant_id_field")?.value || 0);
    const payload = {
      title: document.getElementById("grant_title")?.value?.trim(),
      fundingAgency: document.getElementById("grant_agency")?.value?.trim(),
      amount: document.getElementById("grant_amount")?.value?.trim(),
      startDate: document.getElementById("grant_start")?.value?.trim() || null,
      endDate: document.getElementById("grant_end")?.value?.trim() || null,
      description: document.getElementById("grant_desc")?.value?.trim(),
      projectUrl: document.getElementById("grant_projectUrl")?.value?.trim(),
    };
    try {
      if (grantId) {
        await axios.put(`${API_BASE}/faculty-grant/update/${grantId}`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        });
        toast.success("Grant updated.");
      } else {
        await axios.post(`${API_BASE}/faculty-grant/add`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        });
        toast.success("Grant added.");
      }
      document.getElementById("grantModalButton")?.click();
      await fetchGrantsList();
    } catch (err) {
      toast.error("Could not save grant.");
    }
  }

  async function deleteLicense(licenseId) {
    if (!window.confirm("Delete this license?")) return;
    try {
      await axios.delete(`${API_BASE}/faculty-license/delete/${licenseId}`, {
        headers: { Authorization: "Bearer " + jwtToken },
      });
      toast.success("License removed.");
      await fetchLicensesList();
    } catch {
      toast.error("Could not delete license.");
    }
  }

  async function deleteGrant(grantId) {
    if (!window.confirm("Delete this grant?")) return;
    try {
      await axios.delete(`${API_BASE}/faculty-grant/delete/${grantId}`, {
        headers: { Authorization: "Bearer " + jwtToken },
      });
      toast.success("Grant removed.");
      await fetchGrantsList();
    } catch {
      toast.error("Could not delete grant.");
    }
  }

  async function uploadSocial(e) {
    e.preventDefault();
    const t = e.target;
    const body = {
      linkedin: t.linkedin.value.trim(),
      github: t.github.value.trim(),
      googleScholar: t.googleScholar.value.trim(),
      orcid: t.orcid.value.trim(),
      researchGate: t.researchGate.value.trim(),
      portfolioUrl: t.portfolioUrl.value.trim(),
    };
    try {
      if (social?.socialId) {
        await axios.put(`${API_BASE}/social/update-social/${social.socialId}`, body, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        });
      } else {
        await axios.post(`${API_BASE}/social/add-social`, body, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        });
      }
      setSocial((prev) => ({ ...prev, ...body, socialId: prev.socialId }));
      setRenderPage((p) => !p);
      toast.success("Social & research links saved.");
      document.getElementById("socialModalButton")?.click();
      await getFacultySocial();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong saving social links.");
    }
  }

  async function updateExperience(experience) {
    const updated = {
      ...experience,
      company: window.prompt("Organization name", experience.company) ?? experience.company,
      designation:
        window.prompt("Designation", experience.designation) ?? experience.designation,
      experienceType:
        window.prompt("Experience type", experience.experienceType) ??
        experience.experienceType,
      experienceFrom:
        window.prompt("Experience from (yyyy-mm-dd)", experience.experienceFrom) ??
        experience.experienceFrom,
      experienceTo:
        window.prompt("Experience to (yyyy-mm-dd)", experience.experienceTo) ??
        experience.experienceTo,
    };
    if (!updated.company?.trim()) return;
    const previous = [...experiences];
    setExperiences((prev) =>
      prev.map((item) => (item.experienceId === experience.experienceId ? updated : item))
    );
    setActionLoading(`experience-update-${experience.experienceId}`, true);
    try {
      await axios.put(
        `${API_BASE}/experience/update-experience/${experience.experienceId}`,
        updated,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        }
      );
      toast.success("Experience updated.");
    } catch (error) {
      setExperiences(previous);
      toast.error("Failed to update experience.");
    } finally {
      setActionLoading(`experience-update-${experience.experienceId}`, false);
    }
  }

  async function deleteExperience(experienceId) {
    if (!window.confirm("Delete this experience?")) return;
    const previous = [...experiences];
    setExperiences((prev) => prev.filter((item) => item.experienceId !== experienceId));
    setActionLoading(`experience-delete-${experienceId}`, true);
    try {
      await axios.delete(`${API_BASE}/experience/delete-experience/${experienceId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      });
      toast.success("Experience deleted.");
    } catch (error) {
      setExperiences(previous);
      toast.error("Failed to delete experience.");
    } finally {
      setActionLoading(`experience-delete-${experienceId}`, false);
    }
  }

  async function updateResearchPaper(paper) {
    const updated = {
      ...paper,
      publishedTitle:
        window.prompt("Published title", paper.publishedTitle) ?? paper.publishedTitle,
      publishedDescription:
        window.prompt("Published description", paper.publishedDescription) ??
        paper.publishedDescription,
      publishedBy: window.prompt("Published by", paper.publishedBy) ?? paper.publishedBy,
      paperReferences:
        window.prompt("Paper references URL", paper.paperReferences) ??
        paper.paperReferences,
      publishedYear:
        window.prompt("Published year", paper.publishedYear) ?? paper.publishedYear,
    };
    if (!updated.publishedTitle?.trim()) return;
    const previous = [...researchPapers];
    setResearchPapers((prev) =>
      prev.map((item) => (item.paperId === paper.paperId ? updated : item))
    );
    setActionLoading(`paper-update-${paper.paperId}`, true);
    try {
      await axios.put(`${API_BASE}/research-papers/update-paper/${paper.paperId}`, updated, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      });
      toast.success("Research paper updated.");
    } catch (error) {
      setResearchPapers(previous);
      toast.error("Failed to update research paper.");
    } finally {
      setActionLoading(`paper-update-${paper.paperId}`, false);
    }
  }

  async function deleteResearchPaper(paperId) {
    if (!window.confirm("Delete this research paper?")) return;
    const previous = [...researchPapers];
    setResearchPapers((prev) => prev.filter((item) => item.paperId !== paperId));
    setActionLoading(`paper-delete-${paperId}`, true);
    try {
      await axios.delete(`${API_BASE}/research-papers/delete-paper/${paperId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      });
      toast.success("Research paper deleted.");
    } catch (error) {
      setResearchPapers(previous);
      toast.error("Failed to delete research paper.");
    } finally {
      setActionLoading(`paper-delete-${paperId}`, false);
    }
  }

  async function updateFacultyProject(project) {
    const updated = {
      ...project,
      projectTitle:
        window.prompt("Project title", project.projectTitle) ?? project.projectTitle,
      description:
        window.prompt("Project description", project.description) ?? project.description,
      tags: window.prompt("Tags", project.tags) ?? project.tags,
      url: window.prompt("Project URL", project.url) ?? project.url,
      verificationUrl:
        window.prompt("Verification URL", project.verificationUrl) ??
        project.verificationUrl,
    };
    if (!updated.projectTitle?.trim()) return;
    const previous = [...projects];
    setProjects((prev) =>
      prev.map((item) => (item.projectId === project.projectId ? updated : item))
    );
    setActionLoading(`faculty-project-update-${project.projectId}`, true);
    try {
      await axios.put(`${API_BASE}/faculty-project/update-project/${project.projectId}`, updated, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      });
      toast.success("Project updated.");
    } catch (error) {
      setProjects(previous);
      toast.error("Failed to update project.");
    } finally {
      setActionLoading(`faculty-project-update-${project.projectId}`, false);
    }
  }

  async function deleteFacultyProject(projectId) {
    if (!window.confirm("Delete this project?")) return;
    const previous = [...projects];
    setProjects((prev) => prev.filter((item) => item.projectId !== projectId));
    setActionLoading(`faculty-project-delete-${projectId}`, true);
    try {
      await axios.delete(`${API_BASE}/faculty-project/delete-project/${projectId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      });
      toast.success("Project deleted.");
    } catch (error) {
      setProjects(previous);
      toast.error("Failed to delete project.");
    } finally {
      setActionLoading(`faculty-project-delete-${projectId}`, false);
    }
  }

  async function updateFacultyCertification(certification) {
    const updated = {
      ...certification,
      certificationName:
        window.prompt("Certification name", certification.certificationName) ??
        certification.certificationName,
      expiryDate:
        window.prompt("Expiry date (yyyy-mm-dd)", certification.expiryDate) ??
        certification.expiryDate,
      type: window.prompt("Type", certification.type) ?? certification.type,
      verification:
        window.prompt("Verification URL", certification.verification) ??
        certification.verification,
    };
    if (!updated.certificationName?.trim()) return;
    const previous = [...certifications];
    setCertifications((prev) =>
      prev.map((item) =>
        item.certificationId === certification.certificationId ? updated : item
      )
    );
    setActionLoading(`faculty-cert-update-${certification.certificationId}`, true);
    try {
      await axios.put(
        `${API_BASE}/faculty-certification/update-certification/${certification.certificationId}`,
        updated,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        }
      );
      toast.success("Certification updated.");
    } catch (error) {
      setCertifications(previous);
      toast.error("Failed to update certification.");
    } finally {
      setActionLoading(`faculty-cert-update-${certification.certificationId}`, false);
    }
  }

  async function deleteFacultyCertification(certificationId) {
    if (!window.confirm("Delete this certification?")) return;
    const previous = [...certifications];
    setCertifications((prev) =>
      prev.filter((item) => item.certificationId !== certificationId)
    );
    setActionLoading(`faculty-cert-delete-${certificationId}`, true);
    try {
      await axios.delete(
        `${API_BASE}/faculty-certification/delete-certification/${certificationId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        }
      );
      toast.success("Certification deleted.");
    } catch (error) {
      setCertifications(previous);
      toast.error("Failed to delete certification.");
    } finally {
      setActionLoading(`faculty-cert-delete-${certificationId}`, false);
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
                {" " + facultyDisplayName}
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
                    <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
                      <h3 className="mb-0">{facultyDisplayName}</h3>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={openProfileModal}
                      >
                        Edit profile
                      </button>
                    </div>
                    <div className="mt-2 text-muted">
                      <b>
                        Faculty ID: {loginId || username || "—"} | Dept:{" "}
                        {departmentDisplay}
                      </b>
                    </div>
                    <div className="mt-2 text-muted">
                      {faculty.designation
                        ? `${faculty.designation}, Vaagdevi College of Engineering`
                        : "Vaagdevi College of Engineering"}
                    </div>
                    <div className="row mt-2">
                      <div className="col-lg-4 col-sm-6 col-12 text-muted">
                        <a
                          href={faculty.contactNumber ? `tel:${faculty.contactNumber}` : "#"}
                          className="text-muted text-decoration-none"
                        >
                          <img
                            src={telephone_logo}
                            alt="telephone_logo"
                            className="img-fluid icons-home-page"
                          />{" "}
                          {faculty.contactNumber}
                        </a>
                      </div>
                      <div className="col-lg-6 col-sm-6 col-12 text-muted">
                        <a
                          href={faculty.emailId ? `mailto:${faculty.emailId}` : "#"}
                          className="text-muted text-decoration-none"
                        >
                          <img
                            src={email_logo}
                            alt="email_logo"
                            className="img-fluid icons-home-page"
                          />{" "}
                          {faculty.emailId}
                        </a>
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col-12">
                        <div>
                          {socialProfileError ? (
                            <>
                              <div className="d-flex flex-wrap align-items-center gap-3 faculty-social-icons-row">
                                <a
                                  href={normalizeExternalUrl(social.linkedin)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={`faculty-social-icon-link ${!social?.linkedin ? "pe-none opacity-50" : ""}`}
                                  title="LinkedIn"
                                  aria-label="LinkedIn profile"
                                >
                                  <i
                                    className="bi bi-linkedin faculty-social-bi"
                                    style={{ color: "#0A66C2" }}
                                    aria-hidden
                                  />
                                </a>
                                <a
                                  href={normalizeExternalUrl(social.github)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={`faculty-social-icon-link ${!social?.github ? "pe-none opacity-50" : ""}`}
                                  title="GitHub"
                                  aria-label="GitHub profile"
                                >
                                  <i className="bi bi-github faculty-social-bi text-dark" aria-hidden />
                                </a>
                                {social?.googleScholar && (
                                  <a
                                    className="faculty-social-icon-link"
                                    href={normalizeExternalUrl(social.googleScholar)}
                                    target="_blank"
                                    rel="noreferrer"
                                    title="Google Scholar"
                                    aria-label="Google Scholar profile"
                                  >
                                    <GoogleScholarIcon size={34} className="faculty-social-svg" />
                                  </a>
                                )}
                                {social?.orcid && (
                                  <a
                                    className="faculty-social-icon-link"
                                    href={normalizeExternalUrl(social.orcid)}
                                    target="_blank"
                                    rel="noreferrer"
                                    title="ORCID"
                                    aria-label="ORCID profile"
                                  >
                                    <OrcidIcon size={34} className="faculty-social-svg" />
                                  </a>
                                )}
                                {social?.researchGate && (
                                  <a
                                    className="faculty-social-icon-link"
                                    href={normalizeExternalUrl(social.researchGate)}
                                    target="_blank"
                                    rel="noreferrer"
                                    title="ResearchGate"
                                    aria-label="ResearchGate profile"
                                  >
                                    <ResearchGateIcon size={34} className="faculty-social-svg" />
                                  </a>
                                )}
                                {social?.portfolioUrl && (
                                  <a
                                    className="faculty-social-icon-link"
                                    href={normalizeExternalUrl(social.portfolioUrl)}
                                    target="_blank"
                                    rel="noreferrer"
                                    title="Website / lab / portfolio"
                                    aria-label="Website or portfolio"
                                  >
                                    <i className="bi bi-globe2 faculty-social-bi text-secondary" aria-hidden />
                                  </a>
                                )}
                              </div>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary mt-2"
                                onClick={openSocialModal}
                              >
                                Edit links &amp; profiles
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={openSocialModal}
                              className="btn btn-dark text-white"
                            >
                              Add social &amp; research links
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
                <div className="row align-items-start g-2">
                  <div className="col min-w-0">
                    <h5 className="mb-1">
                      <b>Certifications</b>
                    </h5>
                    <p className="text-muted small mb-0">
                      Talk about the certifications you have completed, What
                      projects you undertook and what special skills you learned.
                    </p>
                  </div>
                  <div className="col-auto d-flex flex-column align-items-end gap-1 flex-shrink-0">
                    <button
                      type="button"
                      className="bi btn bi-plus-lg"
                      data-bs-toggle="modal"
                      data-bs-target="#achievementBackdrop"
                      aria-label="Add certification"
                    ></button>
                    <button
                      type="button"
                      className="bi btn bi-caret-down-fill"
                      data-bs-toggle="collapse"
                      data-bs-target="#certificationsDropdown"
                      aria-expanded="false"
                      aria-controls="certificationsDropdown"
                      aria-label="Expand certifications"
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
                      <a
                        href={normalizeExternalUrl(certification.verification)}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Open Verification
                      </a>
                      <div className="d-flex gap-2 mt-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          disabled={!!pendingActions[`faculty-cert-update-${certification.certificationId}`]}
                          onClick={() => updateFacultyCertification(certification)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          disabled={!!pendingActions[`faculty-cert-delete-${certification.certificationId}`]}
                          onClick={() => deleteFacultyCertification(certification.certificationId)}
                        >
                          Delete
                        </button>
                      </div>
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
                <div className="row align-items-start g-2">
                  <div className="col min-w-0">
                    <h5 className="mb-1">
                      <b>Research Papers</b>
                    </h5>
                    <p className="text-muted small mb-0">
                      Talk about the Research Papers you have completed, What
                      projects you undertook and what special skills you learned.
                    </p>
                  </div>
                  <div className="col-auto d-flex flex-column align-items-end gap-1 flex-shrink-0">
                    <button
                      type="button"
                      className="bi btn bi-plus-lg"
                      data-bs-toggle="modal"
                      data-bs-target="#researchPaperBackdrop"
                      aria-label="Add research paper"
                    ></button>
                    <button
                      type="button"
                      className="bi btn bi-caret-down-fill"
                      data-bs-toggle="collapse"
                      data-bs-target="#researchPapersDropdown"
                      aria-expanded="false"
                      aria-controls="researchPapersDropdown"
                      aria-label="Expand research papers"
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
                      <a
                        href={normalizeExternalUrl(researchPaper.paperReferences)}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Open Reference Link
                      </a>
                      <div className="d-flex gap-2 mt-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          disabled={!!pendingActions[`paper-update-${researchPaper.paperId}`]}
                          onClick={() => updateResearchPaper(researchPaper)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          disabled={!!pendingActions[`paper-delete-${researchPaper.paperId}`]}
                          onClick={() => deleteResearchPaper(researchPaper.paperId)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card mt-4 shadow">
              <div className="card-body">
                <div className="row align-items-start g-2">
                  <div className="col min-w-0">
                    <h5 className="mb-1">
                      <b>Experiences</b>
                    </h5>
                    <p className="text-muted small mb-0">
                      Talk about the experiences you have completed, What projects
                      you undertook and what special skills you learned.
                    </p>
                  </div>
                  <div className="col-auto d-flex flex-column align-items-end gap-1 flex-shrink-0">
                    <button
                      type="button"
                      className="bi btn bi-plus-lg"
                      data-bs-toggle="modal"
                      data-bs-target="#experienceBackdrop"
                      aria-label="Add experience"
                    ></button>
                    <button
                      type="button"
                      className="bi btn bi-caret-down-fill"
                      data-bs-toggle="collapse"
                      data-bs-target="#experiencesDropdown"
                      aria-expanded="false"
                      aria-controls="experiencesDropdown"
                      aria-label="Expand experiences"
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
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          disabled={!!pendingActions[`experience-update-${experience.experienceId}`]}
                          onClick={() => updateExperience(experience)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          disabled={!!pendingActions[`experience-delete-${experience.experienceId}`]}
                          onClick={() => deleteExperience(experience.experienceId)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card mt-4 shadow">
              <div className="card-body">
                <div className="row align-items-start g-2">
                  <div className="col min-w-0">
                    <h5 className="mb-1">
                      <b>Projects</b>
                    </h5>
                    <p className="text-muted small mb-0">
                      Talk about the projects that made you proud and contributed
                      to your learnings.
                    </p>
                  </div>
                  <div className="col-auto d-flex flex-column align-items-end gap-1 flex-shrink-0">
                    <button
                      type="button"
                      className="bi btn bi-plus-lg"
                      data-bs-toggle="modal"
                      data-bs-target="#projectBackdrop"
                      aria-label="Add project"
                    ></button>
                    <button
                      type="button"
                      className="bi btn bi-caret-down-fill"
                      data-bs-toggle="collapse"
                      data-bs-target="#projectsDropdown"
                      aria-expanded="false"
                      aria-controls="projectsDropdown"
                      aria-label="Expand projects"
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
                      disabled={!!pendingActions[`faculty-project-update-${project.projectId}`]}
                      onClick={() => updateFacultyProject(project)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      disabled={!!pendingActions[`faculty-project-delete-${project.projectId}`]}
                      onClick={() => deleteFacultyProject(project.projectId)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="card mt-4 shadow">
              <div className="card-body">
                <div className="row align-items-start g-2">
                  <div className="col min-w-0">
                    <h5 className="mb-1">
                      <b>Professional licenses</b>
                    </h5>
                    <p className="text-muted small mb-0">
                      Teaching credentials, industry certifications, bar memberships, etc.
                    </p>
                  </div>
                  <div className="col-auto d-flex flex-column align-items-end gap-1 flex-shrink-0">
                    <button
                      type="button"
                      className="bi btn bi-plus-lg"
                      onClick={() => openLicenseModal(null)}
                      aria-label="Add license"
                    ></button>
                    <button
                      type="button"
                      className="bi btn bi-caret-down-fill"
                      data-bs-toggle="collapse"
                      data-bs-target="#licensesDropdown"
                      aria-expanded="false"
                      aria-controls="licensesDropdown"
                      aria-label="Expand professional licenses"
                    ></button>
                  </div>
                </div>
              </div>
            </div>
            <div className="collapse shadow" id="licensesDropdown">
              {licenses.map((lic) => (
                <div className="card card-body" key={lic.licenseId}>
                  <p className="mb-1">
                    <strong>{lic.title}</strong>
                  </p>
                  {lic.issuingBody && <p className="mb-1">Issued by: {lic.issuingBody}</p>}
                  {lic.licenseNumber && <p className="mb-1">Number: {lic.licenseNumber}</p>}
                  {lic.expiryDate && <p className="mb-1">Expires: {String(lic.expiryDate).slice(0, 10)}</p>}
                  {lic.verificationUrl && (
                    <a href={normalizeExternalUrl(lic.verificationUrl)} target="_blank" rel="noreferrer">
                      Verification link
                    </a>
                  )}
                  {lic.notes && <p className="mb-0 mt-2 small">{lic.notes}</p>}
                  <div className="d-flex gap-2 mt-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => openLicenseModal(lic)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteLicense(lic.licenseId)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="card mt-4 shadow">
              <div className="card-body">
                <div className="row align-items-start g-2">
                  <div className="col min-w-0">
                    <h5 className="mb-1">
                      <b>Research grants &amp; funding</b>
                    </h5>
                    <p className="text-muted small mb-0">
                      Sponsored projects, seed funds, government or industry grants.
                    </p>
                  </div>
                  <div className="col-auto d-flex flex-column align-items-end gap-1 flex-shrink-0">
                    <button
                      type="button"
                      className="bi btn bi-plus-lg"
                      onClick={() => openGrantModal(null)}
                      aria-label="Add grant"
                    ></button>
                    <button
                      type="button"
                      className="bi btn bi-caret-down-fill"
                      data-bs-toggle="collapse"
                      data-bs-target="#grantsDropdown"
                      aria-expanded="false"
                      aria-controls="grantsDropdown"
                      aria-label="Expand research grants"
                    ></button>
                  </div>
                </div>
              </div>
            </div>
            <div className="collapse shadow" id="grantsDropdown">
              {grants.map((g) => (
                <div className="card card-body" key={g.grantId}>
                  <p className="mb-1">
                    <strong>{g.title}</strong>
                  </p>
                  {g.fundingAgency && <p className="mb-1">Agency: {g.fundingAgency}</p>}
                  {g.amount && <p className="mb-1">Amount: {g.amount}</p>}
                  {(g.startDate || g.endDate) && (
                    <p className="mb-1">
                      Period: {g.startDate ? String(g.startDate).slice(0, 10) : "—"} —{" "}
                      {g.endDate ? String(g.endDate).slice(0, 10) : "—"}
                    </p>
                  )}
                  {g.description && <p className="mb-1">{g.description}</p>}
                  {g.projectUrl && (
                    <a href={normalizeExternalUrl(g.projectUrl)} target="_blank" rel="noreferrer">
                      Project link
                    </a>
                  )}
                  <div className="d-flex gap-2 mt-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => openGrantModal(g)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteGrant(g.grantId)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="card mt-4 shadow">
              <div className="card-body">
                <div className="row align-items-start g-2">
                  <div className="col min-w-0">
                    <h5 className="mb-1">
                      <b>Personal Documents</b>
                    </h5>
                    <p className="text-muted small mb-0">
                      Talk about the Personal Documents that made you proud and
                      contributed to your learnings.
                    </p>
                  </div>
                  <div className="col-auto d-flex flex-column align-items-end gap-1 flex-shrink-0">
                    {!addDocuments && (
                      <button
                        type="button"
                        className="bi btn bi-plus-lg"
                        data-bs-toggle="modal"
                        data-bs-target="#personalDocumentBackdrop"
                        aria-label="Add personal documents"
                      ></button>
                    )}
                    <button
                      type="button"
                      className="bi btn bi-caret-down-fill"
                      data-bs-toggle="collapse"
                      data-bs-target="#personalDocumentsDropdown"
                      aria-expanded="false"
                      aria-controls="personalDocumentsDropdown"
                      aria-label="Expand personal documents"
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
                    <div className="row align-items-start g-2">
                      <div className="col min-w-0">
                        <h5 className="mb-1">
                          <b>Department Students</b>
                        </h5>
                        <p className="text-muted small mb-0">
                          Check about the Department Students that made you proud
                          and contributed to your learnings.
                        </p>
                      </div>
                      <div className="col-auto d-flex flex-column align-items-end gap-1 flex-shrink-0">
                        <button
                          type="button"
                          className="bi btn bi-caret-down-fill"
                          data-bs-toggle="collapse"
                          data-bs-target="#studentsDocumentsDropdown"
                          aria-expanded="false"
                          aria-controls="studentsDocumentsDropdown"
                          aria-label="Expand department students"
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
              uploadFacultyProfile={uploadFacultyProfile}
              uploadLicense={uploadLicense}
              uploadGrant={uploadGrant}
              departmentStudents={departmentStudents}
              uploadStudentPassword={uploadStudentPassword}
              socialDefaults={social}
              profileDefaults={faculty}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
