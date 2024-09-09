import React from "react"
import Header from "@/components/Dashboard/Header" // Import Header ของ Dashboard

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header สำหรับ Dashboard */}
      <Header />

      {/* Main content area */}
      <main className="flex-grow p-4 bg-gray-100">{children}</main>
    </div>
  )
}
