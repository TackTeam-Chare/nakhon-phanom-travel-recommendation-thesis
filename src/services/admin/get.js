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

// Function to fetch all districts
export const checkDuplicateName = async (name) => {
  try {
    const token = getToken()
    const response = await auth.get("/admin/check-duplicate-name", {
      params: { name },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error("Error fetching districts:", error)
    throw error
  }
}
// Function to fetch all places
export const getPlaces = async () => {
  try {
    const token = getToken()
    const response = await auth.get("/admin/place", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const data = Array.isArray(response.data) ? response.data : []
    return data.map(place => ({
      ...place,
      image_url: place.image_path
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${place.image_path}`
        : null,
      image_path: place.image_path || null // Ensure image_path is either string or null
    }))
  } catch (error) {
    console.error("Error fetching places:", error)
    throw error
  }
}

// Function to fetch a place by ID
export const getPlaceById = async id => {
  try {
    const token = getToken()
    const response = await auth.get(`/admin/place/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const place = response.data

    if (place && Array.isArray(place.images)) {
      place.images = place.images.map(image => ({
        ...image,
        image_url: image.image_path
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
          : null,
        image_path: image.image_path || null // Ensure image_path is either string or null
      }))
    }

    return place
  } catch (error) {
    console.error("Error fetching tourist entity:", error)
    throw error
  }
}

// Function to fetch all place images
export const getPlaceImages = async () => {
  try {
    const token = getToken()
    const response = await auth.get("/admin/images", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const data = Array.isArray(response.data) ? response.data : []

    return data.map(image => ({
      ...image,
      image_url: image.image_path
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
        : null
    }))
  } catch (error) {
    console.error("Error fetching place images:", error)
    throw error
  }
}

// Function to fetch place image by ID
export const getPlaceImagesById = async id => {
  try {
    const token = getToken()
    const response = await auth.get(`/admin/images/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const image = response.data
    if (image) {
      image.image_url = image.image_path
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
        : null
    }
    return image
  } catch (error) {
    console.error("Error fetching image by ID:", error)
    throw error
  }
}

// Function to fetch all seasons
export const getSeasons = async () => {
  try {
    const token = getToken()
    const response = await auth.get("/admin/seasons", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error("Error fetching seasons:", error)
    throw error
  }
}

// Function to fetch a season by ID
export const getSeasonById = async id => {
  try {
    const token = getToken()
    const response = await auth.get(`/admin/seasons/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error("Error fetching season by ID:", error)
    throw error
  }
}

// Function to fetch all seasons relations
export const getAllSeasonsRelations = async () => {
  try {
    const token = getToken()
    const response = await auth.get("/admin/seasons-relation", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error("Error fetching seasons relations:", error)
    throw error
  }
}

// Function to fetch a seasons relation by ID
export const getSeasonsRelationById = async id => {
  try {
    const token = getToken()
    const response = await auth.get(`/admin/seasons-relation/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error("Error fetching seasons relation:", error)
    throw error
  }
}

// Function to fetch all districts
export const getDistricts = async () => {
  try {
    const token = getToken()
    const response = await auth.get("/admin/districts", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error("Error fetching districts:", error)
    throw error
  }
}

// Function to fetch all categories
export const getCategories = async () => {
  try {
    const token = getToken()
    const response = await auth.get("/admin/categories", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw error
  }
}

// Function to fetch a category by ID
export const getCategoryById = async id => {
  try {
    const token = getToken()
    const response = await auth.get(`/admin/categories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error("Error fetching category:", error)
    throw error
  }
}

// Function to fetch a district by ID
export const getDistrictById = async id => {
  try {
    const token = getToken()
    const response = await auth.get(`/admin/districts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error("Error fetching district by ID:", error)
    throw error
  }
}

// Function to fetch all operating hours
export const getAllOperatingHours = async () => {
  try {
    const token = getToken()
    const response = await auth.get("/admin/time", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error("Error fetching operating hours:", error)
    throw error
  }
}

// Function to fetch operating hours by ID
export const getOperatingHoursById = async id => {
  try {
    const token = getToken()
    const response = await auth.get(`/admin/time/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error("Error fetching operating hour:", error)
    throw error
  }
}

// Function to fetch all tourism data
export const getAllFetchTourismData = async () => {
  try {
    const token = getToken()
    const response = await auth.get("/admin/place", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const data = Array.isArray(response.data) ? response.data : []

    return data.map(place => ({
      ...place,
      image_path: place.image_path
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${place.image_path}`
        : null
    }))
  } catch (error) {
    console.error("Error fetching tourism data:", error)
    throw error
  }
}

// Function to fetch tourism data by ID
export const getFetchTourismDataById = async id => {
  try {
    const token = getToken()
    const response = await auth.get(`/admin/place/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error("Error fetching tourism data:", error)
    throw error
  }
}

// Function to fetch nearby tourism data
export const getNearbyFetchTourismData = async (id, radius = 5000) => {
  try {
    const token = getToken()
    const response = await auth.get(
      `/admin/place/nearby/${id}?radius=${radius}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    const { entity, nearbyEntities } = response.data

    if (entity.images) {
      entity.images = entity.images.map(img => ({
        ...img,
        image_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${img.image_path}`
      }))
    }

    nearbyEntities.forEach(ent => {
      if (ent.image_path) {
        ent.image_path = ent.image_path.map(img => ({
          ...img,
          image_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${img.image_path}`
        }))
      }
    })

    return { entity, nearbyEntities }
  } catch (error) {
    console.error("Error fetching tourism data:", error)
    throw error
  }
}

// Function to fetch tourism data by category
export const getFetchTourismDataByCategory = async categoryId => {
  try {
    const token = getToken()
    const response = await auth.get(`/admin/categories/${categoryId}/place`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error("Error fetching tourism data:", error)
    throw error
  }
}

// Function to fetch tourism data by district
export const getFetchTourismDataByDistrict = async districtId => {
  try {
    const token = getToken()
    const response = await auth.get(`/admin/district/${districtId}/place`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error("Error fetching tourism data:", error)
    throw error
  }
}

// Function to fetch tourism data by season
export const getFetchTourismDataBySeason = async seasonId => {
  try {
    const token = getToken()
    const response = await auth.get(`/admin/season/${seasonId}/place`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error("Error fetching tourism data:", error)
    throw error
  }
}

// Function to fetch real-time tourist attractions
export const fetchRealTimeTouristAttractions = async () => {
  try {
    const token = getToken()
    const response = await auth.get("/admin/seasons/real-time", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error("Error fetching real-time tourist attractions:", error)
    throw error
  }
}
