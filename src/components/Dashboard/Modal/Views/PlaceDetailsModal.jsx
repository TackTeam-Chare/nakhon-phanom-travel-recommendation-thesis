import React, { useEffect, useState, Fragment } from "react"
import Image from "next/image"
import { useForm, useFieldArray,Controller  } from "react-hook-form"
import { Dialog, Transition } from "@headlessui/react"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import {
  getPlaceById,
  getDistricts,
  getCategories,
  getSeasons
} from "@/services/admin/get"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faTrash,
  faUpload,
  faPlus,
  faMapMarkerAlt,
  faTags,
  faGlobe,
  faClock,
  faChevronDown,
  faChevronUp 
} from "@fortawesome/free-solid-svg-icons"

import Select from 'react-select';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
const MySwal = withReactContent(Swal)

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 1, // จำนวนสไลด์ที่เลื่อนในแต่ละครั้ง
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const PlaceDetailsModal = ({ id, isOpen, onClose, onSuccess }) => {
  const [existingImagesModalOpen, setExistingImagesModalOpen] = useState(false)
  const [selectedExistingImage, setSelectedExistingImage] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSeasons, setSelectedSeasons] = useState([]);
  const [seasons, setSeasons] = useState([]); 
  const {
    register,
    setValue,
    control,
    formState: { isDirty,errors },
    watch
  } = useForm({
    defaultValues: {
      operating_hours: [],
      published: 0,
    }
  })
  const { fields} = useFieldArray({
    control,
    name: "operating_hours"
  })
  const [districts, setDistricts] = useState([])
  const [categories, setCategories] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [dropdownOpen, setDropdownOpen] = useState({
    district: false,
    category: false,
    season: false,
    operatingHours: false
  })

  useEffect(() => {
    // If the category is already set to "สถานที่ท่องเที่ยว", trigger the seasons input
    if (watch("category_name") === "สถานที่ท่องเที่ยว") {
      setSelectedCategory("สถานที่ท่องเที่ยว");
    }
  }, [watch("category_name")]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [districtsData, categoriesData, seasonsData, placeData] = await Promise.all([
          getDistricts(),
          getCategories(),
          getSeasons(),
          getPlaceById(parseInt(id, 10)),
        ]);
  
        // ตั้งค่าข้อมูลหมวดหมู่และอำเภอ
        setDistricts(districtsData);
        setCategories(categoriesData);
  
        // จัดรูปแบบข้อมูลฤดูกาล
        const formattedSeasons = seasonsData.map((season) => ({
          label: season.name,
          value: season.id,
        }));
        setSeasons(formattedSeasons);
  
        // ตั้งค่า "selectedSeasons" หากข้อมูล season_ids มีอยู่
        if (placeData.season_ids && placeData.season_ids.length > 0) {
          setSelectedSeasons(
            placeData.season_ids.map((seasonId) =>
              formattedSeasons.find((season) => season.value === seasonId)
            )
          );
        }
  
        // ตั้งค่า default values ของฟอร์ม
        setValue("name", placeData.name);
        setValue("description", placeData.description);
        setValue("location", placeData.location);
        setValue("latitude", placeData.latitude);
        setValue("longitude", placeData.longitude);
        setValue("district_name", placeData.district_name || "");
        setValue("category_name", placeData.category_name || "");
        setValue("season_id", placeData.season_id || "");
        setValue("operating_hours", placeData.operating_hours || []);
        setValue("published", placeData.published === 1 ? 1 : 0);
  
        setExistingImages(placeData.images || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        MySwal.fire({
          icon: "error",
          title: "Unable to fetch data",
          text: "Please try again later.",
        });
      }
    };
  
    if (id) {
      fetchData();
    }
  }, [id, setValue]);
  
  useEffect(() => {
    if (categories.length > 0) {
      setValue("category_name", watch("category_name") || "");
    }
  
    if (districts.length > 0) {
      setValue("district_name", watch("district_name") || "");
    }
  }, [categories, districts, setValue, watch]);
  
  const renderOperatingHours = (operatingHours) => {
    if (!operatingHours || operatingHours.length === 0) {
      return <p className="text-sm text-gray-500">ไม่มีเวลาทำการของสถานที่</p>;
    }
  
      // แสดงผลเวลาทำการเมื่อมีข้อมูล
  return operatingHours.map((item, index) => (
    <div key={index} className="grid grid-cols-3 gap-4 mb-6 items-center">
      <div>{item.day_of_week}</div>
      <div>{item.opening_time || '--:--'}</div>
      <div>{item.closing_time || '--:--'}</div>
    </div>
  ));
};

  const handleClose = () => {
    if (isDirty) {
      MySwal.fire({
        icon: "warning",
        title: "ปิดการดูข้อมูล",
        showConfirmButton: false,
        timer: 1000,
        willClose: () => onClose()
      })
    } else {
      onClose()
    }
  }

  const toggleDropdown = field => {
    setDropdownOpen(prevState => ({
      ...prevState,
      [field]: !prevState[field]
    }))
  }

  const handleCategoryChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedCategory(selectedValue);
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    ข้อมูลสถานที่
                  </Dialog.Title>
                  <form

                    className="space-y-6 mt-8"
                  >
                   <div className="relative z-0 w-full group mb-8">
  <FontAwesomeIcon
    icon={faTags}
    className="absolute left-3 top-3 text-gray-400"
  />
  <select
    id="category_name"
    {...register("category_name", {
    })}
    onClick={() => toggleDropdown("category")}
    onChange={handleCategoryChange}  
    className="block py-2.5 px-10 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-orange-600 peer"
    disabled
  >
    <option value="">เลือกหมวดหมู่</option>
    {categories.map(category => (
      <option key={category.id} value={category.name}>
        {category.name}
      </option>
    ))}
  </select>
  <FontAwesomeIcon
    icon={dropdownOpen.category ? faChevronUp : faChevronDown}
    className="absolute right-3 top-3 text-gray-400"
  />
  <label
    htmlFor="category_name"
    className="absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-10 -z-10 origin-[0] peer-focus:left-10 peer-focus:text-orange-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
  >
    หมวดหมู่
  </label>
  {/* แสดงข้อความแจ้งเตือนเมื่อมีข้อผิดพลาด */}
  {errors.category_name && (
    <p className="text-red-500 text-xs mt-1">
      {errors.category_name.message}
    </p>
  )}
