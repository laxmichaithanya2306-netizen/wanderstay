export function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded; // { id: "...", iat: ..., exp: ... }
  } catch (err) {
    return null;
  }
}

export function isLoggedIn() {
  return !!localStorage.getItem("token");
}