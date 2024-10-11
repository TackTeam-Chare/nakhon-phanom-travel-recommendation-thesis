"use client";

import { useEffect, useState } from "react";
import {
  getTotalVisitors,
  getVisitorsByDay,
  getVisitorsByWeek,
  getVisitorsByMonth,
  getVisitorsByYear,
  getEntityCounts,
} from "@/services/admin/dashboard/index";
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
  Cell,
} from "recharts";
import { format } from "date-fns";

const DashboardPage = () => {
  const [visitorsData, setVisitorsData] = useState([]);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [viewType, setViewType] = useState("day"); 
  const [entityCounts, setEntityCounts] = useState({
    total_tourist_spots: 0,
    total_accommodations: 0,
    total_restaurants: 0,
    total_souvenir_shops: 0,
  });

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    // Fetch data from the backend based on view type (day/week/month/year)
    const fetchData = async () => {
      try {
        const visitors = await getTotalVisitors();
        let visitorsData;
        if (viewType === "day") {
          visitorsData = await getVisitorsByDay();
        } else if (viewType === "week") {
          visitorsData = await getVisitorsByWeek();
        } else if (viewType === "month") {
          visitorsData = await getVisitorsByMonth();
        } else if (viewType === "year") {
          visitorsData = await getVisitorsByYear();
        }

        const entities = await getEntityCounts();

        setTotalVisitors(visitors);
        setVisitorsData(visitorsData); // Update visitors data based on the view
        setEntityCounts(entities);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, [viewType]); // Update data when view type changes

  const formatXAxisTick = (tick) => {
    const date = new Date(tick);
    
    // Ensure the date is valid
    if (isNaN(date.getTime())) {
      return ''; // Return an empty string for invalid dates
    }
  
    // Format the date based on the selected viewType
    if (viewType === "day") {
      return format(date, "dd/MM/yyyy");
    } else if (viewType === "week") {
      return format(date, "'Week of' MMM dd");
    } else if (viewType === "month") {
      return format(date, "MMMM yyyy");
    } else if (viewType === "year") {
      return format(date, "yyyy");
    }
    return '';
  };
  
  

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">แดชบอร์ด</h1>
          <p className="text-gray-600 mt-2">ภาพรวมของกิจกรรมและสถิติทั้งหมดในระบบ</p>
        </div>

        {/* View Type Selection */}
        <div className="mb-4">
          <label className="mr-4">ดูข้อมูล:</label>
          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="day">รายวัน</option>
            <option value="week">รายสัปดาห์</option>
            <option value="month">รายเดือน</option>
            <option value="year">รายปี</option>
          </select>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Visitors Card */}
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-700">ผู้เยี่ยมชมทั้งหมด</h2>
            <p className="text-3xl font-bold text-blue-500 mt-4">{totalVisitors}</p>
            <p className="text-gray-500 mt-2">สถิติล่าสุด</p>
          </div>

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
          {/* Bar Chart - Visitors per Time Range (Day/Week/Month/Year) */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              ผู้เยี่ยมชมต่อ{viewType === "day" ? "วัน" : viewType === "week" ? "สัปดาห์" : viewType === "month" ? "เดือน" : "ปี"}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={visitorsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
  dataKey="visit_date" 
  tickFormatter={formatXAxisTick || ((tick) => tick)} // If no tickFormatter is passed, use a default function
/>
<YAxis />

                <Tooltip />
                <Bar dataKey="visitor_count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart - Categories Distribution */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">การกระจายประเภทสถานที่</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "สถานที่ท่องเที่ยว", value: entityCounts.total_tourist_spots },
                    { name: "ที่พัก", value: entityCounts.total_accommodations },
                    { name: "ร้านอาหาร", value: entityCounts.total_restaurants },
                    { name: "ร้านค้าของฝาก", value: entityCounts.total_souvenir_shops }
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {[
                    { name: "สถานที่ท่องเที่ยว", value: entityCounts.total_tourist_spots },
                    { name: "ที่พัก", value: entityCounts.total_accommodations },
                    { name: "ร้านอาหาร", value: entityCounts.total_restaurants },
                    { name: "ร้านค้าของฝาก", value: entityCounts.total_souvenir_shops }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
