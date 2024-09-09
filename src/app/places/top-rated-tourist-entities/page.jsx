"use client"
import React, { useEffect, useState } from "react"
import {
  getTopRatedTouristAttractions,
  fetchTopRatedTouristAttractions,
  fetchTopRatedAccommodations,
  fetchTopRatedRestaurants,
  fetchTopRatedSouvenirShops
} from "@/services/user/api"
import Image from "next/image"
import Link from "next/link"
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa"

const PAGE_SIZE = 6

// Mapping category to display text
const categoryDisplayName = {
  "tourist-entities": "สถานที่ทั้งหมด",
  "tourist-attractions": "สถานที่ท่องเที่ยว",
  accommodations: "ที่พัก",
  restaurants: "ร้านอาหาร",
  "souvenir-shops": "ร้านค้าของฝาก"
}

// Helper function to render star icons based on rating
const renderStars = rating => {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} className="text-yellow-500" />)
    } else if (i - rating < 1) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />)
    } else {
      stars.push(<FaRegStar key={i} className="text-yellow-500" />)
    }
  }
  return stars
}

// Function to get image URL
const getImageUrl = imagePath => {
  return `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${imagePath}`
}

const TopRatedPlacesPage = () => {
  const [places, setPlaces] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState("tourist-attractions")

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true)
      let response = []

      try {
        switch (category) {
          case "tourist-entities":
            response = await getTopRatedTouristAttractions()
            break
          case "tourist-attractions":
            response = await fetchTopRatedTouristAttractions()
            break
          case "accommodations":
            response = await fetchTopRatedAccommodations()
            break
          case "restaurants":
            response = await fetchTopRatedRestaurants()
            break
          case "souvenir-shops":
            response = await fetchTopRatedSouvenirShops()
            break
          default:
            break
        }

        setPlaces(
          response.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
        )
        setTotalPages(Math.ceil(response.length / PAGE_SIZE))
      } catch (error) {
        console.error("Error fetching places:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlaces()
  }, [category, currentPage])

  const handleCategoryChange = newCategory => {
    setCategory(newCategory)
    setCurrentPage(1)
  }

  const handlePageChange = page => {
    setCurrentPage(page)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl md:text-4xl lg:text-5xl font-bold text-orange-500 text-center mt-10 mb-5">
        {categoryDisplayName[category]}
      </h1>
      {/* Category Selector */}
      <div className="flex justify-center mb-6 flex-wrap gap-2">
        {Object.keys(categoryDisplayName).map(cat => (
          <button
            key={cat}
            className={`px-4 py-2 rounded ${
              category === cat
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => handleCategoryChange(cat)}
          >
            {categoryDisplayName[cat]}
          </button>
        ))}
      </div>

      {/* Places Grid */}
      {loading ? (
        <div className="text-center">กำลังโหลด...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map(place => (
            <Link href={`/places/${place.id}`} key={place.id}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-95 transition duration-300 ease-in-out flex flex-col h-full">
                {place.images && place.images.length > 0 ? (
                  <Image
                    src={getImageUrl(place.images[0].image_path)}
                    alt={place.name}
                    width={500}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">ไม่มีรูปภาพ</span>
                  </div>
                )}
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{place.name}</h3>
                    <p className="text-gray-600">{place.description}</p>
                    <p className="text-orange-500 font-bold flex items-center">
                      {place.district_name}
                    </p>
                    <p className="text-orange-500 font-bold flex items-center">
                      {place.category_name}
                    </p>
                    <p className="text-orange-500 font-bold flex items-center">
                      {place.season_name}
                    </p>
                  </div>
                  {/* Rating display */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      {typeof place.average_rating === "number" ? (
                        renderStars(place.average_rating)
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </div>
                    <span className="text-gray-600 ml-2">
                      {typeof place.average_rating === "number"
                        ? place.average_rating.toFixed(1)
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <div className="flex justify-center mt-8 flex-wrap gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="mx-1 my-2 px-3 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-orange-400 hover:to-orange-600 transform hover:scale-105 transition duration-300 ease-in-out"
      >
        ก่อนหน้า
      </button>
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`mx-1 my-2 px-3 py-2 rounded-lg transform transition duration-300 ease-in-out ${
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
        className="mx-1 my-2 px-3 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-orange-400 hover:to-orange-600 transform hover:scale-105 transition duration-300 ease-in-out"
      >
        ถัดไป
      </button>
    </div>
  )
}

export default TopRatedPlacesPage