</div>

                    <div className="relative z-0 w-full  group mb-8">
                      <FontAwesomeIcon
                        icon={faGlobe}
                        className="absolute left-3 top-3 text-gray-400"
                      />
                      <input
                        type="text"
                        id="name"
                        {...register("name", {
                        })}
                        className="block py-2.5 px-10 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-orange-600 peer"
                        disabled
                      />
                      <label
                        htmlFor="name"
                        className="absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-10 -z-10 origin-[0] peer-focus:left-10 peer-focus:text-orange-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        ชื่อ
                      </label>
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div className="relative z-0 w-full group mb-10">
  <FontAwesomeIcon
    icon={faTags}
    className="absolute left-3 top-3 text-gray-400"
  />
  <textarea
    id="description"
    {...register("description", {
    })}
    rows={3}
    className="block py-2.5 px-10 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-orange-600 peer"
    disabled
  />
  <label
    htmlFor="description"
    className="absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-10 -z-10 origin-[0] peer-focus:left-10 peer-focus:text-orange-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
  >
    คำอธิบาย
  </label>
</div>

<div className="relative z-0 w-full mb-10 group">
  <FontAwesomeIcon
    icon={faMapMarkerAlt}
    className="absolute left-3 top-3 text-gray-400"
  />
  <input
    type="text"
    id="location"
    {...register("location", {
    })}
    className="block py-2.5 px-10 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-orange-600 peer"
    disabled
  />
  <label
    htmlFor="location"
    className="absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-10 -z-10 origin-[0] peer-focus:left-10 peer-focus:text-orange-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
  >
    ตำแหน่ง
  </label>
</div>

