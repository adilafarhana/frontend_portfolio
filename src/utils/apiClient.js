// import axios from "axios";
// import { getAdminToken } from "./auth";

// // 1. Fallback to REACT_APP_API_URL and your live domain
// // const apiBaseURL = (process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_URL || "").replace(/\/$/, "");


// const apiBaseURL = "";
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

// // 2. Updated getMediaUrl to strip localhost URLs returned by Laravel
// export const getMediaUrl = (path) => {
//   if (!path) return "";

//   // Replaces 127.0.0.1:8000 from image paths with live backend domain
//   let cleaned = path.replace(/http:\/\/127\.0\.0\.1:8000/g, apiBaseURL);

//   if (
//     cleaned.startsWith("http://") ||
//     cleaned.startsWith("https://") ||
//     cleaned.startsWith("blob:") ||
//     cleaned.startsWith("data:")
//   ) {
//     return cleaned;
//   }

//   const cleanPath = cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
//   return `${apiBaseURL}${cleanPath}`;
// };

// export { apiBaseURL };
// export default apiClient;


import axios from "axios";
import { getAdminToken } from "./auth";

// const apiBaseURL = "https://adilaportfolio.gt.tc/";
const apiBaseURL = "http://127.0.0.1:8000/";

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

export const getMediaUrl = (path) => {
  if (!path) return "";

  // Replace localhost/127.0.0.1 with empty string for relative paths
  let cleaned = path.replace(/http:\/\/(127\.0\.0\.1|localhost):8000/g, "");

  if (
    cleaned.startsWith("http://") ||
    cleaned.startsWith("https://") ||
    cleaned.startsWith("blob:") ||
    cleaned.startsWith("data:")
  ) {
    return cleaned;
  }

  const cleanPath = cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
  return `${apiBaseURL}${cleanPath}`;
};

export { apiBaseURL };
export default apiClient;