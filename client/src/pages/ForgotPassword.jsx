import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Key, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState(1);
    const { forgotPassword, resetPassword } = useAuth();
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        const success = await forgotPassword(email);
        if (success) {
            setStep(2);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        const success = await resetPassword(email, otp, newPassword);
        if (success) {
            navigate("/signin");
        }
    };

    return (
        <div className="flex h-screen w-full bg-white items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 relative overflow-hidden">
                {/* Decorative bg */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-50"></div>

                <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
                    <p className="text-gray-500 mb-8 text-sm">
                        {step === 1
                            ? "Enter your email to receive a password reset code."
                            : "Enter the code sent to your email and your new password."}
                    </p>

                    <form onSubmit={step === 1 ? handleSendOtp : handleResetPassword} className="space-y-6">

                        {step === 1 ? (
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange/20 focus:border-orange transition-all duration-200 text-sm"
                                        placeholder="Enter your email"
                                        required
                                    />
                                    <Mail className="absolute right-3 top-3.5 text-gray-400 w-5 h-5" />
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Verification Code</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange/20 focus:border-orange transition-all duration-200 text-sm tracking-widest text-center text-lg"
                                            placeholder="######"
                                            required
                                            maxLength={6}
                                        />
                                        <Key className="absolute right-3 top-3.5 text-gray-400 w-5 h-5" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">New Password</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange/20 focus:border-orange transition-all duration-200 text-sm"
                                            placeholder="Min. 6 characters"
                                            required
                                        />
                                        <Lock className="absolute right-3 top-3.5 text-gray-400 w-5 h-5" />
                                    </div>
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-orange/20 text-sm font-bold text-white bg-orange hover:bg-orange/90 hover:shadow-orange/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange transition-all duration-200"
                        >
                            {step === 1 ? "Send Reset Code" : "Update Password"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link to="/signin" className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
