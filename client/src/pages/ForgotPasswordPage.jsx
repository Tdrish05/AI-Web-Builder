import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import { ArrowLeftIcon, Loader2Icon, MailIcon, StarIcon, CheckCircleIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const ForgotPasswordPage = () => {
  const { theme } = useAppContext();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [simulationLink, setSimulationLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/forgot-password", { email });
      setSubmitted(true);
      toast.success("Reset link generated!");
      if (data.resetLink) {
        setSimulationLink(data.resetLink);
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Something went wrong. Please try again.");
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
              Forgot Password
            </h2>
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              {!submitted
                ? "Enter your email address and we'll generate a secure link to reset your password."
                : "A password recovery link has been generated."}
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-2 py-2 border-b border-zinc-200 focus:outline-none focus:border-zinc-950 text-sm text-zinc-900 bg-white placeholder-zinc-300 transition-colors"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full py-2.5 bg-gradient-to-br from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-semibold flex items-center justify-center cursor-pointer mt-4 rounded-lg shadow transition-all"
                >
                  {loading && <Loader2Icon className="animate-spin h-4 w-4 mr-2" />}
                  Send Reset Link
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl">
                  <CheckCircleIcon className="shrink-0 text-emerald-600" size={20} />
                  <span className="text-xs font-medium">Link Generated Successfully!</span>
                </div>

                {simulationLink && (
                  <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-left">
                    <p className="text-[10px] font-bold text-zinc-450 uppercase tracking-wider mb-2">
                      💡 Testing Link (Simulation)
                    </p>
                    <p className="text-xs text-zinc-500 mb-3 leading-relaxed">
                      Since no SMTP email configuration is present, you can click the button below to test the reset password flow directly:
                    </p>
                    <Link
                      to={`/reset-password/${simulationLink.split("/reset-password/")[1]}`}
                      className="inline-flex items-center justify-center w-full px-4 py-2 bg-zinc-900 text-white text-xs font-semibold rounded-lg hover:bg-zinc-800 transition"
                    >
                      Reset Password Now
                    </Link>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 pt-5 border-t border-zinc-100 flex justify-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-800 transition"
              >
                <ArrowLeftIcon size={12} />
                <span>Back to Sign in</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
