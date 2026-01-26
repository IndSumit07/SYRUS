import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Activity,
    Database,
    Zap,
    Globe,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Signup = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { signup, SERVER_URL } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await signup(fullName, email, password);
        if (success) {
            navigate("/signin");
        }
    };

    return (
        <div className="flex h-screen max-h-screen w-full bg-white overflow-hidden">
            {/* Left Side - Visual Section (Orange) */}
            <div className="hidden lg:flex w-1/2 bg-orange relative flex-col justify-center items-center px-12 overflow-hidden">
                {/* Background Patterns */}
                <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/4 opacity-20">
                    <svg
                        width="400"
                        height="400"
                        viewBox="0 0 200 200"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill="#FFFFFF"
                            d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-46.9C87.4,-34.7,90.1,-20.4,90.9,-6.2C91.7,8,90.6,22,85.2,35.2C79.8,48.4,70.1,60.8,57.9,69.5C45.7,78.2,31,83.2,16.6,84.4C2.2,85.6,-11.9,83,-25.1,77.5C-38.3,72,-50.6,63.6,-61.6,52.9C-72.6,42.2,-82.3,29.2,-85.4,14.7C-88.5,0.2,-85,-15.8,-76.8,-28.9C-68.6,-42,-55.7,-52.2,-42.6,-59.8C-29.5,-67.4,-16.2,-72.4,-0.2,-72C15.8,-71.7,31.6,-66,44.7,-76.4Z"
                            transform="translate(100 100)"
                        />
                    </svg>
                </div>
                <div className="absolute bottom-0 left-0 transform -translate-x-1/2 translate-y-1/4 opacity-20">
                    <svg
                        width="500"
                        height="500"
                        viewBox="0 0 200 200"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill="#FFFFFF"
                            d="M41.3,-70.5C54.4,-63.7,66.4,-55.4,75.3,-44.7C84.2,-34,90,-20.9,90.8,-7.6C91.6,5.7,87.4,19.2,79.6,31.2C71.8,43.2,60.4,53.7,48.2,62.2C36,70.7,23,77.2,9.4,78.3C-4.2,79.4,-18.4,75.1,-31.2,67.8C-44,60.5,-55.4,50.2,-64.5,38C-73.6,25.8,-80.4,11.7,-80.9,-2.7C-81.4,-17.1,-75.6,-31.8,-66.1,-43.8C-56.6,-55.8,-43.4,-65.1,-29.8,-71.5C-16.2,-77.9,-2.2,-81.4,10.6,-79.8C23.4,-78.2,35.2,-71.5,41.3,-70.5Z"
                            transform="translate(100 100)"
                        />
                    </svg>
                </div>

                <div className="relative z-10 text-center w-full max-w-lg">
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                        Unlock Market Intelligence
                    </h2>
                    <p className="text-orange-50 mb-10 text-lg font-medium">
                        Get actionable insights from web data instantly
                    </p>

                    {/* Custom "Something Else" - Live Analytics Card */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500 mx-auto w-full max-w-sm">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
                                    <Zap className="w-5 h-5 text-white fill-white" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-white font-bold text-sm">
                                        SYRUS Intelligence
                                    </h3>
                                    <span className="text-xs text-orange-200">
                                        Pro Analytics Suite
                                    </span>
                                </div>
                            </div>
                            <span className="px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                Live
                            </span>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-left">
                                <p className="text-orange-200 text-xs mb-1">Active Scrapers</p>
                                <p className="text-white text-2xl font-bold">24</p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-left">
                                <p className="text-orange-200 text-xs mb-1">Data Points</p>
                                <p className="text-white text-2xl font-bold">1.2M+</p>
                            </div>
                        </div>

                        {/* Bottom Info */}
                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-orange-200" />
                                <span className="text-sm text-white/80">Global Coverage</span>
                            </div>
                            <div className="flex -space-x-2">
                                <div className="w-6 h-6 rounded-full bg-blue-400 border-2 border-orange-500"></div>
                                <div className="w-6 h-6 rounded-full bg-purple-400 border-2 border-orange-500"></div>
                                <div className="w-6 h-6 rounded-full bg-green-400 border-2 border-orange-500"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form Section (White) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center py-12 px-8 lg:py-24 lg:px-16 relative">
                {/* Snake Card Container */}
                <div className="relative w-full max-w-[400px] group">
                    {/* Animated Gradient Border */}
                    <div className="absolute -inset-[3px] rounded-3xl overflow-hidden opacity-100 transition-opacity duration-300">
                        <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FFF_0%,#FFF_50%,#FD6000_100%)]" />
                    </div>

                    {/* Content */}
                    <div className="relative bg-white rounded-[20px] p-8 shadow-2xl">
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                                Create an account
                            </h2>
                            <p className="text-gray-500 mt-2 text-sm font-medium">
                                Already have an account?{" "}
                                <Link
                                    to="/signin"
                                    className="text-orange font-bold hover:underline"
                                >
                                    Log In
                                </Link>
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {/* Full Name */}
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-gray-700 ml-1">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange/20 focus:border-orange transition-all duration-200 text-sm"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-gray-700 ml-1">
                                    Email address
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange/20 focus:border-orange transition-all duration-200 text-sm"
                                        placeholder="Enter email address"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-gray-700 ml-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange/20 focus:border-orange transition-all duration-200 text-sm"
                                        placeholder="Create a password"
                                        required
                                    />
                                    <div
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-orange/20 text-sm font-bold text-white bg-orange hover:bg-orange/90 hover:shadow-orange/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange transition-all duration-200 mt-2"
                            >
                                Sign up
                            </button>
                        </form>

                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-100"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase tracking-wide">
                                    <span className="px-4 bg-white text-gray-400 font-medium">
                                        Or register with
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    onClick={() => window.location.href = `${SERVER_URL}/auth/google`}
                                    className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all duration-200 hover:border-gray-300"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    Sign up with Google
                                </button>
                            </div>
                        </div>

                        <p className="mt-8 text-center text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                            By creating an account, you are agreeing to our{" "}
                            <a href="#" className="underline hover:text-gray-600">
                                Terms & Conditions
                            </a>{" "}
                            and our{" "}
                            <a href="#" className="underline hover:text-gray-600">
                                Privacy Policy
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
