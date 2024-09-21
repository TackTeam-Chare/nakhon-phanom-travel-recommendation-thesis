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
    <div className="flex items-center space-x-2 p-1 bg-orange-500 rounded-md md:space-x-3 md:p-2 lg:p-3">
      <FaUser className="text-white h-5 w-5 lg:h-6 lg:w-6" />
      <div>
        <p className="text-white font-bold text-4xl md:text-xl lg:text-lg ">
          {adminName}
        </p>
        <div className="flex items-center">
          <FaCircle
            className={`h-2 w-2 mr-1 ${
              onlineStatus ? "text-green-500" : "text-red-500"
            }`}
          />
          <span className="text-xl text-gray-300">
            {onlineStatus ? "ออนไลน์" : "ออฟไลน์"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminStatus;
