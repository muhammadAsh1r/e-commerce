import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { User, Mail, Phone, MapPin, Shield, Package, LogOut, ChevronRight, Edit3, Settings } from "lucide-react";

const UserProfile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl text-center max-w-md">
          <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <User size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-4">Profile not found</h2>
          <p className="text-gray-500 mb-8">Please login to view your account details and manage your preferences.</p>
          <Link to="/login" className="block w-full py-4 bg-brand text-white rounded-2xl font-bold hover:bg-brand-hover transition-all">
            Login to Account
          </Link>
        </div>
      </div>
    );
  }

  const sections = [
    { label: "Full Name", value: user.name, icon: <User size={20} className="text-brand" />, desc: "How you'll appear across the platform" },
    { label: "Email Address", value: user.email, icon: <Mail size={20} className="text-brand" />, desc: "Used for login and order notifications" },
    { label: "Phone Number", value: user.phone || "Not provided", icon: <Phone size={20} className="text-brand" />, desc: "For delivery updates and support" },
    { label: "Shipping Address", value: user.address || "Not provided", icon: <MapPin size={20} className="text-brand" />, desc: "Default address for your purchases" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-brand text-white rounded-[2rem] flex items-center justify-center text-4xl font-black shadow-xl shadow-brand/20">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-1">{user.name}</h1>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-black uppercase tracking-widest rounded-full">
                  {user.role || "Customer"}
                </span>
                <span className="text-gray-400 text-sm font-medium">Member since 2024</span>
              </div>
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl text-gray-700 font-bold hover:bg-gray-50 transition-all shadow-sm">
            <Edit3 size={18} /> Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Stats/Links */}
          <div className="md:col-span-1 space-y-6">
            <Link to="/order" className="block group">
              <div className="bg-gray-900 text-white p-6 rounded-[2.5rem] shadow-xl shadow-gray-900/10 hover:shadow-gray-900/20 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-white/10 rounded-2xl"><Package size={24} /></div>
                  <ChevronRight size={20} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="text-xl font-bold mb-1">My Orders</h3>
                <p className="text-gray-400 text-xs font-medium">Check status of your purchases</p>
              </div>
            </Link>

            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-1">
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all group">
                <div className="flex items-center gap-3">
                  <Settings size={20} className="text-gray-400 group-hover:text-brand transition-colors" />
                  <span className="font-bold text-gray-700">Account Settings</span>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </button>
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all group text-red-500">
                <div className="flex items-center gap-3">
                  <LogOut size={20} />
                  <span className="font-bold">Sign Out</span>
                </div>
              </button>
            </div>
          </div>

          {/* Personal Information */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <Shield className="text-brand" size={28} /> Personal Information
              </h2>
              
              <div className="space-y-8">
                {sections.map((section, idx) => (
                  <div key={idx} className="flex gap-6 group">
                    <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-brand/5 transition-colors shrink-0">
                      {section.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{section.label}</p>
                      <p className="text-lg font-bold text-gray-900 mb-1">{section.value}</p>
                      <p className="text-sm text-gray-500 font-medium">{section.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Security Info */}
            <div className="bg-brand/5 border border-brand/10 p-8 rounded-[3rem] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand shadow-sm">
                  <Shield size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Account Security</p>
                  <p className="text-sm text-gray-500 font-medium">Your account is secured with 2FA</p>
                </div>
              </div>
              <button className="text-brand font-black hover:underline underline-offset-4">Manage</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
