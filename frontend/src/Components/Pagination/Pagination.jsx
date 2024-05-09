import React from 'react'
import './Pagination.css'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    console.log(currentPage, totalPages)
    const getPageRange = () => {
        const startPage = Math.max(1, currentPage - 2)
        const endPage = Math.min(totalPages, currentPage + 2)
        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
    }

    return (
        <div className="pagination-wrapper">
            <button onClick={() => onPageChange(1)} disabled={currentPage === 1}>
                처음
            </button>

            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                이전
            </button>

            {getPageRange().map((page) => (
                <button key={page} onClick={() => onPageChange(page)} disabled={currentPage === page}>
                    {page}
                </button>
            ))}

            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                다음
            </button>

            <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>
                마지막
            </button>
        </div>
    )
}

export default Pagination
