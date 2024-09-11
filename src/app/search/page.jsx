"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  FaMapMarkerAlt,
  FaSearch,
  FaHotel,
  FaUtensils,
  FaStore,
  FaTree,
  FaTimesCircle,
  FaClock,
  FaCalendarAlt,
  FaLayerGroup,
  FaLeaf,
  FaSun,
  FaCloudRain,
  FaSnowflake,
  FaGlobe,
  FaChevronDown,
  FaChevronUp 
} from "react-icons/fa";
import { FallingLines } from "react-loader-spinner";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchPlacesNearbyByCoordinates,
  searchTouristEntitiesUnified,
  fetchAllFilters
} from "@/services/user/api";
import Image from "next/image";
import { useJsApiLoader } from "@react-google-maps/api";

const MapComponent = dynamic(() => import("@/components/Map/MapSearch"), {
  ssr: false
});

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const Tooltip = dynamic(() => import("react-tooltip"), { ssr: false });


const GeocodingSearchPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    seasons: [],
    districts: [],
    categories: []
  });
  const [searchParams, setSearchParams] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false); 
  const [selectedDay, setSelectedDay] = useState(null);
  const [isTimeFilterVisible, setIsTimeFilterVisible] = useState(false); 
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [isClient, setIsClient] = useState(false);
  const [isSeasonEnabled, setIsSeasonEnabled] = useState(true);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  useEffect(() => {
    setIsClient(true);
    const loadFilters = async () => {
      try {
        const data = await fetchAllFilters();
        setFilters(data);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };

    loadFilters();
  }, []);

  
  useEffect(() => {
    if (!isClient) return;

    const updateLocation = () => {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          fetchNearbyPlaces(latitude, longitude);
          setLoading(false);
        },
        (error) => {
          console.error("Error getting user's location:", error);

          Swal.fire({
            title: "ข้อผิดพลาด!",
            text: "ไม่สามารถดึงข้อมูลตำแหน่งของคุณได้ กรุณาเปิดใช้งานบริการตำแหน่ง",
            icon: "error",
            confirmButtonText: "ตกลง"
          });

          setLoading(false);
        }
      );
    };

    updateLocation();
  }, [isClient]);

  const fetchNearbyPlaces = async (lat, lng) => {
    try {
      setLoading(true);
      const data = await fetchPlacesNearbyByCoordinates(lat, lng, 5000);
      setNearbyPlaces(data);
    } catch (error) {
      console.error("Error fetching nearby places:", error);
      setNearbyPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  const searchPlaces = async (params) => {
    try {
      setLoading(true);
      const data = await searchTouristEntitiesUnified(params);
      setSearchResults(data);

      if (data.length > 0) {
        const firstResult = data[0];
        setMapCenter({
          lat: Number(firstResult.latitude),
          lng: Number(firstResult.longitude)
        });
      }
    } catch (error) {
      console.error("Error searching places:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByField = (field, value) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      [field]: value 
    }));
    searchPlaces({ ...searchParams, [field]: value });

    if (field === "category") {
      const selectedCategory = filters.categories.find(
        (cat) => cat.id === value
      );
      setSelectedCategory(selectedCategory?.name || null);
      setIsSeasonEnabled(value === 1); 
    }

    if (field === "season") {
      const seasonName =
        filters.seasons.find((season) => season.id === value)?.name || null;
      setSelectedSeason(seasonName);
    }

    if (field === "district") {
      const districtName =
        filters.districts.find((district) => district.id === value)?.name ||
        null;
      setSelectedDistrict(districtName);
      // setSelectedDistrict(false); 
      setIsDistrictDropdownOpen(false);
    }

    if (field === "day_of_week") {
      setSelectedDay(value);
    }
  };

  const handleCurrentLocationClick = () => {
    if (userLocation) {
      fetchNearbyPlaces(userLocation.lat, userLocation.lng);
      setMapCenter(userLocation);
    }
  };

  const clearSearch = () => {
    Swal.fire({
      title: "ยืนยันการล้างการค้นหา?",
      text: "คุณต้องการล้างผลการค้นหาทั้งหมดใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ล้างการค้นหา!",
      cancelButtonText: "ยกเลิก"
    }).then((result) => {
      if (result.isConfirmed) {
        setSearchParams({});
        setSearchResults([]);
        setNearbyPlaces([]);
        setSelectedCategory(null);
        setSelectedSeason(null);
        setSelectedDistrict(null);
        setSelectedDay(null);
        setIsTimeFilterVisible(false);
        if (userLocation) {
          setMapCenter(userLocation);
        }
        Swal.fire("ล้างข้อมูลแล้ว!", "การค้นหาของคุณถูกล้างแล้ว", "success");
      }
    });
  };

  const resetTogglesAndSearch = () => {
    setIsTimeFilterVisible(false);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const categorizePlaces = (categoryId) => {
    return nearbyPlaces.filter((place) => place.category_id === categoryId);
  };

  return (
    <div className="container mx-auto p-4 relative">
      {/* Search Bar and Buttons */}
      <div className="flex flex-col lg:flex-row items-center justify-center mb-6">
        <div className="relative w-full lg:max-w-md mx-auto flex items-center justify-center mb-4 lg:mb-0">
          <button
            onClick={handleCurrentLocationClick}
            className="bg-orange-500 text-white p-3 rounded-full hover:bg-orange-600 transition duration-300"
            aria-label="Check current location"
            data-tip="เช็คพิกัดปัจจุบัน"
          >
            <FaMapMarkerAlt />
          </button>
          <Tooltip place="top" type="dark" effect="solid" />
          <div className="relative w-full max-w-full lg:max-w-md mx-4">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500" />
            <input
              type="text"
              placeholder="ค้นหาชื่อสถานที่"
              className="p-2 pl-10 border border-orange-500 rounded w-full focus:outline-none focus:border-orange-600"
              value={searchParams.q || ""}
              onChange={e => handleSearchByField("q", e.target.value)}
              aria-label="ค้นชื่อสถานที่"
            />
            {searchParams.q ||
            searchParams.category ||
            searchParams.district ||
            searchParams.season ? (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500"
                aria-label="Clear search"
              >
                <FaTimesCircle size={20} />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Toggle Buttons for Categories, Seasons, Districts, and Days */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 justify-center mb-4">
        <button
          onClick={() => {
            resetTogglesAndSearch();
            setSelectedCategory(prev => (prev ? null : "category"));
          }}
          className="border-2 border-orange-500 text-orange-500 rounded-full py-1 px-3 flex items-center justify-center"
        >
          <FaLayerGroup className="mr-2" /> ประเภทสถานที่
        </button>

        {/* Disable/Enable Season button based on category */}
        <button
          onClick={() => {
            resetTogglesAndSearch();
            setSelectedSeason(prev => (prev ? null : "season"));
          }}
          className={`border-2 border-orange-500 text-orange-500 rounded-full py-1 px-3 flex items-center justify-center ${!isSeasonEnabled ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={!isSeasonEnabled} // Disable if the season is not enabled
        >
          <FaLeaf className="mr-2" /> สถานที่ตามฤดูกาล
        </button>
        <button
            onClick={() => {
              resetTogglesAndSearch();
              setIsDistrictDropdownOpen(prev => (prev ? null : "district"));
            }}
            className="border-2 border-orange-500 text-orange-500 rounded-full py-1 px-3 flex items-center justify-center"
          >
            <FaMapMarkerAlt className="mr-2" /> เลือกอำเภอ
            {isDistrictDropdownOpen ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
          </button>

     {/* Toggle for Day and Time Filter */}
  <button
    onClick={() => {
      resetTogglesAndSearch();
      setIsTimeFilterVisible((prev) => !prev);
    }}
    className="border-2 border-orange-500 text-orange-500 rounded-full py-1 px-3 flex items-center justify-center"
  >
    <FaCalendarAlt className="mr-2" /> วันและเวลา
  </button>
      </div>

      {/* Category, Season, District, and Time Filters */}
      {selectedCategory && (
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {filters.categories.map(category => (
            <button
              key={category.id}
              className={`border-2 border-orange-500 text-orange-500 rounded-full py-1 px-3 flex items-center justify-center ${
                searchParams.category === category.id
                  ? "bg-orange-500 text-white"
                  : ""
              }`}
              onClick={() => handleSearchByField("category", category.id)}
            >
              {category.name === "สถานที่ท่องเที่ยว" && (
                <FaTree className="mr-2" />
              )}
              {category.name === "ที่พัก" && <FaHotel className="mr-2" />}
              {category.name === "ร้านอาหาร" && <FaUtensils className="mr-2" />}
              {category.name === "ร้านค้าของฝาก" && (
                <FaStore className="mr-2" />
              )}
              {category.name}
            </button>
          ))}
        </div>
      )}

      {selectedSeason && (
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {filters.seasons.map(season => (
            <button
              key={season.id}
              className={`border-2 border-orange-500 text-orange-500 rounded-full py-1 px-3 flex items-center justify-center ${
                searchParams.season === season.id
                  ? "bg-orange-500 text-white"
                  : ""
              }`}
              onClick={() => handleSearchByField("season", season.id)}
            >
              {season.name === "ฤดูร้อน" && <FaSun className="mr-2" />}
              {season.name === "ฤดูฝน" && <FaCloudRain className="mr-2" />}
              {season.name === "ฤดูหนาว" && <FaSnowflake className="mr-2" />}
              {season.name === "ตลอดทั้งปี" && <FaGlobe className="mr-2" />}
              {season.name}
            </button>
          ))}
        </div>
      )}
{isDistrictDropdownOpen && (
            <div className="absolute z-10 w-full bg-white border border-orange-500 rounded-md shadow-lg mt-1">
              {filters.districts.map((district) => (
                <button
                  key={district.id}
                  className={`block w-full text-left py-2 px-4 text-sm ${
                    searchParams.district === district.id
                      ? "bg-orange-500 text-white"
                      : "text-orange-500"
                  } hover:bg-orange-100`}
                  onClick={() => handleSearchByField("district", district.id)}
                >
                  {district.name}
                </button>
              ))}
            </div>
          )}

      {isTimeFilterVisible && (
        <div className="flex flex-col sm:flex-row justify-center items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <FaClock className="text-orange-500" />
            <label className="text-orange-500 font-semibold">เลือกวัน:</label>
            <select
              className="border border-orange-500 text-orange-500 rounded-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-600"
              onChange={e => handleSearchByField("day_of_week", e.target.value)}
              value={searchParams.day_of_week || ""}
            >
              <option value="">วัน</option>
              <option value="Sunday">วันอาทิตย์</option>
              <option value="Monday">วันจันทร์</option>
              <option value="Tuesday">วันอังคาร</option>
              <option value="Wednesday">วันพุธ</option>
              <option value="Thursday">วันพฤหัสบดี</option>
              <option value="Friday">วันศุกร์</option>
              <option value="Saturday">วันเสาร์</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <FaClock className="text-orange-500" />
            <label className="text-orange-500 font-semibold">เวลาเปิด:</label>
            <input
              type="time"
              className="border border-orange-500 text-orange-500 rounded-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-600"
              onChange={e =>
                handleSearchByField("opening_time", e.target.value)
              }
              value={searchParams.opening_time || ""}
            />
          </div>

          <div className="flex items-center space-x-2">
            <FaClock className="text-orange-500" />
            <label className="text-orange-500 font-semibold">เวลาปิด:</label>
            <input
              type="time"
              className="border border-orange-500 text-orange-500 rounded-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-600"
              onChange={e =>
                handleSearchByField("closing_time", e.target.value)
              }
              value={searchParams.closing_time || ""}
            />
          </div>
        </div>
      )}

      {/* Display selected filters */}
      <div className="text-center mb-4">
        {selectedCategory && (
          <p className="text-lg font-bold text-orange-500">
            หมวดหมู่ที่เลือก: {selectedCategory}
          </p>
        )}
        {selectedSeason && (
          <p className="text-lg font-bold text-orange-500">
            ฤดูกาลที่เลือก: {selectedSeason}
          </p>
        )}
     {selectedDistrict && (
        <p className="text-lg font-bold text-orange-500 text-center mb-4">
          อำเภอที่เลือก: {selectedDistrict}
        </p>
      )}
        {selectedDay && (
          <p className="text-lg font-bold text-orange-500">
            วันที่เลือก: {selectedDay}
          </p>
        )}
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <FallingLines width="100" color="#4fa94d" visible={true} />
        </div>
      )}

      {/* MapComponent Integration */}
      <div className={`w-full h-96 mb-6 ${loading ? "blur-sm" : ""}`}>
        {isClient && (
          <MapComponent
            isLoaded={isLoaded}
            userLocation={userLocation}
            mapCenter={mapCenter}
            searchResults={searchResults}
            nearbyPlaces={nearbyPlaces}
            selectedPlace={selectedPlace}
            onSelectPlace={setSelectedPlace}
            clearSearch={clearSearch}
          />
        )}
      </div>

      {/* Display search query and results count */}
      <div className="mt-4">
        {searchParams.q && (
          <p className="text-lg font-bold text-center text-orange-500 mb-4">
            คำที่ค้นหา: &quot;{searchParams.q}&quot; (พบ {searchResults.length}{" "}
            ผลลัพธ์)
          </p>
        )}

        {/* Display search results using Slider */}
        {searchResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              ผลลัพธ์การค้นหา ({searchResults.length} สถานที่)
            </h2>
            <Slider {...settings}>
              {searchResults.map(place => (
                <Link href={`/place/${place.id}`} key={place.id}>
                  <div className="p-4 cursor-pointer">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-95 transition duration-300 ease-in-out flex flex-col h-full">
                      <Image
                        src={
                          place.images && place.images[0]?.image_url
                            ? place.images[0].image_url
                            : "/default-image.jpg"
                        }
                        alt={place.name}
                        width={500}
                        height={300}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-xl font-semibold mb-2">
                          {place.name}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          {place.description}
                        </p>
                        <p className="text-orange-500 font-bold">
                          {place.district_name}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </Slider>
          </div>
        )}
      </div>

      {/* Display categorized places using sliders with counts */}
      {filters.categories.map(category => {
        const categorizedPlaces = categorizePlaces(category.id);
        return (
          <div key={category.id} className="mb-8">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              {category.name} ({categorizedPlaces.length} สถานที่ใกล้เคียง)
            </h2>
            <Slider {...settings}>
              {categorizedPlaces.map(place => (
                <Link href={`/place/${place.id}`} key={place.id}>
                  <div className="p-4 cursor-pointer">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-95 transition duration-300 ease-in-out flex flex-col h-full">
                      <Image
                        src={
                          place.images && place.images[0]?.image_url
                            ? place.images[0].image_url
                            : "/default-image.jpg"
                        }
                        alt={place.name}
                        width={500}
                        height={300}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-xl font-semibold mb-2">
                          {place.name}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          {place.description}
                        </p>
                        <p className="text-orange-500 font-bold">
                          {place.district_name}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </Slider>
          </div>
        );
      })}
    </div>
  );
};

export default GeocodingSearchPage;
