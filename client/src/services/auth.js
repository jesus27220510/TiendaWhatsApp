import { api } from "./api.js";
export const login = (body) =>
  api("/auth/login", { method: "POST", body, csrf: true });
export const logout = () =>
  api("/auth/logout", { method: "POST", body: {}, csrf: true });
export const me = () => api("/auth/me");
