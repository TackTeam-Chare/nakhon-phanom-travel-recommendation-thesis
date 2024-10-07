"use client";

import React from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// Dynamically import the Chatbot component with no SSR
const Chatbot = dynamic(() => import("@/components/Chatbot/Chatbot"), {
  ssr: false, // Ensure this component is client-side only
});

// Import Layout normally
import Layout from "@/components/layout";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  // Check if the current path is under the dashboard
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <>
      {/* Conditional rendering based on the path */}
      {isDashboard ? children : <Layout>{children}</Layout>}

      {/* Add the Chatbot component only on non-dashboard pages */}
      {!isDashboard && <Chatbot />}
    </>
  );
}
