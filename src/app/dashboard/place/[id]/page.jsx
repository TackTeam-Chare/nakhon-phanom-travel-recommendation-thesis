 "use client"
import React, { useEffect, useState } from "react";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";
import Link from "next/link";
import { useLoadScript } from "@react-google-maps/api";
import {
  FaSun,
  FaCloudRain,
  FaSnowflake,
  FaGlobe,
  FaUtensils,
  FaCheckCircle,
  FaStore,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaLandmark,
  FaHome,
  FaClock,
  FaTimesCircle,
  FaLayerGroup,
  FaMapSigns,
  FaChevronDown,
  FaCalendarDay,
  FaChevronUp,
  FaRegClock,
  FaArrowRight,
  FaTag,
  FaRoute,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { getNearbyFetchTourismData } from "@/services/user/api";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";
import MapComponent from "@/components/Dashboard/Map/MapNearbyPlaces";

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

const getSeasonIcon = (seasonName) => {
  switch (seasonName) {
    case "ฤดูร้อน":
      return <FaSun className="text-orange-500 mr-2" />;
    case "ฤดูฝน":
      return <FaCloudRain className="text-blue-500 mr-2" />;
    case "ฤดูหนาว":
      return <FaSnowflake className="text-teal-500 mr-2" />;
    case "ตลอดทั้งปี":
      return <FaGlobe className="text-green-500 mr-2" />;
    default:
      return <FaLayerGroup className="text-gray-500 mr-2" />;
  }
};

const getSeasonColor = (seasonName) => {
  switch (seasonName) {
    case "ฤดูร้อน":
      return "text-orange-500";
    case "ฤดูฝน":
      return "text-blue-500";
    case "ฤดูหนาว":
      return "text-teal-500";
    case "ตลอดทั้งปี":
      return "text-green-500";
    default:
      return "text-gray-500";
  }
};

const CustomLeftArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white text-orange-500 shadow-lg p-2 rounded-full z-10 hover:bg-orange-500 hover:text-white transition-all duration-300 ease-in-out"
    style={{ margin: "0 15px" }}
  >
    <FaChevronLeft />
  </button>
);

const CustomRightArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-orange-500 shadow-lg p-2 rounded-full z-10 hover:bg-orange-500 hover:text-white transition-all duration-300 ease-in-out"
    style={{ margin: "0 15px" }}
  >
    <FaChevronRight />
  </button>
);

const removeDuplicateImages = (images) => {
  const uniqueImages = new Map();
  images.forEach((image) => {
    if (!uniqueImages.has(image.image_url)) {
      uniqueImages.set(image.image_url, image);
    }
  });
  return Array.from(uniqueImages.values());
};

const convertMetersToKilometers = (meters) => (meters / 1000).toFixed(2);

const getCurrentTimeInThailand = () => {
  const now = new Date();
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  const thailandTime = new Date(utcTime + 7 * 60 * 60 * 1000);
  return thailandTime;
};

const isOpenNow = (operatingHours) => {
  if (!operatingHours || operatingHours.length === 0) return false;

  const now = getCurrentTimeInThailand();
  const currentDay = now.getDay(); // 0 for Sunday, 1 for Monday, etc.
  const currentTime = now.getHours() * 100 + now.getMinutes(); // Time in HHMM format

  const todayOperatingHours = operatingHours.find((hours) => {
    return (
      hours.day_of_week ===
        ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][currentDay] ||
      hours.day_of_week === "Everyday"
    );
  });

  if (todayOperatingHours) {
    const openingTime = parseInt(todayOperatingHours.opening_time.replace(":", ""));
    const closingTime = parseInt(todayOperatingHours.closing_time.replace(":", ""));

    // Handle overnight open hours (closing after midnight)
    if (closingTime < openingTime) {
      return currentTime >= openingTime || currentTime <= closingTime;
    } else {
      return currentTime >= openingTime && currentTime <= closingTime;
    }
  }

  return false;
};

// Helper function to check if the place is "Opening Soon" or "Closing Soon"
const getTimeUntilNextEvent = (openingTime, closingTime) => {
  const now = getCurrentTimeInThailand();
  const currentTime = now.getHours() * 100 + now.getMinutes(); // Current time in HHMM format

  const openingTimeInt = parseInt(openingTime.replace(":", ""));
  const closingTimeInt = parseInt(closingTime.replace(":", ""));

  if (currentTime < openingTimeInt) {
    const timeUntilOpen = openingTimeInt - currentTime;
    if (timeUntilOpen <= 100) {
      return { status: "Opening Soon" };
    }
  } else if (currentTime < closingTimeInt) {
    const timeUntilClose = closingTimeInt - currentTime;
    if (timeUntilClose <= 100) {
      return { status: "Closing Soon" };
    }
  }

  return { status: null };
};

