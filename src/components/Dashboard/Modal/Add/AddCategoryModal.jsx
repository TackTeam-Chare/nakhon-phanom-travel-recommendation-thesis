"use client";

import React, { useState, Fragment } from "react";
import { useForm } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";
import { createCategory } from "@/services/admin/insert";
import { FaFolderPlus, FaTimes, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function CreateCategory({ onClose, refreshCategories }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const [isOpen, setIsOpen] = useState(true);

  const onSubmit = async (data) => {
    try {
      await createCategory(data);

      MySwal.fire({
        icon: "success",
        title: "หมวดหมู่ถูกสร้างสำเร็จ!",
        showConfirmButton: false,
        timer: 1500,
      });

      setIsOpen(false);
      onClose();
      refreshCategories();  // Call the callback function to refresh the data in parent
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError("name", {
          type: "manual",
          message: "ชื่อหมวดหมู่ซ้ำ กรุณาเลือกชื่อใหม่",
        });

        MySwal.fire({
          icon: "error",
          title: "ชื่อหมวดหมู่ซ้ำ",
          text: "หมวดหมู่นี้มีอยู่แล้วในระบบ กรุณาเลือกชื่อใหม่",
        });
      } else {
        MySwal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "เกิดข้อผิดพลาดในการสร้างหมวดหมู่",
        });
      }
    }
  };

  return (
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
                  className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2"
                >
                  <FaFolderPlus className="text-orange-600" />
                  สร้างหมวดหมู่ใหม่
                </Dialog.Title>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
<div className="relative flex flex-col mb-4">
  <label className="text-gray-700 text-sm font-medium mb-2">
    ชื่อหมวดหมู่
  </label>
  <input
    type="text"
    {...register("name", {
      required: "กรุณากรอกชื่อหมวดหมู่",
    })}
    className={`pl-4 pr-4 py-2 w-full border ${
      errors.name ? "border-red-500" : "border-gray-300"
    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500`}
    placeholder="กรอกชื่อหมวดหมู่"
  />
  {errors.name && (
    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
  )}
</div>
<div className="flex justify-end space-x-2">
  <button
    type="button"
    className="py-2 px-4 bg-gray-300 text-gray-700 rounded-md shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center gap-1"
    onClick={() => setIsOpen(false)}
  >
    <FaTimes />
    ยกเลิก
  </button>
  <button
    type="submit"
    className="py-2 px-4 bg-orange-600 text-white rounded-md shadow-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 flex items-center gap-1"
  >
    <FaPlus />
    สร้างหมวดหมู่
  </button>
</div>
</form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}


