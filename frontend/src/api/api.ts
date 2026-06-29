import axios, { AxiosHeaders } from "axios";

const api = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: "https://payment-ss.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || localStorage.getItem("authToken");

  if (token) {
    const headers = config.headers ?? new AxiosHeaders();
    headers.set("Authorization", `Bearer ${token}`);
    config.headers = headers;
  }

  return config;
});

export default api;