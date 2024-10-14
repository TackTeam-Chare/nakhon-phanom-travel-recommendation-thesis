import React from "react"
import dynamic from "next/dynamic";
import Header from "@/components/Dashboard/Header"
import Footer from "@/components/Dashboard/Footer"
// // Dynamically import the Chatbot component with no SSR
const Chatbot = dynamic(() => import("@/components/Dashboard/Chatbot/Chatbot"), {
  ssr: false, // Ensure this component is client-side only
});

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">  
      {/* Header สำหรับ Dashboard */}
      <Header />

      {/* Main content area */}
      <main className="flex-grow  bg-gray-100">
        {children}
      </main>
      <Chatbot />
      {/* Footer */}
      <Footer />
    </div>
  )
}
