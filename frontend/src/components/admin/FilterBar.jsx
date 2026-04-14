import React, { useState } from "react";

export default function FilterBar({
  setDepartmentChoice,
  setCgpaChoice,
  setBatchChoice,
  batchChoice,
  setSkillChoice,
  setInternshipChoice,
  uniqueBatches,
  uniqueDepartments,
  uniqueSkills,
  uniqueCertifications,
  uniqueCertifications2,
  setCertificationChoice,
}) {
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [showAllDepartments, setShowAllDepartments] = useState(false);
  const [showAllCertifications, setShowAllCertifications] = useState(false);
  const [showAllCertifications2, setShowAllCertifications2] = useState(false);

  const clearFilters = () => {
    setDepartmentChoice(null);
    setCgpaChoice(null);
    setBatchChoice(null);
    setSkillChoice(null);
    setInternshipChoice(null);
    setCertificationChoice(null);

    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach((button) => {
      button.checked = false;
    });
  };

  return (
    <div>
      <div className="card shadow">
        <div className="card-body">
          <div className="row">
            <div className="col-6 d-flex justify-content-start align-items-center">
              <h5>
                <b>Filters</b>
              </h5>
            </div>
            <div className="col-6 d-flex justify-content-end align-items-center">
              <button className="btn clear_filter" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          </div>
          <hr />

          <b>Batch & Dept</b>
          <div className="row mt-1">
            {uniqueBatches.map((batch, index) => (
              <div key={index} className="col-3 mb-2">
                <button
                  className={`btn border-secondary ${
                    batchChoice === batch && "bg-danger text-white"
                  }`}
                  onClick={() => setBatchChoice(batch)}
                >
                  {batch}
                </button>
              </div>
            ))}
          </div>

          <div>
            {uniqueDepartments
              .slice(0, showAllDepartments ? uniqueDepartments.length : 3)
              .map((department, index) => (
                <div className="form-check" key={index}>
                  <input
                    className="form-check-input"
                    onChange={() => setDepartmentChoice(department)}
                    type="radio"
                    id={`dept_${index}`}
                    name="batch_dept"
                  />
                  <label className="form-check-label" htmlFor={`dept_${index}`}>
                    {department}
                  </label>
                  <div
                    className={
                      index === uniqueDepartments.length - 1 ? "mb-2" : ""
                    }
                  ></div>
                </div>
              ))}
          </div>

          {uniqueDepartments.length > 3 && (
            <>
              <div
                className="vaagdevi_link_colors mb-3"
                onClick={() => setShowAllDepartments(!showAllDepartments)}
              >
                {showAllDepartments ? "View less?" : "View more?"}
              </div>
            </>
          )}

          <b>CGPA</b>
          <div className="form-check mt-2">
            <input
              className="form-check-input"
              type="radio"
              onChange={() => setCgpaChoice(9.0)}
              id="cg1"
              name="cgpa"
            />
            <label className="form-check-label" htmlFor="cg1">
              {" "}
              &gt; 9.0{" "}
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              onChange={() => setCgpaChoice(8.0)}
              id="cg2"
              name="cgpa"
            />
            <label className="form-check-label" htmlFor="cg2">
              {" "}
              &gt; 8.0{" "}
            </label>
          </div>
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="radio"
              onChange={() => setCgpaChoice(7.0)}
              id="cg3"
              name="cgpa"
            />
            <label className="form-check-label" htmlFor="cg3">
              {" "}
              &gt; 7.0{" "}
            </label>
          </div>

          <b>Technical Achievements</b>
          {uniqueCertifications
            .slice(0, showAllCertifications ? uniqueCertifications.length : 3)
            .map((certification, index) => (
              <div
                className={`form-check ${index === 0 ? "mt-2" : ""}`}
                key={index}
              >
                <input
                  className="form-check-input"
                  type="radio"
                  id={`c${index}`}
                  name="certification"
                  onClick={() => setCertificationChoice(certification)}
                />
                <label className="form-check-label" htmlFor={`c${index}`}>
                  {certification}
                </label>
                <div
                  className={
                    index === uniqueCertifications.length - 1 ? "mb-2" : ""
                  }
                ></div>
              </div>
            ))}

          {uniqueCertifications.length > 3 && (
            <>
              <div
                className="vaagdevi_link_colors mb-3"
                onClick={() => setShowAllCertifications(!showAllCertifications)}
              >
                {showAllCertifications ? "View less?" : "View more?"}
              </div>
            </>
          )}

          <b>Non-Technical Achievements</b>
          {uniqueCertifications2
            .slice(0, showAllCertifications2 ? uniqueCertifications2.length : 3)
            .map((certification, index) => (
              <div
                className={`form-check ${index === 0 ? "mt-2" : ""}`}
                key={index}
              >
                <input
                  className="form-check-input"
                  type="radio"
                  id={`c${index}`}
                  name="certification"
                  onClick={() => setCertificationChoice(certification)}
                />
                <label className="form-check-label" htmlFor={`c${index}`}>
                  {certification}
                </label>
                <div
                  className={
                    index === uniqueCertifications2.length - 1 ? "mb-2" : ""
                  }
                ></div>
              </div>
            ))}

          {uniqueCertifications2.length > 3 && (
            <>
              <div
                className="vaagdevi_link_colors mb-3"
                onClick={() =>
                  setShowAllCertifications2(!showAllCertifications2)
                }
              >
                {showAllCertifications2 ? "View less?" : "View more?"}
              </div>
            </>
          )}

          <b>Skills</b>
          {uniqueSkills
            .slice(0, showAllSkills ? uniqueSkills.length : 3)
            .map((skill, index) => (
              <div
                className={`form-check ${index === 0 ? "mt-2" : ""}`}
                key={index}
              >
                <input
                  className="form-check-input"
                  type="radio"
                  id={`sk${index}`}
                  name="skills"
                  onChange={() => setSkillChoice(skill)}
                />
                <label className="form-check-label" htmlFor={`sk${index}`}>
                  {skill}
                </label>
                <div
                  className={index === uniqueSkills.length - 1 ? "mb-2" : ""}
                ></div>
              </div>
            ))}

          {uniqueSkills.length > 3 && (
            <>
              <div
                className="vaagdevi_link_colors mb-3"
                onClick={() => setShowAllSkills(!showAllSkills)}
              >
                {showAllSkills ? "View less?" : "View more?"}
              </div>
            </>
          )}

          <b>Internships</b>
          <div className="form-check mt-2">
            <input
              className="form-check-input"
              onClick={() => setInternshipChoice("On-Site")}
              type="radio"
              id="i1"
              name="internships"
            />
            <label className="form-check-label" htmlFor="i1">
              {" "}
              On-Site{" "}
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              onClick={() => setInternshipChoice("Remote")}
              type="radio"
              id="i2"
              name="internships"
            />
            <label className="form-check-label" htmlFor="i2">
              {" "}
              Remote{" "}
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              onClick={() => setInternshipChoice("Hybrid")}
              type="radio"
              id="i3"
              name="internships"
            />
            <label className="form-check-label" htmlFor="i3">
              {" "}
              Hybrid{" "}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
