import React from "react"

export default function DashboardPage() {
  return (
    <>
      <div className="container mx-auto p-4">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, here is an overview of your latest activities.
          </p>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-700">
              Total Visitors
            </h2>
            <p className="text-3xl font-bold text-blue-500 mt-4">1,234</p>
            <p className="text-gray-500 mt-2">Since last week</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-700">New Signups</h2>
            <p className="text-3xl font-bold text-green-500 mt-4">456</p>
            <p className="text-gray-500 mt-2">Since last week</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-700">Revenue</h2>
            <p className="text-3xl font-bold text-red-500 mt-4">$12,345</p>
            <p className="text-gray-500 mt-2">Since last week</p>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Recent Activities
          </h2>
          <div className="bg-white shadow-md rounded-lg p-6">
            <ul className="divide-y divide-gray-200">
              <li className="py-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-blue-500 text-white rounded-full p-2">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-700">New user signed up</p>
                    <p className="text-gray-500 text-sm">5 minutes ago</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">Details</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
