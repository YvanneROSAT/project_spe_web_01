import type { User } from "common";
import { jwtDecode } from "jwt-decode";

export function getUser(): User | null {
  const str = localStorage.getItem("user");
  if (!str) {
    return null;
  }

  return JSON.parse(str);
}

export function getAccessToken(): string | null {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    return null;
  }

  const payload = jwtDecode(accessToken);
  const isExpired = !!payload.exp && payload.exp < Date.now() / 1000;
  if (isExpired) {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    return null;
  }

  return accessToken;
}
