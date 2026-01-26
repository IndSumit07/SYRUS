import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

import DashboardSkeleton from "./components/skeletons/DashboardSkeleton";
import { useAuth } from "./contexts/AuthContext";
import DashboardLayout from "./pages/DashboardLayout";
import Settings from "./pages/Settings";

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
          {/* Add other dashboard routes here later */}
          <Route path="*" element={<Home />} />
        </Route>
      ) : (
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
      )}
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default App;
