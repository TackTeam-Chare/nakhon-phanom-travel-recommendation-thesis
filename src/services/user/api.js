import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL
})

// Function to fetch top-rated tourist entities
export const getTopRatedTouristAttractions = async () => {
  try {
    const response = await api.get("/places/top-rated/tourist-attractions")
    const data = Array.isArray(response.data) ? response.data : []

    return data.map(place => ({
      ...place,
      images: place.images
        ? place.images.map(image => ({
            image_path: image.image_path,
            image_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
          }))
        : [] // Default to an empty array if no images
    }))
  } catch (error) {
    console.error("Error fetching top-rated tourist entities:", error)
    throw new Error(
      error.response?.data?.error || "Error fetching top-rated tourist entities"
    )
  }
}

// Fetch top-rated tourist attractions
export const fetchTopRatedTouristAttractions = async () => {
  try {
    const response = await api.get("/places/top-rated/tourist-attractions")
    const data = Array.isArray(response.data) ? response.data : []

    // Map images for each place to construct full URLs
    return data.map(place => ({
      ...place,
      image_url: place.images
        ? place.images.map(
            image =>
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
          )
        : []
    }))
  } catch (error) {
    console.error("Error fetching top-rated tourist attractions:", error)
    throw new Error(
      error.response?.data?.error ||
        "Error fetching top-rated tourist attractions"
    )
  }
}

// Fetch top-rated accommodations
export const fetchTopRatedAccommodations = async () => {
  try {
    const response = await api.get("/places/top-rated/accommodations")
    const data = Array.isArray(response.data) ? response.data : []

    // Map images for each accommodation
    return data.map(place => ({
      ...place,
      image_url: place.images
        ? place.images.map(
            image =>
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
          )
        : []
    }))
  } catch (error) {
    console.error("Error fetching top-rated accommodations:", error)
    throw new Error(
      error.response?.data?.error || "Error fetching top-rated accommodations"
    )
  }
}

// Fetch top-rated restaurants
export const fetchTopRatedRestaurants = async () => {
  try {
    const response = await api.get("/places/top-rated/restaurants")
    const data = Array.isArray(response.data) ? response.data : []

    // Map images for each restaurant
    return data.map(place => ({
      ...place,
      image_url: place.images
        ? place.images.map(
            image =>
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
          )
        : []
    }))
  } catch (error) {
    console.error("Error fetching top-rated restaurants:", error)
    throw new Error(
      error.response?.data?.error || "Error fetching top-rated restaurants"
    )
  }
}

// Fetch top-rated souvenir shops
export const fetchTopRatedSouvenirShops = async () => {
  try {
    const response = await api.get("/places/top-rated/souvenir-shops")
    const data = Array.isArray(response.data) ? response.data : []

    // Map images for each souvenir shop
    return data.map(place => ({
      ...place,
      image_url: place.images
        ? place.images.map(
            image =>
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
          )
        : []
    }))
  } catch (error) {
    console.error("Error fetching top-rated souvenir shops:", error)
    throw new Error(
      error.response?.data?.error || "Error fetching top-rated souvenir shops"
    )
  }
}

// Function to fetch categories
export const fetchCategories = async () => {
  try {
    const response = await api.get("/categories")
    return response.data
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw error
  }
}

// Function to fetch districts
export const fetchDistricts = async () => {
  try {
    const response = await api.get("/districts")
    return response.data
  } catch (error) {
    console.error("Error fetching districts:", error)
    throw error
  }
}

// Function to fetch seasons
export const fetchSeasons = async () => {
  try {
    const response = await api.get("/seasons")
    return response.data
  } catch (error) {
    console.error("Error fetching seasons:", error)
    throw error
  }
}

// Function to search accommodations
export const searchAccommodations = async query => {
  try {
    const response = await api.get(`/search/accommodations?q=${query}`)
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
    console.error("Error searching accommodations:", error)
    throw error
  }
}

// Function to search restaurants
export const searchRestaurants = async query => {
  try {
    const response = await api.get(`/search/restaurants?q=${query}`)
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
    console.error("Error searching restaurants:", error)
    throw error
  }
}

// Function to search souvenir shops
export const searchSouvenirShops = async query => {
  try {
    const response = await api.get(`/search/souvenir-shops?q=${query}`)
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
    console.error("Error searching souvenir shops:", error)
    throw error
  }
}

