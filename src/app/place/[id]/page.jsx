"use client";

import React, { useEffect, useState } from "react";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";
import Link from "next/link";
import { useLoadScript } from "@react-google-maps/api";
import { FaMapMarkerAlt, FaInfoCircle, FaHome, FaClock,FaLayerGroup, FaTag, FaRoute } from "react-icons/fa"; 
import { getNearbyFetchTourismData } from "@/services/user/api";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";
import MapComponent from "@/components/Map/MapNearbyPlaces";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

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

const removeDuplicateImages = (images) => {
  const uniqueImages = new Map();
  images.forEach((image) => {
    if (!uniqueImages.has(image.image_url)) {
      uniqueImages.set(image.image_url, image);
    }
  });
  return Array.from(uniqueImages.values());
};

const convertMetersToKilometers = (meters) => {
  return (meters / 1000).toFixed(2);
};

const PlaceNearbyPage = ({ params }) => {
  const { id } = params;
  const [tourismData, setTourismData] = useState(null);
  const [nearbyEntities, setNearbyEntities] = useState([]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const fetchTourismData = async () => {
      if (id) {
        try {
          const data = await getNearbyFetchTourismData(Number(id));
          if (data.entity && data.entity.images) {
            data.entity.images = removeDuplicateImages(data.entity.images);
          }
          if (data.nearbyEntities) {
            data.nearbyEntities = data.nearbyEntities.map((entity) => {
              if (entity.images) {
                entity.images = removeDuplicateImages(entity.images);
              }
              return entity;
            });
          }
          setTourismData(data.entity);
          setNearbyEntities(data.nearbyEntities);

          if (!data.nearbyEntities || data.nearbyEntities.length === 0) {
            Swal.fire("No Nearby Places", "ไม่พบสถานที่ใกล้เคียง", "info");
          }
        } catch (error) {
          console.error("Error fetching tourism data:", error);
          Swal.fire(
            "Error",
            "ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
            "error"
          );
        }
      }
    };

    fetchTourismData();
  }, [id]);

  if (!isLoaded) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <ClipLoader size={50} color={"#123abc"} loading={!isLoaded} />
        <p className="mt-4 text-gray-600">กำลังโหลดแผนที่...</p>
      </div>
    );
  }

  if (!tourismData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <ClipLoader size={50} color={"#123abc"} loading={!tourismData} />
        <p className="mt-4 text-gray-600">กำลังโหลดข้อมูลสถานที่ท่องเที่ยว...</p>
      </div>
    );
  }

  const isValidCoordinates =
    !isNaN(Number(tourismData.latitude)) && !isNaN(Number(tourismData.longitude));

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          <Slide easing="ease">
            {Array.isArray(tourismData.images) && tourismData.images.length > 0 ? (
              tourismData.images.map((image, index) => (
                <div key={index}>
                  <Image
                    src={image.image_url}
                    alt={`Slide ${index + 1}`}
                    width={1200}
                    height={800}
                    className="rounded-lg shadow-lg object-cover w-full h-[40vh] lg:h-[60vh]"
                    priority
                    quality={100}
                  />
                </div>
              ))
            ) : (
              <div className="w-full h-[40vh] lg:h-[60vh] flex items-center justify-center bg-gray-200 rounded-lg shadow-lg">
                <p className="text-gray-500">ไม่มีรูปภาพ</p>
              </div>
            )}
          </Slide>
        </div>

      <div className="w-full lg:w-1/2">
          <h1 className="text-4xl md:text-3xl lg:text-5xl font-bold text-orange-500 mt-10 mb-5">
            {tourismData.name}
          </h1>

          <div className="flex items-center  text-lg mb-5">
            <FaMapMarkerAlt className="text-orange-500 mr-2" />
            <strong>{tourismData.district_name}</strong>
          </div>

          <div className="flex items-centermt-2">
            <FaLayerGroup className="text-orange-500 mr-2" />
              <strong>{tourismData.category_name}</strong> 
          </div>

          <div className="flex items-center text-gray-600 mt-4">
  <FaInfoCircle className="text-orange-500 mr-2" />
  <span>
 {tourismData.description}
  </span>
</div>
          <div className="flex items-center text-gray-600 mt-2">
            <FaHome className="text-orange-500 mr-2" />
            <span>
         {tourismData.location}
            </span>
          </div>

          {tourismData.days_of_week && tourismData.opening_times && tourismData.closing_times && (
            <div className="mt-4">
              <h2 className="text-xl font-bold text-gray-800">เวลาทำการ:</h2>
              {tourismData.days_of_week.split(",").map((day, index) => (
                <div key={index} className="flex items-center text-gray-700">
                  <FaClock className="text-orange-500 mr-2" />
                  <span className="mr-2">{day}:</span>
                  <span>
                    {tourismData.opening_times.split(",")[index]} -{" "}
                    {tourismData.closing_times.split(",")[index] || "ไม่ระบุ"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 mb-10">
        {isValidCoordinates && (
          <MapComponent
            center={{
              lat: Number(tourismData.latitude),
              lng: Number(tourismData.longitude),
            }}
            places={nearbyEntities}
            mainPlace={tourismData}
            isLoaded={isLoaded}
          />
        )}
      </div>

 
<div className="flex justify-between items-center mb-8">
  <h1 className="text-4xl md:text-4xl lg:text-5xl font-bold text-orange-500 mt-10 mb-5">
    สถานที่ใกล้เคียง
  </h1>
</div>
<Carousel responsive={responsive} infinite autoPlay autoPlaySpeed={3000}>
  {nearbyEntities.map((entity) => (
    <div key={entity.id} className="p-2 h-full flex">
      <Link href={`/place/${entity.id}`} className="block w-full">
        <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-95 transition duration-300 ease-in-out flex flex-col h-full">
          {entity.images && entity.images.length > 0 ? (
            <Image
              src={entity.images[0].image_url}
              alt={entity.name}
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
              <h3 className="text-lg font-semibold mb-2 flex items-center">
           {entity.name}
              </h3>
              <p className="text-orange-500 font-bold flex items-center mb-2">
                <FaTag className="mr-2" /> {entity.category_name}
              </p>
              <p className="text-orange-500 font-bold flex items-center">
                <FaRoute className="mr-2" />
                ระยะห่าง {convertMetersToKilometers(entity.distance)} กิโลเมตร
              </p>
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
  );
};

export default PlaceNearbyPage;
