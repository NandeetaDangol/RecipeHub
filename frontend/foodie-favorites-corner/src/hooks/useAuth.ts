// src/hooks/useAuth.ts
import { useEffect, useState } from "react";

import axios from "axios";

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:8000/api/user", { withCredentials: true })
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Logout handler
  const logout = async () => {
    await axios.post("http://localhost:8000/api/logout", {}, { withCredentials: true });
    setUser(null);
  };

  // Determine auth state
  const isAuthenticated = !!user;

  return { user, loading, isAuthenticated, logout };
};