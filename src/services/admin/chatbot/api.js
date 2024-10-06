import axios from "axios"
import Cookies from "js-cookie"

const auth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 5000,
})

auth.interceptors.request.use(config => {
  const token = Cookies.get("token")
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

export const getAllChatbotSuggestions = async () => {
  try {
    const response = await auth.get("/admin/chatbot-suggestions")
    return response.data
  } catch (error) {
    console.error("Error fetching chatbot suggestions:", error)
    throw error
  }
}

export const getChatbotSuggestionById = async id => {
  try {
    const response = await auth.get(`/admin/chatbot-suggestions/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching chatbot suggestion with ID ${id}:`, error)
    throw error
  }
}

export const createChatbotSuggestion = async data => {
  try {
    const response = await auth.post("/admin/chatbot-suggestions", data)
    return response.data
  } catch (error) {
    console.error("Error creating chatbot suggestion:", error)
    throw error
  }
}

export const updateChatbotSuggestion = async (id, data) => {
  try {
    const response = await auth.put(`/admin/chatbot-suggestions/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating chatbot suggestion with ID ${id}:`, error)
    throw error
  }
}

export const deleteChatbotSuggestion = async id => {
  try {
    const response = await auth.delete(`/admin/chatbot-suggestions/${id}`) 
    return response.data
  } catch (error) {
    console.error(`Error deleting chatbot suggestion with ID ${id}:`, error)
    throw error
  }
}
