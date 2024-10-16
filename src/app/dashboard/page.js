"use client";

import { useEffect, useState } from "react";
import {
  getEntityCounts,
} from "@/services/admin/dashboard/index";

const DashboardPage = () => {
  const [entityCounts, setEntityCounts] = useState({
    total_tourist_spots: 0,
    total_accommodations: 0,
    total_restaurants: 0,
    total_souvenir_shops: 0,
  });

  useEffect(() => {
    // Fetch data from the backend based on view type (day/week/month/year)
    const fetchData = async () => {
      try {
        const entities = await getEntityCounts();
        setEntityCounts(entities);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []); // Update data when view type changes


  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">แดชบอร์ด</h1>
          <p className="text-gray-600 mt-2">ภาพรวมของกิจกรรมและสถิติทั้งหมดในระบบ</p>
        </div>

    

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
     

          {/* Total Attractions Card */}
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-700">สถานที่ท่องเที่ยวทั้งหมด</h2>
            <p className="text-3xl font-bold text-green-500 mt-4">{entityCounts.total_tourist_spots}</p>
            <p className="text-gray-500 mt-2">ในระบบ</p>
          </div>

          {/* Total Accommodations Card */}
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-700">ที่พักทั้งหมด</h2>
            <p className="text-3xl font-bold text-orange-500 mt-4">{entityCounts.total_accommodations}</p>
            <p className="text-gray-500 mt-2">ในระบบ</p>
          </div>

          {/* Total Restaurants Card */}
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-700">ร้านอาหารทั้งหมด</h2>
            <p className="text-3xl font-bold text-red-500 mt-4">{entityCounts.total_restaurants}</p>
            <p className="text-gray-500 mt-2">ในระบบ</p>
          </div>

          {/* Total Souvenir Shops Card */}
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-700">ร้านค้าของฝากทั้งหมด</h2>
            <p className="text-3xl font-bold text-purple-500 mt-4">{entityCounts.total_souvenir_shops}</p>
            <p className="text-gray-500 mt-2">ในระบบ</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;