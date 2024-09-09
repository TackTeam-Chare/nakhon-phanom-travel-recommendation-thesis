"use client"
import React, { useEffect, useState, useMemo, useCallback } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { getPlaces, getFetchTourismDataByCategory } from "@/services/admin/get"
import { deletePlace } from "@/services/admin/delete"
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter
} from "react-table"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import AddPlacesModal from "@/components/Dashboard/Modal/Add/AddPlacesModal"
import EditPlaceModal from "@/components/Dashboard/Modal/Edit/EditPlaceModal"

const FontAwesomeIcon = dynamic(
  () =>
    import("@fortawesome/react-fontawesome").then(mod => mod.FontAwesomeIcon),
  { ssr: false }
)

import {
  faPlus,
  faEdit,
  faTrash,
  faSearch,
  faArrowLeft,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons"

const PlaceIndexPage = () => {
  const [places, setPlaces] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editPlaceId, setEditPlaceId] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        if (selectedCategory !== null) {
          const result = await getFetchTourismDataByCategory(selectedCategory)
          setPlaces(result)
        } else {
          const result = await getPlaces()
          setPlaces(result)
        }
      } catch (err) {
        toast.error("เกิดข้อผิดพลาดในการดึงข้อมูลสถานที่")
      }
    }

    fetchPlaces()
  }, [selectedCategory])

  const handleDelete = useCallback(async id => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>คุณแน่ใจหรือว่าต้องการลบสถานที่นี้?</p>
          <button
            onClick={async () => {
              try {
                await deletePlace(id)
                setPlaces(prevPlaces =>
                  prevPlaces.filter(place => place.id !== id)
                )
                toast.success("ลบสถานที่สำเร็จ!")
                closeToast()
              } catch (error) {
                console.error(`Error deleting place with ID ${id}:`, error)
                toast.error("เกิดข้อผิดพลาดในการลบสถานที่ กรุณาลองใหม่อีกครั้ง")
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
  }, [])

  const handleCategoryChange = event => {
    const categoryId = parseInt(event.target.value, 10)
    setSelectedCategory(categoryId)
  }

  const columns = useMemo(
    () => [
      {
        Header: "รหัส",
        accessor: "id"
      },
      {
        Header: "ชื่อ",
        accessor: "name",
        Cell: ({ cell: { value } }) => (
          <span className="font-medium text-lg text-gray-700">{value}</span>
        )
      },
      {
        Header: "ฤดูกาล",
        accessor: "season_name",
        Cell: ({ cell: { value } }) => (
          <span>
            {Array.isArray(value) ? value.join(", ") : "ไม่มีข้อมูลฤดูกาล"}
          </span>
        )
      },
      {
        Header: "อำเภอ",
        accessor: "district_name"
      },
      {
        Header: "สถานะ",
        accessor: "published",
        Cell: ({ cell: { value } }) => (
          <span className={value ? "text-green-600" : "text-red-600"}>
            {value ? "เผยแพร่" : "ไม่เผยแพร่"}
          </span>
        )
      },
      {
        Header: "การดำเนินการ",
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setEditPlaceId(row.original.id.toString())
                setIsEditModalOpen(true)
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out flex items-center"
            >
              <FontAwesomeIcon icon={faEdit} className="mr-2" />
              แก้ไข
            </button>
            <button
              onClick={() => handleDelete(row.original.id)}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300 ease-in-out flex items-center"
            >
              <FontAwesomeIcon icon={faTrash} className="mr-2" />
              ลบ
            </button>
          </div>
        )
      }
    ],
    [router, handleDelete]
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
    state: { pageIndex, globalFilter },
    setGlobalFilter
  } = useTable(
    {
      columns,
      data: places,
      initialState: { pageIndex: 0 }
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  )

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-8 text-center text-orange-600">
          สถานที่ท่องเที่ยว
        </h1>

        {/* Dropdown for category selection */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300 ease-in-out flex items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            เพิ่มสถานที่ใหม่
          </button>

          <div className="flex items-center">
            <select
              value={selectedCategory || ""}
              onChange={handleCategoryChange}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="">-- เลือกประเภทสถานที่ --</option>
              <option value="1">สถานที่ท่องเที่ยว</option>
              <option value="2">ที่พัก</option>
              <option value="3">ร้านอาหาร</option>
              <option value="4">ร้านค้าของฝาก</option>
            </select>

            <div className="relative ml-4">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                value={globalFilter || ""}
                onChange={e => setGlobalFilter(e.target.value)}
                placeholder="ค้นหา..."
                className="p-2 pl-10 border border-gray-300 rounded-md"
              />
            </div>
          </div>
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
                    key={row.id}
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
            className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 flex items-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
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
            className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 flex items-center"
          >
            ถัดไป
            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
          </button>
        </div>
        <ToastContainer />
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <AddPlacesModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editPlaceId && (
        <EditPlaceModal
          id={editPlaceId}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  )
}

export default PlaceIndexPage
