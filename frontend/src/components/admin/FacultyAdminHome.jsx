import { toast } from "react-toastify";
import React, { useContext, useEffect, useState } from "react";
import AdminTopBar from "./AdminTopBar";
import FacultyPagination from "./FacultyPagination";
import FacultyPageSelection from "./FacultyPageSelection";
import FacultyCard from "./FacultyCard";
import "../css/admin_home.css";
import AuthContext from "../auth/AuthContext";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import FacultyFilterBar from "./FacultyFilterBar";
import ChangePasswordModal from "./ChangePasswordModal";

import { API_BASE } from "../../apiBase";

export default function FacultyAdminHome() {
  const { jwtToken, logoutUser } = useContext(AuthContext);

  const [totalFaculty, setTotalFaculty] = useState([]);
  const [modifiedFaculty, setModifiedFaculty] = useState([]);

  const [departmentChoice, setDepartmentChoice] = useState(null);
  const [experienceChoice, setExperienceChoice] = useState(null);
  const [designationChoice, setDesignationChoice] = useState(null);

  const [uniqueDepartments, setUniqueDepartments] = useState([]);
  const [uniqueExperiences, setUniqueExperiences] = useState([]);
  const [uniqueDesignations, setUniqueDesignations] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // faculty
  useEffect(() => {
    validateAdmin(jwtToken, logoutUser);

    async function getFacultyData() {
      try {
        const unqDesignations = await getUniqueDesignations(
          logoutUser,
          jwtToken
        );
        setUniqueDesignations(unqDesignations);

        const unqdept = await getUniqueDepartments(logoutUser, jwtToken);
        setUniqueDepartments(unqdept);

        const unqexp = await getUniqueExperiences(logoutUser, jwtToken);
        setUniqueExperiences(unqexp);

        const url = `${API_BASE}/faculty/get-all-faculties`;
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        });
        const facultyWithImages = await Promise.all(
          response.data.map(async (faculty) => {
            const imageData = await getFacultyImage(faculty.profilePicture);
            if (imageData !== null) {
              return {
                ...faculty,
                profilePicture: URL.createObjectURL(imageData),
              };
            }
            return faculty;
          })
        );

        const facultyIds = await getUniqueFacultyIdsByExperience(jwtToken);

        const facultyWithExperiences = await Promise.all(
          facultyWithImages.map(async (faculty) => {
            if (facultyIds.includes(faculty.facultyId)) {
              const experienceData = await getExperiencesByFaculty(
                jwtToken,
                faculty.facultyId
              );
              return { ...faculty, exps: experienceData };
            } else {
              return { ...faculty, exps: [] };
            }
          })
        );

        const facultyIds2 = await getUniqueFacultyIdsByPaper(jwtToken);

        const facultyWithPapers = await Promise.all(
          facultyWithExperiences.map(async (faculty) => {
            if (facultyIds2.includes(faculty.facultyId)) {
              const paperData = await getPapersByFaculty(
                jwtToken,
                faculty.facultyId
              );
              return { ...faculty, papers: paperData };
            } else {
              return { ...faculty, papers: [] };
            }
          })
        );

        const facultyIds3 = await getUniqueFacultyIdsByCertification(jwtToken);
        const facultyWithCertifications = await Promise.all(
          facultyWithPapers.map(async (faculty) => {
            if (facultyIds3.includes(faculty.facultyId)) {
              const certifyData = await getCertificationsByFaculty(
                jwtToken,
                faculty.facultyId
              );
              return { ...faculty, certifications: certifyData };
            } else {
              return { ...faculty, certifications: [] };
            }
          })
        );

        setTotalFaculty(facultyWithCertifications);
        setModifiedFaculty(facultyWithCertifications);
      } catch (e) {
        logoutUser();
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
        return blob;
      } catch (error) {
        return null;
      }
    }

    getFacultyData();
  }, [jwtToken, logoutUser]);

  // filters
  useEffect(() => {
    let filteredFaculty = totalFaculty;

    // department
    if (departmentChoice) {
      filteredFaculty = filteredFaculty.filter(
        (faculty) => faculty.department === departmentChoice
      );
    }

    // designation
    if (designationChoice) {
      filteredFaculty = filteredFaculty.filter(
        (faculty) => faculty.designation === designationChoice
      );
    }

    if (experienceChoice) {
      filteredFaculty = filteredFaculty.filter((faculty) => {
        return (
          faculty.exps &&
          Array.isArray(faculty.exps) &&
          faculty.exps.length !== 0 &&
          faculty.exps.some((exp) => {
            return exp && exp.includes(experienceChoice);
          })
        );
      });
    }

    setModifiedFaculty(filteredFaculty);
    handlePageChange(1);
  }, [departmentChoice, designationChoice, experienceChoice, totalFaculty]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = modifiedFaculty.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(modifiedFaculty.length / itemsPerPage); i++) {
    pageNumbers.push(i);
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

      <div className="body-part pb-5 mt-3">
        <div className="row pt-4">
          <div className="col-xl-3 col-lg-4">
            <FacultyFilterBar
              setDepartmentChoice={setDepartmentChoice}
              setDesignationChoice={setDesignationChoice}
              setExperienceChoice={setExperienceChoice}
              uniqueDepartments={uniqueDepartments}
              uniqueDesignations={uniqueDesignations}
              uniqueExperiences={uniqueExperiences}
            />
          </div>
          <div className="col-xl-7 col-lg-8 offset-xl-1">
            <FacultyPageSelection
              modifiedfaculty={modifiedFaculty}
              itemsPerPage={itemsPerPage}
              downloadFaculty={downloadFaculty}
              jwtToken={jwtToken}
              setItemsPerPage={setItemsPerPage}
            />
            {modifiedFaculty.length === 0 ? (
              <p className="mt-5 text-center">No faculty available</p>
            ) : (
              <>
                {currentItems.map((faculty, index) => (
                  <FacultyCard key={index} faculty={faculty} />
                ))}

                <FacultyPagination
                  currentPage={currentPage}
                  handlePageChange={handlePageChange}
                  pageNumbers={pageNumbers}
                />
              </>
            )}
          </div>
        </div>
      </div>
      <ChangePasswordModal uploadPassword={uploadPassword} />
    </div>
  );
}

