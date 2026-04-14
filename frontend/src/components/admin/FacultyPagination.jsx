import React from 'react'

export default function FacultyPagination({pageNumbers, handlePageChange, currentPage}) {
  return (
    <div>
        <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="page-link vaagdevi_color"
                        aria-label="Previous"
                    >
                        &lt;
                    </button>
                </li>
                {pageNumbers.map(number => (
                    <div key={number}>
                        <li className={`page-item ${currentPage === number && 'active'}`}>
                            <button onClick={() => handlePageChange(number)} className={`btn text-danger ${currentPage === number && 'bg-danger text-white'}`}>
                                {number}
                            </button>
                        </li>
                    </div>
                ))}
                <li className={`page-item ${currentPage === pageNumbers.length && 'disabled'}`}>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="page-link vaagdevi_color"
                        aria-label="Next"
                        disabled={currentPage === pageNumbers.length}
                    >
                        &gt;
                    </button>
                </li>
            </ul>
        </nav>
    </div>
  )
}
