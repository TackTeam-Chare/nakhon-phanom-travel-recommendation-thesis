"use client";

import React, { useState, Fragment } from "react";
import { useForm } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";
import { createChatbotSuggestion } from "@/services/admin/chatbot/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaRegLightbulb, FaTimes, FaPlus } from "react-icons/fa"; // เพิ่มไอคอนที่เกี่ยวข้อง

const MySwal = withReactContent(Swal);

export default function CreateSuggestionModal() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isOpen, setIsOpen] = useState(true);

  const onSubmit = async (data) => {
    try {
      await createChatbotSuggestion(data);

      MySwal.fire({
        icon: "success",
        title: "เพิ่มคำแนะนำสำเร็จ!",
        showConfirmButton: false,
        timer: 1500,
      });

      setIsOpen(false);
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถเพิ่มคำแนะนำได้",
      });
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
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
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-2xl transition-all border-t-4 border-blue-600">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-semibold leading-6 text-gray-800 flex items-center gap-2"
                >
                  <FaRegLightbulb className="text-blue-600" />
                  เพิ่มคำแนะนำใหม่
                </Dialog.Title>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">หมวดหมู่</label>
                    <input
                      type="text"
                      {...register("category", { required: "กรุณากรอกหมวดหมู่" })}
                      className="mt-1 block w-full px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.category && (
                      <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">คำแนะนำ</label>
                    <textarea
                      {...register("suggestion_text", { required: "กรุณากรอกคำแนะนำ" })}
                      className="mt-1 block w-full px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                    {errors.suggestion_text && (
                      <p className="text-red-500 text-xs mt-1">{errors.suggestion_text.message}</p>
                    )}
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      className="flex items-center py-2 px-4 bg-gray-300 text-gray-700 rounded-lg shadow-md hover:bg-gray-400 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaTimes className="mr-2" />
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="flex items-center py-2 px-4 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors"
                    >
                      <FaPlus className="mr-2" />
                      เพิ่มคำแนะนำ
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
