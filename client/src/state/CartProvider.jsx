import React, { createContext, useContext, useReducer } from "react";
import { cartReducer } from "./cart.js";
const Context = createContext(null);
export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  return (
    <Context.Provider value={{ items, dispatch }}>{children}</Context.Provider>
  );
}
export const useCart = () => useContext(Context);
