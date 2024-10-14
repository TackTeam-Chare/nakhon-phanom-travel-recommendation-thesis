"use client";

import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import io from "socket.io-client";
import { FaRoute, FaHotel, FaStore, FaUtensils, FaLandmark } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL);

const categoryIcons = {
  "สถานที่ท่องเที่ยว": { icon: <FaLandmark />, color: "text-blue-500" },
  "ที่พัก": { icon: <FaHotel />, color: "text-purple-500" },
  "ร้านอาหาร": { icon: <FaUtensils />, color: "text-red-500" },
  "ร้านค้าของฝาก": { icon: <FaStore />, color: "text-green-500" },
};

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1024 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 1024, min: 768 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 768, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const RealTimePlaces = () => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    // เมื่อเชื่อมต่อกับ socket.io รับข้อมูลสถานที่ใหม่หรืออัปเดต
    socket.on("newTouristEntity", (touristEntity) => {
      setPlaces((prevPlaces) => [...prevPlaces, { ...touristEntity, isNew: true }]); // เพิ่ม isNew เพื่อระบุว่านี่เป็นสถานที่ใหม่
    });

    socket.on("placeUpdated", (updatedPlace) => {
      setPlaces((prevPlaces) =>
        prevPlaces.map((place) =>
          place.id === updatedPlace.id ? { ...updatedPlace, isNew: false } : place
        )
      ); // กำหนด isNew = false เมื่อเป็นการอัปเดต
    });

    return () => {
      socket.off("newTouristEntity");
      socket.off("placeUpdated");
    };
  }, []);

  if (places.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto mt-10 mb-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl md:text-4xl lg:text-5xl font-bold text-orange-500 mt-10 mb-5">
          สถานที่ใหม่!
        </h1>
      </div>
      <Carousel responsive={responsive} infinite autoPlay autoPlaySpeed={3000}>
        {places.map((place) => {
          const category = categoryIcons[place.category_name] || {
            icon: <FaRoute />,
            color: "text-gray-500",
          };

          return (
            <div key={place.id} className="p-2 h-full flex relative">
              <Link href={`/place/${place.id}`} className="block w-full">
                <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-95 transition duration-300 ease-in-out flex flex-col h-full">
                  {/* Badge แสดงว่าที่นี่ใหม่ */}
                  {place.isNew && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      ใหม่!
                    </span>
                  )}
                  {place.images && place.images.length > 0 && place.images[0].image_url ? (
                    <Image
                      src={place.images[0].image_url}
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
                      <h3 className="text-lg font-semibold text-orange-500 mb-2">
                        {place.name}
                      </h3>
                      <p className={`flex items-center font-bold ${category.color}`}>
                        {category.icon}
                        <span className="ml-2">{place.category_name}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};

export default RealTimePlaces;
