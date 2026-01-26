import React from "react";
import { Link } from "react-router-dom";
import { Sun, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full h-[80px] flex justify-between items-center px-10 shadow-sm border-b border-gray-100">
      <div className="flex justify-center items-center gap-3">
        <img className="w-40" src="./logo.png" alt="Logo" />
      </div>

      <div className="flex items-center gap-8">
        <ul className="flex items-center gap-8 font-medium text-gray-700">
          {["About", "Services", "Contact"].map((item) => (
            <li
              key={item}
              className="cursor-pointer hover:text-[#FD6000] transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-[2px] after:bg-[#FD6000] after:transition-all after:duration-300 hover:after:w-full"
            >
              {item}
            </li>
          ))}
        </ul>

        <div className="h-6 w-[1px] bg-gray-300"></div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-700 font-medium bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                <User size={18} className="text-[#FD6000]" />
                <span>{user.user_metadata?.full_name || user.email}</span>
              </div>
              <button
                onClick={logout}
                className="relative p-[2px] rounded-lg group overflow-hidden bg-gray-200 inline-block"
              >
                <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#FD6000_100%)]" />
                <span className="relative bg-white text-black px-5 py-2.5 rounded-[7px] font-bold flex items-center gap-2 h-full w-full hover:bg-[#FD6000] hover:text-white transition-colors">
                  <LogOut size={20} />
                  Logout
                </span>
              </button>
            </div>
          ) : (
            <Link to="/signin" className="relative p-[2px] rounded-lg group overflow-hidden bg-gray-200 inline-block">
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#FD6000_100%)]" />
              <span className="relative bg-white text-black px-5 py-2.5 rounded-[7px] font-bold flex items-center gap-2 h-full w-full hover:bg-[#FD6000] hover:text-white transition-colors">
                <LogIn size={20} />
                Login
              </span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
