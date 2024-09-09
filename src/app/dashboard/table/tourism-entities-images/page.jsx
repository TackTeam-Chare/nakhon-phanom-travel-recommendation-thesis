"use client"
import React, { useEffect, useState, useMemo } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { getPlaceImages } from "@/services/admin/get"
import { deletePlaceImage } from "@/services/admin/delete"
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter
} from "react-table"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import AddImagesModal from "@/components/Dashboard/Modal/Add/UploadImagesModal"
import EditImagesModal from "@/components/Dashboard/Modal/Edit/EditImagesModal"

const ImagesIndexPage = () => {
  const [images, setImages] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editImageId, setEditImageId] = useState(null) // Store the ID to edit
  const router = useRouter()

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imagesData = await getPlaceImages()
        setImages(imagesData)
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลรูปภาพ:", error)
        toast.error("เกิดข้อผิดพลาดในการดึงข้อมูลรูปภาพ")
      }
    }

    fetchImages()
  }, [])

  const handleDelete = async id => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>คุณแน่ใจหรือไม่ว่าต้องการลบรูปภาพนี้?</p>
          <button
            onClick={async () => {
              try {
                await deletePlaceImage(id)
                setImages(prevImages =>
                  prevImages.filter(image => image.id !== id)
                )
                toast.success("ลบรูปภาพสำเร็จ!")
                closeToast()
              } catch (error) {
                console.error(
                  `เกิดข้อผิดพลาดในการลบรูปภาพที่มี ID ${id}:`,
                  error
                )
                toast.error("เกิดข้อผิดพลาดในการลบรูปภาพ กรุณาลองอีกครั้ง")
              }
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300 ease-in-out"
          >
            ใช่
          </button>
          <button
            onClick={closeToast}
            className="bg-gray-600 text-white px-4 py-2 rounded-md ml-2 hover:bg-gray-700 transition duration-300 ease-in-out"
          >
            ไม่
          </button>
        </div>
      ),
      { closeButton: false }
    )
  }

  const openEditModal = id => {
    setEditImageId(id)
    setIsEditModalOpen(true)
  }

  const columns = useMemo(
    () => [
      {
        Header: "รหัส",
        accessor: "id"
      },
      {
        Header: "รูปภาพ",
        accessor: "image_url",
        Cell: ({ cell: { value }, row }) => (
          <Image
            src={value}
            alt={row.original.image_path}
            width={100}
            height={100}
            className="object-cover rounded-lg"
            priority
          />
        )
      },
      {
        Header: "หน่วยงานท่องเที่ยว",
        accessor: "tourism_entities_id",
        Cell: ({ cell: { value }, row }) => (
          <span>{`ID: ${value}, ชื่อ: ${row.original.tourism_entity_name}`}</span>
        )
      },
      {
        Header: "การกระทำ",
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => openEditModal(row.original.id)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
            >
              แก้ไข
            </button>
            <button
              onClick={() => handleDelete(row.original.id)}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300 ease-in-out"
            >
              ลบ
            </button>
          </div>
        )
      }
    ],
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    prepareRow,
    state,
    setGlobalFilter
  } = useTable(
    {
      columns,
      data: images
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  )

  const { globalFilter, pageIndex } = state

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">รูปภาพทั้งหมด</h1>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300 ease-in-out"
          >
            เพิ่มรูปภาพใหม่
          </button>
          <input
            value={globalFilter || ""}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder="ค้นหา..."
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="overflow-x-auto">
          <table
            {...getTableProps()}
            className="min-w-full bg-white border border-gray-200"
          >
            <thead className="bg-gray-100">
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                  {headerGroup.headers.map(column => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      key={column.id}
                      className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider"
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map(row => {
                prepareRow(row)
                return (
                  <tr
                    {...row.getRowProps()}
                    key={row.original.id}
                    className="hover:bg-gray-100 transition duration-300 ease-in-out"
                  >
                    {row.cells.map(cell => (
                      <td
                        {...cell.getCellProps()}
                        key={cell.column.id}
                        className="px-6 py-4 whitespace-no-wrap border-b border-gray-200"
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            ก่อนหน้า
          </button>
          <span>
            หน้า{" "}
            <strong>
              {pageIndex + 1} จาก {pageOptions.length}
            </strong>
          </span>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            ถัดไป
          </button>
        </div>
        <ToastContainer />
      </div>

      {isAddModalOpen && (
        <AddImagesModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {isEditModalOpen && editImageId && (
        <EditImagesModal
          id={editImageId}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  )
}

export default ImagesIndexPage
