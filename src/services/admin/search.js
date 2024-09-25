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

const getToken = () => Cookies.get("token")

export const fetchCategories = async () => {
  try {
    const token = getToken()
    const response = await auth.get("/admin/categories", {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw error
  }
}

export const fetchDistricts = async () => {
  try {
    const token = getToken()
    const response = await auth.get("/admin/districts", {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    console.error("Error fetching districts:", error)
    throw error
  }
}

export const fetchSeasons = async () => {
  try {
    const token = getToken()
    const response = await auth.get("/admin/seasons", {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    console.error("Error fetching seasons:", error)
    throw error
  }
}

export const searchByCategory = async categoryId => {
  try {
    const token = getToken()
    const response = await auth.get(`/admin/categories/${categoryId}/place`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = Array.isArray(response.data) ? response.data : []

    return data.map(place => ({
      ...place,
      image_url: place.image_url
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${place.image_url}`
        : null
    }))
  } catch (error) {
    console.error("Error searching by category:", error)
    throw error
  }
}

export const searchByDistrict = async districtId => {
  try {
    const token = getToken()
    const response = await auth.get(`/admin/districts/${districtId}/place`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = Array.isArray(response.data) ? response.data : []

    return data.map(place => ({
      ...place,
      image_url: place.image_url
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${place.image_url}`
        : null
    }))
  } catch (error) {
    console.error("Error searching by district:", error)
    throw error
  }
}

export const searchBySeason = async seasonId => {
  try {
    const token = getToken()
    const response = await auth.get(`/admin/seasons/${seasonId}/place`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = Array.isArray(response.data) ? response.data : []

    return data.map(place => ({
      ...place,
      image_url: place.image_url
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${place.image_url}`
        : null
    }))
  } catch (error) {
    console.error("Error searching by season:", error)
    throw error
  }
}

export const searchByTime = async (day_of_week, opening_time, closing_time) => {
  try {
    const token = getToken()
    const response = await auth.get(
      `/admin/time/${day_of_week}/${opening_time}/${closing_time}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    const data = Array.isArray(response.data) ? response.data : []

    return data.map(place => ({
      ...place,
      image_url: place.image_url
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${place.image_url}`
        : null
    }))
  } catch (error) {
    console.error("Error searching by time:", error)
    throw error
  }
}

export const searchPlaces = async query => {
  try {
    const token = getToken()
    const response = await auth.get(`/admin/search?q=${query}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = Array.isArray(response.data) ? response.data : []

    return data.map(place => ({
      ...place,
      image_url:
        typeof place.image_url === "string"
          ? place.image_url
              .split(",")
              .map(
                imagePath =>
                  `${
                    process.env.NEXT_PUBLIC_BACKEND_URL
                  }/uploads/${imagePath.trim()}`
              )
          : []
    }))
  } catch (error) {
    console.error("Error searching places:", error)
    throw error
  }
}
