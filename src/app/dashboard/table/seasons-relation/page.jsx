"use client";

import React, { useEffect, useState, useMemo } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrashAlt, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getAllSeasonsRelations } from "@/services/admin/get";
import { deleteSeasonsRelations } from "@/services/admin/delete";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import AddSeasonsRelationModal from "@/components/Dashboard/Modal/Add/AddSeasonsRelationModal";
import EditSeasonsRelationModal from "@/components/Dashboard/Modal/Edit/EditSeasonsRelationModal";

const MySwal = withReactContent(Swal);

const SeasonsRelationIndexPage = () => {
  const [relations, setRelations] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRelationId, setSelectedRelationId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRelations = async () => {
      try {
        const result = await getAllSeasonsRelations();
        setRelations(result);
      } catch (err) {
        MySwal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถดึงข้อมูลความสัมพันธ์ได้",
        });
      }
    };

    fetchRelations();
  }, []);

  const handleDelete = async (id) => {
    MySwal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการลบความสัมพันธ์นี้ใช่ไหม?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteSeasonsRelations(id);
          setRelations((prevRelations) =>
            prevRelations.filter((relation) => relation.id !== id)
          );
          MySwal.fire("ลบสำเร็จ!", "ความสัมพันธ์ถูกลบแล้ว", "success");
        } catch (error) {
          console.error(
            `เกิดข้อผิดพลาดในการลบความสัมพันธ์ที่มี ID ${id}:`,
            error
          );
          MySwal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถลบความสัมพันธ์ได้ กรุณาลองใหม่อีกครั้ง",
          });
        }
      }
    });
  };

  const handleEdit = (id) => {
    setSelectedRelationId(id);
    setIsEditModalOpen(true);
  };

  const columns = useMemo(
    () => [
      {
        Header: "รหัส",
        accessor: "id",
      },
      {
        Header: "ฤดูกาล",
        accessor: "season_name",
        Cell: ({ row }) => <span>{row.original.season_name}</span>,
      },
      {
        Header: "หน่วยงานท่องเที่ยว",
        accessor: "tourism_entity_name",
        Cell: ({ row }) => (
          <span>{`ID: ${row.original.tourism_entities_id}, ชื่อ: ${row.original.tourism_entity_name}`}</span>
        ),
      },
      {
        Header: "การกระทำ",
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => handleEdit(row.original.id)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out flex items-center gap-2"
            >
              <FaEdit />
              แก้ไข
            </button>
            <button
              onClick={() => handleDelete(row.original.id)}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300 ease-in-out flex items-center gap-2"
            >
              <FaTrashAlt />
              ลบ
            </button>
          </div>
        ),
      },
    ],
    [router]
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
      data: relations,
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
          ตารางความสัมพันธ์ระหว่างฤดูกาล
        </h1>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300 ease-in-out flex items-center gap-2"
          >
            <FaPlus />
            เพิ่มความสัมพันธ์ใหม่
          </button>
          <div className="flex items-center border border-gray-300 rounded-md p-2">
            <FaSearch className="text-gray-500 mr-2" />
            <input
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
            className="min-w-full bg-white border border-gray-200"
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
            className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 flex items-center gap-2"
          >
            <FaArrowLeft />
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
            className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 flex items-center gap-2"
          >
            ถัดไป
            <FaArrowRight />
          </button>
        </div>
      </div>

      {/* Modals */}
      <AddSeasonsRelationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      {selectedRelationId && (
        <EditSeasonsRelationModal
          id={selectedRelationId}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default SeasonsRelationIndexPage;
