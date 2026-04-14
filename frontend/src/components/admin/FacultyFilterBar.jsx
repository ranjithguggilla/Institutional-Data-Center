import React, { useState } from 'react'

export default function FacultyFilterBar({setDepartmentChoice, setDesignationChoice, uniqueDepartments, uniqueDesignations, uniqueExperiences, setExperienceChoice}) {
    
    const [showAllDesignations, setShowAllDesignations] = useState(false);
    const [showAllDepartments, setShowAllDepartments] = useState(false);
    const [showAllExperiences, setShowAllExperiences] = useState(false);

    const clearFilters = () => {
        setDepartmentChoice(null);
        setDesignationChoice(null);
        setExperienceChoice(null);
    
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(button => {
          button.checked = false;
        });
      };
    
    return (
        <div>
            <div className="card shadow">
                <div className="card-body">
                    <div className="row">
                        <div className="col-6 d-flex justify-content-start align-items-center">
                        <h5><b>Filters</b></h5>
                        </div>
                        <div className="col-6 d-flex justify-content-end align-items-center">
                        <button className="btn clear_filter" onClick={clearFilters}>
                            Clear Filters
                        </button>
                        </div>
                    </div>
                    <hr />

                    <b>Departments</b>  
                    <div>
                        {uniqueDepartments.slice(0, showAllDepartments ? uniqueDepartments.length : 3).map((department, index) => (
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
                            <div className={index === uniqueDepartments.length - 1 ? 'mb-2' : ''}></div>
                        </div>
                        ))}
                        {uniqueDepartments.length > 3 && (
                            <>
                            <div className='vaagdevi_link_colors mb-3' onClick={() => setShowAllDepartments(!showAllDepartments)}>
                                {showAllDepartments ? 'View less?' : 'View more?'} 
                            </div>
                            </> 
                        )}
                    </div>


                    <b>Experiences</b>  
                    <div>
                        {uniqueExperiences.slice(0, showAllExperiences ? uniqueExperiences.length : 3).map((experience, index) => (
                        <div className="form-check" key={index}>
                            <input
                            className="form-check-input"
                            onChange={() => setExperienceChoice(experience)}
                            type="radio"
                            id={`exp_${index}`}
                            name="batch_exp"
                            />
                            <label className="form-check-label" htmlFor={`exp_${index}`}>
                            {experience}
                            </label>
                            <div className={index === uniqueExperiences.length - 1 ? 'mb-2' : ''}></div>
                        </div>
                        ))}
                        {uniqueExperiences.length > 3 && (
                            <>
                            <div className='vaagdevi_link_colors mb-3' onClick={() => setShowAllExperiences(!showAllExperiences)}>
                                {showAllExperiences ? 'View less?' : 'View more?'} 
                            </div>
                            </> 
                        )}
                    </div>


                    <b>Designations</b>  
                    <div>
                        {uniqueDesignations.slice(0, showAllDesignations ? uniqueDesignations.length : 3).map((designation, index) => (
                        <div className="form-check" key={index}>
                            <input
                            className="form-check-input"
                            onChange={() => setDesignationChoice(designation)}
                            type="radio"
                            id={`desi_${index}`}
                            name="batch_desi"
                            />
                            <label className="form-check-label" htmlFor={`desi_${index}`}>
                            {designation}
                            </label>
                            <div className={index === uniqueDesignations.length - 1 ? 'mb-2' : ''}></div>
                        </div>
                        ))}
                        {uniqueDesignations.length > 3 && (
                            <>
                            <div className='vaagdevi_link_colors mb-3' onClick={() => setShowAllDesignations(!showAllDesignations)}>
                                {showAllDesignations ? 'View less?' : 'View more?'} 
                            </div>
                            </> 
                        )}
                    </div> 


                </div>
            </div>
        </div>
    )
}
