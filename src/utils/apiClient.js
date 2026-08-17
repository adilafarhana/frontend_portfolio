import axios from "axios";
import { getAdminToken } from "./auth";

// const apiBaseURL =
//   (process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000").replace(
//     /\/$/,
//     ""
//   );

// const apiClient = axios.create({
//   baseURL: apiBaseURL,
//   withCredentials: true,
//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//     "X-Requested-With": "XMLHttpRequest",
//   },
// });

// apiClient.interceptors.request.use((config) => {
//   const token = getAdminToken();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export const getMediaUrl = (path) => {
//   if (!path) return "";
//   if (
//     path.startsWith("http://") ||
//     path.startsWith("https://") ||
//     path.startsWith("blob:") ||
//     path.startsWith("data:")
//   ) {
//     return path;
//   }
//   const cleanPath = path.startsWith("/") ? path : `/${path}`;
//   return `${apiBaseURL}${cleanPath}`;
// };

// export { apiBaseURL };
// export default apiClient;


// import axios from "axios";
// import { getAdminToken } from "./auth";

// // 1. Ensure the raw URL always includes a valid protocol scheme
// let rawURL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";
// rawURL = rawURL.trim().replace(/\/+$/, "");

// if (!rawURL.startsWith("http://") && !rawURL.startsWith("https://")) {
//   rawURL = `http://${rawURL}`;
// }

const apiBaseURL = rawURL;

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

  // 2. Clean malformed endpoint paths safely
  if (config.url) {
    // If the path contains full protocol accidentally, extract only the pathname
    if (config.url.includes("http://") || config.url.includes("https://")) {
      try {
        const parsed = new URL(config.url, apiBaseURL);
        config.url = parsed.pathname + parsed.search;
      } catch (e) {
        // Fallback cleanup if URL constructor fails
        config.url = config.url.replace(/^.*https?:\/\/[^/]+/, "");
      }
    }

    // Strip accidental leading /admin/ before /api/
    config.url = config.url.replace(/^\/admin\/api\//, "/api/");

    // Ensure leading slash exists
    if (!config.url.startsWith("/")) {
      config.url = `/${config.url}`;
    }
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