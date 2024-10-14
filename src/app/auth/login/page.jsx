"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { login } from "../../../services/admin/auth";
import { FaUser, FaLock } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Cookies from "js-cookie";

const MySwal = withReactContent(Swal);

const AdminLogin = () => {
  const router = useRouter();

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const response = await login(data); // `data` contains `username` and `password`
      console.log("Login successful:", response);

      // Store token in cookies
      Cookies.set("token", response.token, { expires: 7 }); // Token lasts for 7 days

      MySwal.fire({
        icon: "success",
        title: "เข้าสู่ระบบสำเร็จ!",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        router.push("/dashboard"); // Redirect to dashboard
      });
    } catch (error) {
      console.error("Login failed:", error);
      MySwal.fire({
        icon: "error",
        title: "เข้าสู่ระบบล้มเหลว",
        text: "กรุณาลองอีกครั้ง",
      });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-col lg:flex-row bg-white rounded-xl shadow-2xl overflow-hidden max-w-5xl w-full">
        {/* Banner Content */}
        <div className="lg:w-1/2 flex flex-col justify-center items-center bg-gradient-to-r from-Orange-500 to-Orange-600 text-white p-8">
          <div className="flex flex-col items-center text-center">
            <Image
              src="/logo/logo.png"
              alt="ตราประจำจังหวัดของจังหวัดนครพนม"
              width={100}
              height={100}
              className="mb-4"
            />
            <h1 className="text-3xl font-bold mb-2">สำหรับผู้ดูแลระบบ</h1>
            <p className="mb-4 text-lg">
              เว็บแอปพลิเคชันแนะนำการท่องเที่ยวและร้านค้าในบริเวณใกล้เคียง
            </p>
            <p className="text-sm max-w-xs">
              Web Application Recommends Travel And Shops In Nearby Tourist
              Attractions In Nakhon Phanom Province
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="lg:w-1/2 p-8 bg-gray-50 flex flex-col justify-center">
          <h2 className="text-center text-2xl font-bold text-gray-700 mb-6">
            สำหรับผู้ดูแลระบบ
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="relative z-0 w-full mb-6 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                name="username"
                id="username"
                className={`block py-3 pl-10 pr-4 w-full text-sm text-gray-900 bg-white border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-Orange-500 focus:border-transparent transition duration-300 ease-in-out`}
                placeholder="ชื่อผู้ใช้"
                {...register("username", { required: "กรุณากรอกชื่อผู้ใช้" })}
              />
              {errors.username && (
                <span className="text-red-500 text-sm">{errors.username.message}</span>
              )}
              
            </div>

            <div className="relative z-0 w-full mb-6 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                id="password"
                className={`block py-3 pl-10 pr-4 w-full text-sm text-gray-900 bg-white border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-Orange-500 focus:border-transparent transition duration-300 ease-in-out`}
                placeholder="รหัสผ่าน"
                {...register("password", { required: "กรุณากรอกรหัสผ่าน" })}
              />
              {errors.password && (
                <span className="text-red-500 text-sm">{errors.password.message}</span>
              )}
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-Orange-600 focus:ring-Orange-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  จดจำอุปกรณ์นี้
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-Orange-600 hover:bg-Orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-Orange-500 transition duration-300 ease-in-out"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;
