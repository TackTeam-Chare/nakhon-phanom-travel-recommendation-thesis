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

// Fetch total visitors
export const getTotalVisitors = async () => {
  try {
    const token = getToken();
    const response = await auth.get("/admin/dashboard/visitors/total", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.totalVisitors; // Assuming the response contains `totalVisitors`
  } catch (error) {
    console.error("Error fetching total visitors:", error);
    throw error;
  }
};

// Fetch visitors per day
export const getVisitorsByDay = async () => {
  try {
    const token = getToken();
    const response = await auth.get("/admin/dashboard/visitors/daily", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Assuming the response contains an array of visitors by day
  } catch (error) {
    console.error("Error fetching visitors by day:", error);
    throw error;
  }
};

// Fetch visitors per week
export const getVisitorsByWeek = async () => {
  try {
    const token = getToken();
    const response = await auth.get("/admin/dashboard/visitors/weekly", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Assuming the response contains an array of visitors by week
  } catch (error) {
    console.error("Error fetching visitors by week:", error);
    throw error;
  }
};

// Fetch visitors per month
export const getVisitorsByMonth = async () => {
  try {
    const token = getToken();
    const response = await auth.get("/admin/dashboard/visitors/monthly", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Assuming the response contains an array of visitors by month
  } catch (error) {
    console.error("Error fetching visitors by month:", error);
    throw error;
  }
};

// Fetch visitors per year
export const getVisitorsByYear = async () => {
  try {
    const token = getToken();
    const response = await auth.get("/admin/dashboard/visitors/yearly", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Assuming the response contains an array of visitors by year
  } catch (error) {
    console.error("Error fetching visitors by year:", error);
    throw error;
  }
};

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
