"use client"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { getAllFetchTouristEntities, fetchDistricts, searchByDistrict } from "@/services/user/api"

const TouristAttractionsPage = () => {
  const [attractions, setAttractions] = useState([])
  const [districts, setDistricts] = useState([])
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    // ดึงข้อมูลอำเภอเมื่อ component เริ่มทำงาน
    const fetchDistrictData = async () => {
      try {
        const districtData = await fetchDistricts()
        setDistricts(districtData)
      } catch (error) {
        console.error("Error fetching districts:", error)
      }
    }

    fetchDistrictData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data
        if (selectedDistrict) {
          // ถ้ามีอำเภอที่เลือกอยู่ให้ค้นหาตามอำเภอ
          data = await searchByDistrict(selectedDistrict)
        } else {
          // ถ้าไม่มีอำเภอที่เลือกให้แสดงสถานที่ท่องเที่ยวทั้งหมด
          data = await getAllFetchTouristEntities()
        }

        setAttractions(data)
        setTotalPages(Math.ceil(data.length / itemsPerPage))
      } catch (error) {
        console.error("Error fetching tourist attractions:", error)
      }
    }

    fetchData()
  }, [selectedDistrict])

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleDistrictChange = (districtId) => {
    setSelectedDistrict(districtId)
    setCurrentPage(1) // รีเซ็ตไปที่หน้าแรกเมื่อเปลี่ยนอำเภอ
  }

  const paginatedAttractions = attractions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl md:text-5xl font-bold text-orange-500 text-center mt-10 mb-10">
        สถานที่ในเเต่ละอำเภอ
      </h1>

      {/* แสดงปุ่มอำเภอให้ผู้ใช้เลือก */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        <button
          onClick={() => handleDistrictChange(null)}
          className={`py-2 px-4 rounded-full hover:bg-orange-300 transition duration-200 ${
            !selectedDistrict ? "bg-orange-600 text-white" : "bg-orange-200 text-orange-800"
          }`}
        >
          สถานที่ทั้งหมด
        </button>
        {districts.map((district) => (
          <button
            key={district.id}
            onClick={() => handleDistrictChange(district.id)}
            className={`py-2 px-4 rounded-full hover:bg-orange-300 transition duration-200 ${
              selectedDistrict === district.id ? "bg-orange-600 text-white" : "bg-orange-200 text-orange-800"
            }`}
          >
            {district.name}
          </button>
        ))}
      </div>

      {/* แสดงสถานที่ท่องเที่ยว */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {paginatedAttractions.map((attraction) => (
          <Link href={`/place/${attraction.id}`} key={attraction.id}>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-95 transition duration-300 ease-in-out flex flex-col h-full p-4">
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
              <div className="flex-grow mt-4">
                <h2 className="text-xl font-bold mb-2 text-orange-500">{attraction.name}</h2>
                <p className="text-gray-600 mb-4">{attraction.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* แสดง Pagination */}
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
      {pages.map((page) => (
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
