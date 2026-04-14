import React from 'react'
import { Link } from 'react-router-dom'

export default function StudentCard({ student }) {
  return (
    <div>
        <div className="card mt-2 mb-4 shadow">
            <div className="card-body">
                <div className="row">
                    <div className="col-sm-2 col-12 justify-content-sm-end align-items-sm-top d-flex">
                        <img src={student.profilePicture} alt="No profile pic" className='img-fluid img-student-profile' />
                    </div>
                    <div className="col-sm-10 mt-sm-0 mt-2 col-12">
                        <h5><b>{student.studentName}</b> | {student.studentId}</h5>
                        <div className="row">
                            <div className="col-sm-3 col-4 text-muted">
                                <i className="bi bi-dot"></i> CGPA: {student.cgpa}
                            </div>
                            <div className="col-5 text-muted">
                                <i className="bi bi-dot"></i> Dept: {student.department}
                            </div>
                            <div className="col-sm-4 col-3 text-muted">
                                <i className="bi bi-dot"></i> {student.batch}
                            </div>
                        </div>
                        <div className="text-muted">
                            Skills: {student.skills.length?
                            <>
                            {student.skills.map((skill, index) => (
                                <span key={index}>
                                    {skill}
                                    {index < student.skills.length - 1 && ", "}
                                </span>
                            ))}
                            </>
                            :"None"} | Certification: {student.certifications.length?
                                <>
                                {student.certifications.map((certification, index) => (
                                    <span key={index}>
                                        {certification}
                                        {index < student.certifications.length - 1 && ", "}
                                    </span>
                                ))}
                                </>
                                :"None"} | {student.internships.length?
                                <>
                                    {student.internships.length} {student.internships.length > 1?"Internship(s)":"Internship"} Completed.
                                </>
                                : "No internships."}
                        </div>
                        <Link to={"/admin/student/" + student.studentId} className="vaagdevi_link_colors nav-link mt-1">
                            See Full Profile
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
