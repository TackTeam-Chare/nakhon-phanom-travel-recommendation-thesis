"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { getPlaces, getFetchTourismDataByCategory } from "@/services/admin/get";
import { deletePlace } from "@/services/admin/delete";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import AddPlacesModal from "@/components/Dashboard/Modal/Add/AddPlacesModal";
import EditPlaceModal from "@/components/Dashboard/Modal/Edit/EditPlaceModal";
import PlaceDetailsModal from "@/components/Dashboard/Modal/View/PlaceDetailsModal";

const MySwal = withReactContent(Swal);

const FontAwesomeIcon = dynamic(() =>
  import("@fortawesome/react-fontawesome").then((mod) => mod.FontAwesomeIcon),
  { ssr: false }
);

import {
  faPlus,
  faEdit,
  faTrash,
  faSearch,
  faArrowLeft,
  faArrowRight,
  faMapMarkerAlt,
  faSnowflake,
  faCheckCircle,
  faTimesCircle,
  faChevronDown,
  faChevronUp 
} from "@fortawesome/free-solid-svg-icons";

const PlaceIndexPage = () => {
  const [places, setPlaces] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailsPlaceId, setDetailsPlaceId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editPlaceId, setEditPlaceId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        if (selectedCategory !== null) {
          const result = await getFetchTourismDataByCategory(selectedCategory);
          setPlaces(result);
        } else {
          const result = await getPlaces();
          setPlaces(result);
        }
      } catch (err) {
        MySwal.fire("Error", "เกิดข้อผิดพลาดในการดึงข้อมูลสถานที่", "error");
      }
    };

    fetchPlaces();
  }, [selectedCategory]);

  const handleDelete = useCallback(async (id) => {
    const result = await MySwal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการลบสถานที่นี้ใช่ไหม?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      try {
        await deletePlace(id);
        setPlaces((prevPlaces) => prevPlaces.filter((place) => place.id !== id));
        MySwal.fire("ลบสำเร็จ!", "สถานที่ถูกลบแล้ว.", "success");
      } catch (error) {
        console.error(`Error deleting place with ID ${id}:`, error);
        MySwal.fire("Error", "เกิดข้อผิดพลาดในการลบสถานที่ กรุณาลองใหม่อีกครั้ง", "error");
      }
    }
  }, []);

  const handleCategoryChange = (event) => {
    const categoryId = parseInt(event.target.value, 10);
    setSelectedCategory(categoryId);
  };

  // ฟังก์ชันสำหรับอัปเดตสถานที่ใหม่
  const handleUpdatePlaces = async () => {
    const result = await getPlaces();
    setPlaces(result);
  };

  const columns = useMemo(
    () => [
      {
        Header: "รหัส",
        accessor: "id",
        Cell: ({ cell: { value } }) => (
          <span>
            <FontAwesomeIcon icon={faArrowRight} className="mr-2" />
            {value}
          </span>
        ),
      },
      {
        Header: "ชื่อ",
        accessor: "name",
        Cell: ({ cell: { value } }) => (
          <span className="font-bold text-lg">
            {value}
          </span>
        ),
      },
      {
        Header: "ฤดูกาล",
        accessor: "season_name",
        Cell: ({ cell: { value } }) => (
          <span>
            <FontAwesomeIcon icon={faSnowflake} className="mr-2" />
            {Array.isArray(value) ? value.join(", ") : "ไม่มีข้อมูลฤดูกาล"}
          </span>
        ),
      },
      {
        Header: "อำเภอ",
        accessor: "district_name",
        Cell: ({ cell: { value } }) => (
          <span>
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
            {value}
          </span>
        ),
      },
      {
        Header: "สถานะ",
        accessor: "published",
        Cell: ({ cell: { value } }) => (
          <span className={value ? "text-green-600" : "text-red-600"}>
            <FontAwesomeIcon
              icon={value ? faCheckCircle : faTimesCircle}
              className="mr-2"
            />
            {value ? "เผยแพร่เเล้ว" : "ไม่เผยแพร่"}
          </span>
        ),
      },
      {
        Header: "การดำเนินการ",
        Cell: ({ row }) => (
          <div className="flex space-x-2">
           <button
            onClick={() => {
              setDetailsPlaceId(row.original.id);
              setIsDetailsModalOpen(true);
            }}
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition duration-300 ease-in-out flex items-center"
          >
            <FontAwesomeIcon icon={faSearch} className="mr-2" />
            ดู
          </button>
            <button
              onClick={() => {
                setEditPlaceId(row.original.id.toString());
                setIsEditModalOpen(true);
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
        ),
      },
    ],
    [router, handleDelete]
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
    state: { pageIndex, globalFilter },
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data: places,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-8 text-center text-orange-600">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
          สถานที่
        </h1>

        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300 ease-in-out flex items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            เพิ่มสถานที่ใหม่
          </button>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <select
                value={selectedCategory || ""}
                onChange={handleCategoryChange}
                className="p-2 border border-gray-300 rounded-md appearance-none cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <option value="">-- เลือกประเภทสถานที่ --</option>
                <option value="1">สถานที่ท่องเที่ยว</option>
                <option value="2">ที่พัก</option>
                <option value="3">ร้านอาหาร</option>
                <option value="4">ร้านค้าของฝาก</option>
              </select>
              <FontAwesomeIcon
                icon={isDropdownOpen ? faChevronUp : faChevronDown}
                className="absolute right-2 top-3 text-gray-600"
              />
            </div>

            <div className="relative">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                value={globalFilter || ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
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
      </div>
            
      <PlaceDetailsModal
        id={detailsPlaceId}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
      {isAddModalOpen && (
        <AddPlacesModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={handleUpdatePlaces}
        />
      )}

      {isEditModalOpen && editPlaceId && (
        <EditPlaceModal
          id={editPlaceId}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleUpdatePlaces}
        />
      )}
    </div>
  );
};

export default PlaceIndexPage;
