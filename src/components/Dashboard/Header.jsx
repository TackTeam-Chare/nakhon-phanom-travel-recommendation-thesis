"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, Disclosure, Popover } from "@headlessui/react"
import {
  Bars3Icon,
  ChevronDownIcon,
  XMarkIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  MapIcon,
  ClockIcon,
  SunIcon,
  StarIcon,
  BuildingOfficeIcon,
  GiftIcon,
  ShoppingBagIcon,
  BuildingStorefrontIcon,
  ArrowLeftOnRectangleIcon,
  CalendarIcon,
  CubeIcon,
  UserIcon
} from "@heroicons/react/20/solid"

import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { logout } from "@/services/admin/auth"
import ProfileAccount from "@/components/Dashboard/Modal/Profile/ProfileAccount" // Import the ProfileAccount modal
import { FaUser } from "react-icons/fa"
import AdminStatus from "@/components/Dashboard/AdminStatus";

const MySwal = withReactContent(Swal)

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false) // State to control the profile modal visibility
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    const result = await MySwal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการออกจากระบบใช่ไหม?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, ออกจากระบบ",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        await logout();
        // ลบ token, session และ cookies
        localStorage.removeItem("token");
        sessionStorage.clear();
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // ลบ cookies (token)
        MySwal.fire("ออกจากระบบแล้ว!", "คุณออกจากระบบสำเร็จ", "success");
        router.push("/auth/login");
      } catch (error) {
        console.error("Error logging out:", error);
        setLoading(false);
        MySwal.fire(
          "เกิดข้อผิดพลาด!",
          "ไม่สามารถออกจากระบบได้ กรุณาลองอีกครั้ง",
          "error"
        );
      }
    }
  };

  return (
    <>
      <header className="bg-orange-500 text-white shadow-md p-4">
        <div className="container mx-auto flex flex-wrap items-center justify-between px-4 md:px-6 lg:px-8 xl:px-12">
          <div className="flex flex-1 items-center space-x-3 sm:space-x-4 md:space-x-6 lg:space-x-8">
            {/* Logo */}
            <div
              className="text-2xl md:text-4xl font-bold cursor-pointer whitespace-nowrap"
              onClick={() => router.push("/dashboard")}
            >
              ผู้ดูเเลระบบ
            </div>
            {/* Admin Status */}
            <AdminStatus />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {[
              { href: "/dashboard", icon: HomeIcon, text: "หน้าเเรก" },
              {
                href: "/dashboard/search",
                icon: MagnifyingGlassIcon,
                text: "ค้นหาสถานที่"
              }
            ].map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="flex items-center text-lg hover:text-white text-white border border-white-500 bg-transparent hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105 rounded-lg px-3 py-2"
              >
                <item.icon className="h-5 w-5 mr-1" />
                {item.text}
              </a>
            ))}

            {/* Place Management Dropdown */}
            <Popover className="relative">
              <Popover.Button className="flex items-center text-lg hover:text-white text-white border border-white-500 bg-transparent hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105 rounded-lg px-3 py-2">
                <MapIcon className="h-5 w-5 mr-2" />
                สถานที่
                <ChevronDownIcon className="ml-1 h-5 w-5" />
              </Popover.Button>
              <Popover.Panel className="absolute left-0 z-10 mt-2 w-56 rounded-lg bg-orange-500 text-white shadow-lg">
                <div className="py-2">
                  {[
                    {
                      href: "/dashboard/table/currently-open-places",
                      icon: ClockIcon,
                      text: "เปิดในขณะนี้"
                    },
                    {
                      href: "/dashboard/table/season-real-time",
                      icon: SunIcon,
                      text: "ฤดูกาลนี้"
                    },
                    {
                      href: "/places",
                      icon: BuildingOfficeIcon,
                      text: "สถานที่ทั้งหมด"
                    },
                    {
                      href: "/dashboard/table/tourist-attractions",
                      icon: MapIcon,
                      text: "สถานที่ท่องเที่ยว"
                    },
                    {
                      href: "/dashboard/table/accommodations",
                      icon: BuildingStorefrontIcon,
                      text: "ที่พัก"
                    },
                    {
                      href: "/dashboard/table/restaurants",
                      icon: GiftIcon,
                      text: "ร้านอาหาร"
                    },
                    {
                      href: "/dashboard/table/souvenir-shops",
                      icon: ShoppingBagIcon,
                      text: "ร้านค้าของฝาก"
                    }
                  ].map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      className="flex items-center rounded-lg py-2 px-4 hover:bg-orange-600 hover:text-white transition duration-300 ease-in-out transform hover:scale-105"
                    >
                      <item.icon className="h-5 w-5 mr-2" />
                      {item.text}
                    </a>
                  ))}
                </div>
              </Popover.Panel>
            </Popover>

            {/* Data Management Dropdown */}
            <Popover className="relative">
              <Popover.Button className="flex items-center text-lg text-white border border-white-500 bg-transparent hover:text-white hover:bg-orange-600 transition duration-300 transform hover:scale-105 rounded-lg px-3 py-2">
                <CalendarIcon className="h-5 w-5 mr-2" />
                การจัดการข้อมูล
                <ChevronDownIcon className="ml-1 h-5 w-5" />
              </Popover.Button>
              <Popover.Panel className="absolute left-0 z-10 mt-2 w-56 rounded-lg bg-orange-500 text-white shadow-lg">
                <div className="py-2">
                  {[
                    {
                      href: "/dashboard/table/categories",
                      icon: ClockIcon,
                      text: "ตารางหมวดหมู่สถานที่"
                    },
                    {
                      href: "/dashboard/table/districts",
                      icon: SunIcon,
                      text: "ตารางอำเภอ"
                    },
                    {
                      href: "/dashboard/table/operating-hours",
                      icon: CubeIcon,
                      text: "ตารางเวลาทำการสถานที่"
                    },
                    {
                      href: "/dashboard/table/seasons",
                      icon: StarIcon,
                      text: "ตารางฤดูกาล"
                    },
                    {
                      href: "/dashboard/table/seasons-relation",
                      icon: MapIcon,
                      text: "ตารางความสัมพันธ์ฤดูกาล"
                    },
                    {
                      href: "/dashboard/table/tourism-entities-images",
                      icon: CalendarIcon,
                      text: "ตารางรูปภาพของสถานที่"
                    },
                    {
                      href: "/dashboard/table/tourist-entities",
                      icon: BuildingOfficeIcon,
                      text: "ตารางสถานที่"
                    }
                  ].map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      className="flex items-center rounded-lg py-2 px-4 hover:bg-orange-600 hover:text-white transition duration-300 ease-in-out transform hover:scale-105"
                    >
                      <item.icon className="h-5 w-5 mr-2" />
                      {item.text}
                    </a>
                  ))}
                </div>
              </Popover.Panel>
            </Popover>

            {/* Profile Account Modal Trigger Button */}
            <button
              // Set the modal open state to true
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center text-lg hover:text-white text-white border border-white-500 bg-transparent hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105 rounded-lg px-3 py-2"
            >
              <UserIcon className="h-5 w-5 mr-1" />
              ข้อมูลส่วนตัว
            </button>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={loading}
              className="flex items-center text-lg hover:text-white text-white border border-white-500 bg-transparent hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105 rounded-lg px-3 py-2"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-1" />
              ออกจากระบบ
            </button>
            
          </nav>

       {/* Mobile Menu Button */}
       <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="text-white hover:text-gray-200"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <Dialog
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          className="md:hidden z-50"
        >
          <div className="fixed inset-0 z-10 bg-black bg-opacity-30" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-20 w-full max-w-sm overflow-y-auto bg-orange-500 text-white px-6 py-6 sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="/" className="text-3xl sm:text-4xl font-bold">
                ระบบผู้ดูเเล
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6 space-y-4">
              {[
                { href: "/", icon: HomeIcon, text: "หน้าเเรก" },
                { href: "/search", icon: MagnifyingGlassIcon, text: "ค้นหาสถานที่" },
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center text-lg text-white border border-white-500 bg-transparent hover:bg-orange-600 rounded-md px-4 py-2 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.text}
                </a>
              ))}

              {/* Mobile Place Management Dropdown */}
              <Disclosure as="div">
                <Disclosure.Button className="group flex justify-center items-center w-full rounded-lg py-2 px-4 text-lg hover:text-white text-white border border-white-500 bg-transparent hover:bg-orange-600 duration-300 ease-in-out transform hover:scale-105">
                  <MapIcon className="h-5 w-5 mr-2" />
                  สถานที่
                  <ChevronDownIcon className="h-5 w-5 group-data-[open]:rotate-180 transition duration-300 ease-in-out" />
                </Disclosure.Button>

                <Disclosure.Panel className="mt-2 space-y-2">
                  {[
                    {
                      href: "/dashboard/table/currently-open-places",
                      icon: ClockIcon,
                      text: "เปิดในขณะนี้",
                    },
                    {
                      href: "/dashboard/table/season-real-time",
                      icon: SunIcon,
                      text: "ฤดูกาลนี้",
                    },
                    {
                      href: "/places",
                      icon: BuildingOfficeIcon,
                      text: "สถานที่ทั้งหมด",
                    },
                    {
                      href: "/dashboard/table/tourist-attractions",
                      icon: MapIcon,
                      text: "สถานที่ท่องเที่ยว",
                    },
                    {
                      href: "/dashboard/table/accommodations",
                      icon: BuildingStorefrontIcon,
                      text: "ที่พัก",
                    },
                    {
                      href: "/dashboard/table/restaurants",
                      icon: GiftIcon,
                      text: "ร้านอาหาร",
                    },
                    {
                      href: "/dashboard/table/souvenir-shops",
                      icon: ShoppingBagIcon,
                      text: "ร้านค้าของฝาก",
                    },
                  ].map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      className="flex justify-center items-center text-lg text-white border border-white-500 bg-transparent hover:bg-orange-600 rounded-md px-4 py-2 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                      <item.icon className="h-5 w-5 mr-2" />
                      {item.text}
                    </a>
                  ))}
                </Disclosure.Panel>
              </Disclosure>

              {/* Mobile Data Management Dropdown */}
              <Disclosure as="div">
                <Disclosure.Button className="group flex justify-center items-center w-full rounded-lg py-2 px-4 text-lg hover:text-white text-white border border-white-500 bg-transparent hover:bg-orange-600 duration-300 ease-in-out transform hover:scale-105">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  การจัดการข้อมูล
                  <ChevronDownIcon className="h-5 w-5 group-data-[open]:rotate-180 transition duration-300 ease-in-out" />
                </Disclosure.Button>
                <Disclosure.Panel className="mt-2 space-y-2">
                  {[
                    {
                      href: "/dashboard/table/categories",
                      icon: ClockIcon,
                      text: "ตารางหมวดหมู่สถานที่",
                    },
                    {
                      href: "/dashboard/table/districts",
                      icon: SunIcon,
                      text: "ตารางอำเภอ",
                    },
                    {
                      href: "/dashboard/table/operating-hours",
                      icon: CubeIcon,
                      text: "ตารางเวลาทำการสถานที่",
                    },
                    {
                      href: "/dashboard/table/seasons",
                      icon: StarIcon,
                      text: "ตารางฤดูกาล",
                    },
                    {
                      href: "/dashboard/table/seasons-relation",
                      icon: MapIcon,
                      text: "ตารางความสัมพันธ์ฤดูกาล",
                    },
                    {
                      href: "/dashboard/table/tourism-entities-images",
                      icon: CalendarIcon,
                      text: "ตารางรูปภาพของสถานที่",
                    },
                    {
                      href: "/dashboard/table/tourist-entities",
                      icon: BuildingOfficeIcon,
                      text: "ตารางสถานที่",
                    },
                  ].map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      className="flex justify-center items-center text-lg text-white border border-white-500 bg-transparent hover:bg-orange-600 rounded-md px-4 py-2 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                      <item.icon className="h-5 w-5 mr-2" />
                      {item.text}
                    </a>
                  ))}
                </Disclosure.Panel>
              </Disclosure>
              <button
                onClick={() => setIsProfileOpen(true)}
                className="group flex w-full items-center justify-center rounded-lg py-2 px-4 text-lg hover:text-white text-white border border-white-500 bg-transparent hover:bg-orange-600 duration-300 ease-in-out transform hover:scale-105"
              >
                <FaUser className="h-5 w-5 mr-2" />
                ข้อมูลส่วนตัว
              </button>

              {/* Logout Button for Mobile */}
              <button
                type="button"
                onClick={handleLogout}
                className={`flex items-center justify-center w-full text-lg text-white bg-transparent border-2 border-white hover:bg-white hover:text-orange-500 transition duration-300 ease-in-out transform hover:scale-105 rounded-full px-4 py-2 shadow-md ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <ArrowLeftOnRectangleIcon className="h-6 w-6 mr-2" />
                {loading ? "Logging out..." : "ออกจากระบบ"}
              </button>
            </div>
          </Dialog.Panel>
        </Dialog>


        {/* Profile Modal */}
        <ProfileAccount
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      </header>
    </>
  )
}
