import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 5000
});

// Intercept request to include Authorization header if token is available
api.interceptors.request.use(config => {
    const token = Cookies.get("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => {
    return Promise.reject(error);
  });

// Function to fetch suggestions (for chatbot)
export const fetchSuggestions = async () => {
  try {
    const token = Cookies.get("token");
    const response = await api.get("/admin/general/suggestions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    throw error;
  }
};

// Function to fetch categories
export const fetchCategories = async () => {
  try {
    const token = Cookies.get("token");
    const response = await api.get("/admin/general/categories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Function to fetch districts
export const fetchDistricts = async () => {
  try {
    const token = Cookies.get("token");
    const response = await api.get("/admin/general/districts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching districts:", error);
    throw error;
  }
};

// Function to fetch seasons
export const fetchSeasons = async () => {
  try {
    const token = Cookies.get("token");
    const response = await api.get("/admin/general/seasons", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching seasons:", error);
    throw error;
  }
};

// Function to search accommodations
export const searchAccommodations = async (query) => {
  try {
    const token = Cookies.get("token");
    const response = await api.get(`/admin/general/search/accommodations?q=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map((place) => ({
      ...place,
      image_url:
        typeof place.image_url === "string"
          ? place.image_url.split(",").map(
              (imagePath) =>
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${imagePath.trim()}`
            )
          : [],
    }));
  } catch (error) {
    console.error("Error searching accommodations:", error);
    throw error;
  }
};

// Function to search restaurants
export const searchRestaurants = async (query) => {
  try {
    const token = Cookies.get("token");
    const response = await api.get(`/admin/general/search/restaurants?q=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map((place) => ({
      ...place,
      image_url:
        typeof place.image_url === "string"
          ? place.image_url.split(",").map(
              (imagePath) =>
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${imagePath.trim()}`
            )
          : [],
    }));
  } catch (error) {
    console.error("Error searching restaurants:", error);
    throw error;
  }
};

// Function to search souvenir shops
export const searchSouvenirShops = async (query) => {
  try {
    const token = Cookies.get("token");
    const response = await api.get(`/admin/general/search/souvenir-shops?q=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map((place) => ({
      ...place,
      image_url:
        typeof place.image_url === "string"
          ? place.image_url.split(",").map(
              (imagePath) =>
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${imagePath.trim()}`
            )
          : [],
    }));
  } catch (error) {
    console.error("Error searching souvenir shops:", error);
    throw error;
  }
};

// Function to search tourist attractions
export const searchTouristAttractions = async (query) => {
  try {
    const token = Cookies.get("token");
    const response = await api.get(`/admin/general/search/tourist-attractions?q=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map((place) => ({
      ...place,
      image_url:
        typeof place.image_url === "string"
          ? place.image_url.split(",").map(
              (imagePath) =>
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${imagePath.trim()}`
            )
          : [],
    }));
  } catch (error) {
    console.error("Error searching tourist attractions:", error);
    throw error;
  }
};

// Function to search places by category
export const searchByCategory = async (categoryId) => {
  try {
    const token = Cookies.get("token");
    const response = await api.get(`/admin/general/categories/${categoryId}/place`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map((place) => ({
      ...place,
      image_url: place.image_url
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${place.image_url}`
        : null,
    }));
  } catch (error) {
    console.error("Error searching by category:", error);
    throw error;
  }
};

// Function to search places by district
export const searchByDistrict = async (districtId) => {
  try {
    const token = Cookies.get("token");
    const response = await api.get(`/admin/general/districts/${districtId}/place`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map((place) => ({
      ...place,
      images: place.images
        ? place.images.map((image) => ({
            image_path: image.image_path,
            image_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`,
          }))
        : [],
    }));
  } catch (error) {
    console.error("Error searching by district:", error);
    throw error;
  }
};

