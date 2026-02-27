import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://doctor-website-9toz.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("meditrack_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

