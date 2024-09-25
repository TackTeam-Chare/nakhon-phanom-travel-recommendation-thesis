import axios from "axios"
import Cookies from "js-cookie"

const auth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 5000
})

auth.interceptors.request.use(config => {
  const token = Cookies.get("token") 
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ดึง token จาก Cookies
const getToken = () => Cookies.get("token")
// console.log(token)

// Delete Place
export const deletePlace = async id => {
  try {
    const token = getToken()
    const response = await auth.delete(`/admin/place/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    console.error(`Error deleting place with ID ${id}:`, error)
    throw error
  }
}

// Delete Place Image
export const deletePlaceImage = async id => {
  try {
    const token = getToken()
    const response = await auth.delete(`/admin/images/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    console.error(`Error deleting place image with ID ${id}:`, error)
    throw error
  }
}

// Delete Seasons Relations
export const deleteSeasonsRelations = async id => {
  try {
    const token = getToken()
    const response = await auth.delete(`/admin/seasons-relation/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    console.error(`Error deleting tourist entity with ID ${id}:`, error)
    throw error
  }
}

// Delete Operating Hours
export const deleteOperatingHours = async id => {
  try {
    const token = getToken()
    const response = await auth.delete(`/admin/time/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    console.error(`Error deleting operating hours with ID ${id}:`, error)
    throw error
  }
}

// Delete Seasons
export const deleteSeason = async id => {
  try {
    const token = getToken()
    const response = await auth.delete(`/admin/seasons/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    console.error(`Error deleting season with ID ${id}:`, error)
    throw error
  }
}

// Delete District by ID
export const deleteDistrict = async id => {
  try {
    const token = getToken()
    const response = await auth.delete(`/admin/districts/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    console.error(`Error deleting district with ID ${id}:`, error)
    throw error
  }
}

// Delete Category by ID
export const deleteCategory = async id => {
  try {
    const token = getToken()
    const response = await auth.delete(`/admin/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    console.error(`Error deleting category with ID ${id}:`, error)
    throw error
  }
}
