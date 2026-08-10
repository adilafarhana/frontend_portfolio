const ADMIN_USER_KEY = "admin_user";
const ADMIN_TOKEN_KEY = "admin_token";

export function getAdminUser() {
  try {
    const raw = localStorage.getItem(ADMIN_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY) || "";
}

export function setAdminUser(user, token = "") {
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
  if (token) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  }
}

export function clearAdminUser() {
  localStorage.removeItem(ADMIN_USER_KEY);
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function isLoggedIn() {
  return getAdminUser() !== null;
}
