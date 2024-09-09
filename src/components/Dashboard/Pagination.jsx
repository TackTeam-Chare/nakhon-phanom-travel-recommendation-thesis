import React from "react"

const Pagination = ({ itemsPerPage, totalItems, currentPage, paginate }) => {
  const pageNumbers = []

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i)
  }

  return (
    <div className="flex justify-center mt-4">
      <nav>
        <ul className="inline-flex items-center -space-x-px">
          {pageNumbers.map(number => (
            <li key={number}>
              <button
                onClick={() => paginate(number)}
                className={`px-3 py-2 leading-tight ${
                  currentPage === number
                    ? "bg-blue-500 text-white"
                    : "bg-white border border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Pagination