<div className="grid grid-cols-2 gap-4 mb-10">
  <div className="relative z-0 w-full group">
    <FontAwesomeIcon
      icon={faGlobe}
      className="absolute left-3 top-3 text-gray-400"
    />
    <input
      type="text"
      id="latitude"
      {...register("latitude", {
      })}
      className="block py-2.5 px-10 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-orange-600 peer"
      disabled
    />
    <label
      htmlFor="latitude"
      className="absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-10 -z-10 origin-[0] peer-focus:left-10 peer-focus:text-orange-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
    >
      ละติจูด
    </label>
  </div>

  <div className="relative z-0 w-full group">
    <FontAwesomeIcon
      icon={faGlobe}
      className="absolute left-3 top-3 text-gray-400"
    />
    <input
      type="text"
      id="longitude"
      {...register("longitude", {
      })}
      className="block py-2.5 px-10 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-orange-600 peer"
      disabled
    />
    <label
      htmlFor="longitude"
      className="absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-10 -z-10 origin-[0] peer-focus:left-10 peer-focus:text-orange-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
    >
      ลองจิจูด
    </label>
  </div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
  <div className="relative z-0 w-full group">
    <FontAwesomeIcon
      icon={faMapMarkerAlt}
      className="absolute left-3 top-3 text-gray-400"
    />
    <select
      id="district_name"
      {...register("district_name", {
    
      })}
      onClick={() => toggleDropdown("district")}
      className="block py-2.5 px-10 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-orange-600 peer"
      disabled
    >
      <option value="">เลือกอำเภอ</option>
      {districts.map((district) => (
        <option key={district.id} value={district.name}>
          {district.name}
        </option>
      ))}
    </select>
    <FontAwesomeIcon
      icon={dropdownOpen.district ? faChevronUp : faChevronDown}
      className="absolute right-3 top-3 text-gray-400"
    />
    <label
      htmlFor="district_name"
      className="absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-10 -z-10 origin-[0] peer-focus:left-10 peer-focus:text-orange-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
    >
      อำเภอ
    </label>

  </div>

  {selectedCategory === "สถานที่ท่องเที่ยว" && (
    <Controller
      control={control}
      name="season_id"
      render={({ field: { onChange, value } }) => (
        <Select
          isMulti
          options={seasons}
          className="basic-multi-select"
          classNamePrefix="select"
          value={selectedSeasons}
          placeholder="เลือกฤดูกาล"
          disabled
        />
      )}
    />
  )}

  <div className="relative z-0 w-full mb-6 group">
    <div className="flex items-center">
      <FontAwesomeIcon icon={faUpload} className="mr-2 text-gray-500" />
      <input
        type="checkbox"
        id="published"
        {...register("published", {
        })}
        className="form-checkbox h-4 w-4 text-orange-600 transition duration-150 ease-in-out"
        disabled
      />
      <label
        htmlFor="published"
        className="ml-2 block text-sm leading-5 text-gray-900"
      >
        เผยแพร่
      </label>
    </div>
    {errors.published && (
      <p className="text-red-500 text-xs mt-1">{errors.published.message}</p>
    )}
  </div>
</div>
               {/* Operating Hours Section */}
<div className="relative z-0 w-full mb-6 group">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    เวลาทำการ
  </label>

  {fields && fields.length > 0 ? (
    fields.map((item, index) => (
      <div key={item.id} className="grid grid-cols-3 gap-4 mb-6 items-center">
        <div className="relative">
          <select
            {...register(`operating_hours.${index}.day_of_week`)}
            className="block py-2 pl-4 pr-10 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md"
            disabled
          >
            <option value="">วันในสัปดาห์</option>
            <option value="Sunday">วันอาทิตย์</option>
            <option value="Monday">วันจันทร์</option>
            <option value="Tuesday">วันอังคาร</option>
            <option value="Wednesday">วันพุธ</option>
            <option value="Thursday">วันพฤหัสบดี</option>
            <option value="Friday">วันศุกร์</option>
            <option value="Saturday">วันเสาร์</option>
            <option value="Everyday">ทุกวัน</option>
            <option value="Except Holidays">ยกเว้นวันหยุดนักขัตฤกษ์</option>
          </select>
        </div>

        <div className="relative">
          <input
            type="time"
            {...register(`operating_hours.${index}.opening_time`)}
            className="block py-2 pl-10 pr-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md"
            disabled
          />
        </div>

        <div className="relative">
          <input
            type="time"
            {...register(`operating_hours.${index}.closing_time`)}
            className="block py-2 pl-10 pr-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md"
            disabled
          />
        </div>
      </div>
    ))
  ) : (
    <p className="text-sm text-gray-500">
      ไม่มีเวลาทำการของสถานที่
    </p>
  )}
</div>
                    <div className="relative z-0 w-full mb-6 group">
{/* Existing Images Section */}
{existingImages.length > 0 && (
        <div className="relative z-0 w-full mb-6 group">
          <label className="block text-lg font-medium text-gray-900">
            รูปภาพสถานที่
          </label>
          <Carousel responsive={responsive} infinite autoPlay>
            {existingImages.map((image, index) => (
              <div key={index} className="p-2">
                <Image
                  src={image.image_url}
                  alt={`Image ${index + 1}`}
                  width={300}
                  height={300}
                  className="object-cover rounded-lg"
                  onClick={() => {
                    setSelectedExistingImage(image.image_url);
                    setExistingImagesModalOpen(true);
                  }}
                />
              </div>
            ))}
          </Carousel>
        </div>
      )}

                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                        onClick={handleClose}
                      >
                        ปิด
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Modal for existing images */}
      <Transition appear show={existingImagesModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setExistingImagesModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="max-w-lg transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                {selectedExistingImage && (
                  <Image
                    src={selectedExistingImage}
                    alt="Existing image"
                    width={500}
                    height={500}
                    className="object-cover rounded-md"
                  />
                )}
                <button
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full"
                  onClick={() => setExistingImagesModalOpen(false)}
                >
                  ปิด
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

    </>
  )
}

export default PlaceDetailsModal