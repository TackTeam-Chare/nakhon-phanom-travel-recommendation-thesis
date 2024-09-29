import axios from "axios"
import Cookies from "js-cookie"

// Create Axios instance with base configuration
const auth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL
})

// Add token to headers of every request
auth.interceptors.request.use(config => {
  const token = Cookies.get("token") 
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const getToken = () => Cookies.get("token")

// Function to create a tourist entity
export const createTouristEntity = async data => {
  try {
    const token = getToken()
    const response = await auth.post("/admin/place", data, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    console.error("Error creating tourist entity:", error)
    throw error
  }
}

// Function to upload tourism images
export const uploadTourismImages = async data => {
  try {
    const token = getToken()
    const response = await auth.post("/admin/insert-images-place", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    })
    return response.data
  } catch (error) {
    console.error("Error uploading tourism images:", error)
    throw error
  }
}

// Function to create a category
export const createCategory = async data => {
  try {
    const token = getToken()
    const response = await auth.post("/admin/categories", data, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    console.error("Error creating category:", error)
    throw error
  }
}

// Function to create a district
export const createDistrict = async data => {
  try {
    const token = getToken()
    const response = await auth.post("/admin/districts", data, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    console.error("Error creating district:", error)
    throw error
  }
}

// Function to create a season
export const createSeason = async data => {
  try {
    const token = getToken()
    const response = await auth.post("/admin/seasons", data, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    console.error("Error creating season:", error)
    throw error
  }
}

// Function to create a seasons relation
export const createSeasonsRelation = async data => {
  try {
    const token = getToken()
    const response = await auth.post("/admin/seasons-relation", data, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    console.error("Error creating relation:", error)
    throw error
  }
}

// Function to create operating hours
export const createOperatingHours = async data => {
  try {
    const token = getToken()
    const response = await auth.post("/admin/time", data, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    console.error("Error creating operating hours:", error)
    throw error
  }
}

export default auth
