"use client"
import React, { Fragment } from "react"
import { useForm } from "react-hook-form"
import { Dialog, Transition } from "@headlessui/react"
import { createSeason } from "@/services/admin/insert"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { FaPlus, FaTimes } from "react-icons/fa"

const MySwal = withReactContent(Swal)

const AddSeasonModal = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = async data => {
    try {
      const response = await createSeason(data)
      MySwal.fire({
        icon: "success",
        title: `ฤดูกาลถูกสร้างสำเร็จ`,
        showConfirmButton: true,
        timer: 3000
      })
      onClose()
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการสร้างฤดูกาล",
        text: "กรุณาลองอีกครั้ง",
        showConfirmButton: true
      })
    }
  }

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
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 text-center"
                  >
                    เพิ่มฤดูกาลใหม่
                  </Dialog.Title>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6 mt-4"
                  >
                    <div className="relative z-0 w-full mb-6 group">
                      <input
                        id="name"
                        {...register("name", {
                          required: "กรุณากรอกชื่อฤดูกาล"
                        })}
                        type="text"
                        className={`block py-2.5 px-4 w-full text-sm text-gray-900 bg-transparent border ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        } rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-Orange-600 peer`}
                        placeholder=" "
                      />
                      <label
                        htmlFor="name"
                        className={`absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-3 -z-10 origin-[0] peer-focus:left-3 peer-focus:text-Orange-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6 ${
                          errors.name ? "text-red-500" : ""
                        }`}
                      >
                        ชื่อฤดูกาล
                      </label>
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                      <input
                        id="date_start"
                        {...register("date_start", {
                          required: "กรุณาระบุวันที่เริ่มต้น"
                        })}
                        type="date"
                        className={`block py-2.5 px-4 w-full text-sm text-gray-900 bg-transparent border ${
                          errors.date_start
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-Orange-600 peer`}
                        placeholder=" "
                      />
                      <label
                        htmlFor="date_start"
                        className={`absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-3 -z-10 origin-[0] peer-focus:left-3 peer-focus:text-Orange-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6 ${
                          errors.date_start ? "text-red-500" : ""
                        }`}
                      >
                        วันที่เริ่มต้น
                      </label>
                      {errors.date_start && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.date_start.message}
                        </p>
                      )}
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                      <input
                        id="date_end"
                        {...register("date_end", {
                          required: "กรุณาระบุวันที่สิ้นสุด"
                        })}
                        type="date"
                        className={`block py-2.5 px-4 w-full text-sm text-gray-900 bg-transparent border ${
                          errors.date_end ? "border-red-500" : "border-gray-300"
                        } rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-Orange-600 peer`}
                        placeholder=" "
                      />
                      <label
                        htmlFor="date_end"
                        className={`absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-3 -z-10 origin-[0] peer-focus:left-3 peer-focus:text-Orange-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6 ${
                          errors.date_end ? "text-red-500" : ""
                        }`}
                      >
                        วันที่สิ้นสุด
                      </label>
                      {errors.date_end && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.date_end.message}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="mr-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300 ease-in-out flex items-center gap-2"
                        onClick={onClose}
                      >
                        <FaTimes />
                        ยกเลิก
                      </button>
                      <button
                        type="submit"
                        className="bg-Orange-600 text-white px-4 py-2 rounded-md hover:bg-Orange-700 transition duration-300 ease-in-out flex items-center gap-2"
                      >
                        <FaPlus />
                        เพิ่มฤดูกาล
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default AddSeasonModal
