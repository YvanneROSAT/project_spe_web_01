import type { User } from "common";
import { jwtDecode } from "jwt-decode";
import { getRefreshedAccessToken } from "./api";

export function getUserFromStorage(): User | null {
  const str = localStorage.getItem("user");
  if (!str) {
    return null;
  }

  return JSON.parse(str);
}

export function getAccessTokenFromStorage(): {
  accessToken: string | null;
  expired: boolean;
} {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    return { accessToken: null, expired: false };
  }

  const payload = jwtDecode(accessToken);
  const isExpired = !!payload.exp && payload.exp < Date.now() / 1000;
  if (isExpired) {
    clearAuthStorage();
    return { accessToken, expired: true };
  }

  return { accessToken, expired: false };
}

export async function refreshAuth(): Promise<string | null> {
  const { accessToken: currentAccessToken, expired } =
    getAccessTokenFromStorage();

  try {
    if (expired) {
      const res = await getRefreshedAccessToken();
      if (!res) {
        throw new Error("Could not refresh access token");
      }

      setAuthStorage(res.accessToken, res.user);

      return res.accessToken;
    }

    return currentAccessToken;
  } catch (err) {
    console.error(err);

    return null;
  }
}

export function clearAuthStorage() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
}

export function setAuthStorage(accessToken: string, user?: User) {
  localStorage.setItem("accessToken", accessToken);

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
}
