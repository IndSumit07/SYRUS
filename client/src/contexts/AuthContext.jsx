
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
const CLIENT_URL = import.meta.env.VITE_CLIENT_URL || "http://localhost:5173";

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
      setUser(data);
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
      const { data } = await api.post("/auth/login", { email, password });
      setUser(data);
      toast.success("Logged in successfully!");
      return true;
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return false;
    }
  };

  const signup = async (fullName, email, password) => {
    try {
      const { data } = await api.post("/auth/register", { name: fullName, email, password });
      toast.success(data.message || "Signup successful! Please check your email for OTP.");
      return true;
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || "Signup failed";
      toast.error(message);
      return false;
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const { data } = await api.post("/auth/verify-otp", { email, otp });
      toast.success(data.message || "Account verified! Please login.");
      return true;
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || "Verification failed";
      toast.error(message);
      return false;
    }
  }

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

  const forgotPassword = async (email) => {
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      toast.success(data.message);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Request failed");
      return false;
    }
  }

  const resetPassword = async (email, otp, newPassword) => {
    try {
      const { data } = await api.post("/auth/reset-password", { email, otp, newPassword });
      toast.success(data.message);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed");
      return false;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        verifyOtp,
        logout,
        loading,
        checkAuth,
        forgotPassword,
        resetPassword,
        SERVER_URL,
        CLIENT_URL,
        api // Export api instance for other components
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
