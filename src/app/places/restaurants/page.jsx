"use client"
import React, { useEffect, useState } from "react"
import { fetchDistricts, fetchRestaurantsByDistrict } from "@/services/user/api"
import Image from "next/image"
import Link from "next/link"
import { FaChevronRight } from "react-icons/fa"

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([])
  const [districts, setDistricts] = useState([])
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 6 // Number of items per page

  useEffect(() => {
    // Fetch districts on component mount
    const fetchDistrictData = async () => {
      try {
        const districtsData = await fetchDistricts()
        setDistricts(districtsData)
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
        if (selectedDistrict !== null) {
          // Fetch restaurants by district if selected
          data = await fetchRestaurantsByDistrict(selectedDistrict)
        } else {
          // Fetch all restaurants if no district is selected
          const allRestaurants = await Promise.all(
            districts.map(district => fetchRestaurantsByDistrict(district.id))
          )
          data = allRestaurants.flat()
        }

        setRestaurants(data)
        setTotalPages(Math.ceil(data.length / itemsPerPage))
      } catch (error) {
        console.error("Error fetching restaurants:", error)
      }
    }

    fetchData()
  }, [selectedDistrict, districts])

  const handlePageChange = page => {
    setCurrentPage(page)
  }

  const handleDistrictChange = districtId => {
    setSelectedDistrict(districtId)
    setCurrentPage(1) // Reset to the first page on district change
  }

  const paginatedRestaurants = restaurants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl md:text-4xl lg:text-5xl font-bold text-orange-500 text-center mt-10 mb-5">
        ร้านอาหาร
      </h1>

      {/* District Buttons */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        <button
          onClick={() => handleDistrictChange(null)}
          className={`py-2 px-4 rounded-full hover:bg-orange-300 transition duration-200 ${
            selectedDistrict === null
              ? "bg-orange-600 text-white"
              : "bg-orange-200 text-orange-800"
          }`}
        >
          ร้านอาหารทั้งหมด
        </button>
        {districts.map(district => (
          <button
            key={district.id}
            onClick={() => handleDistrictChange(district.id)}
            className={`py-2 px-4 rounded-full hover:bg-orange-300 transition duration-200 ${
              selectedDistrict === district.id
                ? "bg-orange-600 text-white"
                : "bg-orange-200 text-orange-800"
            }`}
          >
            {district.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedRestaurants.map(restaurant => (
          <Link href={`/place/${restaurant.id}`} key={restaurant.id}>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-95 transition duration-300 ease-in-out flex flex-col h-full">
              {restaurant.image_url && restaurant.image_url[0] ? (
                <Image
                  src={restaurant.image_url[0]}
                  alt={restaurant.name}
                  width={500}
                  height={300}
                  className="rounded-lg mb-4 object-cover w-full h-48"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg mb-4">
                  <span className="text-gray-500">ไม่มีรูปภาพ</span>
                </div>
              )}
              <div className="p-4 flex-grow flex flex-col">
                <h2 className="text-xl font-semibold mb-2">
                  {restaurant.name}
                </h2>
                <p className="text-gray-600 flex-grow">
                  {restaurant.description}
                </p>
                {/* Display season name */}
                <p className="text-orange-500 font-bold mt-2">
                  {restaurant.season_name}
                </p>
                <Link
                  href={`/place/${restaurant.id}`}
                  className="text-orange-500 mt-2 font-bold self-end flex items-center hover:underline"
                >
                  อ่านเพิ่มเติม
                  <FaChevronRight className="ml-1" />
                </Link>
              </div>
            </div>
          </Link>
        ))}
      </div>
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
    <div className="flex justify-center mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="mx-1 px-3 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-orange-400 hover:to-orange-600 transform hover:scale-105 transition duration-300 ease-in-out"
      >
        ก่อนหน้า
      </button>
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`mx-1 px-3 py-2 rounded-lg transform transition duration-300 ease-in-out ${
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
        className="mx-1 px-3 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-orange-400 hover:to-orange-600 transform hover:scale-105 transition duration-300 ease-in-out"
      >
        ถัดไป
      </button>
    </div>
  )
}

export default RestaurantsPage
