import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, clearMessages } from "../features/user/userSlice";
import { Mail, Lock, ArrowRight, ShoppingBag, AlertCircle, CheckCircle2 } from "lucide-react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, error, successMessage } = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
        navigate("/");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch, navigate]);

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 bg-transparent relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-brand/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="bg-brand text-white p-3 rounded-2xl shadow-lg shadow-brand/20 group-hover:scale-110 transition-transform">
              <ShoppingBag size={32} />
            </div>
            <span className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
              Tech<span className="text-brand">Store</span>
            </span>
          </Link>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Welcome Back</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Enter your credentials to access your account</p>
        </div>

        <div className="bg-white dark:bg-gray-900/95 dark:backdrop-blur-2xl p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl">
          {/* Notifications */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={20} />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900/50 text-green-600 dark:text-green-400 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 size={20} />
              <p className="text-sm font-bold">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-brand transition-colors" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/10 focus:bg-white dark:focus:bg-white/10 focus:border-brand/30 focus:ring-4 focus:ring-brand/5 rounded-2xl transition-all outline-none text-gray-700 dark:text-white font-medium"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Password</label>
                <button type="button" className="text-xs font-bold text-brand hover:underline cursor-pointer">Forgot Password?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-brand transition-colors" size={20} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/10 focus:bg-white dark:focus:bg-white/10 focus:border-brand/30 focus:ring-4 focus:ring-brand/5 rounded-2xl transition-all outline-none text-gray-700 dark:text-white font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-brand hover:bg-brand-hover text-white rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand/20 disabled:opacity-50"
            >
              {loading ? (
                <div className="h-6 w-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={22} /></>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-brand font-black hover:underline underline-offset-4">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
