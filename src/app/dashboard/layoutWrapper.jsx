"use client"

import React from "react"
import Layout from "@/components/Layout"
import { usePathname } from "next/navigation"

export default function LayoutWrapper({ children }) {
  const pathname = usePathname()

  // Check if the current path is under the dashboard
  const isDashboard = pathname.startsWith("/dashboard")

  return (
    <>
      {/* Conditional rendering based on the path */}
      {isDashboard ? children : <Layout>{children}</Layout>}
    </>
  )
}
