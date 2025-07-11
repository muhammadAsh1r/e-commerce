import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsers,
  deleteUser,
  updateUser,
  signupUser, // Assuming you have this thunk for creating user (signup)
} from "../features/user/userSlice";

const UserPage = () => {
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

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setEditUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "user",
      address: "",
      phone: "",
    });
    setShowModal(true);
  };

  const handleEditClick = (user) => {
    setIsEditMode(true);
    setEditUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "", // Leave empty when editing
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

  const handleUpdate = () => {
    const updates = { ...formData };
    delete updates.password; // Do not update password here if empty
    if (formData.password.trim()) {
      updates.password = formData.password;
    }
    dispatch(updateUser({ id: editUser._id, updates }));
    setShowModal(false);
    setEditUser(null);
  };

  const handleAdd = () => {
    // password required for new user
    if (!formData.password.trim()) {
      alert("Password is required to create a new user");
      return;
    }
    dispatch(signupUser(formData));
    setShowModal(false);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-teal-500">Manage Users</h2>
        <button
          onClick={openAddModal}
          className="bg-teal-500 text-white px-4 py-2 rounded-xl hover:bg-teal-600"
        >
          + Add User
        </button>
      </div>

      <input
        type="text"
        placeholder="Search users by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 px-4 py-2 border border-gray-300 rounded-xl w-full max-w-md focus:outline-none focus:ring focus:border-teal-400"
      />

      {loading ? (
        <p className="text-gray-700">Loading users...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-auto rounded-xl shadow-sm border border-gray-200 bg-white max-w-7xl">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-teal-500">Name</th>
                <th className="px-6 py-3 text-left text-teal-500">Email</th>
                <th className="px-6 py-3 text-left text-teal-500">Role</th>
                <th className="px-6 py-3 text-left text-teal-500">Address</th>
                <th className="px-6 py-3 text-left text-teal-500">Phone</th>
                <th className="px-6 py-3 text-left text-teal-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-3 text-gray-700">{user.name}</td>
                    <td className="px-6 py-3 text-gray-700">{user.email}</td>
                    <td className="px-6 py-3 text-gray-700 capitalize">
                      {user.role}
                    </td>
                    <td className="px-6 py-3 text-gray-700">
                      {user.address || "-"}
                    </td>
                    <td className="px-6 py-3 text-gray-700">
                      {user.phone || "-"}
                    </td>
                    <td className="px-6 py-3 flex gap-2">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="bg-teal-500 text-white px-3 py-1 rounded hover:bg-teal-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold text-teal-500 mb-4">
              {isEditMode ? "Edit User" : "Add User"}
            </h3>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <input
                name="name"
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                disabled={isEditMode} // email immutable on edit
              />
              {!isEditMode && (
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                />
              )}
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <input
                name="address"
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl"
              />
              <input
                name="phone"
                type="text"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditUser(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={isEditMode ? handleUpdate : handleAdd}
                className="px-4 py-2 bg-teal-500 text-white rounded-xl hover:bg-teal-600"
              >
                {isEditMode ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
