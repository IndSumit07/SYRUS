import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    CheckCircle2,
    BarChart3,
    Bot,
    Database,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { login, SERVER_URL } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            navigate("/");
        }
    };

    return (
        <div className="flex h-screen max-h-screen w-full bg-white overflow-hidden">
            {/* Left Side - Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
                {/* Snake Card Container */}
                <div className="relative w-full max-w-[400px] group">
                    {/* Animated Gradient Border */}
                    <div className="absolute -inset-[3px] rounded-3xl overflow-hidden opacity-100 transition-opacity duration-300">
                        <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FFF_0%,#FFF_50%,#FD6000_100%)]" />
                    </div>

                    {/* Form Content */}
                    <div className="relative bg-white rounded-[20px] p-8 shadow-2xl">
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                                Sign in
                            </h2>
                            <p className="text-gray-500 mt-2 text-sm">
                                Don't have an account yet?{" "}
                                <Link
                                    to="/signup"
                                    className="font-bold text-orange hover:text-orange/80 transition-colors"
                                >
                                    Sign up here
                                </Link>
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div className="space-y-4">
                                {/* Email Field */}
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

                                {/* Password Field */}
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between ml-1">
                                        <label className="text-sm font-bold text-gray-700">
                                            Password
                                        </label>
                                        <a
                                            href="#"
                                            className="text-sm font-bold text-orange hover:text-orange/80"
                                        >
                                            Forgot?
                                        </a>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange/20 focus:border-orange transition-all duration-200 text-sm"
                                            placeholder="Enter password"
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
                            </div>

                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-orange/20 text-sm font-bold text-white bg-orange hover:bg-orange/90 hover:shadow-orange/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange transition-all duration-200"
                            >
                                Sign In
                            </button>
                        </form>

                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-100"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase tracking-wide">
                                    <span className="px-4 bg-white text-gray-400 font-medium">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    type="button"
                                    onClick={() => window.location.href = `${SERVER_URL}/api/auth/google`}
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
                                    Sign in with Google
                                </button>
                            </div>
                        </div>

                        <p className="mt-8 text-center text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                            By signing in you agree to our{" "}
                            <a href="#" className="underline hover:text-gray-600">
                                Terms & Conditions
                            </a>{" "}
                            and{" "}
                            <a href="#" className="underline hover:text-gray-600">
                                Privacy Policy
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Info Section */}
            <div className="hidden lg:flex w-1/2 bg-orange relative flex-col justify-center px-16 xl:px-24 overflow-hidden">
                {/* Background Circles */}
                <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/4">
                    <div className="w-[400px] h-[400px] border border-white/20 rounded-full"></div>
                </div>
                <div className="absolute bottom-0 left-0 transform -translate-x-1/3 translate-y-1/4">
                    <div className="w-[600px] h-[600px] border border-white/20 rounded-full"></div>
                </div>

                <div className="relative z-10 text-white max-w-lg">
                    <h1 className="text-4xl font-bold mb-12 tracking-tight">
                        Welcome to SYRUS
                    </h1>

                    <div className="space-y-10">
                        {/* Feature 1 */}
                        <div className="flex gap-5 items-start">
                            <div className="flex-shrink-0 w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                                <Database className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">
                                    Advanced Data Scraping
                                </h3>
                                <p className="text-white/80 leading-relaxed font-medium">
                                    Extract comprehensive datasets from any web source
                                    effortlessly with our powerful automated tools.
                                </p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="flex gap-5 items-start">
                            <div className="flex-shrink-0 w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                                <Bot className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">AI-Driven Insights</h3>
                                <p className="text-white/80 leading-relaxed font-medium">
                                    Transform raw data into actionable business intelligence using
                                    our state-of-the-art AI models.
                                </p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="flex gap-5 items-start">
                            <div className="flex-shrink-0 w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                                <BarChart3 className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Visual Analytics</h3>
                                <p className="text-white/80 leading-relaxed font-medium">
                                    Visualize trends and patterns instantly with our integrated
                                    high-performance Power BI dashboards.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signin;
