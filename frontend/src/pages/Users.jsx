import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, deleteUser, updateUser, signupUser } from "../features/user/userSlice";
import { Users, UserPlus, Search, Trash2, Edit3, X, Mail, Phone, MapPin, Shield, CheckCircle2, UserCheck, UserX, MoreVertical } from "lucide-react";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    address: "",
    phone: "",
  });
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user? This action is permanent.")) {
      dispatch(deleteUser(id));
      setSuccessMsg("Account terminated successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setEditUser(null);
    setFormData({ name: "", email: "", password: "", role: "user", address: "", phone: "" });
    setShowModal(true);
  };

  const handleEditClick = (user) => {
    setIsEditMode(true);
    setEditUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "user",
      address: user.address || "",
      phone: user.phone || "",
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (isEditMode) {
        const updates = { ...formData };
        delete updates.password;
        if (formData.password.trim()) updates.password = formData.password;
        await dispatch(updateUser({ id: editUser._id, updates }));
        setSuccessMsg("Identity updated successfully.");
      } else {
        if (!formData.password.trim()) return alert("Security key required.");
        await dispatch(signupUser(formData));
        setSuccessMsg("New entity registered.");
      }
      setTimeout(() => setSuccessMsg(""), 3000);
      setShowModal(false);
    } catch (err) {
      alert("Synchronisation failed.");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  ).reverse();

  return (
    <div className="bg-transparent min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-2">User <span className="text-brand">Directory</span></h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium italic">Manage access control and user identities across the platform</p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-3 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black hover:bg-black dark:hover:bg-gray-100 transition-all shadow-xl active:scale-95 cursor-pointer"
          >
            <UserPlus size={24} /> Register User
          </button>
        </div>

        {/* Action Bar */}
        <div className="bg-white dark:bg-gray-900/95 dark:backdrop-blur-2xl p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm mb-10 flex flex-col md:flex-row gap-6">
          <div className="flex-1 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-brand transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by name or email identity..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-white/5 border-transparent dark:border-white/10 focus:bg-white dark:focus:bg-white/10 focus:border-brand/30 focus:ring-4 focus:ring-brand/5 rounded-2xl transition-all outline-none font-bold text-gray-700 dark:text-white shadow-inner"
            />
          </div>
          <div className="bg-white dark:bg-white/5 px-6 py-4 rounded-2xl flex items-center gap-3 border border-gray-100 dark:border-white/5 shadow-sm">
            <Users className="text-brand" size={20} />
            <span className="font-black text-gray-900 dark:text-white">{users.length} Total Users</span>
          </div>
        </div>

        {successMsg && (
          <div className="mb-8 p-4 bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900/50 text-green-600 dark:text-green-400 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 text-sm font-black shadow-sm">
            <CheckCircle2 size={20} /> {successMsg}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 border-4 border-brand/30 border-t-brand rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900/95 dark:backdrop-blur-2xl rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-white/5">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Identity</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Privileges</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Contact</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-600 rounded-2xl flex items-center justify-center font-black group-hover:bg-brand group-hover:text-white transition-colors">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${user.role === 'admin' ? 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/50' : 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-6 italic text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {user.phone || "No direct link"}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEditClick(user)} className="p-3 text-gray-300 dark:text-gray-600 hover:text-brand dark:hover:text-brand hover:bg-brand/5 dark:hover:bg-white/5 rounded-xl transition-all cursor-pointer"><Edit3 size={18} /></button>
                        <button onClick={() => handleDelete(user._id)} className="p-3 text-gray-300 dark:text-gray-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all cursor-pointer"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-md flex items-center justify-center z-[110] animate-in fade-in p-4">
            <div className="bg-white dark:bg-gray-900 rounded-[3.5rem] p-10 w-full max-w-2xl relative shadow-2xl border border-white/20 dark:border-white/5">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-8 right-8 p-3 bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-2xl transition-all cursor-pointer"
              >
                <X size={24} />
              </button>

              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <div className="p-3 bg-brand text-white rounded-2xl shadow-lg ring-4 ring-brand/5"><UserPlus size={24} /></div>
                {isEditMode ? "Modify Identity" : "Register New Entity"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Legal Name</label>
                  <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-50 dark:bg-white/5 px-6 py-4 rounded-2xl border-transparent dark:border-white/10 focus:bg-white dark:focus:bg-white/10 focus:border-brand/30 focus:ring-4 focus:ring-brand/5 outline-none font-bold text-gray-700 dark:text-white transition-all shadow-inner" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Email Identity</label>
                  <input name="email" value={formData.email} onChange={handleChange} disabled={isEditMode} className="w-full bg-gray-50 dark:bg-white/5 px-6 py-4 rounded-2xl border-transparent dark:border-white/10 focus:bg-white dark:focus:bg-white/10 focus:border-brand/30 focus:ring-4 focus:ring-brand/5 outline-none font-bold text-gray-700 dark:text-white transition-all shadow-inner disabled:opacity-50 cursor-not-allowed" />
                </div>
                {!isEditMode && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Access Key (Password)</label>
                    <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full bg-gray-50 dark:bg-white/5 px-6 py-4 rounded-2xl border-transparent dark:border-white/10 focus:bg-white dark:focus:bg-white/10 focus:border-brand/30 focus:ring-4 focus:ring-brand/5 outline-none font-bold text-gray-700 dark:text-white transition-all shadow-inner" />
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Access Level</label>
                  <select name="role" value={formData.role} onChange={handleChange} className="w-full bg-gray-50 dark:bg-white/5 px-6 py-4 rounded-2xl border-transparent dark:border-white/10 focus:bg-white dark:focus:bg-white/10 focus:border-brand/30 focus:ring-4 focus:ring-brand/5 outline-none font-bold text-gray-700 dark:text-white transition-all shadow-inner cursor-pointer shadow-sm">
                    <option value="user" className="dark:bg-gray-800">Standard User</option>
                    <option value="admin" className="dark:bg-gray-800">Platform Admin</option>
                  </select>
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Primary Residence (Address)</label>
                  <input name="address" value={formData.address} onChange={handleChange} className="w-full bg-gray-50 dark:bg-white/5 px-6 py-4 rounded-2xl border-transparent dark:border-white/10 focus:bg-white dark:focus:bg-white/10 focus:border-brand/30 focus:ring-4 focus:ring-brand/5 outline-none font-bold text-gray-700 dark:text-white transition-all shadow-inner" />
                </div>
              </div>

              <div className="flex justify-end gap-6 pt-6 border-t border-gray-50 dark:border-white/5">
                <button onClick={() => setShowModal(false)} className="px-8 py-4 text-gray-400 hover:text-gray-900 dark:hover:text-white font-bold transition-colors cursor-pointer">Discard</button>
                <button onClick={handleSave} className="px-12 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black hover:bg-black dark:hover:bg-gray-100 transition-all shadow-xl active:scale-95 cursor-pointer">
                  {isEditMode ? "Commit Updates" : "Finalize Registration"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
