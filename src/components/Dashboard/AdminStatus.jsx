"use client";
import { useEffect, useState } from "react";
import { FaCircle, FaUser } from "react-icons/fa";
import { parseCookies } from "nookies";

const AdminStatus = () => {
  const [adminName, setAdminName] = useState(
    "เเอดมินเว็บแนะนำการท่องเที่ยวจังหวัดนครพนม"
  );
  const [onlineStatus, setOnlineStatus] = useState(false);

  useEffect(() => {
    const cookies = parseCookies();
    const nameFromCookie =
      cookies.adminName || "เเอดมินเว็บแนะนำการท่องเที่ยวจังหวัดนครพนม";
    setAdminName(nameFromCookie);

    setOnlineStatus(true); // ตั้งเป็น true เพื่อแสดงว่า admin ออนไลน์
  }, []);

  return (
    <div className="flex items-center space-x-3 p-2 bg-orange-500 rounded-lg md:space-x-4 md:p-4 lg:p-6">
      <FaUser className="text-white h-6 w-6 lg:h-8 lg:w-8" />
      <div>
        <p className="text-white font-bold text-sm md:text-base lg:text-lg">
          {adminName}
        </p>
        <div className="flex items-center">
          <FaCircle
            className={`h-3 w-3 mr-1 ${
              onlineStatus ? "text-green-500" : "text-red-500"
            }`}
          />
          <span className="text-sm text-gray-300">
            {onlineStatus ? "ออนไลน์" : "ออฟไลน์"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminStatus;
