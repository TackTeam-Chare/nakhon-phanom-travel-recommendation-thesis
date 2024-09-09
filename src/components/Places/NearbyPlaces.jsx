"use client"

import { useEffect, useState } from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { fetchPlacesNearbyByCoordinatesRealTime } from "@/services/user/api"
import Image from "next/image"
import Link from "next/link"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

const NearbyPlaces = () => {
  const [places, setPlaces] = useState([])
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)

  const showErrorAlert = (title, text) => {
    MySwal.fire({
      title,
      text,
      icon: "error",
      confirmButtonText: "ตกลง"
    })
  }

  const showInfoAlert = (title, text) => {
    MySwal.fire({
      title,
      text,
      icon: "info",
      confirmButtonText: "ตกลง"
    })
  }

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            setLatitude(position.coords.latitude)
            setLongitude(position.coords.longitude)
          },
          error => {
            console.error("Error fetching user location:", error)
            showErrorAlert(
              "ไม่สามารถดึงตำแหน่งของคุณได้",
              "กรุณาเปิดการใช้งานตำแหน่งหรืออนุญาตการเข้าถึงตำแหน่งในเบราว์เซอร์ของคุณ"
            )
          }
        )
      } else {
        showErrorAlert(
          "เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง",
          "กรุณาใช้เบราว์เซอร์อื่นที่รองรับ"
        )
      }
    }

    getUserLocation()
  }, [])

  useEffect(() => {
    const getNearbyPlaces = async () => {
      if (latitude !== null && longitude !== null) {
        try {
          const data = await fetchPlacesNearbyByCoordinatesRealTime(
            latitude,
            longitude
          )
          if (data.length === 0) {
            showInfoAlert(
              "ไม่มีสถานที่ใกล้เคียง",
              "ไม่พบสถานที่ท่องเที่ยวใกล้ตำแหน่งของคุณ"
            )
          }
          setPlaces(data)
        } catch (error) {
          console.error("Error fetching places nearby by coordinates:", error)
          showErrorAlert(
            "เกิดข้อผิดพลาด",
            "ไม่สามารถดึงข้อมูลสถานที่ได้ กรุณาลองใหม่อีกครั้ง"
          )
        }
      }
    }

    getNearbyPlaces()
  }, [latitude, longitude])

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
      <h2 className="text-4xl md:text-4xl lg:text-5xl font-bold text-orange-500 mt-10 mb-5 text-start">
        สถานที่ใกล้เคียง
      </h2>
      <Slider {...settings}>
        {places.map(place => (
          <div key={place.id} className="flex items-center">
            <div className="flex-1">
              <Link href={`/place/${place.id}`}>
                {place.image_url && place.image_url.length > 0 ? (
                  <Image
                    src={place.image_url[0]}
                    alt={place.name}
                    width={800}
                    height={200}
                    style={{ objectFit: "cover" }}
                    className="rounded-lg shadow-md h-60 w-full object-fill "
                  />
                ) : (
                  <div className="w-full h-56 flex items-center justify-center bg-gray-200">
                    <span className="text-gray-500 ">ไม่มีรูปภาพสถานที่</span>
                  </div>
                )}
              </Link>
            </div>
            <div className="flex-1 flex flex-col justify-between p-6">
              <h3 className="entry-title text-3xl font-bold mb-4">
                <Link href={`/place/${place.id}`}>{place.name}</Link>
              </h3>
              <p className="text-orange-500 font-bold flex items-center">
                {place.category_name}
              </p>
              <p className="text-orange-500 font-bold flex items-center">
                {place.district_name}
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

export default NearbyPlaces
