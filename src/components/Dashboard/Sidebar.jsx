"use client"
import React from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  HomeIcon,
  MapIcon,
  ClipboardIcon,
  CogIcon,
  ArrowRightOnRectangleIcon
} from "@heroicons/react/20/solid"

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    { name: "Dashboard", icon: HomeIcon, path: "/admin" },
    { name: "Manage Places", icon: MapIcon, path: "/admin/places" },
    { name: "Manage Content", icon: ClipboardIcon, path: "/admin/manage" },
    { name: "Settings", icon: CogIcon, path: "/admin/settings" }
  ]

  const handleLogout = () => {
    // Logic for logout
    router.push("/admin/login")
  }

  return (
    <aside className="w-64 bg-orange-500 text-white flex flex-col">
      <div className="p-6 font-bold text-xl">Admin Panel</div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`px-4 py-2 hover:bg-orange-600 cursor-pointer ${
                pathname === item.path ? "bg-orange-600" : ""
              }`}
              onClick={() => router.push(item.path)}
            >
              <item.icon className="inline-block w-5 h-5 mr-2" />
              {item.name}
            </li>
          ))}
        </ul>
      </nav>
      <button
        className="px-4 py-2 mt-auto bg-red-600 hover:bg-red-700 cursor-pointer"
        onClick={handleLogout}
      >
        <ArrowRightOnRectangleIcon className="inline-block w-5 h-5 mr-2" />
        Logout
      </button>
    </aside>
  )
}
