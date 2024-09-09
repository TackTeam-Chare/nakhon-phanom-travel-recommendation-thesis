"use client"

import { useEffect, useState } from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { fetchCurrentlyOpenTouristEntities } from "@/services/user/api"
import Image from "next/image"
import Link from "next/link"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

const CurrentlyOpenPlaces = () => {
  const [places, setPlaces] = useState([])

  const showInfoAlert = (title, text) => {
    MySwal.fire({
      title,
      text,
      icon: "info",
      confirmButtonText: "ตกลง"
    })
  }

  const showErrorAlert = (title, text) => {
    MySwal.fire({
      title,
      text,
      icon: "error",
      confirmButtonText: "ตกลง"
    })
  }

  useEffect(() => {
    const getCurrentlyOpenPlaces = async () => {
      try {
        const data = await fetchCurrentlyOpenTouristEntities()
        if (data.length === 0) {
          showInfoAlert(
            "ไม่มีสถานที่เปิดในขณะนี้",
            "ขณะนี้ไม่มีสถานที่ท่องเที่ยวเปิดให้บริการ"
          )
        }
        setPlaces(data)
      } catch (error) {
        console.error("Error fetching currently open tourist entities:", error)
        showErrorAlert(
          "เกิดข้อผิดพลาด",
          "ไม่สามารถดึงข้อมูลสถานที่ได้ กรุณาลองใหม่อีกครั้ง"
        )
      }
    }

    getCurrentlyOpenPlaces()
  }, [])

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000
  }

  return (
    <div className="container mx-auto mt-10 px-4">
      <h2 className="text-4xl md:text-4xl lg:text-5xl font-bold text-orange-500 mt-10 mb-5 text-center ">
        สถานที่ที่เปิดในขณะนี้
      </h2>
      <Slider {...settings}>
        {places.map(place => (
          <div key={place.id} className="flex items-center">
            <div className="flex-1">
              <Link href={`/place/${place.id}`}>
                {place.images &&
                place.images.length > 0 &&
                place.images[0].image_url ? (
                  <Image
                    src={place.images[0].image_url}
                    alt={place.name}
                    width={500}
                    height={300}
                    className="w-full h-80 object-cover"
                  />
                ) : (
                  <div className="w-full h-56 flex items-center justify-center bg-gray-200">
                    <span className="text-gray-500">ไม่มีรูปภาพสถานที่</span>
                  </div>
                )}
              </Link>
            </div>
            <div className="flex-1 flex flex-col justify-between p-6">
              <h3 className="entry-title text-3xl font-bold mb-4">
                <Link href={`/place/${place.id}`}>{place.name}</Link>
              </h3>
              <p className="flex-grow">
                <strong>หมวดหมู่:</strong> {place.category_name}
              </p>
              <p className="flex-grow">
                <strong>อำเภอ:</strong> {place.district_name}
              </p>
              <p className="flex-grow">{place.description}</p>
              <div className="flex justify-end mt-auto">
                <Link
                  href={`/place/${place.id}`}
                  className="text-orange-500 hover:text-orange-600 font-semibold"
                >
                  อ่านต่อ →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default CurrentlyOpenPlaces
