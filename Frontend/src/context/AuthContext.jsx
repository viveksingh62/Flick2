import React from "react";

import { useContext, createContext, useState, useEffect } from "react";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const API_URL = import.meta.env.VITE_BACKEND_URL;
      
        const res = await fetch(`${API_URL}/check-auth`, {
          credentials: "include", // include cookies
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
       

        if (data.authenticated) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error(error);
        console.error("Auth check failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);
  const logout = async () => {
    try {
       const API_URL = import.meta.env.VITE_BACKEND_URL;
      console.log("Logging out with API_URL:", API_URL);
      const res = await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include", // very important to clear session
      });
      const data = await res.json();
      console.log(data);
      setUser(null); // clear user in frontend context
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);
