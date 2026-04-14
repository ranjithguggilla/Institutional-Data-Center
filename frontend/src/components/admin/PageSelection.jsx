import React from 'react'

export default function PageSelection({setItemsPerPage, itemsPerPage, modifiedStudents, downloadStudents, jwtToken}) {
  return (
    <div>
        <div className="row">
            <div className="col-xl-3 col-lg-6 mt-lg-0 mt-5">
                <h3 className='d-flex align-items-start justify-content-start'><b>{modifiedStudents.length} Students</b></h3>
            </div>
            <div className="col-xl-3 col-lg-6 offset-xl-6">
                <div className="d-flex align-items-end justify-content-end">
                    <button className="btn" onClick={() => downloadStudents(jwtToken)}><i className="bi bi-download"></i></button>
                    <select
                        className="form-select form-select-lg"
                        name="pagecount"
                        id="pagecount"
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                        >
                        <option value={5}>5 Per Page</option>
                        <option value={10}>10 Per Page</option>
                        <option value={20}>20 Per Page</option>
                        <option value={50}>50 Per Page</option>
                        <option value={100}>100 Per Page</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
  )
}
