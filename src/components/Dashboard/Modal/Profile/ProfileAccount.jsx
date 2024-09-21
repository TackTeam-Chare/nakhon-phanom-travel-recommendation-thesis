import React, { useState, useEffect, Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { FaUser, FaLock, FaEye, FaEyeSlash, FaKey } from "react-icons/fa"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import Cookies from "js-cookie"
import { getProfile, updateProfile, verifyPassword } from "@/services/admin/auth"

const MySwal = withReactContent(Swal)

export default function ProfileAccount({ isOpen, onClose }) {
  const [username, setUsername] = useState("")
  const [name, setName] = useState("")
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [passwordVerified, setPasswordVerified] = useState(false)
  const [isPasswordChanging, setIsPasswordChanging] = useState(false) // สถานะการเปลี่ยนรหัสผ่าน
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get("token") // ดึง token จาก cookie
        if (!token) {
          setError("ไม่พบโทเค็น กรุณาเข้าสู่ระบบอีกครั้ง")
          return
        }
        const profile = await getProfile(token)
        setUsername(profile.username)
        setName(profile.name)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching profile:", error)
        setError("เกิดข้อผิดพลาดในการดึงข้อมูลโปรไฟล์")
      }
    }

    fetchProfile()
  }, [])

  const handleVerifyPassword = async e => {
    e.preventDefault()
    try {
      const token = Cookies.get("token") // ดึง token จาก cookie
      const response = await verifyPassword(
        { username, password: oldPassword },
        token
      )
      if (response.verified) {
        setPasswordVerified(true)
        MySwal.fire(
          "ยืนยันรหัสผ่านสำเร็จ",
          "คุณสามารถอัปเดตโปรไฟล์หรือเปลี่ยนรหัสผ่านได้",
          "success"
        )
      } else {
        MySwal.fire("เกิดข้อผิดพลาด", "รหัสผ่านปัจจุบันไม่ถูกต้อง", "error")
      }
    } catch (error) {
      console.error("Error verifying password:", error)
      setError("เกิดข้อผิดพลาดในการยืนยันรหัสผ่าน")
    }
  }

  const handleUpdateProfile = async e => {
    e.preventDefault()
    if (name === "" || username === "") {
      MySwal.fire(
        "เกิดข้อผิดพลาด",
        "ชื่อและชื่อผู้ใช้ไม่สามารถเว้นว่างได้",
        "error"
      )
      return
    }

    if (!passwordVerified) {
      MySwal.fire(
        "เกิดข้อผิดพลาด",
        "กรุณายืนยันรหัสผ่านก่อนทำการอัปเดตโปรไฟล์",
        "error"
      )
      return
    }

    try {
      const token = Cookies.get("token") // ดึง token จาก cookie
      await updateProfile({ username, name }, token)
      MySwal.fire("อัปเดตสำเร็จ", "ข้อมูลโปรไฟล์ได้รับการอัปเดตแล้ว", "success")
      resetState()
    } catch (error) {
      console.error("Error updating profile:", error)
      MySwal.fire("เกิดข้อผิดพลาด", "ไม่สามารถอัปเดตข้อมูลได้", "error")
    }
  }

  const handleChangePassword = async e => {
    e.preventDefault()
    if (!passwordVerified) {
      MySwal.fire(
        "เกิดข้อผิดพลาด",
        "กรุณายืนยันรหัสผ่านก่อนเปลี่ยนรหัสผ่าน",
        "error"
      )
      return
    }

    if (newPassword === "" || confirmNewPassword === "") {
      MySwal.fire("เกิดข้อผิดพลาด", "รหัสผ่านใหม่ไม่สามารถเว้นว่างได้", "error")
      return
    }

    if (newPassword !== confirmNewPassword) {
      MySwal.fire(
        "เกิดข้อผิดพลาด",
        "รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน",
        "error"
      )
      return
    }

    try {
      const token = Cookies.get("token") // ดึง token จาก cookie
      await updateProfile({ password: newPassword }, token)
      MySwal.fire(
        "เปลี่ยนรหัสผ่านสำเร็จ",
        "รหัสผ่านของคุณได้รับการอัปเดตแล้ว",
        "success"
      )
      resetState()
    } catch (error) {
      console.error("Error changing password:", error)
      MySwal.fire("เกิดข้อผิดพลาด", "ไม่สามารถเปลี่ยนรหัสผ่านได้", "error")
    }
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const resetState = () => {
    setOldPassword("")
    setNewPassword("")
    setConfirmNewPassword("")
    setPasswordVerified(false)
    setIsPasswordChanging(false) // Reset สถานะการเปลี่ยนรหัสผ่าน
    setError("")
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-white rounded-lg shadow-lg max-w-full md:max-w-md w-full p-6 mx-4 md:mx-0">
              <Dialog.Title className="text-2xl font-bold mb-6 text-center">
                โปรไฟล์ผู้ดูแลระบบ
              </Dialog.Title>

              {error && (
                <div className="text-red-500 mb-4 text-center">{error}</div>
              )}

              <form>
                <div className="mb-4">
                  <label className="block mb-2 font-semibold">ชื่อผู้ใช้</label>
                  <div className="flex items-center border rounded-md px-3 py-2">
                    <FaUser className="mr-2 text-gray-600" />
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="w-full outline-none"
                      placeholder="ชื่อผู้ใช้"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block mb-2 font-semibold">ชื่อ</label>
                  <div className="flex items-center border rounded-md px-3 py-2">
                    <FaUser className="mr-2 text-gray-600" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full outline-none"
                      placeholder="ชื่อ"
                    />
                  </div>
                </div>

                {/* ปุ่มเปลี่ยนรหัสผ่าน */}
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={() => setIsPasswordChanging(!isPasswordChanging)}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 transition duration-300 transform hover:scale-105 flex items-center justify-center"
                  >
                    <FaKey className="mr-2" />
                    เปลี่ยนรหัสผ่าน
                  </button>
                </div>

                {/* ฟอร์มเปลี่ยนรหัสผ่านแสดงเมื่อคลิกปุ่มเปลี่ยนรหัสผ่าน */}
                {isPasswordChanging && (
                  <>
                    <div className="mb-4">
                      <label className="block mb-2 font-semibold">
                        รหัสผ่านใหม่
                      </label>
                      <div className="flex items-center border rounded-md px-3 py-2">
                        <FaLock className="mr-2 text-gray-600" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          className="w-full outline-none"
                          placeholder="รหัสผ่านใหม่"
                        />
                        <button
                          type="button"
                          onClick={toggleShowPassword}
                          className="ml-2"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block mb-2 font-semibold">
                        ยืนยันรหัสผ่านใหม่
                      </label>
                      <div className="flex items-center border rounded-md px-3 py-2">
                        <FaLock className="mr-2 text-gray-600" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={confirmNewPassword}
                          onChange={e => setConfirmNewPassword(e.target.value)}
                          className="w-full outline-none"
                          placeholder="ยืนยันรหัสผ่านใหม่"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* ยืนยันรหัสผ่านเก่าก่อนอัปเดตโปรไฟล์หรือเปลี่ยนรหัสผ่าน */}
                {!passwordVerified && (
                  <div className="mb-4">
                    <label className="block mb-2 font-semibold">
                      รหัสผ่านปัจจุบัน
                    </label>
                    <div className="flex items-center border rounded-md px-3 py-2">
                      <FaLock className="mr-2 text-gray-600" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={oldPassword}
                        onChange={e => setOldPassword(e.target.value)}
                        className="w-full outline-none"
                        placeholder="รหัสผ่านปัจจุบัน"
                      />
                      <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="ml-2"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  <button
                    onClick={handleVerifyPassword}
                    className="w-full mr-2 px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                  >
                    ยืนยันรหัสผ่าน
                  </button>

                  {passwordVerified && isPasswordChanging ? (
                    <button
                      onClick={handleChangePassword}
                      className="w-full ml-2 px-4 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 transition duration-300 transform hover:scale-105"
                    >
                      เปลี่ยนรหัสผ่าน
                    </button>
                  ) : passwordVerified ? (
                    <button
                      onClick={handleUpdateProfile}
                      className="w-full ml-2 px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition duration-300 transform hover:scale-105"
                    >
                      อัปเดตโปรไฟล์
                    </button>
                  ) : null}
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
