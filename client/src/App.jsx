import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";

import DashboardSkeleton from "./components/skeletons/DashboardSkeleton";
import { useAuth } from "./contexts/AuthContext";
import DashboardLayout from "./pages/DashboardLayout";
import Settings from "./pages/Settings";
import SEO from "./pages/SEO";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Scraper from "./pages/Scraper";
import History from "./pages/History";
const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

const App = () => {
  const { user, loading } = useAuth();

  if (loading) return <DashboardSkeleton />;

  return (
    <Routes>
      {user ? (
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/seo" element={<SEO />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/scraper" element={<Scraper />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<Home />} />
        </Route>
      ) : (
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
      )}
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
};

export default App;