// Function to search tourist attractions
export const searchTouristAttractions = async query => {
  try {
    const response = await api.get(`/search/tourist-attractions?q=${query}`)
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
    console.error("Error searching tourist attractions:", error)
    throw error
  }
}

// Function to search places by category
export const searchByCategory = async categoryId => {
  try {
    const response = await api.get(`/categories/${categoryId}/place`)
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

// Function to search places by district
export const searchByDistrict = async districtId => {
  try {
    const response = await api.get(`/districts/${districtId}/place`)
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

// Function to search places by season
export const searchBySeason = async seasonId => {
  try {
    const response = await api.get(`/seasons/${seasonId}/place`)
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

// Function to search places by time
export const searchByTime = async (day_of_week, opening_time, closing_time) => {
  try {
    const response = await api.get(
      `/time/${day_of_week}/${opening_time}/${closing_time}`
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

// Function to fetch real-time tourist attractions
export const fetchRealTimeTouristAttractions = async () => {
  try {
    const response = await api.get("/seasons/real-time")
    const data = Array.isArray(response.data) ? response.data : []

    // Properly format the images array to match the expected type
    return data.map(place => ({
      ...place,
      images: place.images
        ? place.images.map(image => ({
            image_path: image.image_path,
            image_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
          }))
        : [] // Default to an empty array if no images
    }))
  } catch (error) {
    console.error("Error fetching real-time tourist attractions:", error)
    throw new Error(
      error.response?.data?.error ||
        "Error fetching real-time tourist attractions"
    )
  }
}

// Function to search places
export const searchPlaces = async query => {
  try {
    const response = await api.get(`/search?q=${query}`)
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

// Function to fetch all tourism data
export const getAllFetchTouristEntities = async () => {
  try {
    const response = await api.get("/places")
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

// Function to fetch tourist attractions
export const fetchTouristAttractions = async () => {
  try {
    const response = await api.get("/tourist-attractions")
    const data = Array.isArray(response.data) ? response.data : []

    return data.map(place => ({
      ...place,
      image_url: place.images
        ? place.images.map(
            image =>
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
          )
        : []
    }))
  } catch (error) {
    console.error("Error fetching tourist attractions:", error)
    throw error
  }
}

// Function to fetch accommodations
export const fetchAccommodations = async () => {
  try {
    const response = await api.get("/accommodations")
    return response.data
  } catch (error) {
    console.error("Error fetching accommodations:", error)
    throw error
  }
}

// Function to fetch restaurants
export const fetchRestaurants = async () => {
  try {
    const response = await api.get("/restaurants")
    return response.data
  } catch (error) {
    console.error("Error fetching restaurants:", error)
    throw error
  }
}

// Function to fetch souvenir shops
export const fetchSouvenirShops = async () => {
  try {
    const response = await api.get("/souvenir-shops")
    return response.data
  } catch (error) {
    console.error("Error fetching souvenir shops:", error)
    throw error
  }
}

// Function to fetch nearby tourism data
export const getNearbyFetchTourismData = async (id, radius = 5000) => {
  try {
    const response = await api.get(`/place/nearby/${id}?radius=${radius}`)
    const { entity, nearbyEntities } = response.data

    // Map images for the main entity
    if (entity.images && Array.isArray(entity.images)) {
      entity.images = entity.images.map(image => ({
        ...image,
        image_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
      }))
    }

    // Map images for the nearby entities
    if (nearbyEntities && Array.isArray(nearbyEntities)) {
      nearbyEntities.forEach(entity => {
        if (entity.images && Array.isArray(entity.images)) {
          entity.images = entity.images.map(image => ({
            ...image,
            image_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
          }))
        }
      })
    }

    return { entity, nearbyEntities }
  } catch (error) {
    console.error("Error fetching tourism data:", error)
    throw error
  }
}

// Function to fetch currently open tourist entities
export const fetchCurrentlyOpenTouristEntities = async () => {
  try {
    const response = await api.get("/places/currently-open")
    const data = Array.isArray(response.data) ? response.data : []

    return data.map(place => ({
      ...place,
      images: place.images
        ? place.images.map(image => ({
            image_path: image.image_path,
            image_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
          }))
        : [] // Default to an empty array if no images
    }))
  } catch (error) {
    console.error("Error fetching currently open tourist entities:", error)
    throw error
  }
}

// Function to fetch tourist attractions by district
export const fetchTouristAttractionsByDistrict = async districtId => {
  try {
    const response = await api.get(`/tourist-attractions/${districtId}`)
    const data = Array.isArray(response.data) ? response.data : []

    return data.map(place => ({
      ...place,
      image_url: place.images
        ? place.images.map(
            image =>
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
          )
        : []
    }))
  } catch (error) {
    console.error("Error fetching tourist attractions by district:", error)
    throw error
  }
}

// Function to fetch accommodations by district
export const fetchAccommodationsByDistrict = async districtId => {
  try {
    const response = await api.get(`/accommodations/${districtId}`)
    const data = Array.isArray(response.data) ? response.data : []

    return data.map(place => ({
      ...place,
      image_url: place.images
        ? place.images.map(
            image =>
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
          )
        : []
    }))
  } catch (error) {
    console.error("Error fetching accommodations by district:", error)
    throw error
  }
}

// Function to fetch restaurants by district
export const fetchRestaurantsByDistrict = async districtId => {
  try {
    const response = await api.get(`/restaurants/${districtId}`)
    const data = Array.isArray(response.data) ? response.data : []

    return data.map(place => ({
      ...place,
      image_url: place.images
        ? place.images.map(
            image =>
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
          )
        : []
    }))
  } catch (error) {
    console.error("Error fetching restaurants by district:", error)
    throw error
  }
}

// Function to fetch souvenir shops by district
export const fetchSouvenirShopsByDistrict = async districtId => {
  try {
    const response = await api.get(`/souvenir-shops/${districtId}`)
    const data = Array.isArray(response.data) ? response.data : []

    return data.map(place => ({
      ...place,
      image_url: place.images
        ? place.images.map(
            image =>
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
          )
        : []
    }))
  } catch (error) {
    console.error("Error fetching souvenir shops by district:", error)
    throw error
  }
}

// Function to fetch places nearby by coordinates
export const fetchPlacesNearbyByCoordinates = async (
  latitude,
  longitude,
  radius = 5000
) => {
  try {
    const response = await api.get(`/places/nearby-by-coordinates`, {
      params: {
        lat: latitude,
        lng: longitude,
        radius: radius
      }
    })

    const data = Array.isArray(response.data) ? response.data : []

    return data.map(place => ({
      ...place,
      images: place.images
        ? place.images.map(image => ({
            image_path: image.image_path,
            image_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
          }))
        : [] // Default to an empty array if no images
    }))
  } catch (error) {
    console.error("Error fetching places nearby by coordinates:", error)
    throw new Error(
      error.response?.data?.error ||
        "Error fetching places nearby by coordinates"
    )
  }
}

// Function to fetch places nearby by coordinates
export const fetchPlacesNearbyByCoordinatesRealTime = async (
  latitude,
  longitude,
  radius = 5000
) => {
  try {
    const response = await api.get(`/places/nearby-by-coordinates`, {
      params: {
        lat: latitude,
        lng: longitude,
        radius: radius
      }
    })

    const data = Array.isArray(response.data) ? response.data : []

    return data.map(place => ({
      ...place,
      image_url: place.images
        ? place.images.map(
            image =>
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
          )
        : []
    }))
  } catch (error) {
    console.error("Error fetching places nearby by coordinates:", error)
    throw new Error(
      error.response?.data?.error ||
        "Error fetching places nearby by coordinates"
    )
  }
}

// Unified search for all criteria
export const searchTouristEntitiesUnified = async params => {
  try {
    const response = await api.get("/search", { params })
    const data = Array.isArray(response.data) ? response.data : []

    return data.map(place => ({
      ...place,
      images: place.images
        ? place.images.map(image => ({
            image_path: image.image_path,
            image_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
          }))
        : [] // Default to an empty array if no images
    }))
  } catch (error) {
    console.error("Error fetching tourist entities with unified search:", error)
    throw new Error(
      error.response?.data?.error ||
        "Error fetching tourist entities with unified search"
    )
  }
}

// Fetch all filters (seasons, districts, categories)
export const fetchAllFilters = async () => {
  try {
    const response = await api.get("/filters")
    return response.data
  } catch (error) {
    console.error("Error fetching all filters:", error)
    throw new Error(error.response?.data?.error || "Error fetching all filters")
  }
}
