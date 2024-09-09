"use client"
import React, { useEffect, useState } from "react"
import {
  fetchSeasons,
  searchBySeason,
  fetchRealTimeTouristAttractions
} from "@/services/user/api"
import Image from "next/image"
import Link from "next/link"
import { showInfoAlert } from "@/lib/sweetalert"

const RealTimeSeasonalAttractions = () => {
  const [attractions, setAttractions] = useState([])
  const [seasons, setSeasons] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedSeason, setSelectedSeason] = useState(null)
  const itemsPerPage = 6

  useEffect(() => {
    const fetchAllSeasons = async () => {
      try {
        const data = await fetchSeasons()
        setSeasons(data)
      } catch (error) {
        console.error("Error fetching seasons:", error)
      }
    }

    fetchAllSeasons()
  }, [])

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        let data = []

        if (selectedSeason !== null) {
          data = await searchBySeason(selectedSeason)
        } else {
          data = await fetchRealTimeTouristAttractions()
        }

        setAttractions(data)
        setTotalPages(Math.ceil(data.length / itemsPerPage))

        const seasonName = selectedSeason
          ? seasons.find(season => season.id === selectedSeason)?.name
          : "ฤดูกาลปัจจุบัน"

        if (data.length === 0) {
          showInfoAlert(
            `ไม่มีสถานที่ท่องเที่ยวใน${seasonName}ขณะนี้`,
            "กรุณาลองเลือกฤดูกาลอื่นหรือตรวจสอบข้อมูลใหม่ในภายหลัง"
          )
        }
      } catch (error) {
        console.error("Error fetching tourist attractions:", error)
      }
    }

    fetchAttractions()
  }, [selectedSeason, seasons])

  const handlePageChange = page => {
    setCurrentPage(page)
  }

  const handleSeasonChange = seasonId => {
    setSelectedSeason(seasonId)
    setCurrentPage(1)
  }

  const paginatedAttractions = attractions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl md:text-4xl lg:text-5xl font-bold text-orange-500 text-center mt-10 mb-5">
        สถานที่ท่องเที่ยวตามฤดูกาล
      </h1>

      {/* Season Buttons */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        <button
          onClick={() => handleSeasonChange(null)}
          className={`py-2 px-4 rounded-full hover:bg-orange-300 transition duration-200 ${
            selectedSeason === null
              ? "bg-orange-600 text-white"
              : "bg-orange-200 text-orange-800"
          }`}
        >
          ฤดูกาลปัจจุบัน
        </button>
        {seasons.map(season => (
          <button
            key={season.id}
            onClick={() => handleSeasonChange(season.id)}
            className={`py-2 px-4 rounded-full hover:bg-orange-300 transition duration-200 ${
              selectedSeason === season.id
                ? "bg-orange-600 text-white"
                : "bg-orange-200 text-orange-800"
            }`}
          >
            {season.name}
          </button>
        ))}
      </div>

      {paginatedAttractions.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedAttractions.map((attraction, index) => (
              <Link
                key={index}
                href={`/place/${attraction.id}`}
                className="p-4 block"
              >
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-95 transition duration-300 ease-in-out flex flex-col h-full">
                  {attraction.image_url && attraction.image_url.length > 0 ? (
                    <Image
                      src={attraction.image_url[0]}
                      alt={attraction.name}
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
                    <h3 className="text-xl font-semibold">{attraction.name}</h3>
                    {/* Display highlighted season name */}
                    <p className="text-gray-600 flex-grow overflow-hidden text-ellipsis">
                      {attraction.description}
                    </p>
                    <p className="text-orange-500 font-bold mb-2">
                      {attraction.district_name}
                    </p>
                    <p className="text-gray-600">
                      <strong>ที่ตั้ง:</strong> {attraction.location}
                    </p>
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
      ) : null}
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

export default RealTimeSeasonalAttractions
