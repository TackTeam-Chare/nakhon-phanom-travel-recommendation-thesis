"use client";

import React, { useEffect, useState, Fragment } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { getPlaceImagesById, getPlaceById } from "@/services/admin/get";
import { updateTourismImages } from "@/services/admin/edit";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaSave, FaSpinner, FaTimesCircle, FaEdit } from "react-icons/fa";

const MySwal = withReactContent(Swal);

const EditImagesModal = ({ id, isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [imageFiles, setImageFiles] = useState(null); // เปลี่ยนเป็น null เพื่อรับภาพเดียว
  const [imagePreview, setImagePreview] = useState(""); // สำหรับแสดงรูปหลังอัปโหลด
  const [imageName, setImageName] = useState(""); // สำหรับแสดงชื่อไฟล์รูป
  const [existingImages, setExistingImages] = useState([]);
  const [placeName, setPlaceName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // สำหรับแสดง modal เมื่อคลิกที่รูปภาพ

  const numericId = Number(id);

  useEffect(() => {
    const fetchEntity = async () => {
      try {
        const image = await getPlaceImagesById(numericId);

        if (image.tourism_entities_id) {
          const place = await getPlaceById(image.tourism_entities_id);
          setValue("tourism_entities_id", ` ${image.tourism_entities_id} `);
          setPlaceName(place.name);
          setExistingImages([
            {
              id: image.id,
              image_url: image.image_url || "",
              image_path: image.image_path || "",
              tourism_entities_id: image.tourism_entities_id,
            },
          ]);
        } else {
          throw new Error("ไม่พบ tourism_entities_id ในข้อมูลที่ดึงมา");
        }

        setIsLoading(false);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
        MySwal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการดึงข้อมูล",
          text: error.message,
        });
        setIsLoading(false);
      }
    };

    if (numericId) {
      fetchEntity();
    }
  }, [numericId, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("tourism_entities_id", data.tourism_entities_id);
    if (imageFiles) {
      formData.append("image_paths", imageFiles); // อัปโหลดภาพเดียว
    }

    try {
      await updateTourismImages(numericId, formData);
      MySwal.fire({
        icon: "success",
        title: "อัปเดตรูปภาพสำเร็จ",
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => {
        onClose();
        router.push("/dashboard/table/tourism-entities-images");
      }, 2000);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการอัปเดตรูปภาพ:", error);
      MySwal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการอัปเดตรูปภาพ",
        text: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // รับแค่ไฟล์เดียว
    if (file) {
      setImageFiles(file);
      setImageName(file.name); // ตั้งชื่อไฟล์ที่เลือก
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // แสดงภาพหลังจากเลือก
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <FaSpinner className="animate-spin text-orange-600 text-3xl" />
                  </div>
                ) : (
                  <>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2"
                    >
                      <FaEdit className="text-orange-600" />
                      เเก้ไขรูปภาพ {placeName}
                    </Dialog.Title>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-4 mt-4"
                    >
                      <div className="relative z-0 w-full mb-6 group">
                        <label className="block text-sm font-medium text-gray-700">
                          ไอดีสถานที่
                        </label>
                        <input
                          type="text"
                          {...register("tourism_entities_id")}
                          readOnly
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm bg-gray-200 cursor-not-allowed"
                        />
                      </div>

                      <div className="relative z-0 w-full mb-6 group">
                        <label className="block text-sm font-medium text-gray-700">
                          รูปภาพที่มีอยู่
                        </label>
                        <div className="grid grid-cols-1 gap-4">
                          {existingImages.length > 0 ? (
                            existingImages.map((image) => (
                              <Image
                                key={image.id}
                                src={image.image_url}
                                alt={image.image_path}
                                layout="responsive"
                                width={700}
                                height={400}
                                className="w-full h-auto object-cover rounded-lg"
                                priority
                              />
                            ))
                          ) : (
                            <p className="text-gray-500">ไม่มีรูปภาพ</p>
                          )}
                        </div>
                      </div>

                      <div className="relative z-0 w-full mb-6 group">
                        <label className="block text-sm font-medium text-gray-700">
                          เพิ่มรูปภาพใหม่ (สูงสุด 1 ภาพ)
                        </label>
                        <input
                          type="file"
                          {...register("image_paths")}
                          accept="image/*"
                          multiple={false} // อนุญาตให้เพิ่มได้แค่ไฟล์เดียว
                          onChange={handleFileChange}
                          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {imageName && (
                          <p className="mt-2 text-sm text-gray-500">ชื่อไฟล์: {imageName}</p>
                        )}
                      </div>

                      {imagePreview && (
                        <div className="relative z-0 w-full mb-6 group">
                          <label className="block text-sm font-medium text-gray-700">
                            ตัวอย่างภาพ (คลิกที่ภาพเพื่อขยาย)
                          </label>
                          <img
                            src={imagePreview}
                            alt="ตัวอย่างภาพ"
                            className="w-full h-auto object-cover rounded-lg cursor-pointer"
                            onClick={() => setIsImageModalOpen(true)}
                          />
                        </div>
                      )}

                      {/* Modal for Full Image View */}
                      <Transition appear show={isImageModalOpen} as={Fragment}>
                        <Dialog as="div" className="relative z-10" onClose={() => setIsImageModalOpen(false)}>
                          <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                          >
                            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
                              <div className="bg-white p-4 rounded-lg max-w-3xl max-h-full overflow-auto">
                                <img
                                  src={imagePreview}
                                  alt="ภาพขยาย"
                                  className="w-full h-auto object-contain rounded-lg"
                                />
                                <button
                                  onClick={() => setIsImageModalOpen(false)}
                                  className="mt-4 inline-flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                >
                                  ปิด
                                </button>
                              </div>
                            </div>
                          </Transition.Child>
                        </Dialog>
                      </Transition>

                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          className="inline-flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                          onClick={onClose}
                        >
                          <FaTimesCircle className="text-gray-600" />
                          ยกเลิก
                        </button>
                        <button
                          type="submit"
                          className="inline-flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaSave />
                          )}
                          <span>
                            {isSubmitting ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                          </span>
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditImagesModal;
