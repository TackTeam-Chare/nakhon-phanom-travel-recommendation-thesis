"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getPlaceImages } from "@/services/admin/get";
import { deletePlaceImage } from "@/services/admin/delete";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import AddImagesModal from "@/components/Dashboard/Modal/Add/UploadImagesModal";
import EditImagesModal from "@/components/Dashboard/Modal/Edit/EditImagesModal";

const MySwal = withReactContent(Swal);

const ImagesIndexPage = () => {
  const [images, setImages] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editImageId, setEditImageId] = useState(null);

  const router = useRouter();

  // Fetching images
  const fetchImages = async () => {
    try {
      const imagesData = await getPlaceImages();
      setImages(imagesData);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลรูปภาพ:", error);
      MySwal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถดึงข้อมูลรูปภาพได้",
      });
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleDelete = async (id) => {
    MySwal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการลบรูปภาพนี้ใช่ไหม?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deletePlaceImage(id);
          setImages((prevImages) => prevImages.filter((image) => image.id !== id));
          MySwal.fire("ลบสำเร็จ!", "รูปภาพถูกลบแล้ว", "success");
        } catch (error) {
          console.error(`เกิดข้อผิดพลาดในการลบรูปภาพที่มี ID ${id}:`, error);
          MySwal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถลบรูปภาพได้ กรุณาลองใหม่อีกครั้ง",
          });
        }
      }
    });
  };

  const openEditModal = (id) => {
    setEditImageId(id);
    setIsEditModalOpen(true);
  };

  const columns = useMemo(
    () => [
      {
        Header: "รหัส",
        accessor: "id",
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
        ),
      },
      {
        Header: "สถานที่",
        accessor: "tourism_entities_id",
        Cell: ({ cell: { value }, row }) => (
          <span>{`${row.original.tourism_entity_name}`}</span>
        ),
      },
      {
        Header: "การจัดการข้อมูล",
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => openEditModal(row.original.id)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out flex items-center"
            >
              <FaEdit className="mr-2" /> แก้ไข
            </button>
            <button
              onClick={() => handleDelete(row.original.id)}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300 ease-in-out flex items-center"
            >
              <FaTrash className="mr-2" /> ลบ
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
      data: images,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { globalFilter, pageIndex } = state;

  // Refresh the images list after adding/editing
  const refreshImages = () => {
    fetchImages();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">รูปภาพทั้งหมด</h1>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300 ease-in-out flex items-center"
          >
            <FaPlus className="mr-2" /> เพิ่มรูปภาพใหม่
          </button>
          <div className="flex items-center border border-gray-300 rounded-md p-2">
            <FaSearch className="mr-2 text-gray-500" />
            <input
              value={globalFilter || ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="ค้นหา..."
              className="outline-none"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table
            {...getTableProps()}
            className="min-w-full bg-white border border-gray-200"
          >
            <thead className="bg-gray-100">
              {headerGroups.map((headerGroup, headerGroupIndex) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroupIndex}>
                  {headerGroup.headers.map((column, columnIndex) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      key={columnIndex}
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
              {page.map((row, rowIndex) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    key={row.original.id}
                    className="hover:bg-gray-100 transition duration-300 ease-in-out"
                  >
                    {row.cells.map((cell, cellIndex) => (
                      <td
                        {...cell.getCellProps()}
                        key={cellIndex}
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
            className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 flex items-center"
          >
            <FaArrowLeft className="mr-2" /> ก่อนหน้า
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
            ถัดไป <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <AddImagesModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            refreshImages(); // Refresh images after closing modal
          }}
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editImageId && (
        <EditImagesModal
          id={editImageId}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            refreshImages(); // Refresh images after closing modal
          }}
        />
      )}
    </div>
  );
};

export default ImagesIndexPage;
