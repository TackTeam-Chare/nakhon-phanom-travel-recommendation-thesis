"use client"
import { useState } from "react"
import { Dialog, Disclosure, Popover } from "@headlessui/react"
import {
  Bars3Icon,
  ChevronDownIcon,
  XMarkIcon,
  HomeIcon,
  MapIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  SunIcon,
  StarIcon,
  BuildingOfficeIcon,
  GiftIcon,
  ShoppingBagIcon,
  BuildingStorefrontIcon,
  UserIcon
} from "@heroicons/react/20/solid"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-orange-500 text-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center px-4 md:px-8">
        <div className="flex items-center space-x-4 md:space-x-10">
          <div className="text-2xl md:text-4xl font-bold">นครพนม</div>
        </div>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          {[
            { href: "/", icon: HomeIcon, text: "หน้าเเรก" },
            { href: "/search", icon: MagnifyingGlassIcon, text: "ค้นหาสถานที่" }
          ].map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="flex items-center text-lg hover:text-white hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105 rounded-lg px-3 py-2"
            >
              <item.icon className="h-5 w-5 mr-1" />
              {item.text}
            </a>
          ))}
          <Popover className="relative">
            <Popover.Button className="flex items-center text-lg hover:text-white hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105 rounded-lg px-3 py-2">
              <MapIcon className="h-5 w-5 mr-2" />
              สถานที่
              <ChevronDownIcon className="h-5 w-5 group-data-[open]:rotate-180 transition duration-300 ease-in-out" />
            </Popover.Button>
            <Popover.Panel className="absolute left-0 z-10 mt-2 w-56 rounded-lg bg-orange-500 text-white shadow-lg">
              <div className="py-2">
                {[
                  {
                    href: "/places/currently-open-places",
                    icon: ClockIcon,
                    text: "เปิดในขณะนี้"
                  },
                  {
                    href: "/places/season-real-time",
                    icon: SunIcon,
                    text: "ฤดูกาลนี้"
                  },
                  {
                    href: "/places/top-rated-tourist-entities",
                    icon: StarIcon,
                    text: "ติดอันดับ"
                  },
                  {
                    href: "/places",
                    icon: BuildingOfficeIcon,
                    text: "สถานที่ทั้งหมด"
                  },
                  {
                    href: "/places/tourist-attractions",
                    icon: SunIcon,
                    text: "สถานที่ท่องเที่ยว"
                  },
                  {
                    href: "/places/accommodations",
                    icon: BuildingStorefrontIcon,
                    text: "ที่พัก"
                  },
                  {
                    href: "/places/restaurants",
                    icon: GiftIcon,
                    text: "ร้านอาหาร"
                  },
                  {
                    href: "/places/souvenir-shops",
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
          <a
            href="/auth/login"
            className="flex items-center text-lg hover:text-white text-white border border-white-500 bg-transparent hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105 rounded-lg px-3 py-2"
          >
            <UserIcon className="h-5 w-5 mr-2" />
            เข้าสู่ระบบเเอดมิน
          </a>
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
            <a href="/" className="text-4xl font-bold">
              นครพนม
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
              {
                href: "/search",
                icon: MagnifyingGlassIcon,
                text: "ค้นหาสถานที่"
              }
            ].map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="flex items-center text-lg text-white hover:bg-orange-600 rounded-md px-4 py-2 transition duration-300 ease-in-out transform hover:scale-105"
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.text}
              </a>
            ))}
            <Disclosure as="div">
            <Disclosure.Button className="group flex w-full items-start  justify-start rounded-lg py-2 px-4 text-lg hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105">
  <MapIcon className="h-5 w-5 mr-2" />
  สถานที่
  <ChevronDownIcon className="h-5 w-5 mr-2 group-data-[open]:rotate-180 transition duration-300 ease-in-out" />
</Disclosure.Button>

              <Disclosure.Panel className="mt-2 space-y-2">
                {[
                  {
                    href: "/places/currently-open-places",
                    icon: ClockIcon,
                    text: "เปิดในขณะนี้"
                  },
                  {
                    href: "/places/season-real-time",
                    icon: SunIcon,
                    text: "ฤดูกาลนี้"
                  },
                  {
                    href: "/places/top-rated-tourist-entities",
                    icon: StarIcon,
                    text: "ติดอันดับ"
                  },
                  {
                    href: "/places",
                    icon: BuildingOfficeIcon,
                    text: "สถานที่ทั้งหมด"
                  },
                  {
                    href: "/places/tourist-attractions",
                    icon: SunIcon,
                    text: "สถานที่ท่องเที่ยว"
                  },
                  {
                    href: "/places/accommodations",
                    icon: BuildingStorefrontIcon,
                    text: "ที่พัก"
                  },
                  {
                    href: "/places/restaurants",
                    icon: GiftIcon,
                    text: "ร้านอาหาร"
                  },
                  {
                    href: "/places/souvenir-shops",
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
              </Disclosure.Panel>
            </Disclosure>
            <a
              href="/auth/login"
              className="flex items-center text-lg hover:text-white text-white border border-white-500 bg-transparent hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105 rounded-lg px-3 py-2"
            >
              <UserIcon className="h-5 w-5 mr-2" />
              เข้าสู่ระบบเเอดมิน
            </a>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}
