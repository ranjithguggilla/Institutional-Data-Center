import React from "react";
import { Link } from "react-router-dom";

export default function FacultyCard({ faculty, onEdit, onDelete }) {
  return (
    <div>
      <div className="card mt-2 mb-4 shadow">
        <div className="card-body">
          <div className="row">
            <div className="col-sm-2 col-12 justify-content-sm-end align-items-sm-top d-flex">
              <img
                src={faculty.profilePicture}
                alt="No profile pic"
                className="img-fluid img-student-profile"
              />
            </div>
            <div className="col-sm-10 mt-sm-0 mt-2 col-12">
              <h5>
                <b>{faculty.facultyName}</b> | {faculty.facultyId}
              </h5>
              <div className="row text-muted">
                <div className=" col-4">
                  <i className="bi bi-dot"></i>Dept: {faculty.department}
                </div>
                <div className=" col-4">
                  <i className="bi bi-dot"></i>
                  {faculty.designation}
                </div>
                <div className=" col-4">
                  <i className="bi bi-dot"></i>
                  {faculty.contactNumber}
                </div>
              </div>
              <div className="text-muted mt-2">
                Certifications:{" "}
                {faculty.certifications.length ? (
                  <>
                    {faculty.certifications.map((certificate, index) => (
                      <span key={index}>
                        {certificate}
                        {index < faculty.certifications.length - 1 && ", "}
                      </span>
                    ))}
                  </>
                ) : (
                  "None"
                )}{" "}
                | Experiences:{" "}
                {faculty.exps.length ? (
                  <>
                    {faculty.exps.map((exp, index) => (
                      <span key={index}>
                        {exp}
                        {index < faculty.exps.length - 1 && ", "}
                      </span>
                    ))}
                  </>
                ) : (
                  "None"
                )}{" "}
                | Research Papers:{" "}
                {faculty.papers.length ? (
                  <>
                    {faculty.papers.map((paper, index) => (
                      <span key={index}>
                        {paper}
                        {index < faculty.papers.length - 1 && ", "}
                      </span>
                    ))}
                  </>
                ) : (
                  "None"
                )}
              </div>
              <div className="d-flex align-items-center gap-3 mt-1 flex-wrap">
                <Link
                  to={"/admin/faculty/" + faculty.facultyId}
                  className="vaagdevi_link_colors nav-link"
                >
                  See Full Profile
                </Link>
                {onEdit && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onEdit(faculty)}
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(faculty)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 