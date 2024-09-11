"use client"
import React, { Fragment, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Dialog, Transition } from "@headlessui/react"
import { updateDistrict } from "@/services/admin/edit"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { FaSave, FaTimes } from "react-icons/fa" // Import icons

const MySwal = withReactContent(Swal)

const EditDistrictModal = ({ isOpen, onClose, district }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm()

  useEffect(() => {
    if (district) {
      setValue("name", district.name)
    }
  }, [district, setValue])

  const onSubmit = async data => {
    try {
      await updateDistrict(Number(district.id), data)
      MySwal.fire({
        icon: "success",
        title: "อัปเดตอำเภอสำเร็จ!",
        showConfirmButton: false,
        timer: 1500
      })
      onClose()
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "การอัปเดตอำเภอล้มเหลว",
        text: "กรุณาลองใหม่อีกครั้ง."
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
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    แก้ไขอำเภอ
                  </Dialog.Title>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-4 space-y-4"
                  >
                    <div>
                      <input
                        {...register("name", {
                          required: "กรุณากรอกชื่ออำเภอ"
                        })}
                        placeholder="ชื่ออำเภอ"
                        className={`w-full border ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        } rounded-md p-2`}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        type="button"
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 flex items-center gap-2"
                        onClick={onClose}
                      >
                        <FaTimes /> {/* ยกเลิกไอคอน */}
                        ยกเลิก
                      </button>
                      <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
                      >
                        <FaSave /> {/* อัปเดตไอคอน */}
                        อัปเดต
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

export default EditDistrictModal
