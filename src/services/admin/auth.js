import axios from "axios"
import Cookies from "js-cookie"

const auth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 5000,
})

// Interceptor สำหรับเพิ่ม token ใน Header ทุกครั้งที่ทำคำขอ
auth.interceptors.request.use(config => {
  const token = Cookies.get("token")
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}` // เพิ่ม token ใน Authorization Header
  }
  return config
}, error => {
  return Promise.reject(error)
})

// ดึง token จาก Cookies
const getToken = () => Cookies.get("token")

// Function to set token in Cookies
const setToken = (token) => {
  // Set token with a secure option, and expiration of 7 days
  Cookies.set("token", token, { expires: 7, secure: true })
}

// Function to remove token from Cookies (used for logout)
const removeToken = () => {
  Cookies.remove("token")
}

export const login = async data => {
  try {
    const response = await auth.post("/auth/login", data)
    setToken(response.data.token) // Store token in Cookies
    return response.data
  } catch (error) {
    console.error("Error logging in:", error)
    throw error
  }
}

export const logout = async () => {
  try {
    const token = getToken()
    const response = await auth.post("/auth/logout", null, {
      headers: { Authorization: `Bearer ${token}` }
    })
    removeToken() // Remove token from Cookies
    return response.data
  } catch (error) {
    console.error("Error logging out:", error)
    throw error
  }
}

export const verifyPassword = async data => {
  try {
    const token = getToken()
    const response = await auth.post("/auth/verify-password", data, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    console.error("Error verifying password:", error)
    throw error
  }
}

export const getAllAdmins = async () => {
  try {
    const token = getToken()
    const response = await auth.get("/auth/admin", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error("Error fetching admins:", error)
    throw error
  }
}

export const getAdminById = async id => {
  try {
    const token = getToken()
    const response = await auth.get(`/auth/admin/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error("Error fetching admin:", error)
    throw error
  }
}

export const getProfile = async () => {
  try {
    const token = getToken()
    const response = await auth.get("/auth/profile", {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    console.error("Error fetching profile:", error)
    throw error
  }
}

export const updateProfile = async data => {
  try {
    const token = getToken()
    const response = await auth.put("/auth/profile", data, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    console.error("Error updating profile:", error)
    throw error
  }
}

export const addAdmin = async data => {
  try {
    const token = getToken()
    const response = await auth.post("/auth/register", data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error("Error adding admin:", error)
    throw error
  }
}

export const updateAdmin = async (id, data) => {
  try {
    const token = getToken()
    const response = await auth.put(`/auth/admin/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error("Error updating admin profile:", error)
    throw error
  }
}

export const deleteAdmin = async id => {
  try {
    const token = getToken()
    const response = await auth.delete(`/auth/admin/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error("Error deleting admin:", error)
    throw error
  }
}

export const register = async data => {
  try {
    const response = await auth.post("/auth/register", data)
    localStorage.setItem("token", response.data.token)
    return response.data
  } catch (error) {
    console.error("Error registering:", error)
    throw error
  }
}

