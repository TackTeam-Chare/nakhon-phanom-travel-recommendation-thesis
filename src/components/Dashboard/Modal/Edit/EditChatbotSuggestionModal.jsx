"use client";

import React, { useEffect, useState, Fragment } from "react";
import { useForm } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";
import { updateChatbotSuggestion, getChatbotSuggestionById } from "@/services/admin/chatbot/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaEdit, FaTimes, FaSave } from "react-icons/fa"; // Import necessary icons

const MySwal = withReactContent(Swal);

const EditSuggestionModal = ({ id, isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSuggestion = async () => {
      try {
        const suggestion = await getChatbotSuggestionById(id);
        setValue("category", suggestion.category);
        setValue("suggestion_text", suggestion.suggestion_text);
        setValue("active", suggestion.active); // Set the "active" field
      } catch (error) {
        MySwal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "เกิดข้อผิดพลาดในการดึงข้อมูลคำแนะนำแชทบอท",
        });
      }
    };

    if (id) {
      fetchSuggestion();
    }
  }, [id, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await updateChatbotSuggestion(id, data);
      MySwal.fire({
        icon: "success",
        title: "อัปเดตสำเร็จ",
        showConfirmButton: false,
        timer: 1500,
      });
      onClose();
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถอัปเดตคำแนะนำได้",
      });
    } finally {
      setIsSubmitting(false);
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
          <div className="fixed inset-0 bg-black bg-opacity-50" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-2xl transition-all border-t-4 border-orange-600">
                <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-800 flex items-center gap-2">
                  <FaEdit className="text-orange-600" />
                  แก้ไขคำแนะนำแชทบอท
                </Dialog.Title>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">หมวดหมู่</label>
                    <input
                      type="text"
                      {...register("category", { required: "กรุณากรอกหมวดหมู่" })}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    />
                    {errors.category && (
                      <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">คำแนะนำ</label>
                    <textarea
                      {...register("suggestion_text", { required: "กรุณากรอกคำแนะนำ" })}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    ></textarea>
                    {errors.suggestion_text && (
                      <p className="text-red-500 text-xs mt-1">{errors.suggestion_text.message}</p>
                    )}
                  </div>
                  {/* Add "active" checkbox */}
                  <div className="flex items-center">
                    <input
                      id="active"
                      type="checkbox"
                      {...register("active")}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                      เปิดใช้งาน
                    </label>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      className="flex items-center py-2 px-4 bg-gray-300 text-gray-700 rounded-lg shadow-md hover:bg-gray-400 transition-colors"
                      onClick={onClose}
                    >
                      <FaTimes className="mr-2" />
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="flex items-center py-2 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                      disabled={isSubmitting}
                    >
                      <FaSave className="mr-2" />
                      {isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
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
};

export default EditSuggestionModal;
