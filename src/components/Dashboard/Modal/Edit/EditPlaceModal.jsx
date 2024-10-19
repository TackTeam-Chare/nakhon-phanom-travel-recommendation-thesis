import React, { useEffect, useState, Fragment } from "react"
import Image from "next/image"
import { useForm, useFieldArray,Controller  } from "react-hook-form"
import { Dialog, Transition } from "@headlessui/react"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import {
  getPlaceById,
  getDistricts,
  getCategories,
  getSeasons
} from "@/services/admin/get"
import { updateTouristEntity } from "@/services/admin/edit"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faTrash,
  faUpload,
  faPlus,
  faMapMarkerAlt,
  faTags,
  faSnowflake,
  faGlobe,
  faClock,
  faChevronDown,
  faChevronUp 
} from "@fortawesome/free-solid-svg-icons"
import { faImage } from "@fortawesome/free-regular-svg-icons"
import Select from 'react-select';

const MySwal = withReactContent(Swal)

const EditPlaceModal = ({ id, isOpen, onClose, onSuccess }) => {
  const router = useRouter()
  const [error, setError] = useState("")
  const [existingImagesModalOpen, setExistingImagesModalOpen] = useState(false)
  const [uploadedImagesModalOpen, setUploadedImagesModalOpen] = useState(false)
  const [selectedExistingImage, setSelectedExistingImage] = useState(null)
  const [selectedUploadedImage, setSelectedUploadedImage] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSeasons, setSelectedSeasons] = useState([]);
  const [seasons, setSeasons] = useState([]); 
  const {
    register,
    handleSubmit,
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
  const { fields, append, remove } = useFieldArray({
    control,
    name: "operating_hours"
  })
  const [isLoading, setIsLoading] = useState(true);
  const [districts, setDistricts] = useState([])
  const [categories, setCategories] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [submitting, setSubmitting] = useState(false)
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
    const fetchSeasons = async () => {
      try {
        const seasonsData = await getSeasons();
        setSeasons(seasonsData.map(season => ({ label: season.name, value: season.id }))); // Format for react-select
      } catch (error) {
        console.error("Error fetching seasons:", error);
      }
    };
    fetchSeasons();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [districtsData, categoriesData, seasonsData, placeData] = await Promise.all([
          getDistricts(),
          getCategories(),
          getSeasons(),
          getPlaceById(parseInt(id, 10))
        ]);
  
        // Make sure to format seasons for react-select
        const formattedSeasons = seasonsData.map(season => ({ label: season.name, value: season.id }));
  
        // Set the seasons state properly
        setSeasons(formattedSeasons);
  
        // Only set selected seasons if `placeData.season_ids` exists
        if (placeData.season_ids && placeData.season_ids.length > 0) {
          setSelectedSeasons(
            placeData.season_ids.map(seasonId =>
              formattedSeasons.find(season => season.value === seasonId)
            )
          );
        }
  
        setDistricts(districtsData);
        setCategories(categoriesData);
  
        // Set form default values
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
          text: "Please try again later."
        });
      }
    };
  
    if (id) {
      fetchData();
    }
  }, [id, setValue]);

  const handleFileChange = event => {
    const files = Array.from(event.target.files || []);
    const allowedExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const maxFileSize = 20 * 1024 * 1024; // 20 MB
    // Limit the number of uploaded files to 10
    if (files.length > 10) {
      MySwal.fire({
        icon: "warning",
        title: "อัพโหลดสูงสุด 10 รูปภาพ",
        text: "คุณสามารถอัพโหลดภาพได้สูงสุด 10 ภาพเท่านั้น"
      });
      return;
    }

    const invalidFiles = files.filter(
      (file) => !allowedExtensions.includes(file.type) || file.size > maxFileSize
    );
  
    if (invalidFiles.length > 0) {
      const errorMessage = invalidFiles
        .map((file) => {
          if (!allowedExtensions.includes(file.type)) {
            return `ไฟล์ <b>${file.name}</b> ไม่ใช่ประเภทที่รองรับ (JPEG, JPG, PNG, GIF)`;
          } else if (file.size > maxFileSize) {
            return `ไฟล์ <b>${file.name}</b> มีขนาดเกิน 20MB`;
          }
        })
        .join('<br />'); // ใช้ <br /> เพื่อเว้นบรรทัด
  
      MySwal.fire({
        icon: "error",
        title: "ไฟล์ไม่ถูกต้อง!",
        html: errorMessage, // ใช้ html สำหรับข้อความหลายบรรทัด
      });
      return;
    }
  
    // อัปเดตรูปภาพที่ผ่านการตรวจสอบแล้ว
    const uploaded = files.map((file) => ({
      fileName: file.name,
      previewUrl: URL.createObjectURL(file),
    }));
  
    setUploadedFiles(uploaded);
  };

  const onSubmit = async (data) => {
    if (!isDirty) {
      MySwal.fire({
        icon: "warning",
        title: "ไม่มีการเปลี่ยนแปลงข้อมูล",
        showConfirmButton: false,
        timer: 1500
      })
      return;
    }
  
    setSubmitting(true);
  
    try {
      // Initialize formData
      const formData = new FormData(); // This is where formData is declared
  
      // Append the season_ids
      formData.append("season_ids", JSON.stringify(selectedSeasons.map(season => season.value)));
  
      // Loop through the data object and append to formData
      Object.keys(data).forEach((key) => {
        if (key === "image_paths" && data[key]) {
          const files = data[key];
          for (let i = 0; i < files.length; i++) {
            formData.append(key, files[i]);
          }
        } else if (key === "operating_hours" && data.operating_hours?.length) {
          formData.append(key, JSON.stringify(data.operating_hours));
        } else {
          formData.append(key, data[key]);
        }
      });
  
      // Send the formData to the backend
      const response = await updateTouristEntity(parseInt(id, 10), formData);
  
      if (!response) {
        throw new Error("ไม่สามารถอัปเดตสถานที่ได้");
      }
  
      MySwal.fire({
        icon: "success",
        title: "อัปเดตสถานที่สำเร็จ!",
        showConfirmButton: false,
        timer: 1500
      });
  
      setTimeout(() => {
        onClose();
        onSuccess();
      }, 2000);
    } catch (error) {
      console.error("ไม่สามารถอัปเดตสถานที่ได้", error);
      MySwal.fire({
        icon: "error",
        title: "ไม่สามารถอัปเดตสถานที่ได้",
        text: "กรุณาลองอีกครั้ง"
      });
    } finally {
      setSubmitting(false);
    }
  };


  const handleSeasonChange = (selectedOptions) => {
    setSelectedSeasons(selectedOptions || []); // Update the selected seasons
  };
  
  const handleClose = () => {
    if (isDirty) {
      MySwal.fire({
        icon: "warning",
        title: "ปิดโดยไม่บันทึกการเปลี่ยนแปลง",
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
  // const handleCategoryChange = (event) => {
  //   const selectedValue = event.target.value;
  //   setSelectedCategory(selectedValue);
  
  //   // Check if the selected category is "สถานที่ท่องเที่ยว"
  //   if (selectedValue === "สถานที่ท่องเที่ยว") {
  //     // This triggers the rendering of the seasons select immediately
  //     setSelectedCategory("สถานที่ท่องเที่ยว");
  //   }
  // };
  
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
                    แก้ไขสถานที่
                  </Dialog.Title>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
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
      required: "กรุณาเลือกหมวดหมู่"  // เพิ่ม validation ให้ฟิลด์นี้เป็นฟิลด์บังคับ
    })}
    onClick={() => toggleDropdown("category")}
    onChange={handleCategoryChange}  
    className="block py-2.5 px-10 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-orange-600 peer"
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
                          required: "กรุณากรอกชื่อสถานที่",
                          minLength: {
                            value: 3,
                            message: "ชื่อสถานที่ต้องมีอย่างน้อย 3 ตัวอักษร",
                          },
                        })}
                        className="block py-2.5 px-10 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-orange-600 peer"
                        placeholder=" "
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
      required: "กรุณากรอกคำอธิบาย",
      minLength: {
        value: 10,
        message: "คำอธิบายต้องมีความยาวอย่างน้อย 10 ตัวอักษร"
      }
    })}
    rows={3}
    className="block py-2.5 px-10 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-orange-600 peer"
    placeholder=" "
  />
  <label
    htmlFor="description"
    className="absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-10 -z-10 origin-[0] peer-focus:left-10 peer-focus:text-orange-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
  >
    คำอธิบาย
  </label>

  {/* แสดงข้อความแจ้งเตือนเมื่อมีข้อผิดพลาด */}
  {errors.description && (
    <p className="text-red-500 text-xs mt-1">
      {errors.description.message}
    </p>
  )}
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
      required: "กรุณากรอกตำแหน่งที่ตั้ง", // บังคับให้กรอกข้อมูลตำแหน่งที่ตั้ง
      minLength: {
        value: 5,
        message: "ตำแหน่งต้องมีอย่างน้อย 5 ตัวอักษร" // ตรวจสอบให้มีความยาวอย่างน้อย 5 ตัวอักษร
      }
    })}
    className="block py-2.5 px-10 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-orange-600 peer"
    placeholder=" "
  />
  <label
    htmlFor="location"
    className="absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-10 -z-10 origin-[0] peer-focus:left-10 peer-focus:text-orange-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
  >
    ตำแหน่ง
  </label>

  {/* แสดงข้อความแจ้งเตือนเมื่อมีข้อผิดพลาด */}
  {errors.location && (
    <p className="text-red-500 text-xs mt-1">
      {errors.location.message}
    </p>
  )}
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
        required: "กรุณากรอกละติจูด",
        pattern: {
          value: /^-?\d+(\.\d+)?$/,
          message: "ละติจูดต้องเป็นตัวเลขเท่านั้น"
        },
        validate: (value) =>
          value >= -90 && value <= 90 || "ละติจูดต้องอยู่ระหว่าง -90 ถึง 90"
      })}
      className="block py-2.5 px-10 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-orange-600 peer"
      placeholder=" "
    />
    <label
      htmlFor="latitude"
      className="absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-10 -z-10 origin-[0] peer-focus:left-10 peer-focus:text-orange-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
    >
      ละติจูด
    </label>
    {errors.latitude && (
      <p className="text-red-500 text-xs mt-1">{errors.latitude.message}</p>
    )}
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
        required: "กรุณากรอกลองจิจูด",
        pattern: {
          value: /^-?\d+(\.\d+)?$/,
          message: "ลองจิจูดต้องเป็นตัวเลขเท่านั้น"
        },
        validate: (value) =>
          value >= -180 && value <= 180 || "ลองจิจูดต้องอยู่ระหว่าง -180 ถึง 180"
      })}
      className="block py-2.5 px-10 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-orange-600 peer"
      placeholder=" "
    />
    <label
      htmlFor="longitude"
      className="absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-10 -z-10 origin-[0] peer-focus:left-10 peer-focus:text-orange-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
    >
      ลองจิจูด
    </label>
    {errors.longitude && (
      <p className="text-red-500 text-xs mt-1">{errors.longitude.message}</p>
    )}
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
        required: "กรุณาเลือกอำเภอ", // การตรวจสอบว่าฟิลด์นี้ต้องกรอก
      })}
      onClick={() => toggleDropdown("district")}
      className="block py-2.5 px-10 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-orange-600 peer"
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
    {errors.district_name && (
      <p className="text-red-500 text-xs mt-1">{errors.district_name.message}</p>
    )}
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
          onChange={handleSeasonChange}
          placeholder="เลือกฤดูกาล"
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
          required: "กรุณาเลือกสถานะเผยแพร่", // เพิ่มการตรวจสอบว่าต้องเลือกสถานะเผยแพร่
        })}
        className="form-checkbox h-4 w-4 text-orange-600 transition duration-150 ease-in-out"
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
{fields.length > 0 && (
  <div className="relative z-0 w-full mb-6 group">
    <label
      htmlFor="operating_hours"
      className="block text-sm font-medium text-gray-700 mb-2"
    >
      เวลาทำการ
    </label>
    {fields.map((item, index) => (
      <div
        key={item.id}
        className="grid grid-cols-4 gap-4 mb-6 items-center"
      >
        {/* Container for day_of_week select and chevron icon */}
        <div className="relative">
          <select
            {...register(`operating_hours.${index}.day_of_week`)}
            onClick={() => toggleDropdown("operatingHours")}
            className="block py-2 pl-4 pr-10 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-orange-600"
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
            <option value="ExceptHolidays">ยกเว้นวันหยุดนักขัตฤกษ์</option>
          </select>
          <FontAwesomeIcon
            icon={dropdownOpen.operatingHours ? faChevronUp : faChevronDown}
            className="absolute right-3 top-3 text-gray-400 pointer-events-none"
          />
        </div>

        {/* Opening time input with clock icon */}
        <div className="relative">
          <FontAwesomeIcon
            icon={faClock}
            className="absolute left-3 top-3 text-gray-400"
          />
          <input
            type="time"
            {...register(`operating_hours.${index}.opening_time`)}
            className="block py-2 pl-10 pr-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-orange-600"
          />
          <label
            htmlFor={`operating_hours.${index}.opening_time`}
            className="absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-10 -z-10 origin-[0] peer-focus:left-10 peer-focus:text-orange-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            เวลาเปิด
          </label>
        </div>

        {/* Closing time input with clock icon */}
        <div className="relative">
          <FontAwesomeIcon
            icon={faClock}
            className="absolute left-3 top-3 text-gray-400"
          />
          <input
            type="time"
            {...register(`operating_hours.${index}.closing_time`)}
            className="block py-2 pl-10 pr-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-orange-600"
          />
          <label
            htmlFor={`operating_hours.${index}.closing_time`}
            className="absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-10 -z-10 origin-[0] peer-focus:left-10 peer-focus:text-orange-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            เวลาปิด
          </label>
        </div>

        {/* Delete button */}
        <button
          type="button"
          onClick={() => remove(index)}
          className="text-red-500 hover:text-red-700"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={() =>
        append({
          day_of_week: "",
          opening_time: "",
          closing_time: ""
        })
      }
      className="col-span-3 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 flex items-center justify-center"
    >
      <FontAwesomeIcon icon={faPlus} className="mr-2" />
      เพิ่มเวลาทำการ
    </button>
  </div>
)}


                    <div className="relative z-0 w-full mb-6 group">
                      <label
                        htmlFor="image_paths"
                        className="block text-lg font-medium leading-6 text-gray-900"
                      >
                        รูปภาพสถานที่
                      </label>
{/* Existing Images Section */}
{existingImages.length > 0 && (
  <div className="relative z-0 w-full mb-6 group">
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {existingImages.map((image, index) => (
        image.image_url ? (
          <Image
            key={index}
            src={image.image_url}
            alt={`Existing Image ${index + 1}`}
            width={200}
            height={200}
            className="object-cover rounded-lg cursor-pointer"
            onClick={() => {
              setSelectedExistingImage(image.image_url);
              setExistingImagesModalOpen(true);
            }}
          />
        ) : null
      ))}
    </div>
  </div>
)}
                      {/* Upload Images Section */}
                      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                        <div className="text-center">
                          <FontAwesomeIcon
                            icon={faImage}
                            className="mx-auto h-12 w-12 text-gray-300"
                          />
                          <div className="mt-4 flex text-sm leading-6 text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer rounded-md bg-white font-semibold text-orange-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-orange-600 focus-within:ring-offset-2 hover:text-orange-500"
                            >
                              <span>อัปโหลดไฟล์</span>
                              <input
                                id="file-upload"
                                type="file"
                                multiple
                                className="sr-only"
                                {...register("image_paths", {
                                  onChange: handleFileChange
                                })}
                              />
                            </label>
                            <p className="pl-1">หรือลากและวาง</p>
                          </div>
                          <p className="text-xs leading-5 text-gray-600">
                            PNG, JPG, GIF สูงสุด 10MB
                          </p>
                          <p className="text-xs leading-5 text-red-600">
                            คุณสามารถอัพโหลดภาพได้ไม่เกิน 10 ภาพ
                          </p>
                        </div>
                      </div>

                      {uploadedFiles.length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-lg font-medium text-gray-700">
                            ไฟล์ที่อัปโหลด:
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {uploadedFiles.map((file, index) => (
                              <div key={index} className="relative">
                                <Image
                                  src={file.previewUrl}
                                  alt={`Uploaded ${index}`}
                                  width={200}
                                  height={200}
                                  className="object-cover w-full h-32 rounded-md cursor-pointer"
                                  onClick={() => {
                                    setSelectedUploadedImage(file.previewUrl)
                                    setUploadedImagesModalOpen(true)
                                  }}
                                />
                                <p className="text-xs text-center mt-2">
                                  {file.fileName}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {error && (
                      <p className="text-red-500 text-center">{error}</p>
                    )}
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                        onClick={handleClose}
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="submit"
                        className={`bg-orange-600 text-white px-4 py-2 rounded-md ${
                          submitting
                            ? "bg-opacity-60 cursor-not-allowed"
                            : "hover:bg-orange-700"
                        }`}
                        disabled={submitting}
                      >
                        {submitting ? "กำลังอัปเดต..." : "อัปเดตสถานที่"}
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

      {/* Modal for uploaded images */}
      <Transition appear show={uploadedImagesModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setUploadedImagesModalOpen(false)}
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
                {selectedUploadedImage && (
                  <Image
                    src={selectedUploadedImage}
                    alt="Uploaded image"
                    width={500}
                    height={500}
                    className="object-cover rounded-md"
                  />
                )}
                <button
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full"
                  onClick={() => setUploadedImagesModalOpen(false)}
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

export default EditPlaceModal