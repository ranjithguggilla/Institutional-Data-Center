import React from "react";

export default function Modals({
  uploadProject,
  uploadSkill,
  uploadInternship,
  uploadAchievement,
  uploadPassword,
}) {
  return (
    <div>
      <div
        className="modal fade"
        id="projectBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="projectBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-center">
          <div className="modal-content">
            <form action="#" onSubmit={(e) => uploadProject(e)} method="post">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="projectBackdropLabel">
                  Add Project
                </h1>
                <button
                  type="button"
                  id="projectModalButton"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Project Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    id="title"
                    required
                    aria-describedby="helpId"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Project Description
                  </label>
                  <textarea
                    name="description"
                    className="form-control"
                    id="description"
                    rows="4"
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="tags" className="form-label">
                    Tags
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="tags"
                    id="tags"
                    required
                    aria-describedby="helpId"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="url" className="form-label">
                    URL
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="url"
                    id="url"
                    required
                    aria-describedby="helpId"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="verification url" className="form-label">
                    Verification URL
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="verification_url"
                    id="verification_url"
                    required
                    aria-describedby="helpId"
                  />
                </div>
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      required
                      className="form-check-input mt-4"
                      type="checkbox"
                      value="t&c"
                      id="t&c"
                    />
                    <label className="form-check-label mt-4" htmlFor="t&c">
                      {" "}
                      <u>
                        I hereby declare that all the above-mentioned
                        information , documents are true and correct to the best
                        of my knowledge.
                      </u>{" "}
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-danger">
                  Upload Project
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="skillBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="skillBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-center">
          <div className="modal-content">
            <form action="#" onSubmit={(e) => uploadSkill(e)} method="post">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="skillBackdropLabel">
                  Add Skill
                </h1>
                <button
                  type="button"
                  id="skillModalButton"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="domain" className="form-label">
                    Domain
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="domain"
                    id="domain"
                    required
                    aria-describedby="helpId"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="skill" className="form-label">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="skill"
                    id="skill"
                    required
                    aria-describedby="helpId"
                  />
                </div>
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      required
                      className="form-check-input mt-4"
                      type="checkbox"
                      value="t&c2"
                      id="t&c2"
                    />
                    <label className="form-check-label mt-4" htmlFor="t&c2">
                      {" "}
                      <u>
                        I hereby declare that all the above-mentioned
                        information , documents are true and correct to the best
                        of my knowledge.
                      </u>{" "}
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-danger">
                  Upload Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="internshipBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="internshipBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-center">
          <div className="modal-content">
            <form
              action="#"
              onSubmit={(e) => uploadInternship(e)}
              method="post"
            >
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="internshipBackdropLabel">
                  Add Internship
                </h1>
                <button
                  type="button"
                  id="internshipModalButton"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="internshipName" className="form-label">
                    Internship Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="internshipName"
                    id="internshipName"
                    required
                    aria-describedby="helpId"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="companyName" className="form-label">
                    Company Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="companyName"
                    id="companyName"
                    required
                    aria-describedby="helpId"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="cdomain" className="form-label">
                    Domain
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="cdomain"
                    id="cdomain"
                    required
                    aria-describedby="helpId"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="startDate" className="form-label">
                    Start Date
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="startDate"
                    id="startDate"
                    pattern="\d{4}-\d{2}-\d{2}"
                    placeholder="yyyy-mm-dd"
                    required
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{4}-\d{2}-\d{2}$/.test(value) || value === "") {
                        e.target.setCustomValidity("");
                      } else {
                        e.target.setCustomValidity(
                          "Please use the yyyy-mm-dd format."
                        );
                      }
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="endDate" className="form-label">
                    End Date
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="endDate"
                    id="endDate"
                    pattern="\d{4}-\d{2}-\d{2}"
                    placeholder="yyyy-mm-dd"
                    required
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{4}-\d{2}-\d{2}$/.test(value) || value === "") {
                        e.target.setCustomValidity("");
                      } else {
                        e.target.setCustomValidity(
                          "Please use the yyyy-mm-dd format."
                        );
                      }
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="internshipType" className="form-label">
                    Internship Type
                  </label>
                  <select
                    className="form-select form-select-lg"
                    name="internshipType"
                    id="internshipType"
                  >
                    <option defaultValue={"On-Site"}>On-Site</option>
                    <option defaultValue={"Remote"}>Remote</option>
                    <option defaultValue={"Hybrid"}>Hybrid</option>
                  </select>
                </div>

                <div className="mb-2">
                  <label htmlFor="internshipFile" className="form-label">
                    Upload File
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    name="internshipFile"
                    id="internshipFile"
                    placeholder="Enter your file"
                    aria-describedby="fileHelpId"
                  />
                </div>
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      required
                      className="form-check-input mt-4"
                      type="checkbox"
                      value="t&c3"
                      id="t&c3"
                    />
                    <label className="form-check-label mt-4" htmlFor="t&c3">
                      {" "}
                      <u>
                        I hereby declare that all the above-mentioned
                        information , documents are true and correct to the best
                        of my knowledge.
                      </u>{" "}
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-danger">
                  Upload Internship
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="achievementBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="achievemenentBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-center">
          <div className="modal-content">
            <form
              action="#"
              onSubmit={(e) => uploadAchievement(e)}
              method="post"
            >
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="achievementBackdropLabel">
                  Add Achievement
                </h1>
                <button
                  type="button"
                  id="achievementModalButton"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="certificationName" className="form-label">
                    Achievement Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="certificationName"
                    id="certificationName"
                    required
                    aria-describedby="helpId"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="expiryDate" className="form-label">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="expiryDate"
                    id="expiryDate"
                    required
                    aria-describedby="helpId"
                    pattern="\d{4}-\d{2}-\d{2}"
                    placeholder="yyyy-mm-dd"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{4}-\d{2}-\d{2}$/.test(value) || value === "") {
                        e.target.setCustomValidity("");
                      } else {
                        e.target.setCustomValidity(
                          "Please use the yyyy-mm-dd format."
                        );
                      }
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="verification" className="form-label">
                    Verification
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="verification"
                    id="verification"
                    required
                    aria-describedby="helpId"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="type" className="form-label">
                    Type
                  </label>
                  <select
                    className="form-select form-select-lg"
                    name="type"
                    id="type"
                  >
                    <option defaultValue={"Technical"}>Technical</option>
                    <option defaultValue={"Non-Technical"}>
                      Non-Technical
                    </option>
                  </select>
                </div>

                <div className="mb-2">
                  <label htmlFor="achievementFile" className="form-label">
                    Upload File
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    name="achievementFile"
                    id="achievementFile"
                    placeholder="Enter your file"
                    aria-describedby="fileHelpId"
                  />
                </div>
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      required
                      className="form-check-input mt-4"
                      type="checkbox"
                      value="t&c4"
                      id="t&c4"
                    />
                    <label className="form-check-label mt-4" htmlFor="t&c4">
                      {" "}
                      <u>
                        I hereby declare that all the above-mentioned
                        information , documents are true and correct to the best
                        of my knowledge.
                      </u>{" "}
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-danger">
                  Upload Achievment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="passwordBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="passwordBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-center">
          <div className="modal-content">
            <form action="#" onSubmit={(e) => uploadPassword(e)} method="post">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="passwordBackdropLabel">
                  Change Password
                </h1>
                <button
                  type="button"
                  id="passwordModalButton"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label">
                    Enter Current Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="currentPassword"
                    id="currentPassword"
                    required
                    aria-describedby="helpId"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">
                    Enter New Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="newPassword"
                    id="newPassword"
                    required
                    aria-describedby="helpId"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="newPasswordAgain" className="form-label">
                    Enter New Password Again
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="newPasswordAgain"
                    id="newPasswordAgain"
                    required
                    aria-describedby="helpId"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-danger">
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
