import axios from "axios"
import Cookies from "js-cookie"

const auth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 5000
})

auth.interceptors.request.use(config => {
  const token = getToken()
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const getToken = () => Cookies.get("token")

// Function to update a tourist entity
export const updateTouristEntity = async (id, data) => {
  try {
    const token = getToken()
    const response = await auth.put(`admin/place/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error("Error updating tourist entity:", error)
    throw error
  }
}

// Function to update tourism images
export const updateTourismImages = async (id, data) => {
  try {
    const token = getToken()
    const response = await auth.put(`/admin/images/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    })
    return response.data
  } catch (error) {
    console.error("Error updating tourism images:", error)
    throw error
  }
}

// Function to update a category
export const updateCategory = async (id, data) => {
  try {
    const token = getToken()
    const response = await auth.put(`/admin/categories/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error("Error updating category:", error)
    throw error
  }
}

// Function to update a district
export const updateDistrict = async (id, data) => {
  try {
    const token = getToken()
    const response = await auth.put(`/admin/districts/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error("Error updating district:", error)
    throw error
  }
}

// Function to update a season
export const updateSeason = async (id, data) => {
  try {
    const token = getToken()
    const response = await auth.put(`/admin/seasons/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error("Error updating season:", error)
    throw error
  }
}

// Function to update operating hours
export const updateOperatingHours = async (id, data) => {
  try {
    const token = getToken()
    const response = await auth.put(`/admin/time/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error("Error updating operating hour:", error)
    throw error
  }
}

// Function to update seasons relation
export const updateSeasonsRelation = async (id, data) => {
  try {
    const token = getToken()
    const response = await auth.put(`/admin/seasons-relation/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error("Error updating seasons relation:", error)
    throw error
  }
}

// Function to update tourism entities images
export const updateTourismEntitiesImages = async (id, data) => {
  try {
    const token = getToken()
    const response = await auth.put(`/admin/place/images/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error("Error updating tourism entities images:", error)
    throw error
  }
}
