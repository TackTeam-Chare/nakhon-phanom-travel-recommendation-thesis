import axios from "axios";
import Cookies from "js-cookie";

const auth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 5000,
});

auth.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const getToken = () => Cookies.get("token");

// Fetch tourist spots, accommodations, restaurants, and souvenir shops counts
export const getEntityCounts = async () => {
  try {
    const token = getToken();
    const response = await auth.get("/admin/dashboard/entities/counts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Assuming the response contains the counts for entities
  } catch (error) {
    console.error("Error fetching entity counts:", error);
    throw error;
  }
};
