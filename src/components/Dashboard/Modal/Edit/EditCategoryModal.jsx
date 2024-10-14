"use client"

import React, { useEffect, useState, Fragment } from "react"
import { useForm } from "react-hook-form"
import { Dialog, Transition } from "@headlessui/react"
import { useRouter } from "next/navigation"
import { updateCategory } from "@/services/admin/edit"
import { getCategoryById } from "@/services/admin/get"
import { FaSave, FaSpinner, FaTimes, FaEdit } from "react-icons/fa"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

const EditCategoryModal = ({ id, isOpen, onClose, refreshCategories}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const category = await getCategoryById(parseInt(id, 10))
        setValue("name", category.name)
        setIsLoading(false)
      } catch (error) {
        MySwal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่"
        })
        setIsLoading(false)
      }
    }

    if (id) {
      fetchCategory()
    }
  }, [id, setValue])

  const onSubmit = async data => {
    setIsSubmitting(true)
    try {
      await updateCategory(parseInt(id, 10), data)
      MySwal.fire({
        icon: "success",
        title: "อัปเดตสำเร็จ",
        showConfirmButton: false,
        timer: 1500
      })
      setTimeout(() => {
        onClose()
        refreshCategories(); 
      }, 2000)
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถอัปเดตหมวดหมู่ได้"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
                    <FaSpinner className="animate-spin text-Orange-600 text-3xl" />
                  </div>
                ) : (
                  <>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2 mb-8"
                    >
                      <FaEdit className="text-orange-600" />
                      แก้ไขหมวดหมู่
                    </Dialog.Title>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-4 mt-4"
                    >
                      <div className="relative z-0 w-full mb-6 group">
                        <input
                          id="name"
                          type="text"
                          {...register("name", {
                            required: "กรุณากรอกชื่อหมวดหมู่"
                          })}
                          className="block py-2.5 px-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-Orange-600 peer"
                          placeholder=" "
                        />
                <label
  htmlFor="name"
  className={`absolute text-xl  text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-3 -z-10 origin-[0] peer-focus:left-3 peer-focus:text-Orange-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6 font-bold ${errors.name ? "text-red-500" : ""}`}
>
  ชื่อหมวดหมู่
</label>

                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-Orange-500"
                          onClick={onClose}
                        >
                          <FaTimes />
                          ยกเลิก
                        </button>
                        <button
                          type="submit"
                          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-Orange-600 border border-transparent rounded-md shadow-sm hover:bg-Orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-Orange-500"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaSave />
                          )}
                          <span className="ml-2">
                            {isSubmitting
                              ? "กำลังบันทึก..."
                              : "บันทึกการเปลี่ยนแปลง"}
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
  )
}

export default EditCategoryModal
