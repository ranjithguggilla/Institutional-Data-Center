import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../auth/AuthContext";
import { Navigate } from "react-router-dom";
import "../css/admin_home.css";
import AdminTopBar from "./AdminTopBar";
import axios from "axios";
import FilterBar from "./FilterBar";
import StudentCard from "./StudentCard";
import { jwtDecode } from "jwt-decode";
import StudentPagination from "./StudentPagination";
import PageSelection from "./PageSelection";
import ChangePasswordModal from "./ChangePasswordModal";
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function AdminHome() {
  const { jwtToken, logoutUser } = useContext(AuthContext);

  const [totalStudents, setTotalStudents] = useState([]);
  const [modifiedStudents, setModifiedStudents] = useState([]);

  const [certificationChoice, setCertificationChoice] = useState(null);
  const [batchChoice, setBatchChoice] = useState(null);
  const [departmentChoice, setDepartmentChoice] = useState(null);
  const [cgpaChoice, setCgpaChoice] = useState(null);
  const [skillChoice, setSkillChoice] = useState(null);
  const [internshipChoice, setInternshipChoice] = useState(null);

  const [uniqueBatches, setUniqueBatches] = useState([]);
  const [uniqueDepartments, setUniqueDepartments] = useState([]);
  const [uniqueSkills, setUniqueSkills] = useState([]);
  const [uniqueCertifications, setUniqueCertifications] = useState([]);
  const [uniqueCertifications2, setUniqueCertifications2] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    async function getStudentData() {
      try {
        const unqBatches = await getUniqueBatches(logoutUser, jwtToken);
        setUniqueBatches(unqBatches);

        const unqdept = await getUniqueDepartments(logoutUser, jwtToken);
        setUniqueDepartments(unqdept);

        const unqskill = await getUniqueSkills(logoutUser, jwtToken);
        setUniqueSkills(unqskill);

        const unqCertification = await getUniqueCertificationsTechnical(
          logoutUser,
          jwtToken
        );
        setUniqueCertifications(unqCertification);

        const unqCertification2 = await getUniqueCertificationsNonTechnical(
          logoutUser,
          jwtToken
        );
        setUniqueCertifications2(unqCertification2);

        const url = `${API_BASE}/student/get-all-students`;
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        });
        const studentsWithImages = await Promise.all(
          response.data.map(async (student) => {
            const imageData = await getStudentImage(student.profilePicture);
            const newCpga = parseFloat(student.cgpa);
            if (imageData !== null) {
              return {
                ...student,
                profilePicture: URL.createObjectURL(imageData),
                cgpa: newCpga,
              };
            }
            return { ...student, cgpa: newCpga };
          })
        );

        const studentIds = await getUniqueStudentIdsBySKill(jwtToken);

        const studentsWithSkills = await Promise.all(
          studentsWithImages.map(async (student) => {
            if (studentIds.includes(student.studentId)) {
              const skillData = await getSkillsByStudent(
                jwtToken,
                student.studentId
              );
              return { ...student, skills: skillData };
            } else {
              return { ...student, skills: [] };
            }
          })
        );

        const studentIds2 = await getUniqueStudentIdsByCertifcation(jwtToken);

        const studentsWithCertifactions = await Promise.all(
          studentsWithSkills.map(async (student) => {
            if (studentIds2.includes(student.studentId)) {
              const certificationData = await getCertificationsByStudent(
                jwtToken,
                student.studentId
              );
              return { ...student, certifications: certificationData };
            } else {
              return { ...student, certifications: [] };
            }
          })
        );

        const studentIds3 = await getUniqueStudentIdsByInternship(jwtToken);

        const studentsWithInternships = await Promise.all(
          studentsWithCertifactions.map(async (student) => {
            if (studentIds3.includes(student.studentId)) {
              const internshipData = await getInternshipsByStudent(
                jwtToken,
                student.studentId
              );
              return { ...student, internships: internshipData };
            } else {
              return { ...student, internships: [] };
            }
          })
        );

        setTotalStudents(studentsWithInternships);
        setModifiedStudents(studentsWithInternships);
      } catch (e) {
        logoutUser();
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

    getStudentData();
  }, [jwtToken, logoutUser]);

  // Filters
  useEffect(() => {
    let filteredStudents = totalStudents;

    // department
    if (departmentChoice) {
      filteredStudents = filteredStudents.filter(
        (student) => student.department === departmentChoice
      );
    }

    // cgpa
    if (cgpaChoice) {
      filteredStudents = filteredStudents.filter(
        (student) => student.cgpa >= cgpaChoice
      );
    }

    // batch
    if (batchChoice) {
      filteredStudents = filteredStudents.filter(
        (student) => student.batch === batchChoice
      );
    }

    // skill
    if (skillChoice) {
      filteredStudents = filteredStudents.filter((student) => {
        return (
          student.skills &&
          Array.isArray(student.skills) &&
          student.skills.length !== 0 &&
          student.skills.some((skill) => {
            return skill && skill.includes(skillChoice);
          })
        );
      });
    }

    // certification
    if (certificationChoice) {
      filteredStudents = filteredStudents.filter((student) => {
        return (
          student.certifications &&
          Array.isArray(student.certifications) &&
          student.certifications.length !== 0 &&
          student.certifications.some((certification) => {
            return certification && certification.includes(certificationChoice);
          })
        );
      });
    }

    // internship
    if (internshipChoice) {
      filteredStudents = filteredStudents.filter((student) => {
        return (
          student.internships &&
          Array.isArray(student.internships) &&
          student.internships.length !== 0 &&
          student.internships.some((internship) => {
            return internship && internship.includes(internshipChoice);
          })
        );
      });
    }

    setModifiedStudents(filteredStudents);
    handlePageChange(1);
  }, [
    departmentChoice,
    cgpaChoice,
    batchChoice,
    skillChoice,
    certificationChoice,
    internshipChoice,
    totalStudents,
  ]);

  validateAdmin(jwtToken, logoutUser);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = modifiedStudents.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(modifiedStudents.length / itemsPerPage); i++) {
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
            <FilterBar
              setDepartmentChoice={setDepartmentChoice}
              setCgpaChoice={setCgpaChoice}
              setBatchChoice={setBatchChoice}
              batchChoice={batchChoice}
              uniqueBatches={uniqueBatches}
              uniqueDepartments={uniqueDepartments}
              uniqueSkills={uniqueSkills}
              uniqueCertifications={uniqueCertifications}
              setSkillChoice={setSkillChoice}
              setCertificationChoice={setCertificationChoice}
              setInternshipChoice={setInternshipChoice}
              uniqueCertifications2={uniqueCertifications2}
            />
          </div>
          <div className="col-xl-7 col-lg-8 offset-xl-1">
            <PageSelection
              modifiedStudents={modifiedStudents}
              itemsPerPage={itemsPerPage}
              downloadStudents={downloadStudents}
              jwtToken={jwtToken}
              setItemsPerPage={setItemsPerPage}
            />
            {modifiedStudents.length === 0 ? (
              <p className="mt-5 text-center">No students available</p>
            ) : (
              <>
                {currentItems.map((student, index) => (
                  <StudentCard key={index} student={student} />
                ))}

                <StudentPagination
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

async function getUniqueBatches(logoutUser, jwtToken) {
  try {
    const url = `${API_BASE}/student/get-unique-batches`;
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

async function getUniqueDepartments(logoutUser, jwtToken) {
  try {
    const url = `${API_BASE}/student/get-unique-departments`;
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

async function getUniqueSkills(logoutUser, jwtToken) {
  try {
    const url = `${API_BASE}/skill/get-unique-skills`;
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

async function getUniqueCertificationsTechnical(logoutUser, jwtToken) {
  try {
    const url =
      `${API_BASE}/certification/get-unique-certifications-technical`;
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

async function getUniqueCertificationsNonTechnical(logoutUser, jwtToken) {
  try {
    const url =
      `${API_BASE}/certification/get-unique-certifications-non-technical`;
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

function validateAdmin(jwtToken, logoutUser) {
  if (!jwtToken) {
    return <Navigate to="/login" />;
  }

  let username1 = jwtDecode(jwtToken);
  if (username1.sub !== "admin") {
    logoutUser();
  }
}

async function getSkillsByStudent(jwtToken, studentId) {
  try {
    const url =
      `${API_BASE}/skill/get-all-unique-skills-by-student-id/${studentId}`;
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

async function getCertificationsByStudent(jwtToken, studentId) {
  try {
    const url =
      `${API_BASE}/certification/get-unique-certifications-by-student-id/${studentId}`;
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

async function getInternshipsByStudent(jwtToken, studentId) {
  try {
    const url =
      `${API_BASE}/internship/get-unique-internships-by-student-id/${studentId}`;
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

async function getUniqueStudentIdsBySKill(jwtToken) {
  try {
    const url =
      `${API_BASE}/skill/get-all-unique-student-ids-by-skill`;
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

async function getUniqueStudentIdsByCertifcation(jwtToken) {
  try {
    const url =
      `${API_BASE}/certification/get-all-unique-student-ids-by-certification`;
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

async function getUniqueStudentIdsByInternship(jwtToken) {
  try {
    const url =
      `${API_BASE}/internship/get-all-unique-student-ids-by-internship`;
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

async function downloadStudents(jwtToken) {
  try {
    const url = `${API_BASE}/student/excel`;

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
    link.setAttribute("download", "students.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(urlObject);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
}
