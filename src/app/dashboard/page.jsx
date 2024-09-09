// src/app/dashboard/page.tsx
"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"
import {
  Chart as ChartJS,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement
} from "chart.js"

ChartJS.register(Title, ChartTooltip, Legend, ArcElement)

const DashboardPage = () => {
  const [visitorsData] = useState([
    { name: "Mon", visitors: 400 },
    { name: "Tue", visitors: 300 },
    { name: "Wed", visitors: 200 },
    { name: "Thu", visitors: 278 },
    { name: "Fri", visitors: 189 },
    { name: "Sat", visitors: 239 },
    { name: "Sun", visitors: 349 }
  ])

  const [categoryData] = useState([
    { name: "Attractions", value: 400 },
    { name: "Restaurants", value: 300 },
    { name: "Souvenir Shops", value: 200 },
    { name: "Accommodations", value: 100 }
  ])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Overview of the latest activities and stats.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Visitors Card */}
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-700">
              Total Visitors
            </h2>
            <p className="text-3xl font-bold text-blue-500 mt-4">1,234</p>
            <p className="text-gray-500 mt-2">Since last week</p>
          </div>

          {/* New Signups Card */}
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-700">New Signups</h2>
            <p className="text-3xl font-bold text-green-500 mt-4">456</p>
            <p className="text-gray-500 mt-2">Since last week</p>
          </div>

          {/* Revenue Card */}
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-700">Revenue</h2>
            <p className="text-3xl font-bold text-red-500 mt-4">$12,345</p>
            <p className="text-gray-500 mt-2">Since last week</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Bar Chart - Visitors per Day */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Visitors Per Day
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={visitorsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="visitors" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart - Categories Distribution */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Categories Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
