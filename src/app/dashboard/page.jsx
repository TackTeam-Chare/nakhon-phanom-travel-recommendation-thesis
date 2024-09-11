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

const DashboardPage = () => {
  const [visitorsData] = useState([
    { name: "จันทร์", visitors: 400 },
    { name: "อังคาร", visitors: 300 },
    { name: "พุธ", visitors: 200 },
    { name: "พฤหัสบดี", visitors: 278 },
    { name: "ศุกร์", visitors: 189 },
    { name: "เสาร์", visitors: 239 },
    { name: "อาทิตย์", visitors: 349 }
  ])

  const [categoryData] = useState([
    { name: "สถานที่ท่องเที่ยว", value: 400 },
    { name: "ร้านอาหาร", value: 300 },
    { name: "ร้านค้าของฝาก", value: 200 },
    { name: "ที่พัก", value: 100 }
  ])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">แดชบอร์ด</h1>
          <p className="text-gray-600 mt-2">
            ภาพรวมของกิจกรรมและสถิติทั้งหมดในระบบ
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Visitors Card */}
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-700">ผู้เยี่ยมชมทั้งหมด</h2>
            <p className="text-3xl font-bold text-blue-500 mt-4">1,234</p>
            <p className="text-gray-500 mt-2">สถิติล่าสุด</p>
          </div>

          {/* Total Attractions Card */}
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-700">สถานที่ท่องเที่ยวทั้งหมด</h2>
            <p className="text-3xl font-bold text-green-500 mt-4">400</p>
            <p className="text-gray-500 mt-2">ในระบบ</p>
          </div>

          {/* Total Accommodations Card */}
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-700">ที่พักทั้งหมด</h2>
            <p className="text-3xl font-bold text-orange-500 mt-4">100</p>
            <p className="text-gray-500 mt-2">ในระบบ</p>
          </div>

          {/* Total Restaurants Card */}
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-700">ร้านอาหารทั้งหมด</h2>
            <p className="text-3xl font-bold text-red-500 mt-4">300</p>
            <p className="text-gray-500 mt-2">ในระบบ</p>
          </div>

          {/* Total Souvenir Shops Card */}
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-700">ร้านค้าของฝากทั้งหมด</h2>
            <p className="text-3xl font-bold text-purple-500 mt-4">200</p>
            <p className="text-gray-500 mt-2">ในระบบ</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Bar Chart - Visitors per Day */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              ผู้เยี่ยมชมต่อวัน
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
              การกระจายประเภทสถานที่
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
