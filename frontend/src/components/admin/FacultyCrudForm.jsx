import React from "react";

export default function FacultyCrudForm({
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
        <h5 className="mb-3">{isEditing ? "Edit Faculty" : "Add Faculty"}</h5>
        <form onSubmit={onSubmit}>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Faculty ID</label>
              <input
                type="text"
                className="form-control"
                name="facultyId"
                value={formData.facultyId}
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
                name="facultyName"
                value={formData.facultyName}
                onChange={onChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                name="gender"
                value={String(formData.gender)}
                onChange={onChange}
              >
                <option value="true">Male</option>
                <option value="false">Female</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={onChange}
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
              <label className="form-label">Designation</label>
              <input
                type="text"
                className="form-control"
                name="designation"
                value={formData.designation}
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
              <label className="form-label">Contact Number</label>
              <input
                type="text"
                className="form-control"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={onChange}
              />
            </div>
            <div className="col-12">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                name="address"
                value={formData.address}
                onChange={onChange}
              />
            </div>
          </div>
          <div className="d-flex gap-2 mt-3">
            <button type="submit" className="btn btn-danger" disabled={submitting}>
              {submitting ? "Saving..." : isEditing ? "Update Faculty" : "Create Faculty"}
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
