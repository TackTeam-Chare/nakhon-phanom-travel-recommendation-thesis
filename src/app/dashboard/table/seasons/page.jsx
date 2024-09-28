"use client"
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getSeasons } from "@/services/admin/get";
import { deleteSeason } from "@/services/admin/delete";
import { useTable, useSortBy, usePagination, useGlobalFilter } from "react-table";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { format } from "date-fns"; // Import date-fns format function
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import AddSeasonForm from "@/components/Dashboard/Modal/Add/AddSeasonModal";
import EditSeasonModal from "@/components/Dashboard/Modal/Edit/EditSeasonModal";

const MySwal = withReactContent(Swal);

const SeasonsPage = () => {
  const [seasons, setSeasons] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSeasonId, setSelectedSeasonId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const result = await getSeasons();
        setSeasons(result);
      } catch (err) {
        MySwal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถดึงข้อมูลฤดูกาลได้",
        });
      }
    };

    fetchSeasons();
  }, []);

  const handleDelete = async (id) => {
    MySwal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการลบฤดูกาลนี้ใช่ไหม?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteSeason(id);
          setSeasons((prevSeasons) =>
            prevSeasons.filter((season) => season.id !== id)
          );
          MySwal.fire("ลบสำเร็จ!", "ฤดูกาลได้ถูกลบออกแล้ว.", "success");
        } catch (error) {
          console.error(`เกิดข้อผิดพลาดในการลบฤดูกาล ID ${id}:`, error);
          MySwal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถลบฤดูกาลได้ กรุณาลองอีกครั้ง",
          });
        }
      }
    });
  };

  const handleEdit = (id) => {
    setSelectedSeasonId(id);
    setIsEditModalOpen(true);
  };

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "ชื่อฤดูกาล",
        accessor: "name",
      },
      {
        Header: "วันที่เริ่มต้น",
        accessor: "date_start",
        Cell: ({ value }) => format(new Date(value), "dd MMMM yyyy"), // Format date
      },
      {
        Header: "วันที่สิ้นสุด",
        accessor: "date_end",
        Cell: ({ value }) => format(new Date(value), "dd MMMM yyyy"), // Format date
      },
      {
        Header: "การจัดการข้อมูล",
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => handleEdit(row.original.id)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out flex items-center gap-1"
            >
              <FaEdit /> แก้ไข
            </button>
            <button
              onClick={() => handleDelete(row.original.id)}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300 ease-in-out flex items-center gap-1"
            >
              <FaTrash /> ลบ
            </button>
          </div>
        ),
      },
    ],
    []
  );

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
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data: seasons,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { globalFilter, pageIndex } = state;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">
          จัดการฤดูกาล
        </h1>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300 ease-in-out flex items-center gap-1"
          >
            <FaPlus /> เพิ่มฤดูกาลใหม่
          </button>
          <div className="flex items-center bg-white border border-gray-300 rounded-md p-2">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              value={globalFilter || ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="ค้นหา..."
              className="outline-none w-full placeholder-gray-400"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table
            {...getTableProps()}
            className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md"
          >
            <thead className="bg-gray-100">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                  {headerGroup.headers.map((column) => (
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
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    key={row.id}
                    className="hover:bg-gray-100 transition duration-300 ease-in-out"
                  >
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        key={cell.column.id}
                        className="px-6 py-4 whitespace-no-wrap border-b border-gray-200"
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 flex items-center gap-1"
          >
            <FaArrowLeft /> ก่อนหน้า
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
            className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 flex items-center gap-1"
          >
            ถัดไป <FaArrowRight />
          </button>
        </div>
      </div>

      {/* Modals */}
      <AddSeasonForm isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      {selectedSeasonId && (
        <EditSeasonModal
          id={selectedSeasonId}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default SeasonsPage
