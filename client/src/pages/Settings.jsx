import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  User,
  Mail,
  Shield,
  Key,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const Settings = () => {
  const { user, changePassword } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const isGoogleUser = false;

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters long",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    setLoading(true);
    const success = await changePassword(newPassword);
    setLoading(false);

    if (success) {
      setMessage({ type: "success", text: "Password updated successfully" });
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Settings
        </h1>
        <p className="text-gray-500 mt-2">
          Manage your account preferences and security.
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-orange-500" />
            Profile Information
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full syrus-gradient flex items-center justify-center shadow-lg shadow-orange-200">
              <span className="text-white font-bold text-3xl">
                {user?.user_metadata?.full_name?.charAt(0) || "U"}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {user?.user_metadata?.full_name || "User"}
              </h3>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100 mt-2">
                <Shield className="w-3 h-3" />
                {user?.role || "User"}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-500 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Address
              </label>
              <p className="text-gray-900 font-medium bg-gray-50/50 px-4 py-3 rounded-xl border border-gray-100">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Section - Conditional Render */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Key className="w-5 h-5 text-orange-500" />
            Security
          </h2>
        </div>
        <div className="p-6">
          {isGoogleUser ? (
            <div className="flex items-center gap-4 bg-orange-50 rounded-xl p-4 border border-orange-100">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-orange-500">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Google Account</h3>
                <p className="text-sm text-gray-600">
                  Your security is managed by Google. Please change your
                  password through your Google Account settings.
                </p>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handlePasswordChange}
              className="max-w-md space-y-4"
            >
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange/20 focus:border-orange transition-all duration-200 text-sm"
                  placeholder="Min. 6 characters"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange/20 focus:border-orange transition-all duration-200 text-sm"
                  placeholder="Re-enter password"
                  required
                />
              </div>

              {message.text && (
                <div
                  className={`p-3 rounded-xl flex items-center gap-2 text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                >
                  {message.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 syrus-btn text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-200 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Change Password"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