// Function to search places by season
export const searchBySeason = async (seasonId) => {
  try {
    const token = Cookies.get("token");
    const response = await api.get(`/admin/general/seasons/${seasonId}/place`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map((place) => ({
      ...place,
      images: place.images
        ? place.images.map((image) => ({
            image_path: image.image_path,
            image_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`,
          }))
        : [],
    }));
  } catch (error) {
    console.error("Error searching by season:", error);
    throw error;
  }
};

// Function to search places by time
export const searchByTime = async (day_of_week, opening_time, closing_time) => {
  try {
    const token = Cookies.get("token");
    const response = await api.get(
      `/admin/general/time/${day_of_week}/${opening_time}/${closing_time}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map((place) => ({
      ...place,
      image_url: place.image_url
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${place.image_url}`
        : null,
    }));
  } catch (error) {
    console.error("Error searching by time:", error);
    throw error;
  }
};

// Function to fetch real-time tourist attractions
export const fetchRealTimeTouristAttractions = async () => {
  try {
    const token = Cookies.get("token");
    const response = await api.get("/admin/general/seasons/real-time", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map((place) => ({
      ...place,
      images: place.images
        ? place.images.map((image) => ({
            image_path: image.image_path,
            image_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`,
          }))
        : [],
    }));
  } catch (error) {
    console.error("Error fetching real-time tourist attractions:", error);
    throw error;
  }
};

// Function to search places
export const searchPlaces = async (query) => {
  try {
    const token = Cookies.get("token");
    const response = await api.get(`/admin/general/search?q=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map((place) => ({
      ...place,
      image_url:
        typeof place.image_url === "string"
          ? place.image_url.split(",").map(
              (imagePath) =>
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${imagePath.trim()}`
            )
          : [],
    }));
  } catch (error) {
    console.error("Error searching places:", error);
    throw error;
  }
};

// Function to fetch all tourism data
export const getAllFetchTouristEntities = async () => {
  try {
    const token = Cookies.get("token");
    const response = await api.get("/admin/general/places", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map((place) => ({
      ...place,
      images: place.images
        ? place.images.map((image) => ({
            image_path: image.image_path,
            image_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`,
          }))
        : [],
    }));
  } catch (error) {
    console.error("Error fetching tourism data:", error);
    throw error;
  }
};

// Function to fetch tourist attractions
export const fetchTouristAttractions = async () => {
  try {
    const token = Cookies.get("token");
    const response = await api.get("/admin/general/tourist-attractions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map((place) => ({
      ...place,
      image_url: place.images
        ? place.images.map(
            (image) =>
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
          )
        : [],
    }));
  } catch (error) {
    console.error("Error fetching tourist attractions:", error);
    throw error;
  }
};

// Function to fetch accommodations
export const fetchAccommodations = async () => {
  try {
    const token = Cookies.get("token");
    const response = await api.get("/admin/general/accommodations", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching accommodations:", error);
    throw error;
  }
};

// Function to fetch restaurants
export const fetchRestaurants = async () => {
  try {
    const token = Cookies.get("token");
    const response = await api.get("/admin/general/restaurants", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw error;
  }
};

// Function to fetch souvenir shops
export const fetchSouvenirShops = async () => {
  try {
    const token = Cookies.get("token");
    const response = await api.get("/admin/general/souvenir-shops", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching souvenir shops:", error);
    throw error;
  }
};

// Function to fetch nearby tourism data
export const getNearbyFetchTourismData = async (id, radius = 5000) => {
  try {
    const token = Cookies.get("token");
    const response = await api.get(`/admin/general/place/nearby/${id}?radius=${radius}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const { entity, nearbyEntities } = response.data;

    // Map images for the main entity
    if (entity.images && Array.isArray(entity.images)) {
      entity.images = entity.images.map((image) => ({
        ...image,
        image_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`,
      }));
    }

    // Map images for the nearby entities
    if (nearbyEntities && Array.isArray(nearbyEntities)) {
      nearbyEntities.forEach((entity) => {
        if (entity.images && Array.isArray(entity.images)) {
          entity.images = entity.images.map((image) => ({
            ...image,
            image_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`,
          }));
        }
      });
    }

    return { entity, nearbyEntities };
  } catch (error) {
    console.error("Error fetching tourism data:", error);
    throw error;
  }
};

// Function to fetch currently open tourist entities
export const fetchCurrentlyOpenTouristEntities = async () => {
  try {
    const token = Cookies.get("token");
    const response = await api.get("/admin/general/places/currently-open", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map((place) => ({
      ...place,
      images: Array.isArray(place.images)
        ? place.images.map((image) => ({
            image_path: image.image_path,
            image_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`,
          }))
        : [], // หากไม่ใช่ array ให้กำหนดเป็น array ว่าง
    }));
  } catch (error) {
    console.error("Error fetching currently open tourist entities:", error);
    throw error;
  }
};

// Function to fetch tourist attractions by district
export const fetchTouristAttractionsByDistrict = async (districtId) => {
  try {
    const token = Cookies.get("token");
    const response = await api.get(`/admin/general/tourist-attractions/${districtId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map((place) => ({
      ...place,
      image_url: place.images
        ? place.images.map(
            (image) =>
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
          )
        : [],
    }));
  } catch (error) {
    console.error("Error fetching tourist attractions by district:", error);
    throw error;
  }
};

// Function to fetch accommodations by district
export const fetchAccommodationsByDistrict = async (districtId) => {
  try {
    const token = Cookies.get("token");
    const response = await api.get(`/admin/general/accommodations/${districtId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map((place) => ({
      ...place,
      image_url: place.images
        ? place.images.map(
            (image) =>
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
          )
        : [],
    }));
  } catch (error) {
    console.error("Error fetching accommodations by district:", error);
    throw error;
  }
};

// Function to fetch restaurants by district
export const fetchRestaurantsByDistrict = async (districtId) => {
  try {
    const token = Cookies.get("token");
    const response = await api.get(`/admin/general/restaurants/${districtId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map((place) => ({
      ...place,
      image_url: place.images
        ? place.images.map(
            (image) =>
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
          )
        : [],
    }));
  } catch (error) {
    console.error("Error fetching restaurants by district:", error);
    throw error;
  }
};

// Function to fetch souvenir shops by district
export const fetchSouvenirShopsByDistrict = async (districtId) => {
  try {
    const token = Cookies.get("token");
    const response = await api.get(`/admin/general/souvenir-shops/${districtId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map((place) => ({
      ...place,
      image_url: place.images
        ? place.images.map(
            (image) =>
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
          )
        : [],
    }));
  } catch (error) {
    console.error("Error fetching souvenir shops by district:", error);
    throw error;
  }
};

// Function to fetch places nearby by coordinates
export const fetchPlacesNearbyByCoordinates = async (
  latitude,
  longitude,
  radius = 5000
) => {
  try {
    const token = Cookies.get("token");
    const response = await api.get(`/admin/general/places/nearby-by-coordinates`, {
      params: {
        lat: latitude,
        lng: longitude,
        radius: radius,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = Array.isArray(response.data) ? response.data : [];

    return data.map((place) => ({
      ...place,
      images: place.images
        ? place.images.map((image) => ({
            image_path: image.image_path,
            image_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`,
          }))
        : [], // Default to an empty array if no images
    }));
  } catch (error) {
    console.error("Error fetching places nearby by coordinates:", error);
    throw error;
  }
};

// Unified search for all criteria
export const searchTouristEntitiesUnified = async (params) => {
  try {
    const token = Cookies.get("token");
    const response = await api.get("/admin/general/search", {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map((place) => ({
      ...place,
      images: place.images
        ? place.images.map((image) => ({
            image_path: image.image_path,
            image_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`,
          }))
        : [], // Default to an empty array if no images
    }));
  } catch (error) {
    console.error("Error fetching tourist entities with unified search:", error);
    throw error;
  }
};

// Fetch all filters (seasons, districts, categories)
export const fetchAllFilters = async () => {
  try {
    const token = Cookies.get("token");
    const response = await api.get("/admin/general/filters", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all filters:", error);
    throw error;
  }
};
