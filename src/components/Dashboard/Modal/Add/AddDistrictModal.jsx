"use client"

import React, { Fragment } from "react"
import { useForm } from "react-hook-form"
import { Dialog, Transition } from "@headlessui/react"
import { FaPlus, FaTimes, FaExclamationTriangle } from "react-icons/fa"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

const AddDistrictModal = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = async data => {
    try {
      await createDistrict(data)

      MySwal.fire({
        icon: "success",
        title: "เพิ่มเขตสำเร็จ!",
        showConfirmButton: false,
        timer: 1500
      })

      onClose()
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถเพิ่มเขตได้ กรุณาลองใหม่อีกครั้ง."
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
            <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />
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
                    className="text-xl font-semibold leading-6 text-gray-900 flex items-center"
                  >
                    เพิ่มเขตใหม่
                  </Dialog.Title>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-4 space-y-4"
                  >
                    <div className="relative">
                      <input
                        {...register("name", { required: "กรุณากรอกชื่อเขต" })}
                        placeholder="ชื่อเขต"
                        className={`w-full border ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        } rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <FaExclamationTriangle className="h-4 w-4" />
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex justify-end gap-3">
                      <button
                        type="button"
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-all duration-300 flex items-center gap-2"
                        onClick={onClose}
                      >
                        <FaTimes />
                        ยกเลิก
                      </button>
                      <button
                        type="submit"
                        className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-all duration-300 flex items-center gap-2"
                      >
                        <FaPlus />
                        เพิ่ม
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

export default AddDistrictModal
