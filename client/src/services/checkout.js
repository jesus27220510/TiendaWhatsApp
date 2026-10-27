import { api } from "./api.js";
export const prepareCheckout = (items) =>
  api("/checkout", { method: "POST", body: { items } });
