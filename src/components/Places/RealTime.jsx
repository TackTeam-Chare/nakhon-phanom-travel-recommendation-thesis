"use client"
import React, { useEffect, useState } from "react"
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"
import { fetchRealTimeTouristAttractions } from "../../services/user/api"
import Image from "next/image"
import Link from "next/link"

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1
  }
}

const RealTimeSeasonalAttractions = () => {
  const [attractions, setAttractions] = useState([])

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const data = await fetchRealTimeTouristAttractions()
        setAttractions(data)
      } catch (error) {
        console.error("Error fetching real-time tourist attractions:", error)
      }
    }

    fetchAttractions()
  }, [])

  if (attractions.length === 0) {
    return null // Hide the entire content if there's no data
  }

  return (
    <div className="container mx-auto mt-10 px-4">
      <h1 className="text-4xl md:text-4xl lg:text-5xl font-bold text-orange-500 mt-10 mb-5">
        สถานที่ท่องเที่ยวตามฤดูกาลปัจจุบัน
      </h1>
      <div>
        <Carousel responsive={responsive} className="z-10">
          {attractions.map((attraction, index) => (
            <Link
              key={index}
              href={`/place/${attraction.id}`}
              className="p-4 block"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-95 transition duration-300 ease-in-out flex flex-col h-full">
                {attraction.images &&
                attraction.images.length > 0 &&
                attraction.images[0].image_url ? (
                  <Image
                    src={attraction.images[0].image_url}
                    alt={attraction.name}
                    width={500}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">ไม่มีรูปภาพ</span>
                  </div>
                )}
                <div className="p-4 flex flex-col flex-grow justify-between h-full">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">{attraction.name}</h3>
                    <p className="text-gray-600 line-clamp-2">
                      {attraction.description}
                    </p>
                  </div>
                  <p className="text-orange-500 font-bold flex items-center">
                    {attraction.district_name}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </Carousel>
        <div className="flex justify-end mt-4">
          <Link
            href="/place/season-real-time"
            className="bg-orange-500 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105"
          >
            ดูทั้งหมด
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RealTimeSeasonalAttractions
