import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const CLIENT_URL = import.meta.env.VITE_CLIENT_URL;

const api = axios.create({
  baseURL: `${SERVER_URL}/api`,
  withCredentials: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      await api.post("/auth/login", { email, password });
      toast.success("Logged in successfully!");
      await checkAuth();
      return true;
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.error || "Login failed";
      toast.error(message);
      return false;
    }
  };

  const signup = async (fullName, email, password) => {
    try {
      await api.post("/auth/signup", { full_name: fullName, email, password });
      toast.success("Signup successful! Please log in.");
      return true;
    } catch (error) {
      console.error(error);
      const message =
        error.response?.data?.error || error.response?.data || "Signup failed";

      // Handle validation errors object
      if (typeof message === "object" && message !== null) {
        // Flatten errors if it's an object of arrays or strings
        const combinedErrors = Object.values(message).flat().join(", ");
        toast.error(combinedErrors || "Signup failed");
      } else {
        toast.error(String(message));
      }
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error(error);
      toast.error("Logout failed");
    }
  };

  const changePassword = async (newPassword) => {
    try {
      await api.post("/auth/change-password", { new_password: newPassword });
      toast.success("Password updated successfully");
      return true;
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.error || "Failed to update password";
      toast.error(message);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        loading,
        checkAuth,
        changePassword,
        SERVER_URL,
        CLIENT_URL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
