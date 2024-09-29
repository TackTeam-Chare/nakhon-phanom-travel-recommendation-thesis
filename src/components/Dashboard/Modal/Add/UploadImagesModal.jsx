"use client"
import React, { useState, useEffect, Fragment } from "react"
import { useForm } from "react-hook-form"
import { Dialog, Transition } from "@headlessui/react"
import { useRouter } from "next/navigation"
import { getPlaces } from "@/services/admin/get"
import { uploadTourismImages } from "@/services/admin/insert"
import { FaMapMarkerAlt, FaUpload } from "react-icons/fa"
import Image from "next/image"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

const UploadImagesModal = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()
  const router = useRouter()
  const [places, setPlaces] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const placesData = await getPlaces()
        setPlaces(placesData)
      } catch (error) {
        const err = error
        MySwal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการดึงข้อมูลสถานที่",
          text: err.message
        })
      }
    }

    fetchPlaces()
  }, [])

  const handleFileChange = event => {
    const files = Array.from(event.target.files || []);

    // Enforce a maximum of 10 files
    if (files.length > 10) {
        MySwal.fire({
            icon: "warning",
            title: "สามารถอัปโหลดได้สูงสุด 10 รูปเท่านั้น",
        });
        return;
    }

    const filePreviews = files.map(file => ({
        file,
        previewUrl: URL.createObjectURL(file)
    }));
    setUploadedFiles(filePreviews);
};


const onSubmit = async data => {
  const formData = new FormData();
  formData.append("tourism_entities_id", data.tourism_entities_id);
  
  uploadedFiles.forEach(file => {
      formData.append("image_paths", file.file); // Add each file to the FormData
  });

  try {
      await uploadTourismImages(formData);
      MySwal.fire({
          icon: "success",
          title: "อัปโหลดรูปภาพสำเร็จ",
          showConfirmButton: false,
          timer: 1500
      });
      setTimeout(() => {
          onClose();
          router.push("/dashboard/table/tourism-entities-images");
      }, 2000);
  } catch (error) {
      MySwal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ",
          text: error.message
      });
  }
};


  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    อัปโหลดรูปภาพ
                  </Dialog.Title>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6 mt-4"
                  >
                    <div className="relative z-0 w-full mb-6 group">
                      <label className="block text-sm font-medium text-gray-700">
                        สถานที่ท่องเที่ยว
                      </label>
                      <div className="flex items-center mt-1">
                        <FaMapMarkerAlt className="mr-2 text-gray-500" />
                        <select
                          {...register("tourism_entities_id", {
                            required: "กรุณาเลือกสถานที่"
                          })}
                          className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        >
                          <option value="">เลือกสถานที่</option>
                          {places.map(place => (
                            <option key={place.id} value={place.id}>
                              {place.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.tourism_entities_id && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.tourism_entities_id.message}
                        </p>
                      )}
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                      <label className="block text-sm font-medium text-gray-700">
                        รูปภาพ
                      </label>
                      <div className="flex items-center mt-1">
                        <FaUpload className="mr-2 text-gray-500" />
                        <input
                          type="file"
                          {...register("image_paths", {
                            required: "กรุณาเลือกรูปภาพ"
                          })}
                          multiple
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                          onChange={handleFileChange}
                        />
                      </div>
                      {errors.image_paths && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.image_paths.message}
                        </p>
                      )}
                    </div>
                    {uploadedFiles.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-lg font-medium text-gray-700">
                          ไฟล์ที่อัปโหลด:
                        </h3>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="relative">
                              <Image
                                src={file.previewUrl}
                                alt={`Uploaded ${index}`}
                                className="object-cover w-full h-32 rounded-md cursor-pointer"
                                width={150}
                                height={100}
                                onClick={() =>
                                  setSelectedImage(file.previewUrl)
                                }
                                unoptimized
                              />
                              <p className="text-xs text-center mt-2">
                                {file.file.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <button
                      type="submit"
                      className="w-full justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 flex items-center gap-2"
                    >
                      <FaUpload />
                      อัปโหลด
                    </button>
                  </form>

                  {selectedImage && (
                    <Transition appear show={!!selectedImage} as={Fragment}>
                      <Dialog
                        as="div"
                        className="relative z-50"
                        onClose={() => setSelectedImage(null)}
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
                          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
                        </Transition.Child>

                        <div className="fixed inset-0 flex items-center justify-center p-4">
                          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto overflow-auto">
                            <Image
                              src={selectedImage}
                              alt="Preview"
                              className="object-contain w-full h-auto max-h-[80vh] rounded-md"
                              width={800}
                              height={600}
                              unoptimized
                            />
                            <button
                              onClick={() => setSelectedImage(null)}
                              className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto"
                            >
                              ปิด
                            </button>
                          </div>
                        </div>
                      </Dialog>
                    </Transition>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default UploadImagesModal
