import React, { useEffect } from "react";

export default function FacultyModals({
  uploadAchievement,
  uploadExperience,
  uploadResearchPaper,
  uploadProject,
  uploadDocuments,
  uploadSocial,
  uploadPassword,
  uploadFacultyProfile,
  uploadLicense,
  uploadGrant,
  departmentStudents,
  uploadStudentPassword,
  socialDefaults,
  profileDefaults,
}) {
  useEffect(() => {
    if (!socialDefaults) return;
    const set = (id, v) => {
      const el = document.getElementById(id);
      if (el) el.value = v ?? "";
    };
    set("linkedin", socialDefaults.linkedin);
    set("github", socialDefaults.github);
    set("googleScholar", socialDefaults.googleScholar);
    set("orcid", socialDefaults.orcid);
    set("researchGate", socialDefaults.researchGate);
    set("portfolioUrl", socialDefaults.portfolioUrl);
  }, [socialDefaults]);

  useEffect(() => {
    if (!profileDefaults) return;
    const set = (id, v) => {
      const el = document.getElementById(id);
      if (el) el.value = v ?? "";
    };
    set("profile_facultyName", profileDefaults.facultyName);
    set("profile_department", profileDefaults.department);
    set("profile_emailId", profileDefaults.emailId);
    set("profile_contactNumber", profileDefaults.contactNumber);
    set("profile_designation", profileDefaults.designation);
    set("profile_address", profileDefaults.address);
    set("profile_dob", profileDefaults.dateOfBirth?.slice?.(0, 10) ?? "");
  }, [profileDefaults]);

  return (
    <div>
      <div
        className="modal fade"
        id="achievementBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="achievementBackdropLabel"
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
                  Add Certification
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
                    Certification Name
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
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-danger">
                  Upload Certification
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="experienceBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="experienceBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-center">
          <div className="modal-content">
            <form
              action="#"
              onSubmit={(e) => uploadExperience(e)}
              method="post"
            >
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="experienceBackdropLabel">
                  Add Experience
                </h1>
                <button
                  type="button"
                  id="experienceModalButton"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="organizationName" className="form-label">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="organizationName"
                    id="organizationName"
                    required
                    aria-describedby="helpId"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="designation" className="form-label">
                    Designation
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="designation"
                    id="designation"
                    required
                    aria-describedby="helpId"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="experienceFrom" className="form-label">
                    Experience From
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="experienceFrom"
                    id="experienceFrom"
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
                  <label htmlFor="experienceTo" className="form-label">
                    Experience To
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="experienceTo"
                    id="experienceTo"
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
                  <label htmlFor="experienceType" className="form-label">
                    Experience Type
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="experienceType"
                    id="experienceType"
                    required
                    aria-describedby="helpId"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-danger">
                  Upload Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="researchPaperBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="researchPaperBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-center">
          <div className="modal-content">
            <form
              action="#"
              onSubmit={(e) => uploadResearchPaper(e)}
              method="post"
            >
              <div className="modal-header">
                <h1
                  className="modal-title fs-5"
                  id="researchPaperBackdropLabel"
                >
                  Add Research Paper
                </h1>
                <button
                  type="button"
                  id="researchPaperModalButton"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="publishedTitle" className="form-label">
                    Published Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="publishedTitle"
                    id="publishedTitle"
                    required
                    aria-describedby="helpId"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="publishedDescription" className="form-label">
                    Published Description
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="publishedDescription"
                    id="publishedDescription"
                    required
                    aria-describedby="helpId"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="publishedBy" className="form-label">
                    Published By
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="publishedBy"
                    id="publishedBy"
                    required
                    aria-describedby="helpId"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="paperReferences" className="form-label">
                    References
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="paperReferences"
                    id="paperReferences"
                    required
                    aria-describedby="helpId"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="publishedYear" className="form-label">
                    Published Year
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="publishedYear"
                    id="publishedYear"
                    required
                    aria-describedby="helpId"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-danger">
                  Upload Paper
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
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
        id="socialBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="socialLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-center">
          <div className="modal-content">
            <form action="#" onSubmit={(e) => uploadSocial(e)} method="post">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="socialLabel">
                  Social &amp; research profiles
                </h1>
                <button
                  type="button"
                  id="socialModalButton"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-4">
                  <label htmlFor="linkedin" className="form-label">
                    Linkedin URL
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    name="linkedin"
                    id="linkedin"
                    placeholder="Enter your url"
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor="github" className="form-label">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    name="github"
                    id="github"
                    placeholder="https://github.com/username"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="googleScholar" className="form-label">
                    Google Scholar profile
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    name="googleScholar"
                    id="googleScholar"
                    placeholder="https://scholar.google.com/citations?user=..."
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="orcid" className="form-label">
                    ORCID
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    name="orcid"
                    id="orcid"
                    placeholder="https://orcid.org/0000-0000-0000-0000"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="researchGate" className="form-label">
                    ResearchGate
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    name="researchGate"
                    id="researchGate"
                    placeholder="https://www.researchgate.net/profile/..."
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="portfolioUrl" className="form-label">
                    Website / lab / portfolio
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    name="portfolioUrl"
                    id="portfolioUrl"
                    placeholder="https://"
                  />
                </div>
                <p className="small text-muted mb-0">
                  Optional fields. Paste full URLs. You can clear a field by deleting its text and saving.
                </p>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-danger">
                  Save profiles
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="profileBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="profileLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <form action="#" onSubmit={(e) => uploadFacultyProfile(e)} method="post">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="profileLabel">
                  Edit faculty profile
                </h1>
                <button
                  type="button"
                  id="profileModalButton"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body row g-2">
                <div className="col-md-6">
                  <label className="form-label" htmlFor="profile_facultyName">
                    Name
                  </label>
                  <input type="text" className="form-control" id="profile_facultyName" name="facultyName" />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="profile_department">
                    Department
                  </label>
                  <input type="text" className="form-control" id="profile_department" name="department" />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="profile_emailId">
                    Email
                  </label>
                  <input type="email" className="form-control" id="profile_emailId" name="emailId" />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="profile_contactNumber">
                    Phone
                  </label>
                  <input type="text" className="form-control" id="profile_contactNumber" name="contactNumber" />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="profile_designation">
                    Designation
                  </label>
                  <input type="text" className="form-control" id="profile_designation" name="designation" />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="profile_dob">
                    Date of birth
                  </label>
                  <input type="text" className="form-control" id="profile_dob" name="dateOfBirth" placeholder="yyyy-mm-dd" />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="profile_address">
                    Address
                  </label>
                  <textarea className="form-control" id="profile_address" name="address" rows={2} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-danger">
                  Save profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="licenseBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="licenseLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form action="#" onSubmit={(e) => uploadLicense(e)} method="post">
              <input type="hidden" name="licenseId" id="license_id_field" value="" />
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="licenseLabel">
                  Professional license
                </h1>
                <button
                  type="button"
                  id="licenseModalButton"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <label className="form-label" htmlFor="license_title">
                    Title / credential name
                  </label>
                  <input type="text" className="form-control" id="license_title" name="title" required />
                </div>
                <div className="mb-2">
                  <label className="form-label" htmlFor="license_issuingBody">
                    Issuing organization
                  </label>
                  <input type="text" className="form-control" id="license_issuingBody" name="issuingBody" />
                </div>
                <div className="mb-2">
                  <label className="form-label" htmlFor="license_number">
                    License number
                  </label>
                  <input type="text" className="form-control" id="license_number" name="licenseNumber" />
                </div>
                <div className="mb-2">
                  <label className="form-label" htmlFor="license_expiry">
                    Expiry (yyyy-mm-dd)
                  </label>
                  <input type="text" className="form-control" id="license_expiry" name="expiryDate" placeholder="yyyy-mm-dd" />
                </div>
                <div className="mb-2">
                  <label className="form-label" htmlFor="license_verificationUrl">
                    Verification URL
                  </label>
                  <input type="url" className="form-control" id="license_verificationUrl" name="verificationUrl" />
                </div>
                <div className="mb-2">
                  <label className="form-label" htmlFor="license_notes">
                    Notes
                  </label>
                  <textarea className="form-control" id="license_notes" name="notes" rows={2} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-danger">
                  Save license
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="grantBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="grantLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <form action="#" onSubmit={(e) => uploadGrant(e)} method="post">
              <input type="hidden" name="grantId" id="grant_id_field" value="" />
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="grantLabel">
                  Research grant / funding
                </h1>
                <button
                  type="button"
                  id="grantModalButton"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <label className="form-label" htmlFor="grant_title">
                    Project / grant title
                  </label>
                  <input type="text" className="form-control" id="grant_title" name="title" required />
                </div>
                <div className="mb-2">
                  <label className="form-label" htmlFor="grant_agency">
                    Funding agency
                  </label>
                  <input type="text" className="form-control" id="grant_agency" name="fundingAgency" />
                </div>
                <div className="mb-2">
                  <label className="form-label" htmlFor="grant_amount">
                    Amount (optional)
                  </label>
                  <input type="text" className="form-control" id="grant_amount" name="amount" placeholder="e.g. INR 5,00,000" />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <label className="form-label" htmlFor="grant_start">
                      Start (yyyy-mm-dd)
                    </label>
                    <input type="text" className="form-control" id="grant_start" name="startDate" placeholder="yyyy-mm-dd" />
                  </div>
                  <div className="col-md-6 mb-2">
                    <label className="form-label" htmlFor="grant_end">
                      End (yyyy-mm-dd)
                    </label>
                    <input type="text" className="form-control" id="grant_end" name="endDate" placeholder="yyyy-mm-dd" />
                  </div>
                </div>
                <div className="mb-2">
                  <label className="form-label" htmlFor="grant_desc">
                    Description
                  </label>
                  <textarea className="form-control" id="grant_desc" name="description" rows={3} />
                </div>
                <div className="mb-2">
                  <label className="form-label" htmlFor="grant_projectUrl">
                    Project / outcomes URL
                  </label>
                  <input type="url" className="form-control" id="grant_projectUrl" name="projectUrl" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-danger">
                  Save grant
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="personalDocumentBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="personalDocumentLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-center">
          <div className="modal-content">
            <form action="#" onSubmit={(e) => uploadDocuments(e)} method="post">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="personalDocumentLabel">
                  Add Personal Documents
                </h1>
                <button
                  type="button"
                  id="personalDocumentModalButton"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-4">
                  <label htmlFor="aadharCard" className="form-label">
                    Upload Aadhar Card
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    name="aadharCard"
                    id="aadharCard"
                    placeholder="Enter your file"
                    aria-describedby="fileHelpId"
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor="panCard" className="form-label">
                    Upload Pan Card
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    name="panCard"
                    id="panCard"
                    placeholder="Enter your file"
                    aria-describedby="fileHelpId"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-danger">
                  Upload Social Profile
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

      <div
        className="modal fade"
        id="studentPasswordBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="studentPasswordBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-center">
          <div className="modal-content">
            <form
              action="#"
              onSubmit={(e) => uploadStudentPassword(e)}
              method="post"
            >
              <div className="modal-header">
                <h1
                  className="modal-title fs-5"
                  id="studentPasswordBackdropLabel"
                >
                  Change Password
                </h1>
                <button
                  type="button"
                  id="studentPasswordModalButton"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="studentId" className="form-label">
                    Student Id
                  </label>
                  <select
                    className="form-select form-select-lg"
                    name="studentId"
                    id="studentId"
                  >
                    {departmentStudents.map((student, index) => (
                      <option key={index} defaultValue={student.studentId}>
                        {student.studentId}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="newPasswordStudent" className="form-label">
                    Enter New Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="newPasswordStudent"
                    id="newPasswordStudent"
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
