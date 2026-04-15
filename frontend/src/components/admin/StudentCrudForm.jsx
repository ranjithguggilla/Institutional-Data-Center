import React from "react";

export default function StudentCrudForm({
  isEditing,
  formData,
  onChange,
  onSubmit,
  onCancel,
  submitting,
}) {
  return (
    <div className="card shadow mb-3">
      <div className="card-body">
        <h5 className="mb-3">{isEditing ? "Edit Student" : "Add Student"}</h5>
        <form onSubmit={onSubmit}>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Student ID</label>
              <input
                type="text"
                className="form-control"
                name="studentId"
                value={formData.studentId}
                onChange={onChange}
                disabled={isEditing}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="studentName"
                value={formData.studentName}
                onChange={onChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                name="studentGender"
                value={String(formData.studentGender)}
                onChange={onChange}
              >
                <option value="true">Male</option>
                <option value="false">Female</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Batch</label>
              <input
                type="text"
                className="form-control"
                name="batch"
                value={formData.batch}
                onChange={onChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Department</label>
              <input
                type="text"
                className="form-control"
                name="department"
                value={formData.department}
                onChange={onChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">CGPA</label>
              <input
                type="text"
                className="form-control"
                name="cgpa"
                value={formData.cgpa}
                onChange={onChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="emailId"
                value={formData.emailId}
                onChange={onChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Mobile Number</label>
              <input
                type="text"
                className="form-control"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={onChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">LinkedIn URL</label>
              <input
                type="url"
                className="form-control"
                name="linkedinUrl"
                value={formData.linkedinUrl || ""}
                onChange={onChange}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">GitHub URL</label>
              <input
                type="url"
                className="form-control"
                name="githubUrl"
                value={formData.githubUrl || ""}
                onChange={onChange}
                placeholder="https://github.com/username"
              />
            </div>
          </div>
          <div className="d-flex gap-2 mt-3">
            <button type="submit" className="btn btn-danger" disabled={submitting}>
              {submitting ? "Saving..." : isEditing ? "Update Student" : "Create Student"}
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
