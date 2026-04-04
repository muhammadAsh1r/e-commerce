import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, clearMessages } from "../features/user/userSlice";
import { User, Mail, Lock, Phone, MapPin, ArrowRight, ShoppingBag, AlertCircle, CheckCircle2 } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    address: "",
    phone: "",
  });

  const { loading, error, successMessage } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      // We could use a better way to show errors, but for now:
      return;
    }

    const { confirmPassword, ...payload } = formData;
    dispatch(signupUser(payload)).then((res) => {
      if (!res.error) {
        setShouldRedirect(true);
      }
    });
  };

  useEffect(() => {
    if (shouldRedirect && successMessage) {
      const timer = setTimeout(() => {
        navigate("/login");
        dispatch(clearMessages());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [shouldRedirect, successMessage, navigate, dispatch]);

  const inputClass = "w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent focus:bg-white focus:border-brand/30 focus:ring-4 focus:ring-brand/5 rounded-2xl transition-all outline-none text-gray-700 font-medium";
  const labelClass = "text-sm font-bold text-gray-700 ml-1 mb-1 block";
  const iconClass = "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand transition-colors";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-gray-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl" />

      <div className="max-w-2xl w-full relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="bg-brand text-white p-3 rounded-2xl shadow-lg shadow-brand/20 group-hover:scale-110 transition-transform">
              <ShoppingBag size={32} />
            </div>
            <span className="text-3xl font-black tracking-tight text-gray-900">
              Tech<span className="text-brand">Store</span>
            </span>
          </Link>
          <h2 className="text-4xl font-black text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-500 font-medium">Join our community of premium tech enthusiasts</p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50">
          {/* Notifications */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 text-sm font-bold">
              <AlertCircle size={20} />
              {error}
            </div>
          )}
          {successMessage && (
            <div className="mb-8 p-4 bg-green-50 border border-green-100 text-green-600 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 text-sm font-bold">
              <CheckCircle2 size={20} />
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className={labelClass}>Full Name</label>
                <div className="relative group">
                  <User className={iconClass} size={20} />
                  <input name="name" required placeholder="John Doe" value={formData.name} onChange={handleChange} className={inputClass} />
                </div>
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Email Address</label>
                <div className="relative group">
                  <Mail className={iconClass} size={20} />
                  <input name="email" type="email" required placeholder="john@example.com" value={formData.email} onChange={handleChange} className={inputClass} />
                </div>
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Password</label>
                <div className="relative group">
                  <Lock className={iconClass} size={20} />
                  <input name="password" type="password" required placeholder="••••••••" value={formData.password} onChange={handleChange} className={inputClass} />
                </div>
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Confirm Password</label>
                <div className="relative group">
                  <Lock className={iconClass} size={20} />
                  <input name="confirmPassword" type="password" required placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} className={inputClass} />
                </div>
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Phone Number</label>
                <div className="relative group">
                  <Phone className={iconClass} size={20} />
                  <input name="phone" required placeholder="+92 300 1234567" value={formData.phone} onChange={handleChange} className={inputClass} />
                </div>
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Shipping Address</label>
                <div className="relative group">
                  <MapPin className={iconClass} size={20} />
                  <input name="address" required placeholder="123 Street, City" value={formData.address} onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>

            {formData.password !== formData.confirmPassword && formData.confirmPassword !== "" && (
              <p className="text-red-500 text-xs font-bold pl-1 animate-pulse">Passwords do not match</p>
            )}

            <button
              type="submit"
              disabled={loading || (formData.password !== formData.confirmPassword)}
              className="w-full py-5 bg-brand hover:bg-brand-hover text-white rounded-[1.5rem] font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand/20 disabled:opacity-50 mt-4"
            >
              {loading ? (
                <div className="h-6 w-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={22} /></>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-500 font-medium text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-brand font-black hover:underline underline-offset-4">
                Sign In Instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
