"use client"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { getAllFetchTouristEntities } from "@/services/user/api"

const TouristAttractionsPage = () => {
  const [attractions, setAttractions] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllFetchTouristEntities()
        setAttractions(data)
        setTotalPages(Math.ceil(data.length / itemsPerPage))
      } catch (error) {
        console.error("Error fetching tourist attractions:", error)
      }
    }

    fetchData()
  }, [])

  const handlePageChange = page => {
    setCurrentPage(page)
  }

  const paginatedAttractions = attractions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Title with responsive margin */}
      <h1 className="text-4xl md:text-5xl font-bold text-orange-500 text-center mt-10 mb-10">
        สถานที่ทั้งหมดที่มีในระบบ
      </h1>
      
      {/* Responsive grid with proper gap */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {paginatedAttractions.map(attraction => (
          <Link href={`/place/${attraction.id}`} key={attraction.id}>
            {/* Add padding inside cards */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-95 transition duration-300 ease-in-out flex flex-col h-full p-4">
              {/* Image section */}
              {attraction.images && attraction.images.length > 0 && attraction.images[0].image_url ? (
                <Image
                  src={attraction.images[0].image_url}
                  alt={attraction.name}
                  width={500}
                  height={300}
                  className="w-full h-48 object-cover rounded"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">ไม่มีรูปภาพ</span>
                </div>
              )}
              
              {/* Text content */}
              <div className="flex-grow mt-4">
                <h2 className="text-xl font-bold mb-2 text-orange-500">{attraction.name}</h2>
                <p className="text-gray-600 mb-4">
                  {attraction.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Pagination component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <div className="flex flex-wrap justify-center mt-8 space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="mx-1 px-3 py-2 text-xs sm:text-sm bg-orange-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-orange-400 hover:to-orange-600 transform hover:scale-105 transition duration-300 ease-in-out"
      >
        ก่อนหน้า
      </button>
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`mx-1 px-3 py-2 text-xs sm:text-sm rounded-lg transform transition duration-300 ease-in-out ${
            page === currentPage
              ? "bg-orange-700 text-white hover:shadow-xl hover:bg-gradient-to-r hover:from-orange-600 hover:to-orange-800"
              : "bg-orange-500 text-white hover:bg-gradient-to-r hover:from-orange-400 hover:to-orange-600"
          } hover:scale-105`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="mx-1 px-3 py-2 text-xs sm:text-sm bg-orange-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-orange-400 hover:to-orange-600 transform hover:scale-105 transition duration-300 ease-in-out"
      >
        ถัดไป
      </button>
    </div>
  )
}

export default TouristAttractionsPage
