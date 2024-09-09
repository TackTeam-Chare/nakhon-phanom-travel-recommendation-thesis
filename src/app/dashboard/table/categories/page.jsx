"use client"
import React, { useEffect, useState, useMemo } from "react"
import { getCategories } from "@/services/admin/get"
import { deleteCategory } from "@/services/admin/delete"
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter
} from "react-table"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa"
import CreateCategory from "@/components/Dashboard/Modal/Add/AddCategoryModal"
import EditCategoryModal from "@/components/Dashboard/Modal/Edit/EditCategoryModal"

const CategoriesPage = () => {
  const [categories, setCategories] = useState([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editCategoryId, setEditCategoryId] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getCategories()
        setCategories(result)
      } catch (err) {
        toast.error("เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่")
      }
    }

    fetchCategories()
  }, [])

  const handleDelete = async id => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่นี้?</p>
          <button
            onClick={async () => {
              try {
                await deleteCategory(id)
                setCategories(prevCategories =>
                  prevCategories.filter(category => category.id !== id)
                )
                toast.success("ลบหมวดหมู่สำเร็จ!")
                closeToast()
              } catch (error) {
                console.error(
                  `เกิดข้อผิดพลาดในการลบหมวดหมู่ที่มี ID ${id}:`,
                  error
                )
                toast.error(
                  "เกิดข้อผิดพลาดในการลบหมวดหมู่ กรุณาลองใหม่อีกครั้ง"
                )
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

  const handleEdit = id => {
    setEditCategoryId(id.toString())
    setIsEditModalOpen(true)
  }

  const columns = useMemo(
    () => [
      {
        Header: "รหัส",
        accessor: "id"
      },
      {
        Header: "ชื่อหมวดหมู่",
        accessor: "name"
      },
      {
        Header: "การจัดการ",
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => handleEdit(row.original.id)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out flex items-center"
            >
              <FaEdit className="mr-1" />
              แก้ไข
            </button>
            <button
              onClick={() => handleDelete(row.original.id)}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300 ease-in-out flex items-center"
            >
              <FaTrash className="mr-1" />
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
      data: categories,
      initialState: { pageIndex: 0 }
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  )

  const { globalFilter, pageIndex } = state

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-8 text-center text-bold text-black-600">
          หมวดหมู่
        </h1>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300 ease-in-out flex items-center"
          >
            <FaPlus className="mr-1" />
            เพิ่มหมวดหมู่ใหม่
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
                      {...column.getHeaderProps(
                        column.getSortByToggleProps
                          ? column.getSortByToggleProps()
                          : {}
                      )}
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
        {/* Modals */}
        {isCreateModalOpen && <CreateCategory />}
        {isEditModalOpen && editCategoryId && (
          <EditCategoryModal
            id={editCategoryId}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
          />
        )}
        <ToastContainer />
      </div>
    </div>
  )
}

export default CategoriesPage
