"use client"
import React, { useEffect, useState, Fragment } from "react"
import { useForm } from "react-hook-form"
import { Dialog, Transition } from "@headlessui/react"
import { useRouter } from "next/navigation"
import {
  getSeasonsRelationById,
  getSeasons,
  getPlaceById
} from "@/services/admin/get"
import { updateSeasonsRelation } from "@/services/admin/edit"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { FaSave, FaSpinner } from "react-icons/fa"

const MySwal = withReactContent(Swal)

const EditSeasonsRelationModal = ({ id, isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [seasons, setSeasons] = useState([])
  const [placeName, setPlaceName] = useState("")

  const numericId = Number(id)

  useEffect(() => {
    const fetchRelation = async () => {
      try {
        const [relation, seasonsData] = await Promise.all([
          getSeasonsRelationById(numericId),
          getSeasons()
        ])

        setValue("season_id", relation.season_id.toString())
        setValue("tourism_entities_id", relation.tourism_entities_id.toString())

        const placeData = await getPlaceById(
          Number(relation.tourism_entities_id)
        )
        setPlaceName(`ID: ${placeData.id} - ${placeData.name}`)

        setSeasons(
          seasonsData.map(season => ({
            id: season.id.toString(),
            name: season.name
          }))
        )

        setIsLoading(false)
      } catch (error) {
        MySwal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการดึงข้อมูล"
        })
        setIsLoading(false)
      }
    }

    if (id) {
      fetchRelation()
    }
  }, [id, numericId, setValue])

  const onSubmit = async data => {
    setIsSubmitting(true)
    try {
      await updateSeasonsRelation(numericId, data)
      MySwal.fire({
        icon: "success",
        title: "อัปเดตความสัมพันธ์ฤดูกาลสำเร็จ",
        showConfirmButton: false,
        timer: 1500
      })
      setTimeout(() => {
        onClose()
        router.push("/dashboard/table/seasons-relation")
      }, 2000)
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการอัปเดตความสัมพันธ์ฤดูกาล"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
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
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        แก้ไขความสัมพันธ์ฤดูกาล
                      </Dialog.Title>
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                      >
                        <div className="relative z-0 w-full mb-6 group">
                          <label
                            htmlFor="season_id"
                            className="block text-sm font-medium text-gray-700"
                          >
                            ฤดูกาล
                          </label>
                          <select
                            id="season_id"
                            {...register("season_id", {
                              required: "กรุณาเลือกฤดูกาล"
                            })}
                            className="block mt-1 w-full py-2 px-3 bg-white border border-gray-300 rounded-md shadow-sm focus:border-Orange-500 focus:ring-Orange-500 sm:text-sm"
                          >
                            <option value="">เลือกฤดูกาล</option>
                            {seasons.map(season => (
                              <option key={season.id} value={season.id}>
                                {season.name}
                              </option>
                            ))}
                          </select>
                          {errors.season_id && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.season_id.message}
                            </p>
                          )}
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <label
                            htmlFor="tourism_entities_id"
                            className="block text-sm font-medium text-gray-700"
                          >
                            สถานที่ท่องเที่ยว
                          </label>
                          <input
                            id="tourism_entities_id"
                            type="text"
                            value={placeName}
                            readOnly
                            className="block mt-1 w-full py-2 px-3 bg-gray-200 border border-gray-300 rounded-md shadow-sm sm:text-sm cursor-not-allowed"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <button
                            type="button"
                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-Orange-500"
                            onClick={onClose}
                          >
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
    </>
  )
}

export default EditSeasonsRelationModal
