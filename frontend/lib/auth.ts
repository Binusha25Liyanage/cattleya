import { api } from "./api";

export async function fetchMe() {
  const response = await api.get("/auth/me");
  return response.data.data;
}

export function saveAccessToken(token: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("cattleya_access_token", token);
  }
}

export function clearAccessToken() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("cattleya_access_token");
  }
}
