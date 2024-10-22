"use client";

import { useEffect, useState } from "react";
import { getEntityCounts } from "@/services/admin/dashboard/index";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from "recharts";

const DashboardPage = () => {
  const [entityCounts, setEntityCounts] = useState({
    total_tourist_spots: 0,
    total_accommodations: 0,
    total_restaurants: 0,
    total_souvenir_shops: 0,
    total_all_places: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const entities = await getEntityCounts();
        setEntityCounts(entities);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const chartData = [
    { name: "สถานที่ท่องเที่ยว", value: entityCounts.total_tourist_spots, color: "#0088FE" },
    { name: "ที่พัก", value: entityCounts.total_accommodations, color: "#00C49F" },
    { name: "ร้านอาหาร", value: entityCounts.total_restaurants, color: "#FFBB28" },
    { name: "ร้านค้าของฝาก", value: entityCounts.total_souvenir_shops, color: "#FF8042" },
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">แดชบอร์ดภาพรวมของระบบ</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
  <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-center items-center text-center">
    <h2 className="text-xl font-semibold text-gray-700">สถานที่ท่องเที่ยว</h2>
    <p className="text-3xl font-bold text-green-500 mt-4">{entityCounts.total_tourist_spots}</p>
    <p className="text-gray-500 mt-2">ในระบบ</p>
  </div>

  <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-center items-center text-center">
    <h2 className="text-xl font-semibold text-gray-700">ที่พัก</h2>
    <p className="text-3xl font-bold text-orange-500 mt-4">{entityCounts.total_accommodations}</p>
    <p className="text-gray-500 mt-2">ในระบบ</p>
  </div>

  <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-center items-center text-center">
    <h2 className="text-xl font-semibold text-gray-700">ร้านอาหาร</h2>
    <p className="text-3xl font-bold text-red-500 mt-4">{entityCounts.total_restaurants}</p>
    <p className="text-gray-500 mt-2">ในระบบ</p>
  </div>

  <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-center items-center text-center">
    <h2 className="text-xl font-semibold text-gray-700">ร้านค้าของฝาก</h2>
    <p className="text-3xl font-bold text-purple-500 mt-4">{entityCounts.total_souvenir_shops}</p>
    <p className="text-gray-500 mt-2">ในระบบ</p>
  </div>

  <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-center items-center text-center">
    <h2 className="text-xl font-semibold text-gray-700">จำนวนสถานที่ทั้งหมด</h2>
    <p className="text-3xl font-bold text-blue-500 mt-4">{entityCounts.total_all_places}</p>
    <p className="text-gray-500 mt-2">ในระบบ</p>
  </div>
</div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">จำนวนสถานที่ตามประเภท (BarChart)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList dataKey="value" position="top" formatter={(value) => `จำนวน: ${value}`} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
