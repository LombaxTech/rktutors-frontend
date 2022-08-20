import { useState, useEffect, createContext } from "react";
import useCustomAuth from "../customHooks/useCustomAuth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user, userLoading } = useCustomAuth();

  return (
    <AuthContext.Provider value={{ user, userLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
