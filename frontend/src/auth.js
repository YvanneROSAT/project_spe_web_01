export function getUser() {
  const str = localStorage.getItem("user");
  if (!str) {
    return null;
  }

  return JSON.parse(str);
}

export function getAccessToken() {
  return localStorage.getItem("accessToken");
}
