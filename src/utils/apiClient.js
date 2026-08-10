import axios from "axios";
import { getAdminToken } from "./auth";

const apiBaseURL =
  (process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000").replace(
    /\/$/,
    ""
  );

const apiClient = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
