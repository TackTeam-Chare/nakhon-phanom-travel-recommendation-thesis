"use client"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { register } from "@/services/admin/auth"

const AdminRegister = () => {
  const {
    register: formRegister,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm()
  const [alert, setAlert] = useState({ type: "", message: "" })
  const router = useRouter()

  const handleRegister = async data => {
    if (data.password !== data.confirmPassword) {
      setAlert({ type: "error", message: "Passwords do not match!" })
      return
    }

    try {
      const response = await register(data)
      console.log("Register successful:", response)
      localStorage.setItem("token", response.token)
      setAlert({ type: "success", message: "Register successful!" })
      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
    } catch (error) {
      console.error("Register failed:", error)
      if (error.response && error.response.status === 400) {
        setAlert({
          type: "error",
          message: "Username already exists. Please choose another one."
        })
      } else {
        setAlert({
          type: "error",
          message: "Register failed. Please try again."
        })
      }
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Admin Register
        </h2>
        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit(handleRegister)}
        >
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              {...formRegister("username", { required: true })}
              id="username"
              className="block py-2.5 px-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="username"
              className={`absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-3 -z-10 origin-[0] peer-focus:left-3 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6 ${
                errors.username ? "scale-75 -translate-y-6" : ""
              }`}
            >
              Username
            </label>
            {errors.username && (
              <span className="text-red-500 text-sm">
                This field is required
              </span>
            )}
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="password"
              {...formRegister("password", { required: true })}
              id="password"
              className="block py-2.5 px-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="password"
              className={`absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-3 -z-10 origin-[0] peer-focus:left-3 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6 ${
                errors.password ? "scale-75 -translate-y-6" : ""
              }`}
            >
              Password
            </label>
            {errors.password && (
              <span className="text-red-500 text-sm">
                This field is required
              </span>
            )}
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="password"
              {...formRegister("confirmPassword", { required: true })}
              id="confirmPassword"
              className="block py-2.5 px-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="confirmPassword"
              className={`absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-3 -z-10 origin-[0] peer-focus:left-3 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6 ${
                errors.confirmPassword ? "scale-75 -translate-y-6" : ""
              }`}
            >
              Confirm Password
            </label>
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">
                This field is required
              </span>
            )}
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              {...formRegister("name", { required: true })}
              id="name"
              className="block py-2.5 px-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="name"
              className={`absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-3 -z-10 origin-[0] peer-focus:left-3 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6 ${
                errors.name ? "scale-75 -translate-y-6" : ""
              }`}
            >
              Name
            </label>
            {errors.name && (
              <span className="text-red-500 text-sm">
                This field is required
              </span>
            )}
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
            >
              Register
            </button>
          </div>
          {alert.message && (
            <div
              className={`${
                alert.type === "success"
                  ? "bg-green-100 border-green-400 text-green-700"
                  : "bg-red-100 border-red-400 text-red-700"
              } border px-4 py-3 rounded relative mb-4`}
              role="alert"
            >
              <span className="block sm:inline">{alert.message}</span>
            </div>
          )}
        </form>
      </div>
    </section>
  )
}

export default AdminRegister
