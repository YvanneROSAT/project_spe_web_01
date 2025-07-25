import type { User } from "common";

export function getUser(): User | null {
  const str = localStorage.getItem("user");
  if (!str) {
    return null;
  }

  return JSON.parse(str);
}

export function getAccessToken() {
  return localStorage.getItem("accessToken");
}