function validateAdmin(jwtToken, logoutUser) {
  if (!jwtToken) {
    return <Navigate to="/login" />;
  }

  let username1 = jwtDecode(jwtToken);
  if (username1.sub !== "admin") {
    logoutUser();
  }
}

async function getUniqueDepartments(logoutUser, jwtToken) {
  try {
    const url = `${API_BASE}/faculty/get-unique-departments`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwtToken,
      },
    });
    return response.data;
  } catch (e) {
    logoutUser();
  }
}

async function getUniqueDesignations(logoutUser, jwtToken) {
  try {
    const url = `${API_BASE}/faculty/get-unique-designations`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwtToken,
      },
    });
    return response.data;
  } catch (e) {
    logoutUser();
  }
}

async function getUniqueExperiences(logoutUser, jwtToken) {
  try {
    const url = `${API_BASE}/experience/get-unique-experiences`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwtToken,
      },
    });
    return response.data;
  } catch (e) {
    logoutUser();
  }
}

async function downloadFaculty(jwtToken) {
  try {
    const url = `${API_BASE}/faculty/excel`;

    const response = await axios.get(url, {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const urlObject = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = urlObject;
    link.setAttribute("download", "faculty.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(urlObject);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
}

async function getUniqueFacultyIdsByExperience(jwtToken) {
  try {
    const url =
      `${API_BASE}/experience/get-all-unique-faculty-ids-by-experience`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwtToken,
      },
    });
    return response.data;
  } catch (e) {
    return null;
  }
}

async function getExperiencesByFaculty(jwtToken, facultyId) {
  try {
    const url =
      `${API_BASE}/experience/get-unique-experiences-by-faculty-id/${facultyId}`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwtToken,
      },
    });
    return response.data;
  } catch (e) {
    return null;
  }
}

async function getUniqueFacultyIdsByPaper(jwtToken) {
  try {
    const url =
      `${API_BASE}/research-papers/get-all-unique-faculty-ids-by-paper`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwtToken,
      },
    });
    return response.data;
  } catch (e) {
    return null;
  }
}

async function getPapersByFaculty(jwtToken, facultyId) {
  try {
    const url =
      `${API_BASE}/research-papers/get-unique-papers-by-faculty-id/${facultyId}`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwtToken,
      },
    });
    return response.data;
  } catch (e) {
    return null;
  }
}

async function getUniqueFacultyIdsByCertification(jwtToken) {
  try {
    const url =
      `${API_BASE}/faculty-certification/get-all-unique-faculty-ids-by-certification`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwtToken,
      },
    });
    return response.data;
  } catch (e) {
    return null;
  }
}

async function getCertificationsByFaculty(jwtToken, facultyId) {
  try {
    const url =
      `${API_BASE}/faculty-certification/get-unique-certifications-by-faculty-id/${facultyId}`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwtToken,
      },
    });
    return response.data;
  } catch (e) {
    return null;
  }
}
