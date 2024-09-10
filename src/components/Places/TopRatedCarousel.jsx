"use client"

import React, { useEffect, useState } from "react"
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"
import { getTopRatedTouristAttractions } from "@/services/user/api"
import Image from "next/image"
import Link from "next/link"
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa"

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1024 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 1024, min: 768 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 768, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
}

const renderStars = average_rating => {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    if (i <= average_rating) {
      stars.push(<FaStar key={i} className="text-yellow-500" />)
    } else if (i - average_rating < 1) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />)
    } else {
      stars.push(<FaRegStar key={i} className="text-yellow-500" />)
    }
  }
  return stars
}

const TopRatedCarousel = () => {
  const [attractions, setAttractions] = useState([])

  useEffect(() => {
    const fetchTopRatedAttractions = async () => {
      try {
        const data = await getTopRatedTouristAttractions()
        console.log("Fetched top-rated attractions:", data)
        setAttractions(data)
      } catch (error) {
        console.error("Error fetching top-rated attractions:", error)
      }
    }

    fetchTopRatedAttractions()
  }, [])

  if (attractions.length === 0) {
    // ซ่อนเนื้อหาทั้งหมดถ้าไม่มีข้อมูล
    return null
  }

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl md:text-4xl lg:text-5xl font-bold text-orange-500 mt-10 mb-5">
          สถานที่ท่องเที่ยวที่ได้รับความนิยมสูงสุด
        </h1>
      </div>
      <Carousel responsive={responsive} infinite autoPlay autoPlaySpeed={3000}>
        {attractions.map(attraction => (
          <div key={attraction.id} className="p-2 h-full flex">
            <Link href={`/place/${attraction.id}`} className="block w-full">
              <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-95 transition duration-300 ease-in-out flex flex-col h-full">
                {attraction.images && attraction.images.length > 0 ? (
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
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {attraction.name}
                    </h3>
                    <p className="text-orange-500 font-bold flex items-center">
                      {attraction.district_name}
                    </p>
                  </div>
                  {/* average_rating display */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {typeof attraction.average_rating === "number" ? (
                        renderStars(attraction.average_rating)
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </div>
                    {/* Check if average_rating is a number before displaying */}
                    <span className="text-gray-600 ml-2">
                      {typeof attraction.average_rating === "number"
                        ? attraction.average_rating.toFixed(1)
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </Carousel>
      <div className="flex justify-end mt-4">
        <Link
          className="bg-orange-500 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105"
          href="/places/top-rated-tourist-entities"
        >
          ดูทั้งหมด
        </Link>
      </div>
    </div>
  )
}

export default TopRatedCarousel
