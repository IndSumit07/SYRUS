import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Database,
  Search,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  LayoutGrid,
  History,
  TrendingUp,
  FileText,
  PanelLeft,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navItems = [
    { name: "Overview", icon: Home, path: "/" },
    { name: "SEO", icon: TrendingUp, path: "/seo" },
    { name: "Data Scraper", icon: Database, path: "/scraper" },
    { name: "My Projects", icon: LayoutGrid, path: "/projects" },
    { name: "History", icon: History, path: "/history" },
    { name: "Reports", icon: FileText, path: "/reports" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-100 transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen
          ? "w-64 translate-x-0"
          : "w-64 -translate-x-full lg:w-20"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Toggle */}
          <div
            className={`h-20 flex items-center border-b border-gray-50 ${isSidebarOpen ? "px-8 justify-between" : "justify-center"}`}
          >
            {isSidebarOpen && (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-800 tracking-tight whitespace-nowrap overflow-hidden">
                  SYRUS
                </span>
              </div>
            )}
            {/* Desktop Toggle (only visible on desktop) */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <PanelLeft size={18} />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {isSidebarOpen && (
              <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                Main Menu
              </p>
            )}
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={!isSidebarOpen ? item.name : ""}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                    ? "bg-orange-50 text-orange-600 font-bold shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium"
                    } ${!isSidebarOpen ? "justify-center px-2" : ""}`}
                >
                  <item.icon
                    size={20}
                    className={`flex-shrink-0 transition-colors ${isActive
                      ? "text-orange-500"
                      : "text-gray-400 group-hover:text-gray-600"
                      }`}
                  />
                  {isSidebarOpen && <span>{item.name || "User"}</span>}
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-gray-50 bg-gray-50/50">
            <div
              className={`flex items-center gap-3 mb-4 ${isSidebarOpen ? "px-2" : "justify-center"}`}
            >
              <div className="w-10 h-10 rounded-full bg-white border-2 border-orange-100 flex items-center justify-center shadow-sm flex-shrink-0">
                <User size={20} className="text-gray-600" />
              </div>
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {user?.user_metadata?.full_name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              )}
            </div>

            <Link
              to="/settings"
              title={!isSidebarOpen ? "Settings" : ""}
              className={`w-full flex items-center gap-2 px-4 py-2.5 mb-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors ${!isSidebarOpen ? "justify-center px-0" : ""}`}
            >
              <Settings size={18} className="flex-shrink-0" />
              {isSidebarOpen && <span>Settings</span>}
            </Link>

            <button
              onClick={handleLogout}
              title={!isSidebarOpen ? "Log Out" : ""}
              className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors ${!isSidebarOpen ? "justify-center px-0" : ""}`}
            >
              <LogOut size={18} className="flex-shrink-0" />
              {isSidebarOpen && <span>Log Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center gap-4 text-gray-400 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 w-96">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search for data, reports, or projects..."
                className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500 border border-white"></div>
              <Settings size={20} />
            </button>
            <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
            <button className="syrus-btn text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-orange-200 transition-all hover:translate-y-[-1px]">
              + New Project
            </button>
          </div>
        </header>

        {/* content area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default DashboardLayout;
