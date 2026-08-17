import axios from "axios";
import { getAdminToken } from "./auth";

const rawURL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";
const apiBaseURL = rawURL.trim().replace(/\/+$/, "");

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

  // Interceptor fix: Clean up malformed endpoint paths
  if (config.url) {
    // Strips out leading "/admin/http://..." or "http://..." from the endpoint path
    config.url = config.url
      .replace(/^(\/admin\/)?https?:\/\/[^/]+/, "")
      .replace(/^\/admin\/api\//, "/api/");
  }

  return config;
});

export const getMediaUrl = (path) => {
  if (!path) return "";
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("blob:") ||
    path.startsWith("data:")
  ) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${apiBaseURL}${cleanPath}`;
};

export { apiBaseURL };
export default apiClient;