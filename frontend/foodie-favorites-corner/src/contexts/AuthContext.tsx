import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";


// ✅ Define your User type here
interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, user: User) => void; // ✅ Fix this line
  logout: () => void;
  token: string | null;
  user: User | null; // if you're returning user in context
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(null);

  // inside AuthContext.tsx
  const login = (token: string, user: User) => {
    setToken(token);
    setUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user)); // 👈
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);

  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, token, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
