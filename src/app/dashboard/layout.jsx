import React from "react"
import Header from "@/components/Dashboard/Header"
import Footer from "@/components/Dashboard/Footer"

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">  
      {/* Header สำหรับ Dashboard */}
      <Header />

      {/* Main content area */}
      <main className="flex-grow  bg-gray-100">
        {children}
      </main>
      {/* Footer */}
      <Footer />
    </div>
  )
}
