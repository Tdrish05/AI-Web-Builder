import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { StarIcon, Loader2Icon, CheckCircleIcon, ArrowLeftIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const ResetPasswordPage = () => {
  const { theme } = useAppContext();
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) return;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.post(`/api/auth/reset-password/${token}`, { password });
      setSuccess(true);
      toast.success("Password reset successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Reset token is invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex h-screen w-screen font-sans relative transition-colors duration-200 ${
      theme === "dark"
        ? "bg-gradient-to-b from-black via-red-950 via-red-800 to-amber-600 text-white"
        : "bg-gradient-to-b from-[#eae6e1] via-[#ebdcd0] to-[#dfcbb5] text-zinc-900"
    }`}>
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-red-600/10 blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] rounded-full bg-amber-600/10 blur-[100px] pointer-events-none z-0" />

      <div className="flex flex-col flex-1 items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-[400px]">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <StarIcon fill="black" size={16} />
            </div>
            <span className="text-xl font-semibold tracking-tight bg-gradient-to-r from-red-400 to-rose-450 bg-clip-text text-transparent">
              AI Web Builder
            </span>
          </div>

          <div className="bg-white text-zinc-900 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-2">
              Reset Password
            </h2>
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              {!success
                ? "Please type and confirm your new password below."
                : "Your password has been changed."}
            </p>

            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-2 py-2 border-b border-zinc-200 focus:outline-none focus:border-zinc-950 text-sm text-zinc-900 bg-white placeholder-zinc-350 pr-8"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-2 py-2 border-b border-zinc-200 focus:outline-none focus:border-zinc-950 text-sm text-zinc-900 bg-white placeholder-zinc-350 pr-8"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !password || !confirmPassword}
                  className="w-full py-2.5 bg-gradient-to-br from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-semibold flex items-center justify-center cursor-pointer mt-4 rounded-lg shadow transition-all"
                >
                  {loading && <Loader2Icon className="animate-spin h-4 w-4 mr-2" />}
                  Update Password
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl">
                  <CheckCircleIcon className="shrink-0 text-emerald-600" size={20} />
                  <span className="text-xs font-medium">Password Reset Completed!</span>
                </div>
                <p className="text-xs text-zinc-400 text-center">
                  Redirecting to Sign in screen...
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-zinc-900 text-white text-xs font-semibold rounded-lg hover:bg-zinc-800 transition"
                >
                  Go to Sign in
                </Link>
              </div>
            )}

            {!success && (
              <div className="mt-6 pt-5 border-t border-zinc-100 flex justify-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-800 transition"
                >
                  <ArrowLeftIcon size={12} />
                  <span>Back to Sign in</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
