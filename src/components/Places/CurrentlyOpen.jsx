"use client";

import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { fetchCurrentlyOpenTouristEntities } from "@/services/user/api";
import Image from "next/image";
import Link from "next/link";
import { FaRoute } from "react-icons/fa";
import { FaHotel, FaStore, FaUtensils, FaLandmark } from "react-icons/fa";

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

const CurrentlyOpenTouristEntities = ({ latitude, longitude }) => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const getCurrentlyOpenTouristEntities = async () => {
      try {
        const data = await fetchCurrentlyOpenTouristEntities();
        setPlaces(data);
      } catch (error) {
        console.error("Error fetching places nearby by coordinates:", error);
      }
    };

    getCurrentlyOpenTouristEntities();
  }, []);

  if (places.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto mt-10 mb-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl md:text-4xl lg:text-5xl font-bold text-orange-500 mt-10 mb-5">
          สถานที่เปิดอยู่ในขณะนี้
        </h1>
      </div>
      <Carousel responsive={responsive} infinite autoPlay autoPlaySpeed={3000}>
        {places.map((place) => {
          return (
            <div key={place.id} className="p-2 h-full flex">
              <Link href={`/place/${place.id}`} className="block w-full">
                <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-95 transition duration-300 ease-in-out flex flex-col h-full">
                {place.images &&
                place.images.length > 0 &&
                place.images[0].image_url ? (
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
                      <h3 className="text-lg font-bold  mb-2">
                        {place.name}
                      </h3>
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

export default CurrentlyOpenTouristEntities;
