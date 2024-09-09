"use client"
import React, { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getAllOperatingHours } from "@/services/admin/get"
import { deleteOperatingHours } from "@/services/admin/delete"
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter
} from "react-table"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import AddOperatingHoursForm from "@/components/Dashboard/Modal/Add/AddOperatingHoursModal"
import EditOperatingHoursModal from "@/components/Dashboard/Modal/Edit/EditOperatingHoursModal"

const OperatingHoursPage = () => {
  const [operatingHours, setOperatingHours] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedOperatingHour, setSelectedOperatingHour] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchOperatingHours = async () => {
      try {
        const result = await getAllOperatingHours()
        setOperatingHours(result)
      } catch (err) {
        toast.error("เกิดข้อผิดพลาดในการดึงข้อมูลเวลาทำการ")
      }
    }

    fetchOperatingHours()
  }, [])

  const handleDelete = async id => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>คุณแน่ใจหรือไม่ว่าต้องการลบเวลาทำการนี้?</p>
          <button
            onClick={async () => {
              try {
                await deleteOperatingHours(id)
                setOperatingHours(prevHours =>
                  prevHours.filter(hour => hour.id !== id)
                )
                toast.success("ลบเวลาทำการสำเร็จ!")
                closeToast()
              } catch (error) {
                console.error(
                  `เกิดข้อผิดพลาดในการลบเวลาทำการที่มี ID ${id}:`,
                  error
                )
                toast.error("เกิดข้อผิดพลาดในการลบเวลาทำการ กรุณาลองอีกครั้ง")
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

  const openAddModal = () => setIsAddModalOpen(true)
  const closeAddModal = () => setIsAddModalOpen(false)

  const openEditModal = operatingHour => {
    setSelectedOperatingHour(operatingHour)
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedOperatingHour(null)
  }

  const columns = useMemo(
    () => [
      {
        Header: "รหัส",
        accessor: "id"
      },
      {
        Header: "สถานที่",
        accessor: "place_name",
        Cell: ({ row }) => (
          <span>{`ID: ${row.original.place_id}, ชื่อ: ${row.original.place_name}`}</span>
        )
      },
      {
        Header: "วันในสัปดาห์",
        accessor: "day_of_week"
      },
      {
        Header: "เวลาเปิด",
        accessor: "opening_time"
      },
      {
        Header: "เวลาปิด",
        accessor: "closing_time"
      },
      {
        Header: "การกระทำ",
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => openEditModal(row.original)}
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
      data: operatingHours
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  )

  const { globalFilter, pageIndex } = state

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">
          เวลาทำการ
        </h1>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={openAddModal}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300 ease-in-out"
          >
            เพิ่มเวลาทำการใหม่
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

        {/* เพิ่ม Modal เวลาทำการ */}
        {isAddModalOpen && (
          <AddOperatingHoursForm
            isOpen={isAddModalOpen}
            onClose={closeAddModal}
          />
        )}

        {/* แก้ไข Modal เวลาทำการ */}
        {isEditModalOpen && selectedOperatingHour && (
          <EditOperatingHoursModal
            id={selectedOperatingHour.id}
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
          />
        )}
      </div>
    </div>
  )
}

export default OperatingHoursPage