const PlaceNearbyPage = ({ params }) => {
  const { id } = params;
  const [tourismData, setTourismData] = useState(null);
  const [nearbyEntities, setNearbyEntities] = useState([]);
  const [showOperatingHours, setShowOperatingHours] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const toggleOperatingHours = () => setShowOperatingHours(!showOperatingHours);

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
          Swal.fire("Error", "ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่อีกครั้ง", "error");
        }
      }
    };

    fetchTourismData();
  }, [id]);

  if (!isLoaded) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <ClipLoader size={50} color={"#FF7043"} loading={!isLoaded} />
        <p className="mt-4 text-gray-600">กำลังโหลดแผนที่...</p>
      </div>
    );
  }

  if (!tourismData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <ClipLoader size={50} color={"#FF7043"} loading={!tourismData} />
        <p className="mt-4 text-gray-600">กำลังโหลดข้อมูลสถานที่ท่องเที่ยว...</p>
      </div>
    );
  }

  const isValidCoordinates =
    !isNaN(Number(tourismData.latitude)) && !isNaN(Number(tourismData.longitude));

  const categoryIcons = {
    "สถานที่ท่องเที่ยว": { icon: <FaLandmark />, color: "text-blue-500" },
    "ที่พัก": { icon: <FaHome />, color: "text-purple-500" },
    "ร้านอาหาร": { icon: <FaUtensils />, color: "text-red-500" },
    "ร้านค้าของฝาก": { icon: <FaStore />, color: "text-green-500" },
  };

  const getCategoryDetails = (categoryName) =>
    categoryIcons[categoryName] || { icon: <FaLayerGroup />, color: "text-gray-500" };

  return (
    <div className="container mx-auto mt-12 mb-12 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          <Slide easing="ease" prevArrow={<CustomLeftArrow />} nextArrow={<CustomRightArrow />}>
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

        {/* Information about the place */}
        <div className="w-full lg:w-1/2 space-y-6">
          {/* Place Name */}
          <h1 className="text-4xl md:text-3xl lg:text-5xl font-bold text-orange-500">
            {tourismData.name}
          </h1>

          {/* District and Category */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center text-lg">
              <FaMapMarkerAlt className="text-orange-500 mr-2 text-2xl" />
              <strong className="text-gray-700">{tourismData.district_name}</strong>
            </div>
            <div className={`flex items-center text-lg ${getCategoryDetails(tourismData.category_name).color}`}>
              {getCategoryDetails(tourismData.category_name).icon}
              <strong className={`ml-2 ${getCategoryDetails(tourismData.category_name).color}`}>
                {tourismData.category_name}
              </strong>
            </div>
            {/* Check if it's a tourist spot */}
            {tourismData.category_name === "สถานที่ท่องเที่ยว" && (
              <div className={`flex items-center text-lg ${getSeasonColor(tourismData.season_name)}`}>
                {getSeasonIcon(tourismData.season_name)}
                <strong className={`ml-2 ${getSeasonColor(tourismData.season_name)}`}>
                  {tourismData.season_name}
                </strong>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="flex items-center text-gray-600">
            <FaInfoCircle className="text-orange-500 mr-2 text-3xl" />
            <span>{tourismData.description}</span>
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-600">
            <FaHome className="text-orange-500 mr-2 text-3xl" />
            <span>{tourismData.location}</span>
          </div>

          {/* Open/Closed Status */}
          {tourismData.category_name !== "ที่พัก" && (
            <div className="flex items-center font-bold text-lg">
              {isOpenNow(tourismData.operating_hours) ? (
                <span className="text-green-500 flex items-center">
                  <FaCheckCircle className="mr-1" /> เปิดทำการ
                </span>
              ) : (
                <span className="text-red-500 flex items-center">
                  <FaTimesCircle className="mr-1" /> ปิดทำการ
                </span>
              )}

              {/* Check for Opening Soon or Closing Soon */}
              {tourismData.operating_hours.map((hours, index) => {
                const nextEvent = getTimeUntilNextEvent(hours.opening_time, hours.closing_time);

                if (nextEvent.status === "Opening Soon") {
                  return (
                    <span key={index} className="text-yellow-500 flex items-center ml-4">
                      <FaClock className="mr-1" /> ใกล้เปิดเร็วๆนี้
                    </span>
                  );
                } else if (nextEvent.status === "Closing Soon") {
                  return (
                    <span key={index} className="text-orange-500 flex items-center ml-4">
                      <FaClock className="mr-1" /> ใกล้ปิดเร็วๆนี้
                    </span>
                  );
                }
                return null;
              })}
            </div>
          )}

          {/* Operating Hours */}
          {tourismData.category_name !== "ที่พัก" && (
            <div className="mt-6 p-4 bg-white rounded-lg shadow-lg">
              <h2
                className="text-lg text-orange-500 font-black mb-3 flex items-center cursor-pointer"
                onClick={toggleOperatingHours}
              >
                <FaClock className="text-orange-500 mr-2" />
                ช่วงวันเวลาทำการของสถานที่
                {showOperatingHours ? (
                  <FaChevronUp className="ml-2" />
                ) : (
                  <FaChevronDown className="ml-2" />
                )}
              </h2>

              {showOperatingHours && tourismData.operating_hours && tourismData.operating_hours.length > 0 ? (
                <ul className="mt-4">
                  {tourismData.operating_hours.map((hours, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-200 last:border-none"
                    >
                      <div className="flex items-center space-x-2">
                        <FaCalendarDay className="text-orange-500" />
                        <span className="font-medium text-gray-700">
                          {hours.day_of_week === "Sunday"
                            ? "วันอาทิตย์"
                            : hours.day_of_week === "Monday"
                            ? "วันจันทร์"
                            : hours.day_of_week === "Tuesday"
                            ? "วันอังคาร"
                            : hours.day_of_week === "Wednesday"
                            ? "วันพุธ"
                            : hours.day_of_week === "Thursday"
                            ? "วันพฤหัสบดี"
                            : hours.day_of_week === "Friday"
                            ? "วันศุกร์"
                            : hours.day_of_week === "Saturday"
                            ? "วันเสาร์"
                            : hours.day_of_week === "Everyday"
                            ? "ทุกวัน"
                            : hours.day_of_week === "Except Holidays"
                            ? "ยกเว้นวันหยุด"
                            : hours.day_of_week}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {hours.opening_time ? (
                          <>
                            <FaRegClock className="text-green-500" />
                            <span>{hours.opening_time}</span>
                            <FaArrowRight className="text-gray-500 mx-1" />
                            <FaRegClock className="text-red-500" />
                            <span>{hours.closing_time}</span>
                          </>
                        ) : (
                          <span className="text-gray-500">ปิด</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : showOperatingHours && <p>ช่วงวันเวลาทำการของสถานที่ไม่มีอยู่</p>}
            </div>
          )}
        </div>
      </div>

      {/* Map Component */}
      <div className="mt-20 mb-10">
        <h1 className="text-4xl md:text-4xl lg:text-5xl font-bold text-orange-500 mt-10 mb-5 flex items-center">
          <FaMapMarkerAlt className="mr-2 text-5xl text-orange-500" />
          แผนที่
        </h1>

        {isValidCoordinates ? (
          <>
            <div className="text-lg text-gray-700 mb-4 flex items-center">
              <FaMapSigns className="text-orange-500 mr-2" />
              <span className="ml-2 text-orange-600 font-semibold">{tourismData.name}</span>
            </div>

            <MapComponent
              center={{
                lat: Number(tourismData.latitude),
                lng: Number(tourismData.longitude),
              }}
              places={nearbyEntities}
              mainPlace={tourismData}
              isLoaded={isLoaded}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-64 bg-gray-200 text-gray-600">
            <FaInfoCircle className="text-orange-500 mr-2" />
            <p>ไม่พบข้อมูลพิกัดสถานที่</p>
          </div>
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
            <Link href={`/dashboard/place/${entity.id}`} className="block w-full">
              <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-95 transition duration-300 ease-in-out flex flex-col h-full relative">
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
                    <p className={`font-bold flex items-center mb-2 ${getCategoryDetails(entity.category_name).color}`}>
                      {getCategoryDetails(entity.category_name).icon}
                      <span className="ml-2">{entity.category_name}</span>
                    </p>

                    <p className="text-orange-500 font-bold flex items-center">
                      <FaRoute className="mr-2" />
                      ระยะห่าง {convertMetersToKilometers(entity.distance)} กิโลเมตร
                    </p>
                  </div>

                  {/* Status Section (Open/Closed) */}
                  <div className="flex justify-end mt-5">
                    {isOpenNow(entity.operating_hours) ? (
                      <span className="text-green-500 font-bold flex items-center mr-2">
                        <FaCheckCircle className="mr-1" /> เปิดทำการ
                      </span>
                    ) : (
                      <span className="text-red-500 font-bold flex items-center mr-2">
                        <FaTimesCircle className="mr-1" /> ปิดทำการ
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default PlaceNearbyPage;
